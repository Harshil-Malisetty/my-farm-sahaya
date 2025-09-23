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
    console.log('Farmer AI Assistant request received');
    
    // Parse form data to get audio file
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      throw new Error('No audio file provided');
    }

    console.log('Audio file received:', audioFile.name, audioFile.type, audioFile.size);

    // Step 1: Convert Audio to Text using Hugging Face Whisper STT
    console.log('Step 1: Converting audio to text...');
    const audioArrayBuffer = await audioFile.arrayBuffer();
    const audioFormData = new FormData();
    audioFormData.append('file', new Blob([audioArrayBuffer], { type: audioFile.type }), 'audio');

    const sttResponse = await fetch('https://api-inference.huggingface.co/models/openai/whisper-small', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('HF_TOKEN')}`,
      },
      body: audioFormData,
    });

    if (!sttResponse.ok) {
      const error = await sttResponse.text();
      console.error('Hugging Face STT error:', error);
      throw new Error(`STT API error: ${sttResponse.status} - ${error}`);
    }

    const sttResult = await sttResponse.json();
    const transcribedText = sttResult.text;
    console.log('Transcribed text:', transcribedText);

    if (!transcribedText) {
      throw new Error('No text was transcribed from audio');
    }

    // Step 2: Send text to AI chatbot model
    console.log('Step 2: Generating AI response...');
    const chatResponse = await fetch('https://api-inference.huggingface.co/models/google/gemma-2b', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('HF_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `You are a helpful farming assistant. The farmer asked: "${transcribedText}". Please provide a helpful and concise response about farming, agriculture, crops, or related topics.`,
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
      const inputPrompt = `You are a helpful farming assistant. The farmer asked: "${transcribedText}". Please provide a helpful and concise response about farming, agriculture, crops, or related topics.`;
      aiResponseText = aiResponseText.replace(inputPrompt, '').trim();
    } else {
      aiResponseText = "I'm here to help with your farming questions. Could you please repeat your question?";
    }

    console.log('AI response text:', aiResponseText);

    // Step 3: Convert AI response to speech using ElevenLabs TTS
    console.log('Step 3: Converting text to speech...');
    const voiceId = '9BWtsMINqrJLrRacOk9x'; // Aria voice
    
    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('ELEVENLABS_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: aiResponseText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }),
    });

    if (!ttsResponse.ok) {
      const error = await ttsResponse.text();
      console.error('ElevenLabs TTS error:', error);
      throw new Error(`TTS API error: ${ttsResponse.status} - ${error}`);
    }

    // Convert audio response to base64 for easy transmission
    const audioArrayBufferResponse = await ttsResponse.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioArrayBufferResponse)));
    const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;

    console.log('TTS conversion completed successfully');

    // Step 4: Return the result
    const result = {
      text: aiResponseText,
      audio_url: audioDataUrl,
      transcribed_text: transcribedText,
    };

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Farmer AI Assistant error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        audio_url: null
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});