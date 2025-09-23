import { useState } from 'react';
import { useAudioRecorder } from './useAudioRecorder';

interface VoiceLoggingResult {
  text: string;
  confidence?: number;
}

export const useVoiceLogging = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isRecording, startRecording, stopRecording, audioBlob } = useAudioRecorder();

  const convertSpeechToText = async (audioBlob: Blob): Promise<VoiceLoggingResult> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'auto'); // Auto-detect language

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sk_d01ca1003988cc3ad1a14cae278bc0043128777e2a161e0f',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to convert speech to text');
    }

    const result = await response.json();
    return {
      text: result.text || '',
      confidence: result.confidence
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