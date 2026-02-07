import { Sparkles, Menu, User } from "lucide-react";

interface ChatHeaderProps {
  onMenuClick?: () => void;
}

const ChatHeader = ({ onMenuClick }: ChatHeaderProps) => {
  return (
    <header className="border-b border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 ">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">
              NUBTK CSE Student Support
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* <button className="px-4 py-2 rounded-full gradient-accent text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Upgrade</span>
        </button> */}

          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-foreground">
            <User className="h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
