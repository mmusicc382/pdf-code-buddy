import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import gcLogo from "@/assets/gc-logo.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gc-gradient flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="animate-float mb-8">
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-card/20">
          <img
            src={gcLogo}
            alt="G&C - Gesture and Communication Logo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Welcome Text */}
      <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
          Hello!!
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-primary-foreground/90 mb-3">
          Welcome to gesture and communication
        </h2>
        <p className="text-lg text-primary-foreground/80 max-w-md mx-auto">
          Gestures helps to communicate<br />
          Join us to communicate with others using signs.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <Button
          variant="gcDark"
          size="xl"
          className="flex-1"
          onClick={() => navigate("/signin")}
        >
          SIGN IN
        </Button>
        <Button
          variant="gcLight"
          size="xl"
          className="flex-1"
          onClick={() => navigate("/signup")}
        >
          SIGN UP
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
