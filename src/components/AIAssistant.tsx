import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConversationalAI } from '@/hooks/useConversationalAI';
import { useAzureChatBot } from '@/hooks/useAzureChatBot';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { Bot, Mic, MicOff, Send, X, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AIAssistantProps {
  pageContext: {
    pageName: string;
    pageData?: any;
    contextualPrompt?: string;
  };
  className?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  pageContext, 
  className = "fixed bottom-4 right-4 z-50" 
}) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [textInput, setTextInput] = useState('');
  
  const { 
    processAudioInput, 
    isProcessing, 
    lastResponse, 
    isPlaying 
  } = useConversationalAI();
  
  const { 
    messages, 
    isLoading: isChatLoading, 
    sendMessage, 
    clearMessages 
  } = useAzureChatBot();
  
  const { 
    isRecording, 
    startRecording, 
    stopRecording 
  } = useAudioRecorder();

  // Create contextual system prompts based on page
  const getContextualPrompt = () => {
    const basePrompt = language === 'malayalam' 
      ? `നിങ്ങൾ ഒരു കേരളത്തിലെ കാർഷിക സഹായിയാണ്. കർഷകരെ സഹായിക്കാൻ മലയാളത്തിൽ ഉത്തരം നൽകുക.`
      : `You are an agricultural assistant for Kerala farmers. Provide helpful farming advice in simple language.`;
    
    const contextPrompts = {
      weather: language === 'malayalam'
        ? 'കാലാവസ്ഥയെ കുറിച്ചും അതിന്റെ അടിസ്ഥാനത്തിൽ കൃഷി ഉപദേശങ്ങളും നൽകുക'
        : 'Provide weather-related farming advice and next action recommendations',
      'crop-recommender': language === 'malayalam'
        ? 'വിള തിരഞ്ഞെടുപ്പും കൃഷി പദ്ധതിയും സംബന്ധിച്ച ഉപദേശം നൽകുക'
        : 'Help with crop selection and farming planning advice',
      'farm-diary': language === 'malayalam'
        ? 'കൃഷി പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്താനും ഓർമ്മിപ്പിക്കാനും സഹായിക്കുക'
        : 'Help with recording farming activities and reminders',
      'pest-disease': language === 'malayalam'
        ? 'കീട-രോഗ നിയന്ത്രണത്തെ കുറിച്ച് ഉപദേശം നൽകുക'
        : 'Provide pest and disease control advice',
      'fertilizer': language === 'malayalam'
        ? 'വളപ്രയോഗത്തെ കുറിച്ചും മണ്ണിന്റെ ആരോഗ്യത്തെ കുറിച്ചും ഉപദേശം നൽകുക'
        : 'Give fertilizer application and soil health advice',
      'virtual-farm': language === 'malayalam'
        ? 'വെർച്വൽ ഫാമിന്റെ പുരോഗതിയെ കുറിച്ച് വിവരിക്കുകയും കൃഷി ഉപദേശങ്ങൾ നൽകുകയും ചെയ്യുക'
        : 'Describe virtual farm progress and provide farming guidance'
    };

    return pageContext.contextualPrompt || 
           contextPrompts[pageContext.pageName as keyof typeof contextPrompts] || 
           basePrompt;
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      if (audioBlob) {
        await processAudioInput(audioBlob);
      }
    } else {
      await startRecording();
    }
  };

  const handleTextMessage = async () => {
    if (textInput.trim()) {
      await sendMessage(textInput, pageContext.pageName);
      setTextInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className={className}>
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="w-80 max-h-96 bg-background/95 backdrop-blur-sm shadow-xl border">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">
              {language === 'malayalam' ? 'കൃഷി സഹായി' : 'Farm Assistant'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMode(mode === 'voice' ? 'text' : 'voice')}
              className="h-8 w-8 p-0"
            >
              {mode === 'voice' ? <Mic className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 max-h-64 overflow-y-auto">
          {mode === 'voice' ? (
            <div className="space-y-3">
              {/* Voice Status */}
              <div className="text-center">
                <Button
                  onClick={handleVoiceToggle}
                  disabled={isProcessing || isPlaying}
                  size="lg"
                  className={`rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
                >
                  {isRecording ? (
                    <MicOff className="h-6 w-6 animate-pulse" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  {isRecording 
                    ? (language === 'malayalam' ? 'സംസാരിക്കുക...' : 'Listening...') 
                    : (language === 'malayalam' ? 'സംസാരിക്കാൻ അമർത്തുക' : 'Press to speak')
                  }
                </p>
              </div>

              {/* Voice Response */}
              {(isProcessing || isPlaying) && (
                <div className="text-center">
                  <div className="animate-pulse text-sm text-muted-foreground">
                    {isProcessing 
                      ? (language === 'malayalam' ? 'പ്രോസസ്സിംഗ്...' : 'Processing...') 
                      : (language === 'malayalam' ? 'പ്ലേ ചെയ്യുന്നു...' : 'Playing response...')
                    }
                  </div>
                </div>
              )}

              {lastResponse && !isProcessing && !isPlaying && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm">{lastResponse}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Chat Messages */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {messages.slice(-5).map((message) => (
                  <div
                    key={message.id}
                    className={`p-2 rounded-lg text-sm ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground ml-4'
                        : 'bg-muted mr-4'
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
                {isChatLoading && (
                  <div className="bg-muted mr-4 p-2 rounded-lg text-sm">
                    <div className="animate-pulse">
                      {language === 'malayalam' ? 'ചിന്തിക്കുന്നു...' : 'Thinking...'}
                    </div>
                  </div>
                )}
              </div>

              {/* Text Input */}
              <div className="flex gap-2">
                <Input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={language === 'malayalam' ? 'സന്ദേശം ടൈപ്പ് ചെയ്യുക...' : 'Type a message...'}
                  className="text-sm"
                />
                <Button
                  onClick={handleTextMessage}
                  disabled={!textInput.trim() || isChatLoading}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Page Context Indicator */}
        <div className="px-3 pb-2">
          <div className="text-xs text-muted-foreground text-center bg-muted/30 rounded px-2 py-1">
            {language === 'malayalam' ? 'സന്ദർഭം' : 'Context'}: {pageContext.pageName}
          </div>
        </div>
      </Card>
    </div>
  );
};