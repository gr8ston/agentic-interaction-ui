
import { AuthResponse, ConversationRequest, ConversationResponse, Tool, User } from '@/types/api';

// Base URL for API calls - replace with actual API endpoint
const API_BASE_URL = 'https://api.example.com';

// Mock data for development
const MOCK_TOOLS: Tool[] = [
  {
    id: '1',
    name: 'Ask Question',
    description: 'Ask any question to get an answer',
    icon: 'help-circle'
  },
  {
    id: '2',
    name: 'Analyze Text',
    description: 'Analyze and extract insights from text',
    icon: 'file-text'
  },
  {
    id: '3',
    name: 'Generate Code',
    description: 'Generate code in various programming languages',
    icon: 'code'
  },
  {
    id: '4',
    name: 'Summarize Content',
    description: 'Create concise summaries of longer content',
    icon: 'file-minus'
  },
  {
    id: '5',
    name: 'Research Information',
    description: 'Research information on specific topics',
    icon: 'search'
  }
];

// Check if we're in development mode to use mock data
const USE_MOCK_DATA = true;

// Helper for making authenticated requests
const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
};

// Auth services
export const authService = {
  // Login function
  login: async (credentials: User): Promise<AuthResponse> => {
    if (USE_MOCK_DATA) {
      // Simulate API call with mock data
      return new Promise((resolve) => {
        setTimeout(() => {
          if (credentials.username === 'demo' && credentials.password === 'password') {
            const mockResponse: AuthResponse = {
              token: 'mock-jwt-token-12345',
              user: {
                username: credentials.username,
              },
            };
            localStorage.setItem('auth_token', mockResponse.token);
            localStorage.setItem('user', JSON.stringify(mockResponse.user));
            resolve(mockResponse);
          } else {
            throw new Error('Invalid credentials');
          }
        }, 800);
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },
  
  // Logout function
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
  
  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },
};

// Tools services
export const toolsService = {
  // Get all tools
  getTools: async (): Promise<Tool[]> => {
    if (USE_MOCK_DATA) {
      // Return mock tools data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_TOOLS);
        }, 500);
      });
    }
    
    return authFetch('/api/tools');
  },
};

// Conversation services
export const conversationService = {
  // Send message to API
  sendMessage: async (request: ConversationRequest): Promise<ConversationResponse> => {
    if (USE_MOCK_DATA) {
      // Generate mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockResponse: ConversationResponse = {
            conversation_id: request.conversation_id || `c${Math.floor(Math.random() * 10000)}`,
            message_id: `m${Math.floor(Math.random() * 10000)}`,
            answer: mockResponses[request.question.toLowerCase()] || "I don't have a specific answer for that question. Could you please provide more details or ask something else?",
            tokens_consumed: {
              input: Math.floor(Math.random() * 20) + 5,
              output: Math.floor(Math.random() * 30) + 10,
            },
            latency_taken: parseFloat((Math.random() * 1.5 + 0.5).toFixed(2)),
            prompt_for_composition: request.question,
            composition: requestCompositions[request.question.toLowerCase()] || "Let me think about how to respond to this question... I'll need to consider the context and provide a helpful, accurate answer based on the information I have. I should break down my reasoning step by step to ensure my response is well-structured and logical.",
            prompt_for_enhanced_response: `Question: ${request.question}\n\nPlease reason step by step and then provide the final answer.`,
            raw_results: rawResults[request.question.toLowerCase()] || null
          };
          
          resolve(mockResponse);
        }, 1500);
      });
    }
    
    return authFetch('/api/conversation', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};

// Mock responses for common questions
const mockResponses: Record<string, string> = {
  'what is the capital of france?': 'Paris is the capital of France. Its attractions include the iconic Eiffel Tower, the world-famous Louvre Museum housing the Mona Lisa, the historic Notre-Dame Cathedral, and the picturesque Champs-Élysées avenue.',
  'what is the capital of france and its attractions?': 'Paris is the capital of France. Its attractions include the iconic Eiffel Tower, the world-famous Louvre Museum housing the Mona Lisa, the historic Notre-Dame Cathedral, and the picturesque Champs-Élysées avenue.',
  'who are you?': 'I am an AI assistant created by MOURITech using the Agentic Framework. I can help answer questions, analyze information, and assist with various tasks through conversation.',
  'hello': 'Hello! How can I assist you today?',
  'hi': 'Hi there! How can I help you?',
  'how does the agentic framework work?': 'The Agentic Framework works by breaking down complex tasks into steps handled by specialized tools and agents. When you ask a question, the framework determines which tools to use, creates a composition of reasoning steps, enhances the response with additional context if needed, and then delivers a comprehensive answer. Behind the scenes, it manages conversation context, metrics tracking, and efficient token usage.',
};

// Mock compositions for common questions
const requestCompositions: Record<string, string> = {
  'what is the capital of france?': 'Find_Attractions(Find_Capital("France"))',
  'what is the capital of france and its attractions?': 'Find_Attractions(Find_Capital("France"))',
  'who are you?': 'Identify_Self() -> Describe_Capabilities() -> Format_Response()',
  'hello': 'Greeting_Response(context=None)',
  'hi': 'Greeting_Response(context=None)',
  'how does the agentic framework work?': 'Define_Agentic_Framework() -> Explain_Components() -> Describe_Process_Flow() -> Summarize()',
};

// Mock raw results for common questions
const rawResults: Record<string, string> = {
  'what is the capital of france?': 'Paris | Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, Champs-Élysées',
  'what is the capital of france and its attractions?': 'Paris | Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, Champs-Élysées',
  'how does the agentic framework work?': 'Components: [Task Decomposition, Tool Selection, Reasoning Engine, Response Enhancement] | Process: Sequential with feedback loops | Metrics: Latency=0.8s, Tokens=[input:15, output:42]',
};
