import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content?: string;
  image?: string;
  timestamp: Date;
}

const WEBHOOK_URL = "https://itsheba.app.n8n.cloud/webhook/95dd458a-f44e-4949-87e0-e9fb24b18b95";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content?: string, file?: File) => {
    if (!content && !file) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content || "",
      image: file ? URL.createObjectURL(file) : undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const formData = new FormData();

      if (content) formData.append("message", content);
      if (file) formData.append("image", file);

      formData.append("timestamp", new Date().toISOString());

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      }).catch(() => null);

      let assistantContent = "";

      if (response?.ok) {
        const data = await response.json();
        assistantContent =
          data.response ||
          data.message ||
          "I received your request.";
      } else {
        assistantContent = generateDemoResponse(content || "", !!file);
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      toast.error("Server connection failed");

      const fallbackMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: generateDemoResponse(content || "", !!file),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};


// Basic demo replies
function generateDemoResponse(input: string, hasImage: boolean): string {

  const lower = input.toLowerCase();

  if (hasImage && input) {
    return `🖼 I received your image and question.

Your question: "${input}"

To analyze images, connect your n8n workflow with Gemini Vision API.`;
  }

  if (hasImage) {
    return "🖼 I received your image. Connect Gemini Vision in n8n to analyze it.";
  }

  if (lower.includes("hello") || lower.includes("hi")) {
    return "Hello! 👋 How can I help you today?";
  }

  if (lower.includes("image")) {
    return "You can upload an image and ask questions about it.";
  }

  if (lower.includes("help")) {
    return "Sure! Tell me what you need help with.";
  }

  if (lower.includes("learn")) {
    return "Learning is great! What topic do you want to learn?";
  }

  if (lower.includes("motivation")) {
    return "✨ Stay motivated! Every expert was once a beginner.";
  }

  return `Thanks for your message!

You said: "${input}"

This is a demo response. Connect your n8n webhook to enable AI responses.`;
}