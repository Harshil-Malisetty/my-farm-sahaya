import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Chatbot brain request received');
    
    const { inputs } = await req.json();
    
    if (!inputs) {
      throw new Error('No text input provided');
    }

    console.log('Input text:', inputs);

    // Send text to AI chatbot model (Hugging Face Gemma-2b)
    console.log('Sending text to AI chatbot model...');
    const chatResponse = await fetch('https://api-inference.huggingface.co/models/google/gemma-2b', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('HF_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `You are a helpful farming assistant. The farmer asked: "${inputs}". Please provide a helpful and concise response about farming, agriculture, crops, or related topics.`,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          do_sample: true,
        }
      }),
    });

    if (!chatResponse.ok) {
      const error = await chatResponse.text();
      console.error('Hugging Face Chat error:', error);
      throw new Error(`Chat API error: ${chatResponse.status} - ${error}`);
    }

    const chatResult = await chatResponse.json();
    let aiResponseText = '';
    
    if (Array.isArray(chatResult) && chatResult[0]?.generated_text) {
      aiResponseText = chatResult[0].generated_text;
      // Remove the input prompt from the response if it's included
      const inputPrompt = `You are a helpful farming assistant. The farmer asked: "${inputs}". Please provide a helpful and concise response about farming, agriculture, crops, or related topics.`;
      aiResponseText = aiResponseText.replace(inputPrompt, '').trim();
    } else {
      aiResponseText = "I'm here to help with your farming questions. Could you please repeat your question?";
    }

    console.log('AI response text:', aiResponseText);

    return new Response(
      JSON.stringify({ 
        generated_text: aiResponseText,
        input: inputs
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Chatbot brain error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        generated_text: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});