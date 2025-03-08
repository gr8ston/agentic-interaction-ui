
import { ConversationMessage } from "@/types/api";
import { formatDistanceToNow } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  ChatBubble, 
  ChatBubbleAvatar, 
  ChatBubbleMessage,
  ChatBubbleActionWrapper,
  ChatBubbleAction
} from "@/components/ui/chat-bubble";
import { Copy, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ConversationMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
  });

  return (
    <ChatBubble 
      variant={isUser ? "sent" : "received"}
      className="mb-1"
    >
      <ChatBubbleAvatar
        fallback={isUser ? "U" : "A"}
      />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="font-medium">
            {isUser ? "You" : "Assistant"}
          </span>
          <span className="text-xs text-gray-500">{formattedTime}</span>
        </div>
        <ChatBubbleMessage
          variant={isUser ? "sent" : "received"}
          className={cn(
            isUser ? "bg-brand-light text-gray-800" : "bg-white border border-gray-200 shadow-sm text-gray-800"
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </ChatBubbleMessage>

        {!isUser && (message.metrics || message.verbose) && (
          <div className="mt-1">
            {message.metrics && (
              <div className="message-metrics">
                <span className="message-metric-badge">
                  Latency: {message.metrics.latency.toFixed(2)}s
                </span>
                <span className="message-metric-badge">
                  Tokens: {message.metrics.tokens.input} in, {message.metrics.tokens.output} out
                </span>
              </div>
            )}
            
            {message.verbose && (
              <div className="mt-2 max-w-[95%]">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="verbose-details" className="border border-gray-200 rounded-md bg-white">
                    <AccordionTrigger className="px-4 py-2 text-sm font-medium text-brand-primary hover:text-brand-secondary">
                      View process details
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3 text-sm">
                        <div>
                          <h4 className="font-medium text-brand-primary mb-1">Initial Prompt</h4>
                          <p className="text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">
                            {message.verbose.promptForComposition}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-brand-primary mb-1">Reasoning Process</h4>
                          <p className="text-gray-700 bg-gray-50 p-2 rounded border border-gray-100 whitespace-pre-wrap">
                            {message.verbose.composition}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-brand-primary mb-1">Enhanced Prompt</h4>
                          <p className="text-gray-700 bg-gray-50 p-2 rounded border border-gray-100 whitespace-pre-wrap">
                            {message.verbose.promptForEnhancedResponse}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>
        )}
      </div>
    </ChatBubble>
  );
}
