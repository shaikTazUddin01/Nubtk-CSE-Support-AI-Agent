import { useState, useRef, useEffect } from "react";
import { Send, Plus, Settings2, Mic, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message?: string, file?: File) => void;
  isLoading: boolean;
  placeholder?: string;
}

const ChatInput = ({
  onSend,
  isLoading,
  placeholder = "Ask anything...",
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;
    if (!message.trim() && !selectedFile) return;

    onSend(message.trim() || undefined, selectedFile || undefined);

    setMessage("");
    setSelectedFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);
  };

  const removeSelectedImage = () => {
    setSelectedFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [message]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative rounded-2xl border border-border bg-input transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImagePick}
          disabled={isLoading}
        />

        {previewUrl && (
          <div className="px-3 pt-3">
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="Selected preview"
                className="h-24 w-24 rounded-xl border border-border object-cover"
              />
              <button
                type="button"
                onClick={removeSelectedImage}
                className="absolute -right-2 -top-2 rounded-full border border-border bg-background p-1 shadow hover:bg-secondary"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-end gap-2 p-3">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className="min-h-[24px] max-h-[200px] flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none md:text-base"
          />

          <div className="flex items-center gap-1">
            <button
              type="submit"
              disabled={(!message.trim() && !selectedFile) || isLoading}
              className={cn(
                "rounded-full p-2 transition-all duration-200",
                (message.trim() || selectedFile) && !isLoading
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "cursor-not-allowed text-muted-foreground"
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 pb-3 pt-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Settings2 className="h-4 w-4" />
              <span className="hidden sm:inline">Tools</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Fast
            </span>
            <button
              type="button"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;