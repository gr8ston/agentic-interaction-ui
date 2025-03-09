
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export function useSeedDemoData() {
  const [seedingStatus, setSeedingStatus] = useState<string>("");
  
  const seedDemoData = async () => {
    setSeedingStatus("Seeding database with demo data...");
    
    try {
      const now = new Date();
      const appNames = ["travel_planner", "weather_app", "recipe_finder", "shopping_assistant", "workout_planner"];
      const conversations = [];
      const messages = [];
      
      // Helper function to generate a proper UUID
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      // Generate 30 conversations for the current 14-day period
      for (let i = 0; i < 30; i++) {
        // Random date within last 14 days
        const daysAgo = Math.floor(Math.random() * 14);
        const createdAt = new Date();
        createdAt.setDate(now.getDate() - daysAgo);
        
        const conversation_id = generateUUID();
        const app_name = appNames[Math.floor(Math.random() * appNames.length)];
        
        conversations.push({
          conversation_id,
          app_name,
          created_at: createdAt.toISOString(),
          user_id: "demo-user",
          summary: `Demo conversation ${i+1}`
        });
        
        // Generate 3-5 messages per conversation
        const messageCount = Math.floor(Math.random() * 3) + 3;
        for (let j = 0; j < messageCount; j++) {
          const isUser = j % 2 === 0;
          const message_id = generateUUID();
          
          // For AI responses, add metrics
          const latency = isUser ? null : 800 + Math.floor(Math.random() * 1200);
          const tokens = isUser ? null : 200 + Math.floor(Math.random() * 800);
          
          messages.push({
            message_id,
            conversation_id,
            content: isUser ? `User message ${j/2+1}` : `AI response to message ${Math.floor(j/2)+1}`,
            role: isUser ? "user" : "system",
            created_at: createdAt.toISOString(),
            sequence_number: j + 1,
            latency_ms: latency,
            tokens_consumed: tokens,
            llm_model: isUser ? null : "gpt-4o",
            llm_provider: isUser ? null : "OpenAI"
          });
        }
      }
      
      // Insert conversations
      const { error: convError } = await supabase
        .from('conversations')
        .insert(conversations);
      
      if (convError) {
        throw new Error(`Error inserting conversations: ${convError.message}`);
      }
      
      // Insert messages
      const { error: msgError } = await supabase
        .from('messages')
        .insert(messages);
      
      if (msgError) {
        throw new Error(`Error inserting messages: ${msgError.message}`);
      }
      
      setSeedingStatus(`Successfully seeded database with ${conversations.length} conversations and ${messages.length} messages!`);
      
      return true;
    } catch (error) {
      console.error("Error seeding demo data:", error);
      setSeedingStatus(`Error seeding demo data: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  };
  
  return {
    seedingStatus,
    setSeedingStatus,
    seedDemoData
  };
}
