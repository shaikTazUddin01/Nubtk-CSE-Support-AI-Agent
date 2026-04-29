import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import QuickChips from "./QuickChips";
import WelcomeScreen from "./WelcomeScreen";
import ChatHeader from "./ChatHeader";
import { useChat } from "@/hooks/useChat";

const ChatContainer = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen flex-col bg-background">
      <ChatHeader />

      <main className="flex flex-1 flex-col overflow-hidden">
        {hasMessages ? (
          <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6">
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  image={message.image}
                />
              ))}

              {isLoading && <ChatMessage role="assistant" isLoading />}

              <div ref={messagesEndRef} />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center px-4">
            <WelcomeScreen />
          </div>
        )}

        <div className="px-4 pb-6 pt-4">
          <div className="mx-auto max-w-3xl space-y-4">
            <ChatInput
              onSend={sendMessage}
              isLoading={isLoading}
              placeholder="Ask anything..."
            />

            {!hasMessages && <QuickChips onChipClick={(text) => sendMessage(text)} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatContainer;