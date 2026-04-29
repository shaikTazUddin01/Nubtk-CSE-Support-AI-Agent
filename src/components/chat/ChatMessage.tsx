import { cn } from "@/lib/utils";
import { Sparkles, User } from "lucide-react";
import logo from '@/assets/logo.jfif'

interface ChatMessageProps {
  role: "user" | "assistant";
  content?: string;
  image?: string;
  isLoading?: boolean;
}

const ChatMessage = ({
  role,
  content,
  image,
  isLoading,
}: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-2 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full gradient-accent">
          <img src={logo} alt="" className="h-10 w-10"/>
        </div>
      )}

      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3 space-y-2",
          isUser
            ? "bg-chat-user text-foreground"
            : "bg-transparent text-foreground"
        )}
      >
        {isLoading ? (
          <div className="flex gap-1">
            <span
              className="h-2 w-2 rounded-full bg-muted-foreground animate-typing"
              style={{ animationDelay: "0s" }}
            />
            <span
              className="h-2 w-2 rounded-full bg-muted-foreground animate-typing"
              style={{ animationDelay: "0.2s" }}
            />
            <span
              className="h-2 w-2 rounded-full bg-muted-foreground animate-typing"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        ) : (
          <>
            {image && (
              <img
                src={image}
                alt="Uploaded by user"
                className="max-w-[250px] rounded-xl border border-border object-cover"
              />
            )}

            {content && (
              <p className="whitespace-pre-wrap text-sm leading-relaxed md:text-base">
                {content}
              </p>
            )}
          </>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
          <User className="h-4 w-4 text-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;