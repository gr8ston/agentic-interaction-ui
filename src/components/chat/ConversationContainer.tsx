import { useState, useEffect } from "react";
import { ChatHistory } from "./ChatHistory";
import { ChatInput } from "./ChatInput";
import { ConversationMessage } from "@/types/api";
import { conversationService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ConversationContainer() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [developerMode, setDeveloperMode] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSendMessage = async (content: string) => {
    // Add user message to chat
    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Send to API
      const response = await conversationService.sendMessage({
        conversation_id: conversationId,
        question: content,
      });
      
      // Save conversation ID for subsequent messages
      if (!conversationId) {
        setConversationId(response.conversation_id);
      }
      
      // Add agent response to chat
      const agentMessage: ConversationMessage = {
        id: response.message_id,
        role: "agent",
        content: response.answer,
        timestamp: new Date().toISOString(),
        metrics: {
          latency: response.latency_taken,
          tokens: response.tokens_consumed,
        },
        verbose: {
          promptForComposition: response.prompt_for_composition,
          composition: response.composition,
          promptForEnhancedResponse: response.prompt_for_enhanced_response,
          rawResults: response.raw_results,
        },
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-gray-50">
      <div className="flex justify-end items-center px-4 py-2 bg-white border-b">
        <div className="flex items-center space-x-2">
          <Switch
            id="developer-mode"
            checked={developerMode}
            onCheckedChange={setDeveloperMode}
          />
          <Label htmlFor="developer-mode" className="text-sm font-medium">
            Developer Mode
          </Label>
        </div>
      </div>
      <ChatHistory messages={messages} isTyping={isTyping} developerMode={developerMode} />
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
}
