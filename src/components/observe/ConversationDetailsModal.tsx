
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ConversationMessage } from "@/types/api";
import { X } from "lucide-react";

// Sample conversation data for demonstration
const sampleConversations: Record<string, ConversationMessage[]> = {
  "conv-1234": [
    {
      id: "m1",
      role: "user",
      content: "I need help finding information about your pricing plans.",
      timestamp: "2023-01-05T14:23:00Z",
    },
    {
      id: "m2",
      role: "agent",
      content: "I'd be happy to help you with our pricing plans. We offer three tiers: Basic, Pro, and Enterprise. Would you like me to provide details about each?",
      timestamp: "2023-01-05T14:23:15Z",
      metrics: {
        latency: 0.75,
        tokens: {
          input: 12,
          output: 28
        }
      }
    },
    {
      id: "m3",
      role: "user",
      content: "Yes, please tell me about the Enterprise plan.",
      timestamp: "2023-01-05T14:23:45Z",
    },
    {
      id: "m4",
      role: "agent",
      content: "The Enterprise plan is our most comprehensive offering, designed for large organizations. It includes unlimited users, priority support, custom integrations, dedicated account manager, and advanced analytics. Pricing is custom and based on your organization's needs. Would you like to speak with a sales representative for a custom quote?",
      timestamp: "2023-01-05T14:24:10Z",
      metrics: {
        latency: 0.89,
        tokens: {
          input: 8,
          output: 48
        }
      },
      verbose: {
        promptForComposition: "Tell me about the Enterprise pricing plan. What features does it include?",
        composition: "I should provide information about the Enterprise plan, which is our premium tier. I'll include details about the key features that differentiate it from other plans, such as unlimited users, priority support, and dedicated resources. I should also mention that pricing is custom for this tier and offer next steps.",
        promptForEnhancedResponse: "Respond to a user asking about Enterprise pricing plan details. Be thorough but concise.",
      }
    }
  ],
  "conv-2345": [
    {
      id: "m1",
      role: "user",
      content: "Can you help me troubleshoot why my application is showing error code 403?",
      timestamp: "2023-01-06T09:12:00Z",
    },
    {
      id: "m2",
      role: "agent",
      content: "Error code 403 typically indicates a forbidden access issue. This means your credentials don't have permission to access the requested resource. Let me help you troubleshoot this. First, could you tell me if you've recently changed any access permissions or API keys?",
      timestamp: "2023-01-06T09:12:15Z",
      metrics: {
        latency: 0.76,
        tokens: {
          input: 15,
          output: 42
        }
      }
    },
    {
      id: "m3",
      role: "user",
      content: "Yes, we recently rotated our API keys but we updated them in the configuration.",
      timestamp: "2023-01-06T09:12:32Z",
    }
  ],
  "conv-3456": [
    {
      id: "m1",
      role: "user",
      content: "How do I integrate your API with a Python application?",
      timestamp: "2023-01-08T16:45:00Z",
    },
    {
      id: "m2",
      role: "agent",
      content: "Integrating our API with Python is straightforward. Here's a step-by-step guide:\n\n1. First, install our Python SDK: `pip install mouri-client`\n\n2. Import the client in your code:\n```python\nfrom mouri import Client\n```\n\n3. Initialize the client with your API key:\n```python\nclient = Client(api_key='your_api_key_here')\n```\n\n4. Make API calls:\n```python\nresponse = client.chat.create(\n  messages=[{'role': 'user', 'content': 'Hello!'}]\n)\nprint(response.output)\n```\n\nWould you like a more detailed example for a specific use case?",
      timestamp: "2023-01-08T16:45:30Z",
      metrics: {
        latency: 0.92,
        tokens: {
          input: 10,
          output: 89
        }
      }
    }
  ],
  // Add more conversations for other IDs
  "conv-4567": [
    {
      id: "m1",
      role: "user",
      content: "Can you generate an image of a mountain landscape at sunset?",
      timestamp: "2023-01-10T11:34:00Z",
    },
    {
      id: "m2",
      role: "agent",
      content: "I'd be happy to help you generate an image of a mountain landscape at sunset. To create the best possible image, could you provide any specific details about the style (photorealistic, painting, anime, etc.) or any particular elements you'd like to include in the landscape?",
      timestamp: "2023-01-10T11:34:10Z",
      metrics: {
        latency: 0.81,
        tokens: {
          input: 12,
          output: 45
        }
      }
    },
    {
      id: "m3",
      role: "user",
      content: "I'd like a photorealistic image with snow-capped mountains and a lake in the foreground.",
      timestamp: "2023-01-10T11:34:19Z",
    }
  ],
  // Add samples for the latency vs token scatter plot points
  "conv-1001": [],
  "conv-1002": [],
  "conv-1003": [],
  "conv-1004": [],
  "conv-1005": [],
  "conv-1006": [],
  "conv-1007": [],
  "conv-1008": [],
  "conv-1009": [],
  "conv-1010": []
};

// Default messages for IDs without explicit definitions
const getDefaultConversation = (id: string): ConversationMessage[] => [
  {
    id: "m1",
    role: "user",
    content: `This is a sample conversation for ID ${id}. The actual conversation data would be loaded from your database.`,
    timestamp: new Date().toISOString(),
  },
  {
    id: "m2",
    role: "agent",
    content: "This is a placeholder response for demonstration purposes. In a real implementation, this would display the actual conversation messages retrieved from your database.",
    timestamp: new Date().toISOString(),
    metrics: {
      latency: 0.5,
      tokens: {
        input: 20,
        output: 30
      }
    }
  }
];

interface ConversationDetailsModalProps {
  conversationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ConversationDetailsModal({
  conversationId,
  isOpen,
  onClose
}: ConversationDetailsModalProps) {
  if (!conversationId) return null;
  
  // In a real app, you would fetch conversation data from API based on conversationId
  const conversationMessages = sampleConversations[conversationId] || getDefaultConversation(conversationId);
  
  // Get the application name and timestamp from the first message if available
  const appName = "Sample Application"; // This would come from real data
  const startTime = conversationMessages.length > 0 
    ? new Date(conversationMessages[0].timestamp).toLocaleString()
    : "Unknown time";
    
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl flex items-center gap-2">
              Conversation Details
              <span className="text-sm font-normal text-gray-500">({conversationId})</span>
            </DialogTitle>
            <DialogDescription className="mt-1">
              <div className="flex flex-col space-y-1">
                <span>Application: {appName}</span>
                <span>Started: {startTime}</span>
              </div>
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 my-4">
          <div className="space-y-4">
            {conversationMessages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <div className="w-full flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {conversationMessages.length} messages
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
