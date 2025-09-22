import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const speak = async (text: string, voiceId: string = '9BWtsMINqrJLrRacOk9x') => {
    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      setIsPlaying(true);

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          voice_id: voiceId,
        },
      });

      if (error) {
        console.error('TTS Error:', error);
        setIsPlaying(false);
        return;
      }

      if (data?.audioContent) {
        // Convert base64 to blob and play
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          URL.revokeObjectURL(audioUrl);
        };

        setCurrentAudio(audio);
        await audio.play();
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setIsPlaying(false);
  };

  return {
    speak,
    stop,
    isPlaying,
  };
};