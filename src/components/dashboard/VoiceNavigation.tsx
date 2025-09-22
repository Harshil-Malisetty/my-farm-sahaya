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

  const handleSpeakHelp = () => {
    if (isPlaying) {
      stop();
    } else {
      const helpText = language === 'malayalam' 
        ? 'കാലാവസ്ഥ, കീടം, വളം, ആധുനിക കൃഷി, കൃഷി ദിനപതി, വിള നിർദ്ദേശം, കൂട്ടായ്മ, അല്ലെങ്കിൽ വെർച്വൽ ഫാം എന്ന് പറയുക'
        : 'Say weather, pest, fertilizer, modern farming, farm diary, crop recommender, farmer groups, or virtual farm';
      speak(helpText);
    }
  };

  return (
    <div className="sticky top-[80px] z-30 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-4">
          {/* Voice Help Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSpeakHelp}
            className="flex items-center gap-2"
            disabled={isPlaying}
          >
            <Volume2 className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">
              {language === 'malayalam' ? 'ശബ്ദ സഹായം' : 'Voice Help'}
            </span>
          </Button>

          {/* Main Voice Button */}
          <Button
            onClick={handleVoiceToggle}
            className={`voice-button ${isListening ? 'animate-pulse' : ''}`}
            size="lg"
          >
            {isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>

          {/* Status Text */}
          <div className="text-center min-w-[120px]">
            {isListening ? (
              <div className="space-y-1">
                <p className="malayalam-text text-primary text-sm">
                  {t('listening')}
                </p>
                {transcript && (
                  <p className="english-subtext text-xs bg-background/50 px-2 py-1 rounded">
                    {transcript}
                  </p>
                )}
              </div>
            ) : (
              <p className="english-subtext text-xs">
                {t('voiceHelp')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};