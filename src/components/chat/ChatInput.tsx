import { useState, useRef, useEffect } from "react";
import { Send, Plus, Settings2, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const ChatInput = ({ onSend, isLoading, placeholder = "Ask anything..." }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative bg-input rounded-2xl border border-border transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
        <div className="flex items-end gap-2 p-3">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none text-sm md:text-base min-h-[24px] max-h-[200px]"
          />
          
          <div className="flex items-center gap-1">
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                message.trim() && !isLoading
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between px-3 pb-3 pt-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">Tools</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">Fast</span>
            <button
              type="button"
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
