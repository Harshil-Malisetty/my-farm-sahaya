import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Azure OpenAI chat request received');
    
    const { message, conversationId, pageContext } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    console.log('Processing message:', message);
    console.log('Page context:', pageContext);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader?.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('User authenticated:', user.id);

    // Get or create conversation
    let currentConversationId = conversationId;
    
    if (!currentConversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          title: message.substring(0, 50) + '...'
        })
        .select()
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        throw convError;
      }

      currentConversationId = newConversation.id;
      console.log('Created new conversation:', currentConversationId);
    }

    // Save user message
    const { error: userMsgError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: currentConversationId,
        user_id: user.id,
        message: message,
        is_user: true,
        page_context: pageContext
      });

    if (userMsgError) {
      console.error('Error saving user message:', userMsgError);
      throw userMsgError;
    }

    // Get conversation history for context
    const { data: messages, error: historyError } = await supabase
      .from('chat_messages')
      .select('message, is_user, page_context')
      .eq('conversation_id', currentConversationId)
      .order('timestamp', { ascending: true });

    if (historyError) {
      console.error('Error fetching conversation history:', historyError);
    }

    // Build conversation context
    const conversationHistory = messages?.map(msg => ({
      role: msg.is_user ? 'user' : 'assistant',
      content: msg.message
    })) || [];

    // Create system prompt based on page context
    let systemPrompt = `You are an AI farming assistant for Kerala farmers. Provide helpful, practical farming advice in simple language. `;
    
    if (pageContext) {
      const contextPrompts = {
        weather: 'Focus on weather-related farming advice and next action recommendations based on current conditions.',
        'crop-recommender': 'Help with crop selection and farming planning advice based on season, soil, and local conditions.',
        'farm-diary': 'Assist with recording farming activities, scheduling tasks, and providing reminders.',
        'pest-disease': 'Provide pest and disease identification, prevention, and control advice.',
        'fertilizer': 'Give fertilizer application and soil health advice.',
        'virtual-farm': 'Describe virtual farm progress and provide farming guidance.',
        'modern-farming': 'Provide modern farming techniques and technology recommendations.'
      };
      
      systemPrompt += contextPrompts[pageContext as keyof typeof contextPrompts] || '';
    }

    // Call Azure OpenAI
    console.log('Calling Azure OpenAI...');
    const azureResponse = await fetch(
      'https://suchi-ai-model.cognitiveservices.azure.com/openai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': Deno.env.get('AZURE_OPENAI_API_KEY')!,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.slice(-10), // Keep last 10 messages for context
          ],
          max_completion_tokens: 500,
          stream: false
        }),
      }
    );

    if (!azureResponse.ok) {
      const error = await azureResponse.text();
      console.error('Azure OpenAI error:', error);
      throw new Error(`Azure OpenAI error: ${azureResponse.status} - ${error}`);
    }

    const result = await azureResponse.json();
    const aiReply = result.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    console.log('AI response received:', aiReply);

    // Save AI response
    const { error: aiMsgError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: currentConversationId,
        user_id: user.id,
        message: aiReply,
        is_user: false,
        page_context: pageContext
      });

    if (aiMsgError) {
      console.error('Error saving AI message:', aiMsgError);
      throw aiMsgError;
    }

    return new Response(
      JSON.stringify({ 
        reply: aiReply,
        conversationId: currentConversationId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Azure OpenAI chat error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        reply: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});