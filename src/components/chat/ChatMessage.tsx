import { cn } from "@/lib/utils";
import { Sparkles, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

const ChatMessage = ({ role, content, isLoading }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-accent flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-chat-user text-foreground"
            : "bg-transparent text-foreground"
        )}
      >
        {isLoading ? (
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: "0s" }} />
            <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: "0.2s" }} />
            <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: "0.4s" }} />
          </div>
        ) : (
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{content}</p>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-4 h-4 text-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
