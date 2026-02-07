import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Demo webhook URL - replace with your actual n8n webhook URL
const WEBHOOK_URL = "https://demo.webhook.site/test"; // Placeholder for demo

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // For demo purposes, we'll simulate a response
      // In production, this would call your n8n webhook
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => null);

      // If webhook fails or is demo, simulate a response
      let assistantContent: string;
      
      if (response?.ok) {
        const data = await response.json();
        assistantContent = data.response || data.message || "I received your message!";
      } else {
        // Demo response when webhook is not configured
        assistantContent = generateDemoResponse(content);
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      
      // Still add a fallback response for demo
      const fallbackMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I'm having trouble connecting to the server. Please check your webhook configuration.",
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

// Demo response generator for testing without a real webhook
function generateDemoResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
    return "Hello! 👋 How can I help you today? I'm connected to your n8n workflow and ready to assist.";
  }
  
  if (lowerInput.includes("image") || lowerInput.includes("create")) {
    return "I'd love to help you create something! To generate images, you'll need to configure your n8n workflow with an image generation node. What would you like to create?";
  }
  
  if (lowerInput.includes("write") || lowerInput.includes("help me write")) {
    return "I'm here to help you write! What would you like to work on? I can help with:\n\n• Blog posts and articles\n• Creative writing\n• Professional emails\n• Documentation\n• And much more!";
  }
  
  if (lowerInput.includes("learn")) {
    return "Learning is wonderful! 📚 What topic interests you? I can help explain concepts, provide resources, or create a learning plan tailored to your goals.";
  }
  
  if (lowerInput.includes("boost") || lowerInput.includes("motivation")) {
    return "Here's a boost for you! ✨\n\n\"Every expert was once a beginner. Keep pushing forward!\"\n\nWould you like some productivity tips or perhaps a creative challenge to spark your day?";
  }
  
  return `Thanks for your message! 🚀\n\nI received: "${input}"\n\nThis is a demo response. To connect your n8n workflow:\n1. Update the WEBHOOK_URL in useChat.ts\n2. Set your n8n webhook to receive POST requests\n3. Return a JSON with a "response" or "message" field`;
}
