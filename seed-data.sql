-- Seed Data Script for Supabase (SIMPLIFIED VERSION)
-- This fixes the constraint error by only using 'user' and 'system' roles

-- Clear existing data (uncomment if you want to start fresh)
-- DELETE FROM message_feedback;
-- DELETE FROM messages;
-- DELETE FROM conversations;

-- Add conversations first
INSERT INTO conversations (conversation_id, app_name, created_at, updated_at, summary, user_id)
SELECT 
  gen_random_uuid(), -- conversation_id
  (ARRAY['weather_app', 'travel_planner', 'recipe_finder', 'workout_planner', 'shopping_assistant'])[1 + floor(random() * 5)], -- app_name
  NOW() - ((30 - g) || ' days')::INTERVAL + (floor(random() * 24) || ' hours')::INTERVAL, -- created_at
  NOW() - ((30 - g) || ' days')::INTERVAL + (floor(random() * 24) || ' hours')::INTERVAL + (floor(random() * 60) || ' minutes')::INTERVAL, -- updated_at
  'Sample conversation ' || g, -- summary
  'demo_user' -- user_id
FROM 
  generate_series(1, 30) g -- 30 days
WHERE 
  -- Create more conversations in recent days
  random() < LEAST(0.8, 0.3 + (g::float / 40))
LIMIT 100;

-- Now add messages for each conversation
WITH conversation_data AS (
  SELECT conversation_id, created_at, app_name 
  FROM conversations 
  WHERE user_id = 'demo_user' -- Only select our demo conversations
)
INSERT INTO messages (message_id, conversation_id, sequence_number, content, role, created_at, tokens_consumed, latency_ms, llm_model, user_id)
SELECT
  gen_random_uuid(), -- message_id
  cd.conversation_id,
  s, -- sequence number
  CASE WHEN s % 2 = 1 
       THEN 'User question about ' || cd.app_name || ' #' || (s+1)/2
       ELSE 'System response about ' || cd.app_name || ' #' || s/2
  END, -- content
  CASE WHEN s % 2 = 1 THEN 'user' ELSE 'system' END, -- role (alternating user/system)
  cd.created_at + ((s || ' minutes')::interval), -- created_at (sequential)
  -- Token usage decreases over time (recent dates have fewer tokens)
  CASE WHEN s % 2 = 0 THEN 
    jsonb_build_object(
      'input', GREATEST(15, 40 - (extract(day from (NOW() - cd.created_at)) / 30.0 * 15)::int + (random() * 10)::int),
      'output', 10 + floor(random() * 91)::INT  -- Random value between 10-100
    )
  ELSE 
    NULL  -- No token info for user messages
  END, -- tokens as JSON only for system messages
  -- Latency improves over time (recent dates have lower latency)
  CASE WHEN s % 2 = 0 THEN
    GREATEST(400, 2000 - (extract(day from (NOW() - cd.created_at)) / 30.0 * 1200)::int + (random() * 200)::int)
  ELSE NULL END, -- latency for system messages only
  CASE WHEN s % 2 = 0 THEN 
    (ARRAY['gpt-4o', 'gpt-4-turbo', 'claude-3-sonnet', 'claude-3-opus', 'gpt-3.5-turbo'])[1 + floor(random() * 5)] 
  ELSE NULL END, -- model for system messages only
  'demo_user'
FROM 
  conversation_data cd,
  generate_series(1, 4) s -- 4 messages per conversation (2 pairs)
ORDER BY cd.created_at, s;

-- Add feedback for ~15% of system responses
WITH system_messages AS (
  SELECT message_id, created_at FROM messages 
  WHERE role = 'system' AND user_id = 'demo_user'
)
INSERT INTO message_feedback (feedback_id, message_id, is_positive, comment, created_at)
SELECT
  gen_random_uuid(),
  message_id,
  random() > 0.2, -- 80% positive
  CASE WHEN random() > 0.5 
       THEN 'Sample feedback comment'
       ELSE NULL 
  END,
  created_at + interval '1 minute'
FROM system_messages
WHERE random() < 0.15 -- Only add feedback to ~15% of messages
LIMIT 30;

SELECT 
  COUNT(*) AS conversations_count 
FROM conversations 
WHERE user_id = 'demo_user';

SELECT 
  COUNT(*) AS messages_count 
FROM messages 
WHERE user_id = 'demo_user';

SELECT 
  COUNT(*) AS feedback_count 
FROM message_feedback;

-- Vacuum analyze for performance
VACUUM ANALYZE conversations;
VACUUM ANALYZE messages;
VACUUM ANALYZE message_feedback; 