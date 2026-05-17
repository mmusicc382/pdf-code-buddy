import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Volume2, Copy, RefreshCw, Hand } from "lucide-react";
import { toast } from "sonner";
import {
  HandLandmarker,
  FilesetResolver,
  type HandLandmarkerResult,
} from "@mediapipe/tasks-vision";
import { classifyGesture } from "@/lib/gestureRecognizer";

const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

const GestureToText = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Stability buffer: only commit a gesture once held for ~0.7s
  const lastGestureRef = useRef<{ label: string; since: number } | null>(null);
  const lastCommittedRef = useRef<string>("");

  const loadModel = useCallback(async () => {
    if (landmarkerRef.current) return;
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
    );
    landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 1,
    });
  }, []);

  const drawResults = (result: HandLandmarkerResult) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const landmarks of result.landmarks) {
      // connections
      ctx.strokeStyle = "hsl(22, 100%, 62%)";
      ctx.lineWidth = 3;
      for (const [a, b] of HAND_CONNECTIONS) {
        ctx.beginPath();
        ctx.moveTo(landmarks[a].x * canvas.width, landmarks[a].y * canvas.height);
        ctx.lineTo(landmarks[b].x * canvas.width, landmarks[b].y * canvas.height);
        ctx.stroke();
      }
      // points
      ctx.fillStyle = "hsl(230, 58%, 26%)";
      for (const p of landmarks) {
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const predict = useCallback(() => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !landmarker || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(predict);
      return;
    }
    const ts = performance.now();
    const result = landmarker.detectForVideo(video, ts);
    drawResults(result);

    if (result.landmarks.length > 0) {
      const handedness =
        (result.handedness?.[0]?.[0]?.categoryName as "Left" | "Right") || "Right";
      const g = classifyGesture(result.landmarks[0], handedness);
      if (g) {
        setCurrentGesture(`${g.label} → "${g.meaning}"`);
        const now = performance.now();
        const last = lastGestureRef.current;
        if (!last || last.label !== g.meaning) {
          lastGestureRef.current = { label: g.meaning, since: now };
        } else if (
          now - last.since > 700 &&
          lastCommittedRef.current !== g.meaning
        ) {
          lastCommittedRef.current = g.meaning;
          setTranscript((prev) => (prev ? `${prev} ${g.meaning}` : g.meaning));
          // reset so same gesture can repeat after re-holding
          lastGestureRef.current = { label: g.meaning, since: now + 1500 };
        }
      } else {
        setCurrentGesture("Hand detected — gesture not recognized");
        lastGestureRef.current = null;
        lastCommittedRef.current = "";
      }
    } else {
      setCurrentGesture("");
      lastGestureRef.current = null;
      lastCommittedRef.current = "";
    }

    rafRef.current = requestAnimationFrame(predict);
  }, []);

  const start = async () => {
    setError("");
    setLoading(true);
    try {
      await loadModel();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setIsRunning(true);
      setLoading(false);
      predict();
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Could not start camera");
      setLoading(false);
      toast.error("Camera access denied or model failed to load");
    }
  };

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current)
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setIsRunning(false);
    setCurrentGesture("");
  }, []);

  useEffect(() => () => stop(), [stop]);

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    toast.success("Copied!");
  };
  const handleSpeak = () => {
    if (!transcript || !("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(transcript));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="font-display text-2xl text-primary-foreground">
            Real-time Gesture → Text & Voice
          </h1>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-6">
          {/* Video */}
          <div className="md:col-span-3 space-y-4">
            <div className="relative aspect-video bg-card rounded-3xl overflow-hidden shadow-lg border">
              <video
                ref={videoRef}
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full scale-x-[-1] pointer-events-none"
              />
              {!isRunning && !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 text-center p-6">
                  <Camera className="w-14 h-14 text-muted-foreground mb-3" />
                  <p className="font-medium">Camera is off</p>
                  <p className="text-sm text-muted-foreground">
                    Click Start to begin real-time hand tracking
                  </p>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Loading hand-tracking model…
                  </p>
                </div>
              )}
              {isRunning && (
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                  LIVE
                </div>
              )}
              {isRunning && currentGesture && (
                <div className="absolute bottom-3 left-3 right-3 bg-background/90 backdrop-blur rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2">
                  <Hand className="w-4 h-4 text-primary" />
                  {currentGesture}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {!isRunning ? (
                <Button
                  variant="gcPrimary"
                  size="xl"
                  className="flex-1"
                  onClick={start}
                  disabled={loading}
                >
                  {loading ? "Starting…" : "Start Camera"}
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="xl"
                  className="flex-1"
                  onClick={stop}
                >
                  Stop Camera
                </Button>
              )}
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive rounded-xl p-3 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Transcript + legend */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-card rounded-3xl p-5 shadow-lg border min-h-[180px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-xl">Transcript</h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSpeak}
                    disabled={!transcript}
                  >
                    <Volume2 size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    disabled={!transcript}
                  >
                    <Copy size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTranscript("")}
                    disabled={!transcript}
                  >
                    <RefreshCw size={18} />
                  </Button>
                </div>
              </div>
              <p className="text-lg leading-relaxed text-card-foreground min-h-[60px]">
                {transcript || (
                  <span className="text-muted-foreground italic">
                    Hold a gesture in front of the camera. Recognized words will
                    appear here.
                  </span>
                )}
              </p>
            </div>

            <div className="bg-card rounded-3xl p-5 shadow border">
              <h4 className="font-semibold mb-2">Supported gestures</h4>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>✋ Open palm → <span className="text-foreground">Hello</span></li>
                <li>✊ Fist → <span className="text-foreground">Yes</span></li>
                <li>👍 Thumbs up → <span className="text-foreground">Good</span></li>
                <li>✌️ Peace → <span className="text-foreground">Peace</span></li>
                <li>👉 Pointing → <span className="text-foreground">You</span></li>
                <li>🤘 Rock → <span className="text-foreground">I love you</span></li>
                <li>👌 OK → <span className="text-foreground">Okay</span></li>
                <li>🤙 Call → <span className="text-foreground">Call me</span></li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                Hold a gesture steady for ~0.7s to add it to the transcript.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GestureToText;
