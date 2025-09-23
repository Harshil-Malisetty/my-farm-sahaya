import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'malayalam' | 'english';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  malayalam: {
    // App Name
    appName: 'കൃഷി സഖി',
    welcome: 'സ്വാഗതം',
    
    // Auth
    email: 'ഇമെയിൽ',
    password: 'പാസ്‌വേഡ്',
    login: 'ലോഗിൻ',
    register: 'രജിസ്റ്റർ',
    signUp: 'സൈൻ അപ്പ്',
    signIn: 'സൈൻ ഇൻ',
    alreadyHaveAccount: 'ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?',
    dontHaveAccount: 'അക്കൗണ്ട് ഇല്ലേ?',
    
    // Services
    weather: 'കാലാവസ്ഥ',
    pestDisease: 'കീടം',
    fertilizer: 'വളം',
    modernFarming: 'ആധുനിക കൃഷി',
    farmDiary: 'കൃഷി ദിനപതി',
    cropRecommender: 'വിള നിർദ്ദേശം',
    farmerGroups: 'കൂട്ടായ്മ',
    virtualFarm: 'വെർച്വൽ ഫാം',
    
    // Service Descriptions
    weatherDesc: 'തത്സമയ കാലാവസ്ഥാ വിവരങ്ങൾ',
    pestDesc: 'ഫോട്ടോയിലൂടെ കീടങ്ങളെ കണ്ടെത്തുക',
    fertilizerDesc: 'വിപണി വിലയനുസരിച്ച് വള ശുപാർശകൾ',
    modernFarmingDesc: 'മണ്ണിനും വിളയ്ക്കും അനുയോജ്യമായ ആധുനിക രീതികൾ',
    farmDiaryDesc: 'ദൈനംദിന കൃഷി പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്തുക',
    cropRecommenderDesc: 'സീസണനുസരിച്ച് മികച്ച 3 വിളകൾ',
    farmerGroupsDesc: 'ശബ്ദത്തിലൂടെ കർഷകരുമായി ചാറ്റ്',
    virtualFarmDesc: 'ദൃശ്യമായ കൃഷിയിടം ഘട്ടം ഘട്ടമായി',
    
    // Common
    home: 'ഹോം',
    back: 'തിരികെ',
    next: 'അടുത്തത്',
    submit: 'സമർപ്പിക്കുക',
    cancel: 'റദ്ദാക്കുക',
    save: 'സംരക്ഷിക്കുക',
    loading: 'ലോഡിംഗ്...',
    error: 'പിശക്',
    success: 'വിജയം',
    
    // Voice Commands
    voiceHelp: 'ശബ്ദ സഹായം സജീവമാക്കാൻ മൈക്രോഫോൺ ബട്ടൺ അമർത്തുക',
    listening: 'കേൾക്കുന്നു...',
    voiceError: 'ശബ്ദ തിരിച്ചറിയൽ പിശക്',
    processing: 'പ്രോസസ്സിംഗ്...',
    chat: 'ചാറ്റ്',
    navigation: 'നാവിഗേഷൻ',
    chatHelp: 'AI സഹായിയുമായി സംസാരിക്കാൻ മൈക്രോഫോൺ അമർത്തുക',
    playing: 'പ്ലേ ചെയ്യുന്നു...',
  },
  english: {
    // App Name
    appName: 'Krishi Sakhi',
    welcome: 'Welcome',
    
    // Auth
    email: 'Email',
    password: 'Password',
    login: 'Login',
    register: 'Register',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    
    // Services
    weather: 'Weather',
    pestDisease: 'Pest & Disease',
    fertilizer: 'Fertilizer & Soil',
    modernFarming: 'Modern Farming',
    farmDiary: 'Farm Diary',
    cropRecommender: 'Crop Recommender',
    farmerGroups: 'Farmer Groups',
    virtualFarm: 'Virtual Farm',
    
    // Service Descriptions
    weatherDesc: 'Real-time weather updates',
    pestDesc: 'Detect crop pests through photos',
    fertilizerDesc: 'Market-based fertilizer recommendations',
    modernFarmingDesc: 'Modern techniques for your soil & crops',
    farmDiaryDesc: 'Log your daily farming activities',
    cropRecommenderDesc: 'Top 3 seasonal crop suggestions',
    farmerGroupsDesc: 'Chat with farmers using voice',
    virtualFarmDesc: 'Visual farm growth tracking',
    
    // Common
    home: 'Home',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Voice Commands
    voiceHelp: 'Press the microphone button to activate voice help',
    listening: 'Listening...',
    voiceError: 'Voice recognition error',
    processing: 'Processing...',
    chat: 'Chat',
    navigation: 'Navigation',
    chatHelp: 'Press microphone to talk with AI assistant',
    playing: 'Playing...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('malayalam');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('krishiSakhiLanguage') as Language;
    if (savedLanguage && (savedLanguage === 'malayalam' || savedLanguage === 'english')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'malayalam' ? 'english' : 'malayalam';
    setLanguage(newLanguage);
    localStorage.setItem('krishiSakhiLanguage', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.malayalam] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};