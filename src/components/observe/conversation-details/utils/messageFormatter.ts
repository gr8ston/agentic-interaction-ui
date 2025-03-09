
import { ConversationMessage } from "@/types/api";
import { getTotalTokens } from "@/integrations/supabase/client";

export const formatMessage = (message: any): ConversationMessage => {
  // Check if we have latency or token data (only for system/agent messages)
  const hasMetrics = (message.role === 'system' || message.role === 'agent') && 
                    (message.latency_ms !== null || message.tokens_consumed !== null);
  
  // Extract token information from the JSONB structure
  let inputTokens = 0;
  let outputTokens = 0;
  
  if (message.tokens_consumed) {
    // Use our improved getTotalTokens helper
    const totalTokens = getTotalTokens(message.tokens_consumed);
    
    // Check for specific format with separate input/output fields
    if (typeof message.tokens_consumed === 'object' && message.tokens_consumed !== null) {
      const tokenObj = message.tokens_consumed as Record<string, unknown>;
      
      if ('input' in tokenObj && 'output' in tokenObj) {
        inputTokens = Number(tokenObj.input || 0);
        outputTokens = Number(tokenObj.output || 0);
      } else if ('prompt_tokens' in tokenObj && 'completion_tokens' in tokenObj) {
        inputTokens = Number(tokenObj.prompt_tokens || 0);
        outputTokens = Number(tokenObj.completion_tokens || 0);
      } else {
        // Split the total based on role (33% input, 67% output for AI messages)
        if (message.role === 'system' || message.role === 'agent') {
          inputTokens = Math.floor(totalTokens * 0.33);
          outputTokens = Math.floor(totalTokens * 0.67);
        } else {
          inputTokens = totalTokens; // For user messages, all tokens are input
          outputTokens = 0;
        }
      }
    } else {
      // For non-object token values, split based on role
      if (message.role === 'system' || message.role === 'agent') {
        inputTokens = Math.floor(totalTokens * 0.33);
        outputTokens = Math.floor(totalTokens * 0.67);
      } else {
        inputTokens = totalTokens;
        outputTokens = 0;
      }
    }
  }
  
  return {
    id: message.message_id,
    role: message.role,
    content: message.content,
    timestamp: message.created_at,
    // Only include metrics for system/agent messages
    metrics: hasMetrics ? {
      latency: message.latency_ms ? Number(message.latency_ms) / 1000 : 0, // Convert ms to seconds
      tokens: {
        input: inputTokens,
        output: outputTokens
      }
    } : undefined
  };
};
