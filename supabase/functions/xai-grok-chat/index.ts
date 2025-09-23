import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the xAI API key from environment variables
    const xaiApiKey = Deno.env.get('XAI_API_KEY');
    if (!xaiApiKey) {
      console.error('XAI_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'XAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Making request to xAI API with message:', message);

    // Try xAI Grok API first
    let reply = '';
    let model = 'grok-beta';
    
    try {
      const xaiResponse = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${xaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant specialized in helping farmers with agricultural questions, crop management, pest control, weather-related advice, and farming techniques. Provide practical, actionable advice that farmers can implement. Be concise but informative.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (xaiResponse.ok) {
        const xaiData = await xaiResponse.json();
        console.log('xAI API response:', xaiData);
        reply = xaiData.choices?.[0]?.message?.content || '';
      } else {
        const errorText = await xaiResponse.text();
        console.error('xAI API error:', xaiResponse.status, errorText);
        
        // Check if it's a credits/permission error
        if (xaiResponse.status === 403 && errorText.includes('credits')) {
          console.log('xAI credits exhausted, falling back to chatbot-brain...');
          throw new Error('Credits exhausted');
        } else {
          throw new Error(`xAI API error: ${xaiResponse.status} - ${errorText}`);
        }
      }
    } catch (xaiError) {
      console.log('xAI failed, trying fallback HuggingFace API...', xaiError.message);
      
      // Fallback to HuggingFace API directly
      try {
        const hfApiKey = Deno.env.get('HF_TOKEN');
        if (hfApiKey) {
          const hfResponse = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${hfApiKey}`,
              'Content-Type': 'application/json',
              'User-Agent': 'Supabase Edge Function'
            },
            body: JSON.stringify({
              inputs: `Farming Question: ${message}\n\nFarming Assistant:`,
              parameters: {
                max_length: 150,
                temperature: 0.7,
                do_sample: true,
                top_p: 0.9,
                repetition_penalty: 1.1
              }
            }),
          });

          if (hfResponse.ok) {
            const hfData = await hfResponse.json();
            const rawResponse = hfData[0]?.generated_text || '';
            // Extract just the assistant response
            reply = rawResponse.split('Farming Assistant:')[1]?.trim() || 'I can help you with farming questions. Please try rephrasing your question.';
            model = 'huggingface-fallback';
            console.log('HuggingFace fallback response successful');
          } else {
            console.error('HuggingFace API also failed:', await hfResponse.text());
            reply = 'I apologize, but both AI services are currently unavailable. Please try again later or consider purchasing xAI credits for full functionality.';
            model = 'error-fallback';
          }
        } else {
          console.error('No HuggingFace token available for fallback');
          reply = 'I apologize, but the AI service is currently unavailable. Please ensure you have xAI credits or try again later.';
          model = 'error-fallback';
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        reply = 'I apologize, but I cannot provide a response at the moment. Please try again later.';
        model = 'error-fallback';
      }
    }

    if (!reply) {
      reply = 'I apologize, but I could not generate a response. Please try rephrasing your question.';
    }

    return new Response(
      JSON.stringify({ 
        reply,
        model 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in xai-grok-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});