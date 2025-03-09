
import { createClient } from '@supabase/supabase-js';

// In Vite, environment variables are accessed via import.meta.env, not process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface AppUsageMetric {
  name: string;
  value: number;
}

export interface ConversationMetrics {
  totalConversations: number;
  totalMessages: number;
  averageLatency: number;
  totalTokensConsumed: number;
  conversationsChange: number;
  messagesChange: number;
  latencyChange: number;
  tokensChange: number;
}

export interface DailyMetric {
  date: string;
  value: number;
}

export interface RecentConversation {
  id: string;
  app: string;
  time: string;
  status: string;
  tokens: number;
}

// Function to calculate total tokens from a token object
export function getTotalTokens(tokensObj: unknown): number {
  if (!tokensObj) return 0;
  
  try {
    // Handle different potential formats
    if (typeof tokensObj === 'number') {
      return Number(tokensObj);
    }
    
    if (typeof tokensObj === 'string') {
      return Number(tokensObj);
    }
    
    // If it's an object with prompt_tokens and completion_tokens
    if (typeof tokensObj === 'object' && tokensObj !== null) {
      const obj = tokensObj as Record<string, unknown>;
      let total = 0;
      
      if ('prompt_tokens' in obj && typeof obj.prompt_tokens === 'number') {
        total += Number(obj.prompt_tokens);
      }
      
      if ('completion_tokens' in obj && typeof obj.completion_tokens === 'number') {
        total += Number(obj.completion_tokens);
      }
      
      if ('total_tokens' in obj && typeof obj.total_tokens === 'number') {
        return Number(obj.total_tokens);
      }
      
      return total;
    }
    
    return 0;
  } catch (error) {
    console.error('Error calculating tokens:', error);
    return 0;
  }
}
