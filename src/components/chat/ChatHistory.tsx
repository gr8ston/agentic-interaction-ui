
import { ConversationMessage } from "@/types/api";
import { ChatMessage } from "./ChatMessage";
import { useEffect, useRef } from "react";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble";

interface ChatHistoryProps {
  messages: ConversationMessage[];
  isTyping?: boolean;
}

export function ChatHistory({ messages, isTyping = false }: ChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-brand-primary">Welcome to Agentic Framework Demo</h3>
            <p className="text-gray-500 max-w-md">
              Ask a question to start a conversation with the assistant.
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar fallback="A" />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
          
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
