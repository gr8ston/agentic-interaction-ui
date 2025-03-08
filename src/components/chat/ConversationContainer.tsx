
import { useState, useEffect } from "react";
import { ChatHistory } from "./ChatHistory";
import { ChatInput } from "./ChatInput";
import { ConversationMessage } from "@/types/api";
import { conversationService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export function ConversationContainer() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  // Example messages for demonstration
  useEffect(() => {
    const exampleMessages: ConversationMessage[] = [
      {
        id: 'user-example-1',
        role: 'user',
        content: 'hi',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'agent-example-1',
        role: 'agent',
        content: 'Hi there! How can I help you?',
        timestamp: new Date().toISOString(),
        metrics: {
          latency: 1.3,
          tokens: {
            input: 9,
            output: 23,
          },
        },
        verbose: {
          promptForComposition: 'hi',
          composition: 'Greeting_Response(context=None)',
          promptForEnhancedResponse: 'Question: hi\n\nPlease reason step by step and then provide the final answer.',
        },
      },
      {
        id: 'user-example-2',
        role: 'user',
        content: 'what is the capital of france and its attractions',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'agent-example-2',
        role: 'agent',
        content: 'Paris is the capital of France. Its attractions include the iconic Eiffel Tower, the world-famous Louvre Museum housing the Mona Lisa, the historic Notre-Dame Cathedral, and the picturesque Champs-Élysées avenue.',
        timestamp: new Date().toISOString(),
        metrics: {
          latency: 0.85,
          tokens: {
            input: 10,
            output: 5,
          },
        },
        verbose: {
          promptForComposition: 'You are a composition expert. User asked: What is the capital of France and its attractions? ..........',
          composition: 'Find_Attractions(Find_Capital("France"))',
          rawResults: 'Paris | Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, Champs-Élysées',
          promptForEnhancedResponse: 'Based on the raw results, and the users question.... provide answer in a concierge manner.',
        },
      },
    ];

    setMessages(exampleMessages);
  }, []);

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
      <ChatHistory messages={messages} isTyping={isTyping} />
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
}
