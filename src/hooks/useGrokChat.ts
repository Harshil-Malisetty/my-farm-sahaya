import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface GrokChatHook {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
}

export const useGrokChat = (): GrokChatHook => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('xai-grok-chat', {
        body: { message: message.trim() },
      });

      if (error) {
        console.error('Grok chat error:', error);
        throw error;
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.reply || 'Sorry, I could not generate a response.',
        isUser: false,
        timestamp: new Date(),
      };

      // Add a note if using fallback model
      if (data.model && data.model !== 'grok-beta') {
        const modelNote = data.model === 'huggingface-fallback' 
          ? '\n\n*Note: Using fallback AI model. For best results, consider adding xAI credits.*'
          : data.model === 'error-fallback'
          ? '\n\n*Note: AI services are experiencing issues. Please try again later.*'
          : '';
        
        botMessage.text += modelNote;
      }

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message to Grok:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error while processing your message. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};