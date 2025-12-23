import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Volume2, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const GestureToText = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState("");

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate gesture recognition
    setTimeout(() => {
      setResult("Hello, how are you?");
      setIsRecording(false);
      toast.success("Gesture recognized!");
    }, 3000);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast.success("Copied to clipboard!");
    }
  };

  const handleSpeak = () => {
    if (result && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(result);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gc-gradient px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold text-primary-foreground">
            Gesture to Text & Voice
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Camera Preview Area */}
          <div className="aspect-[4/3] bg-card rounded-3xl overflow-hidden shadow-lg relative">
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              {isRecording ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Recognizing gestures...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Camera preview</p>
                  <p className="text-sm text-muted-foreground/60">
                    Position your hands in frame
                  </p>
                </div>
              )}
            </div>

            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                <span className="text-sm font-medium">Recording</span>
              </div>
            )}
          </div>

          {/* Start Button */}
          <Button
            variant={isRecording ? "destructive" : "gcPrimary"}
            size="xl"
            className="w-full"
            onClick={isRecording ? () => setIsRecording(false) : handleStartRecording}
          >
            {isRecording ? "Stop Recording" : "Start Recognition"}
          </Button>

          {/* Result Area */}
          {result && (
            <div className="gc-card-gradient rounded-3xl p-6 shadow-lg animate-slide-up">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Recognized Text:
              </h3>
              <p className="text-lg font-medium text-card-foreground mb-4">
                {result}
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={handleSpeak}>
                  <Volume2 size={16} />
                  Speak
                </Button>
                <Button variant="secondary" size="sm" onClick={handleCopy}>
                  <Copy size={16} />
                  Copy
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setResult("")}
                >
                  <RefreshCw size={16} />
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-card rounded-2xl p-4 shadow">
            <h4 className="font-semibold text-card-foreground mb-2">Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Ensure good lighting for better recognition</li>
              <li>• Keep your hands within the frame</li>
              <li>• Make gestures slowly and clearly</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GestureToText;
