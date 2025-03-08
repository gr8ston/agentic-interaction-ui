
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
import { Clock, Cpu, Copy, Info, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
              <div className="flex space-x-2 mt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                        <Clock size={12} className="animate-pulse" />
                        <span>{message.metrics.latency.toFixed(2)}s</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Response latency</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                        <Zap size={12} />
                        <span>{message.metrics.tokens.input} in, {message.metrics.tokens.output} out</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Tokens consumed</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                          <div className="text-gray-700 bg-gray-50 p-2 rounded border border-gray-100 whitespace-pre-wrap">
                            <code className="font-mono text-sm">
                              {message.verbose.composition}
                            </code>
                          </div>
                        </div>
                        
                        {message.verbose.rawResults && (
                          <div>
                            <h4 className="font-medium text-brand-primary mb-1">Raw Results</h4>
                            <p className="text-gray-700 bg-gray-50 p-2 rounded border border-gray-100 font-mono text-sm">
                              {message.verbose.rawResults}
                            </p>
                          </div>
                        )}
                        
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
