
import { AIInputWithLoading } from "@/components/ui/ai-input-with-loading";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  return (
    <div className="border-t bg-white">
      <AIInputWithLoading
        onSubmit={onSendMessage}
        placeholder="Type your message..."
        loadingDuration={2000}
        disabled={disabled}
        className="py-2"
      />
    </div>
  );
}
