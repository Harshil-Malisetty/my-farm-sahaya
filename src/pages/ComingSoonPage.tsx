import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const ComingSoonPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { service } = useParams();

  const serviceNames: Record<string, { malayalam: string; english: string }> = {
    fertilizer: {
      malayalam: 'വളം',
      english: 'Fertilizer & Soil',
    },
    'modern-farming': {
      malayalam: 'ആധുനിക കൃഷി',
      english: 'Modern Farming',
    },
    'farm-diary': {
      malayalam: 'കൃഷി ദിനപതി',
      english: 'Farm Diary',
    },
    'crop-recommender': {
      malayalam: 'വിള നിർദ്ദേശം',
      english: 'Crop Recommender',
    },
    'farmer-groups': {
      malayalam: 'കൂട്ടായ്മ',
      english: 'Farmer Groups',
    },
    'virtual-farm': {
      malayalam: 'വെർച്വൽ ഫാം',
      english: 'Virtual Farm',
    },
  };

  const currentService = service ? serviceNames[service] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === 'malayalam' ? 'തിരികെ' : 'Back'}
          </Button>
          
          <div className="text-center">
            <h1 className="malayalam-text text-xl text-primary">
              {currentService 
                ? (language === 'malayalam' ? currentService.malayalam : currentService.english)
                : (language === 'malayalam' ? 'സേവനം' : 'Service')
              }
            </h1>
          </div>

          <div className="w-[100px]"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <Card className="farmer-card max-w-2xl mx-auto text-center">
          <div className="py-12">
            <div className="mb-8">
              <div className="relative">
                <Clock className="h-24 w-24 text-primary/30 mx-auto mb-4" />
                <Sparkles className="h-8 w-8 text-primary absolute top-0 right-1/4 animate-pulse" />
              </div>
            </div>

            <h2 className="malayalam-text text-2xl mb-4">
              {language === 'malayalam' ? 'ഉടൻ വരുന്നു!' : 'Coming Soon!'}
            </h2>
            
            <p className="english-subtext text-lg mb-6 max-w-md mx-auto">
              {language === 'malayalam' 
                ? 'ഈ സേവനം നിലവിൽ വികസിപ്പിച്ചുകൊണ്ടിരിക്കുകയാണ്. ഉടൻ തന്നെ ലഭ്യമാകും!'
                : 'This service is currently under development. It will be available soon!'
              }
            </p>

            <div className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-xl">
                <p className="malayalam-text text-primary mb-2">
                  {language === 'malayalam' ? 'പ്രതീക്ഷിക്കാവുന്ന സവിശേഷതകൾ:' : 'Expected Features:'}
                </p>
                
                <ul className="english-subtext space-y-1">
                  {currentService && service === 'fertilizer' && (
                    <>
                      <li>• {language === 'malayalam' ? 'മണ്ണ് പരിശോധന' : 'Soil Analysis'}</li>
                      <li>• {language === 'malayalam' ? 'വള ശുപാർശകൾ' : 'Fertilizer Recommendations'}</li>
                      <li>• {language === 'malayalam' ? 'വിപണി വില' : 'Market Prices'}</li>
                    </>
                  )}
                  {currentService && service === 'virtual-farm' && (
                    <>
                      <li>• {language === 'malayalam' ? 'ത്രിമാന കൃഷിയിടം' : '3D Farm Visualization'}</li>
                      <li>• {language === 'malayalam' ? 'വിള വളർച്ച ട്രാക്കിംഗ്' : 'Crop Growth Tracking'}</li>
                      <li>• {language === 'malayalam' ? 'പ്രവർത്തന രേഖകൾ' : 'Activity Records'}</li>
                    </>
                  )}
                  {!currentService && (
                    <>
                      <li>• {language === 'malayalam' ? 'വിപുലമായ സവിശേഷതകൾ' : 'Advanced Features'}</li>
                      <li>• {language === 'malayalam' ? 'എളുപ്പത്തിലുള്ള ഉപയോഗം' : 'Easy to Use Interface'}</li>
                      <li>• {language === 'malayalam' ? 'ശബ്ദ സഹായം' : 'Voice Support'}</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <Button
              onClick={() => navigate('/')}
              className="language-toggle mt-8"
              size="lg"
            >
              {language === 'malayalam' ? 'ഹോമിലേക്ക് മടങ്ങുക' : 'Return to Home'}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};