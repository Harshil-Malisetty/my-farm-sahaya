import { useState } from 'react';
import { useAudioRecorder } from './useAudioRecorder';
import { supabase } from '@/integrations/supabase/client';

interface VoiceLoggingResult {
  text: string;
  confidence?: number;
}

export const useVoiceLogging = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isRecording, startRecording, stopRecording, audioBlob } = useAudioRecorder();

  const convertSpeechToText = async (audioBlob: Blob): Promise<VoiceLoggingResult> => {
    // Convert blob to base64 for edge function
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Use Supabase edge function for speech-to-text
    const { data, error } = await supabase.functions.invoke('speech-to-text', {
      body: { audio: base64Audio },
    });

    if (error) {
      console.error('Speech-to-text error:', error);
      throw new Error(error.message || 'Failed to convert speech to text');
    }

    return {
      text: data?.text || '',
      confidence: data?.confidence || 0.8
    };
  };

  const startVoiceLogging = async (): Promise<void> => {
    try {
      setError(null);
      await startRecording();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      throw err;
    }
  };

  const stopVoiceLogging = async (): Promise<string> => {
    try {
      setError(null);
      setIsProcessing(true);

      const blob = await stopRecording();
      if (!blob) {
        throw new Error('No audio recorded');
      }

      const result = await convertSpeechToText(blob);
      
      if (!result.text.trim()) {
        throw new Error('No speech detected in the recording');
      }

      return result.text.trim();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process voice input';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearError = () => setError(null);

  return {
    isRecording,
    isProcessing,
    error,
    startVoiceLogging,
    stopVoiceLogging,
    clearError,
  };
};