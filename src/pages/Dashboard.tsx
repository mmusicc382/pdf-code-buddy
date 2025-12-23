import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hand, MessageSquare, Mic, Type, LogOut } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "GESTURE TO TEXT, VOICE",
      description: "Convert your sign language gestures into text and voice",
      icon: Hand,
      gradient: "from-gc-purple-light to-gc-pink",
      onClick: () => navigate("/gesture-to-text"),
    },
    {
      title: "TEXT, VOICE TO GESTURE",
      description: "Convert text or voice input into sign language gestures",
      icon: MessageSquare,
      gradient: "from-gc-pink to-gc-purple-light",
      onClick: () => navigate("/text-to-gesture"),
    },
  ];

  return (
    <div className="min-h-screen bg-gc-purple-light/30">
      {/* Header */}
      <header className="gc-gradient px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-foreground">G&C</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut size={24} />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Choose a feature
          </h2>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={feature.onClick}
                className="w-full group"
              >
                <div className={`
                  gc-card-gradient rounded-3xl p-6 md:p-8
                  shadow-lg hover:shadow-xl transition-all duration-300
                  hover:scale-[1.02] text-left
                `}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm md:text-base pl-16">
                    {feature.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickActionCard
                icon={Hand}
                label="Camera"
                onClick={() => navigate("/gesture-to-text")}
              />
              <QuickActionCard
                icon={Type}
                label="Text Input"
                onClick={() => navigate("/text-to-gesture")}
              />
              <QuickActionCard
                icon={Mic}
                label="Voice Input"
                onClick={() => navigate("/text-to-gesture")}
              />
              <QuickActionCard
                icon={MessageSquare}
                label="History"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface QuickActionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}

const QuickActionCard = ({ icon: Icon, label, onClick }: QuickActionCardProps) => (
  <button
    onClick={onClick}
    className="bg-card rounded-2xl p-4 flex flex-col items-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-105"
  >
    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <span className="text-sm font-medium text-card-foreground">{label}</span>
  </button>
);

export default Dashboard;
