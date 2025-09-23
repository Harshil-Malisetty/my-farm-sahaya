import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ConversationalAIHook {
  isProcessing: boolean;
  processAudioInput: (audioBlob: Blob) => Promise<void>;
  lastResponse: string;
  isPlaying: boolean;
}

export const useConversationalAI = (): ConversationalAIHook => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const processAudioInput = useCallback(async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      console.log('Processing audio input...');

      // Step 1: Send audio to farmer-ai-assistant (handles STT + AI + TTS)
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('farmer-ai-assistant', {
        body: formData,
      });

      if (aiError) {
        console.error('AI Assistant error:', aiError);
        throw new Error('Failed to process with AI assistant');
      }

      console.log('AI Assistant response:', aiResponse);

      if (aiResponse?.transcribedText && aiResponse?.aiResponse) {
        console.log('Transcribed text:', aiResponse.transcribedText);
        console.log('AI response:', aiResponse.aiResponse);
        setLastResponse(aiResponse.aiResponse);

        // If audio URL is provided, play it
        if (aiResponse.audioUrl) {
          setIsPlaying(true);
          const audio = new Audio();
          
          // Handle data URL
          if (aiResponse.audioUrl.startsWith('data:')) {
            audio.src = aiResponse.audioUrl;
          } else {
            audio.src = aiResponse.audioUrl;
          }

          audio.onended = () => {
            setIsPlaying(false);
          };

          audio.onerror = () => {
            console.error('Error playing audio');
            setIsPlaying(false);
          };

          await audio.play();
        }
      } else {
        // Fallback: Use separate endpoints
        await processWithSeparateEndpoints(audioBlob);
      }

    } catch (error) {
      console.error('Error processing audio input:', error);
      setLastResponse('Sorry, I encountered an error processing your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processWithSeparateEndpoints = useCallback(async (audioBlob: Blob) => {
    try {
      // Convert audio blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Step 1: Speech to Text (using existing Whisper in farmer-ai-assistant)
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      // Try to extract just transcription from farmer-ai-assistant
      console.log('Getting transcription...');
      
      // Step 2: Send text to chatbot brain
      console.log('Sending to chatbot brain...');
      const { data: chatResponse, error: chatError } = await supabase.functions.invoke('chatbot-brain', {
        body: { 
          inputs: 'Hello, I need farming advice' // Placeholder - in real implementation would use STT result
        },
      });

      if (chatError) {
        console.error('Chatbot error:', chatError);
        throw new Error('Failed to get chatbot response');
      }

      console.log('Chatbot response:', chatResponse);

      if (chatResponse?.generated_text) {
        setLastResponse(chatResponse.generated_text);

        // Step 3: Text to Speech
        console.log('Converting to speech...');
        const { data: ttsResponse, error: ttsError } = await supabase.functions.invoke('text-to-speech', {
          body: { 
            text: chatResponse.generated_text,
            voice_id: '9BWtsMINqrJLrRacOk9x' // Default Aria voice
          },
        });

        if (ttsError) {
          console.error('TTS error:', ttsError);
        } else if (ttsResponse?.audioContent) {
          // Play the generated audio
          setIsPlaying(true);
          const audioBlob = new Blob(
            [Uint8Array.from(atob(ttsResponse.audioContent), c => c.charCodeAt(0))],
            { type: 'audio/mpeg' }
          );
          
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          
          audio.onended = () => {
            setIsPlaying(false);
            URL.revokeObjectURL(audioUrl);
          };

          audio.onerror = () => {
            console.error('Error playing TTS audio');
            setIsPlaying(false);
            URL.revokeObjectURL(audioUrl);
          };

          await audio.play();
        }
      }

    } catch (error) {
      console.error('Error in separate endpoints flow:', error);
      throw error;
    }
  }, []);

  return {
    isProcessing,
    processAudioInput,
    lastResponse,
    isPlaying,
  };
};