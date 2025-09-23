import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceNavigation } from '@/hooks/useVoiceNavigation';
import { AIAssistant } from '@/components/AIAssistant';
import { 
  Cloud, 
  Sprout, 
  BookOpen, 
  Tractor, 
  Users, 
  Bug, 
  TestTube, 
  Home,
  Mic,
  MicOff,
  Volume2,
  Bot
} from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { speak, isPlaying } = useTextToSpeech();
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening 
  } = useVoiceNavigation();

  const services = [
    {
      title: t('weather'),
      icon: Cloud,
      path: '/weather',
      color: 'from-blue-500 to-blue-600',
      description: language === 'malayalam' ? 'കാലാവസ്ഥ പ്രവചനം' : 'Weather forecast'
    },
    {
      title: t('cropRecommender'),
      icon: Sprout,
      path: '/crop-recommender',
      color: 'from-green-500 to-green-600',
      description: language === 'malayalam' ? 'വിള ശുപാർശ' : 'Crop recommendations'
    },
    {
      title: t('farmDiary'),
      icon: BookOpen,
      path: '/farm-diary',
      color: 'from-orange-500 to-orange-600',
      description: language === 'malayalam' ? 'കൃഷി ഡയറി' : 'Farm diary'
    },
    {
      title: t('virtualFarm'),
      icon: Home,
      path: '/virtual-farm',
      color: 'from-purple-500 to-purple-600',
      description: language === 'malayalam' ? 'വെർച്വൽ ഫാം' : 'Virtual farm'
    },
    {
      title: t('fieldCare'),
      icon: Tractor,
      path: '/field-care',
      color: 'from-yellow-500 to-yellow-600',
      description: language === 'malayalam' ? 'വയൽ പരിചരണം' : 'Field care'
    },
    {
      title: t('farmerGroups'),
      icon: Users,
      path: '/farmer-groups',
      color: 'from-indigo-500 to-indigo-600',
      description: language === 'malayalam' ? 'കർഷക കൂട്ടായ്മകൾ' : 'Farmer groups'
    },
    {
      title: t('pestDisease'),
      icon: Bug,
      path: '/pest-disease',
      color: 'from-red-500 to-red-600',
      description: language === 'malayalam' ? 'കീട രോഗ നിയന്ത്രണം' : 'Pest & disease control'
    },
    {
      title: t('fertilizer'),
      icon: TestTube,
      path: '/fertilizer',
      color: 'from-teal-500 to-teal-600',
      description: language === 'malayalam' ? 'വള ശുപാർശ' : 'Fertilizer recommendations'
    }
  ];

  useEffect(() => {
    const welcomeText = language === 'malayalam' 
      ? 'സ്വാഗതം! ഇത് നിങ്ങളുടെ കൃഷി സഹായി ആപ്പാണ്. കാലാവസ്ഥ, വിള ശുപാർശ, കൃഷി ഡയറി എന്നിവയും മറ്റുമുള്ള സേവനങ്ങൾ ലഭ്യമാണ്. ശബ്ദ നാവിഗേഷനും ലഭ്യമാണ്.'
      : 'Welcome! This is your farming assistant app. Services like weather, crop recommendations, farm diary and more are available. Voice navigation is also available.';
    
    setTimeout(() => speak(welcomeText), 1000);
  }, [language, speak]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleReadPage = () => {
    const pageText = language === 'malayalam' 
      ? 'മുഖ്യ പേജ്. ലഭ്യമായ സേവനങ്ങൾ: കാലാവസ്ഥ പ്രവചനം, വിള ശുപാർശ, കൃഷി ഡയറി, വെർച്വൽ ഫാം, വയൽ പരിചരണം, കർഷക കൂട്ടായ്മകൾ, കീട രോഗ നിയന്ത്രണം, വള ശുപാർശ.'
      : 'Home page. Available services: weather forecast, crop recommendations, farm diary, virtual farm, field care, farmer groups, pest and disease control, fertilizer recommendations.';
    
    speak(pageText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary malayalam-text">
            {t('appName')}
          </h1>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReadPage}
            disabled={isPlaying}
          >
            <Volume2 className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 malayalam-text bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {language === 'malayalam' ? 'സ്വാഗതം!' : 'Welcome!'}
          </h2>
          <p className="text-lg text-muted-foreground malayalam-text">
            {language === 'malayalam' 
              ? 'നിങ്ങളുടെ കൃഷി യാത്രയിൽ ഞങ്ങളോടൊപ്പം ചേരുക'
              : 'Join us on your farming journey'
            }
          </p>
        </div>

        {/* Voice Navigation Section */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 malayalam-text">
              {language === 'malayalam' ? 'ശബ്ദ നാവിഗേഷൻ' : 'Voice Navigation'}
            </h3>
            
            <Button
              onClick={handleVoiceToggle}
              size="lg"
              className={`rounded-full mb-4 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
            >
              {isListening ? (
                <MicOff className="h-6 w-6 animate-pulse" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground malayalam-text">
              {isListening 
                ? (language === 'malayalam' ? 'കേൾക്കുന്നു... സംസാരിക്കുക' : 'Listening... Please speak')
                : (language === 'malayalam' ? 'ശബ്ദ കമാൻഡിനായി അമർത്തുക' : 'Press for voice command')
              }
            </p>
            
            {transcript && (
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <p className="text-sm font-medium malayalam-text">{transcript}</p>
              </div>
            )}
          </div>
        </Card>

        {/* AI Assistant Card */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="text-center">
            <Bot className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 malayalam-text">
              {language === 'malayalam' ? 'AI കൃഷി സഹായി' : 'AI Farming Assistant'}
            </h3>
            <p className="text-muted-foreground mb-4 malayalam-text">
              {language === 'malayalam' 
                ? 'ഏത് സമയത്തും കൃഷി സംബന്ധിയായ സംശയങ്ങൾ ചോദിക്കാം'
                : 'Ask farming questions anytime with our AI assistant'
              }
            </p>
            <Button
              onClick={() => {
                // The AI Assistant will open automatically when clicking the floating button
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Bot className="h-4 w-4 mr-2" />
              {language === 'malayalam' ? 'AI സഹായി ഉപയോഗിക്കുക' : 'Use AI Assistant'}
            </Button>
          </div>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className="farmer-card cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(service.path)}
              >
                <div className="text-center">
                  <div className={`bg-gradient-to-r ${service.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="malayalam-text font-semibold text-lg mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground malayalam-text">
                    {service.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </main>

      {/* AI Assistant */}
      <AIAssistant 
        pageContext={{
          pageName: 'home',
          contextualPrompt: language === 'malayalam'
            ? `മുഖ്യ പേജിൽ നിന്ന്: ലഭ്യമായ സേവനങ്ങൾ - കാലാവസ്ഥ, വിള ശുപാർശ, കൃഷി ഡയറി, വെർച്വൽ ഫാം, വയൽ പരിചരണം, കർഷക കൂട്ടായ്മകൾ, കീട രോഗ നിയന്ത്രണം, വള ശുപാർശ. പൊതുവായ കൃഷി ഉപദേശങ്ങൾ നൽകുക, പേജ് നാവിഗേഷൻ സഹായിക്കുക.`
            : `Home page context: Available services - weather, crop recommender, farm diary, virtual farm, field care, farmer groups, pest disease control, fertilizer recommendations. Provide general farming advice and help with page navigation.`
        }}
      />
    </div>
  );
};