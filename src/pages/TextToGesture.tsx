import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mic, Play, Pause, RotateCcw, Hand } from "lucide-react";
import { toast } from "sonner";

const TextToGesture = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGesture, setShowGesture] = useState(false);

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    setIsListening(true);
    toast.info("Listening... Speak now");
    
    // Simulate voice recognition
    setTimeout(() => {
      setInputText("Hello, nice to meet you!");
      setIsListening(false);
      toast.success("Voice recognized!");
    }, 2000);
  };

  const handleConvert = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text first");
      return;
    }
    setShowGesture(true);
    setIsPlaying(true);
    toast.success("Converting to gestures...");
    
    // Simulate gesture animation
    setTimeout(() => {
      setIsPlaying(false);
    }, 5000);
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
            Text & Voice to Gesture
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Type your message here or use voice input..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[120px] rounded-2xl bg-card border-border resize-none pr-14"
              />
              <Button
                variant={isListening ? "destructive" : "gcSocial"}
                size="icon"
                className="absolute right-3 top-3"
                onClick={handleVoiceInput}
              >
                <Mic size={20} className={isListening ? "animate-pulse" : ""} />
              </Button>
            </div>

            <Button
              variant="gcPrimary"
              size="xl"
              className="w-full"
              onClick={handleConvert}
              disabled={!inputText.trim()}
            >
              Convert to Gesture
            </Button>
          </div>

          {/* Gesture Display Area */}
          {showGesture && (
            <div className="gc-card-gradient rounded-3xl overflow-hidden shadow-lg animate-slide-up">
              {/* Gesture Animation Area */}
              <div className="aspect-square bg-muted/50 relative flex items-center justify-center">
                <div className="text-center">
                  {isPlaying ? (
                    <>
                      <Hand className="w-24 h-24 text-primary mx-auto mb-4 animate-bounce" />
                      <p className="text-muted-foreground">Playing gestures...</p>
                    </>
                  ) : (
                    <>
                      <Hand className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Gesture complete</p>
                    </>
                  )}
                </div>

                {/* Playback indicator */}
                {isPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                    <div className="h-full bg-primary animate-pulse w-full" />
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-4 flex justify-center gap-4">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => {
                    setIsPlaying(true);
                    setTimeout(() => setIsPlaying(false), 5000);
                  }}
                >
                  <RotateCcw size={20} />
                </Button>
              </div>

              {/* Text being signed */}
              <div className="px-4 pb-4">
                <p className="text-sm text-muted-foreground text-center">
                  Signing: "{inputText}"
                </p>
              </div>
            </div>
          )}

          {/* Common Phrases */}
          <div className="bg-card rounded-2xl p-4 shadow">
            <h4 className="font-semibold text-card-foreground mb-3">
              Common Phrases
            </h4>
            <div className="flex flex-wrap gap-2">
              {["Hello", "Thank you", "Please", "Goodbye", "How are you?", "Nice to meet you"].map(
                (phrase) => (
                  <button
                    key={phrase}
                    onClick={() => setInputText(phrase)}
                    className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
                  >
                    {phrase}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TextToGesture;
