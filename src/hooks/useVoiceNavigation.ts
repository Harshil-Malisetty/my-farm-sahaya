import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface VoiceNavigationHook {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
}

export const useVoiceNavigation = (): VoiceNavigationHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Voice command mappings for both languages
  const voiceCommands = {
    malayalam: {
      'കാലാവസ്ഥ': '/weather',
      'കീടം': '/pest-disease',
      'വളം': '/fertilizer',
      'ആധുനിക കൃഷി': '/modern-farming',
      'കൃഷി ദിനപതി': '/farm-diary',
      'വിള നിർദ്ദേശം': '/crop-recommender',
      'കൂട്ടായ്മ': '/farmer-groups',
      'വെർച്വൽ ഫാം': '/virtual-farm',
      'വെർച്വൽ': '/virtual-farm',
      'ഹോം': '/',
    },
    english: {
      'weather': '/weather',
      'pest': '/pest-disease',
      'disease': '/pest-disease',
      'fertilizer': '/fertilizer',
      'soil': '/fertilizer',
      'modern farming': '/modern-farming',
      'modern': '/modern-farming',
      'farm diary': '/farm-diary',
      'diary': '/farm-diary',
      'crop': '/crop-recommender',
      'crops': '/crop-recommender',
      'recommender': '/crop-recommender',
      'farmer groups': '/farmer-groups',
      'groups': '/farmer-groups',
      'virtual farm': '/virtual-farm',
      'virtual': '/virtual-farm',
      'home': '/',
    },
  };

  const processVoiceCommand = useCallback((transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();
    const commands = voiceCommands[language];
    
    // Check for exact matches first
    for (const [command, route] of Object.entries(commands)) {
      if (lowerTranscript.includes(command.toLowerCase())) {
        navigate(route);
        return true;
      }
    }
    
    return false;
  }, [language, navigate]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = language === 'malayalam' ? 'ml-IN' : 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      
      if (event.results[0].isFinal) {
        const commandProcessed = processVoiceCommand(result);
        if (!commandProcessed) {
          console.log('No matching command found for:', result);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [language, processVoiceCommand]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    transcript,
  };
};