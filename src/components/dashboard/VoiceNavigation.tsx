import React from 'react';
import { Button } from '@/components/ui/button';
import { useVoiceNavigation } from '@/hooks/useVoiceNavigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

export const VoiceNavigation = () => {
  const { isListening, startListening, stopListening, transcript } = useVoiceNavigation();
  const { t, language } = useLanguage();
  const { speak, isPlaying, stop } = useTextToSpeech();

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };


  return (
    <div className="sticky top-[80px] z-30 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-primary/20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Main Voice Button - Centered and Round */}
          <Button
            onClick={handleVoiceToggle}
            className={`w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 ${isListening ? 'animate-pulse ring-4 ring-primary/30' : ''}`}
            size="lg"
          >
            {isListening ? (
              <MicOff className="h-8 w-8 text-white" />
            ) : (
              <Mic className="h-8 w-8 text-white" />
            )}
          </Button>

          {/* Status Text */}
          <div className="text-center">
            {isListening ? (
              <div className="space-y-1">
                <p className="malayalam-text text-primary text-sm font-medium">
                  {t('listening')}
                </p>
                {transcript && (
                  <p className="english-subtext text-xs bg-background/50 px-3 py-1 rounded-full">
                    {transcript}
                  </p>
                )}
              </div>
            ) : (
              <p className="english-subtext text-xs text-muted-foreground">
                {t('voiceHelp')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};