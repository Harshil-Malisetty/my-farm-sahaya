import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useVoiceNavigation } from '@/hooks/useVoiceNavigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mic, MicOff, Volume2, MessageCircle, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useConversationalAI } from '@/hooks/useConversationalAI';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

export const VoiceNavigation = () => {
  const { isListening, startListening, stopListening, transcript } = useVoiceNavigation();
  const { t, language } = useLanguage();
  const { speak, isPlaying, stop } = useTextToSpeech();
  const { isProcessing, processAudioInput, lastResponse, isPlaying: aiIsPlaying } = useConversationalAI();
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
  const [showChatMode, setShowChatMode] = useState(false);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleChatToggle = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      if (audioBlob) {
        await processAudioInput(audioBlob);
      }
    } else {
      await startRecording();
    }
  };

  const toggleMode = () => {
    setShowChatMode(!showChatMode);
    // Stop any current activities when switching modes
    if (isListening) stopListening();
    if (isRecording) stopRecording();
  };


  return (
    <div className="sticky top-[80px] z-30 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-primary/20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-4">
          
          {/* Mode Toggle Buttons */}
          <div className="flex gap-2 mb-2">
            <Button
              onClick={toggleMode}
              variant={showChatMode ? "outline" : "default"}
              size="sm"
              className="flex items-center gap-2"
            >
              <Mic className="h-4 w-4" />
              {t('navigation')}
            </Button>
            <Button
              onClick={toggleMode}
              variant={showChatMode ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              {t('chat')}
            </Button>
          </div>

          {/* Main Voice Button */}
          <Button
            onClick={showChatMode ? handleChatToggle : handleVoiceToggle}
            disabled={isProcessing}
            className={`w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 ${
              (isListening || isRecording) ? 'animate-pulse ring-4 ring-primary/30' : ''
            } ${isProcessing ? 'opacity-75' : ''}`}
            size="lg"
          >
            {isProcessing ? (
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            ) : (isListening || isRecording) ? (
              <MicOff className="h-8 w-8 text-white" />
            ) : (
              <Mic className="h-8 w-8 text-white" />
            )}
          </Button>

          {/* Status Text */}
          <div className="text-center max-w-sm">
            {showChatMode ? (
              <div className="space-y-2">
                {isProcessing ? (
                  <p className="malayalam-text text-primary text-sm font-medium">
                    {t('processing')}
                  </p>
                ) : isRecording ? (
                  <p className="malayalam-text text-primary text-sm font-medium">
                    {t('listening')}
                  </p>
                ) : aiIsPlaying ? (
                  <div className="flex items-center justify-center gap-2">
                    <Volume2 className="h-4 w-4 text-primary animate-pulse" />
                    <p className="malayalam-text text-primary text-sm font-medium">
                      {t('playing')}
                    </p>
                  </div>
                ) : (
                  <p className="english-subtext text-xs text-muted-foreground">
                    {t('chatHelp')}
                  </p>
                )}
                
                {lastResponse && (
                  <div className="bg-background/50 px-3 py-2 rounded-lg border">
                    <p className="text-xs text-foreground">
                      {lastResponse}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};