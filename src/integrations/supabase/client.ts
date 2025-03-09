
import { createClient } from '@supabase/supabase-js';

// For Vite applications, environment variables should be accessed using import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a fallback client for development if environment variables aren't set
export const supabase = createClient(
  supabaseUrl || 'https://qijceioeubmccdmissne.supabase.co',
  supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpamNlaW9ldWJtY2NkbWlzc25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NjQ2MjEsImV4cCI6MjA1NzA0MDYyMX0.8a_61geHU6blwMIQ092MHB_tOovO0dDFl-Hi9hE2zsI'
);

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
