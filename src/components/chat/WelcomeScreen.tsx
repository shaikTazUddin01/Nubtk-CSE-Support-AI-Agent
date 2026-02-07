import { Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  userName?: string;
}

const WelcomeScreen = ({ userName = "there" }: WelcomeScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-primary" />
        <span className="text-lg gradient-text font-medium">Hi {userName}</span>
      </div>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-2">
        Where should we start?
      </h1>
    </div>
  );
};

export default WelcomeScreen;
