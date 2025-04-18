import { AuthResponse, ConversationRequest, ConversationResponse, Tool, User } from '@/types/api';

// Base URL for API calls - replace with actual API endpoint
const API_BASE_URL = 'http://0.0.0.0:8000';

// Set this to false to use the real API
const USE_MOCK_DATA = false;

// Use mock data for authentication but real data for other services
const USE_MOCK_AUTH = true;

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
  },
  {
    id: '6',
    name: 'Find Attractions',
    description: 'Discover attractions in various locations',
    icon: 'map-pin'
  },
  {
    id: '7',
    name: 'Find Capital',
    description: 'Learn about capitals of countries worldwide',
    icon: 'flag'
  }
];

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
    if (USE_MOCK_AUTH) {
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
    
    try {
      const response = await fetch(`${API_BASE_URL}/tools`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      
      const data = await response.json();
      
      // Map the array of tool names to the expected Tool interface format
      return data.tools.map((toolName: string, index: number) => ({
        id: `tool-${index}`,
        name: toolName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        description: `Execute the ${toolName} function`,
        icon: getToolIcon(toolName),
      }));
    } catch (error) {
      console.error('Error fetching tools:', error);
      return [];
    }
  },
};

// Helper function to assign icons based on tool name
const getToolIcon = (toolName: string): string => {
  const iconMappings: Record<string, string> = {
    'write_email': 'file-text',
    'create_travel_guide': 'file-text',
    'compare_destinations': 'file-text',
    'get_current_date': 'calendar',
    'get_forecast': 'cloud',
    'get_distance': 'map',
    'find_hotels': 'home',
    'get_attractions': 'map-pin',
    'get_property_id_by_name': 'search',
    'predict_demand_for_resort': 'chart',
    'check_availability': 'calendar',
  };
  
  return iconMappings[toolName] || 'help-circle';
};

// Conversation services
export const conversationService = {
  // Send message to API
  sendMessage: async (request: ConversationRequest): Promise<ConversationResponse> => {
    if (USE_MOCK_DATA) {
      // Generate mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          // Process the question to make matching more reliable
          const processedQuestion = request.question.toLowerCase().trim();
          
          // Check if the question contains specific keywords for predefined responses
          let responseKey = '';
          
          if (processedQuestion.includes('france') && (processedQuestion.includes('capital') || processedQuestion.includes('paris'))) {
            responseKey = 'france_capital';
          } else if (processedQuestion === 'hi' || processedQuestion === 'hello') {
            responseKey = 'greeting';
          } else if (processedQuestion.includes('who are you')) {
            responseKey = 'identity';
          } else if (processedQuestion.includes('agentic framework')) {
            responseKey = 'framework';
          }
          
          const mockResponse: ConversationResponse = {
            conversation_id: request.conversation_id || `c${Math.floor(Math.random() * 10000)}`,
            message_id: `m${Math.floor(Math.random() * 10000)}`,
            answer: mockResponses[responseKey] || "I don't have a specific answer for that question. Could you please provide more details or ask something else?",
            tokens_consumed: {
              input: Math.floor(Math.random() * 20) + 5,
              output: Math.floor(Math.random() * 30) + 10,
            },
            latency_taken: parseFloat((Math.random() * 1.5 + 0.5).toFixed(2)),
            prompt_for_composition: request.question,
            composition: requestCompositions[responseKey] || "Let me think about how to respond to this question... I'll need to consider the context and provide a helpful, accurate answer based on the information I have. I should break down my reasoning step by step to ensure my response is well-structured and logical.",
            prompt_for_enhanced_response: `Question: ${request.question}\n\nPlease reason step by step and then provide the final answer.`,
            raw_results: rawResults[responseKey] || null
          };
          
          resolve(mockResponse);
        }, 1500);
      });
    }
    
    try {
      // Map the request to the format expected by the real API
      const apiRequest = {
        conversation_id: request.conversation_id || null,
        user_id: 'demo', // Hardcoded user ID for now, can be made dynamic
        question: request.question
      };
      
      const response = await fetch(`${API_BASE_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRequest),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to get response');
      }
      
      const data = await response.json();
      
      // Map the API response to our expected ConversationResponse format
      return {
        conversation_id: data.conversation_id,
        message_id: `m${Date.now()}`, // Generate a message ID since API might not provide one
        answer: data.answer,
        tokens_consumed: data.tokens_consumed,
        latency_taken: data.latency_taken,
        prompt_for_composition: data.prompt_for_composition,
        composition: data.composition,
        prompt_for_enhanced_response: data.prompt_for_enhanced_response,
        raw_results: data.raw_results
      };
    } catch (error) {
      console.error('Error sending message to API:', error);
      throw error;
    }
  },
};

// Mock responses for common questions
const mockResponses: Record<string, string> = {
  'france_capital': 'Paris is the capital of France. Its attractions include the iconic Eiffel Tower, the world-famous Louvre Museum housing the Mona Lisa, the historic Notre-Dame Cathedral, and the picturesque Champs-Élysées avenue.',
  'greeting': 'Hello! How can I assist you today?',
  'identity': 'I am an AI assistant created by MOURITech using the Agentic Framework. I can help answer questions, analyze information, and assist with various tasks through conversation.',
  'framework': 'The Agentic Framework works by breaking down complex tasks into steps handled by specialized tools and agents. When you ask a question, the framework determines which tools to use, creates a composition of reasoning steps, enhances the response with additional context if needed, and then delivers a comprehensive answer. Behind the scenes, it manages conversation context, metrics tracking, and efficient token usage.',
};

// Mock compositions for common questions
const requestCompositions: Record<string, string> = {
  'france_capital': 'Find_Attractions(Find_Capital("France"))',
  'greeting': 'Greeting_Response(context=None)',
  'identity': 'Identify_Self() -> Describe_Capabilities() -> Format_Response()',
  'framework': 'Define_Agentic_Framework() -> Explain_Components() -> Describe_Process_Flow() -> Summarize()',
};

// Mock raw results for common questions
const rawResults: Record<string, string> = {
  'france_capital': 'Paris | Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, Champs-Élysées',
  'framework': 'Components: [Task Decomposition, Tool Selection, Reasoning Engine, Response Enhancement] | Process: Sequential with feedback loops | Metrics: Latency=0.8s, Tokens=[input:15, output:42]',
};
