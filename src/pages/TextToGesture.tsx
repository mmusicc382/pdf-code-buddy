import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mic, MicOff, Play, Pause, RotateCcw, Hand } from "lucide-react";
import { toast } from "sonner";
import SigningHand from "@/components/SigningHand";
import { REST, textToPoseSequence, type HandPose } from "@/lib/signPoses";

const POSE_DURATION_MS = 650;
const WORD_GAP_MS = 250;

const TextToGesture = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPose, setCurrentPose] = useState<HandPose>(REST);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [signedWords, setSignedWords] = useState<string[]>([]);
  const playTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const recognitionRef = useRef<any>(null);

  const clearTimers = () => {
    playTimers.current.forEach((t) => clearTimeout(t));
    playTimers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const playSequence = (text: string) => {
    clearTimers();
    const sequence = textToPoseSequence(text);
    if (sequence.length === 0) {
      toast.error("Nothing to sign");
      return;
    }
    setIsPlaying(true);
    setSignedWords([]);
    let offset = 0;
    sequence.forEach(({ word, poses }) => {
      playTimers.current.push(
        setTimeout(() => {
          setCurrentWord(word);
          setSignedWords((prev) => [...prev, word]);
        }, offset)
      );
      poses.forEach((pose) => {
        playTimers.current.push(setTimeout(() => setCurrentPose(pose), offset));
        offset += POSE_DURATION_MS;
      });
      offset += WORD_GAP_MS;
    });
    playTimers.current.push(
      setTimeout(() => {
        setIsPlaying(false);
        setCurrentPose(REST);
        setCurrentWord("");
      }, offset)
    );
  };

  const handleConvert = () => {
    if (!inputText.trim()) {
      toast.error("Please enter or speak some text first");
      return;
    }
    toast.success("Signing in 3D…");
    playSequence(inputText);
  };

  const handleStop = () => {
    clearTimers();
    setIsPlaying(false);
    setCurrentPose(REST);
    setCurrentWord("");
  };

  const handleVoiceInput = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInputText(transcript);
      toast.success(`Heard: "${transcript}"`);
      setTimeout(() => playSequence(transcript), 300);
    };
    rec.onerror = () => toast.error("Couldn't catch that, try again");
    rec.onend = () => setIsListening(false);
    rec.start();
    recognitionRef.current = rec;
    setIsListening(true);
    toast.info("Listening…");
  };

  return (
    <div className="min-h-screen bg-warm">
      <header className="bg-hero px-6 py-4 shadow-elegant">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}
            className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-2xl font-display text-primary-foreground leading-none">Text & Voice to Sign</h1>
            <p className="text-primary-foreground/70 text-sm mt-1">Animated 3D Indian Sign Language</p>
          </div>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8">
          {/* Left: 3D stage */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative rounded-3xl overflow-hidden shadow-elegant aspect-square lg:aspect-[4/3] bg-primary">
              <SigningHand pose={currentPose} />
              {currentWord && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-5 py-2 rounded-full shadow-glow animate-fade-in">
                  <span className="font-display text-2xl text-primary">{currentWord}</span>
                </div>
              )}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-accent animate-pulse" : "bg-muted-foreground"}`} />
                {isPlaying ? "Signing" : "Idle"}
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="secondary" size="icon" onClick={() => (isPlaying ? handleStop() : handleConvert())}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>
              <Button variant="secondary" size="icon" onClick={() => playSequence(inputText)} disabled={!inputText.trim()}>
                <RotateCcw size={20} />
              </Button>
            </div>
          </div>

          {/* Right: input */}
          <div className="lg:col-span-2 space-y-5">
            <div className="relative">
              <Textarea
                placeholder="Type a message, or tap the mic to speak…"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[140px] rounded-2xl bg-card border-border resize-none pr-14 text-base"
              />
              <Button
                variant={isListening ? "destructive" : "default"}
                size="icon"
                className="absolute right-3 top-3"
                onClick={handleVoiceInput}
              >
                {isListening ? <MicOff size={20} className="animate-pulse" /> : <Mic size={20} />}
              </Button>
            </div>

            <Button
              size="lg"
              className="w-full bg-saffron-gradient text-accent-foreground hover:opacity-90 shadow-glow"
              onClick={handleConvert}
              disabled={!inputText.trim() || isPlaying}
            >
              <Hand className="mr-2" size={18} /> Sign it in 3D
            </Button>

            <div className="bg-card rounded-2xl p-4 shadow border border-border">
              <h4 className="font-display text-xl text-card-foreground mb-3">Try a phrase</h4>
              <div className="flex flex-wrap gap-2">
                {["Hello", "Thank you", "I love you", "How are you", "Namaste", "Good", "Please", "Goodbye"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setInputText(p)}
                    className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {signedWords.length > 0 && (
              <div className="bg-card rounded-2xl p-4 shadow border border-border animate-fade-in">
                <h4 className="font-display text-xl text-card-foreground mb-2">Signed so far</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {signedWords.map((w, i) => (
                    <span key={i} className={`inline-block mr-2 ${w === currentWord ? "text-accent font-semibold" : ""}`}>
                      {w}
                    </span>
                  ))}
                </p>
              </div>
            )}

            <p className="text-xs text-muted-foreground leading-relaxed">
              Demo: gestures are stylized representations for common ISL signs. Unknown words play a generic motion as a placeholder.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TextToGesture;
