
export interface User {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    username: string;
  };
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  metrics?: {
    latency: number;
    tokens: {
      input: number;
      output: number;
    };
  };
  verbose?: {
    promptForComposition: string;
    composition: string;
    promptForEnhancedResponse: string;
  };
}

export interface Conversation {
  id: string;
  messages: ConversationMessage[];
}

export interface ConversationRequest {
  conversation_id?: string;
  question: string;
}

export interface ConversationResponse {
  conversation_id: string;
  message_id: string;
  answer: string;
  tokens_consumed: {
    input: number;
    output: number;
  };
  latency_taken: number;
  prompt_for_composition: string;
  composition: string;
  prompt_for_enhanced_response: string;
}
