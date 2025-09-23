import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, MicOff, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGrokChat } from '@/hooks/useGrokChat';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceLogging } from '@/hooks/useVoiceLogging';

const ChatbotPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { messages, isLoading, sendMessage, clearMessages } = useGrokChat();
  const { speak, isPlaying, stop: stopTTS } = useTextToSpeech();
  const { isRecording, startVoiceLogging, stopVoiceLogging } = useVoiceLogging();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    await sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      const transcript = await stopVoiceLogging();
      if (transcript) {
        setInputMessage(transcript);
      }
    } else {
      startVoiceLogging();
    }
  };

  const handleSpeakMessage = (text: string) => {
    if (isPlaying) {
      stopTTS();
    } else {
      speak(text);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="hover:bg-green-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {language === 'malayalam' ? 'AI സഹായി' : 'AI Assistant'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'malayalam' 
                    ? 'കൃഷിയുമായി ബന്ധപ്പെട്ട നിങ്ങളുടെ എല്ലാ ചോദ്യങ്ങൾക്കും ഉത്തരം'
                    : 'Your farming companion powered by Grok AI'
                  }
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {language === 'malayalam' ? 'മായ്ക്കുക' : 'Clear'}
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🤖</div>
                    <h3 className="text-xl font-semibold text-gray-700">
                      {language === 'malayalam' 
                        ? 'ഹലോ! എനിക്ക് എങ്ങനെ സഹായിക്കാം?'
                        : 'Hello! How can I help you today?'
                      }
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      {language === 'malayalam'
                        ? 'കൃഷി, വിള പരിചരണം, കീട നിയന്ത്രണം എന്നിവയെക്കുറിച്ച് ചോദിക്കൂ'
                        : 'Ask me about farming, crop care, pest control, and more'
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.isUser
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.text}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${message.isUser ? 'text-green-100' : 'text-gray-500'}`}>
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {!message.isUser && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSpeakMessage(message.text)}
                              className="h-6 w-6 p-0 hover:bg-gray-200"
                            >
                              <Mic className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
          </CardContent>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={handleVoiceInput}
                className="flex-shrink-0"
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === 'malayalam'
                    ? 'നിങ്ങളുടെ ചോദ്യം ടൈപ്പ് ചെയ്യൂ...'
                    : 'Type your message...'
                }
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {isRecording && (
              <p className="text-sm text-red-600 mt-2 text-center">
                {language === 'malayalam' ? 'ശബ്ദം റെക്കോർഡ് ചെയ്യുന്നു...' : 'Recording...'}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotPage;