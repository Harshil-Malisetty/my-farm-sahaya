import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Bug, Lightbulb } from 'lucide-react';

const services = [
  {
    id: 'pest-disease',
    icon: Bug,
    route: '/pest-disease',
    malayalamName: 'കീടം',
    englishName: 'Pest & Disease',
    malayalamDesc: 'ഫോട്ടോയിലൂടെ കീടങ്ങളെ കണ്ടെത്തുക',
    englishDesc: 'Detect pests through photos',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100'
  },
  {
    id: 'crop-recommender',
    icon: Lightbulb,
    route: '/crop-recommender',
    malayalamName: 'വിള നിർദ്ദേശം',
    englishName: 'Crop Recommender',
    malayalamDesc: 'സീസണനുസരിച്ച് മികച്ച 3 വിളകൾ',
    englishDesc: 'Top 3 seasonal crop suggestions',
    color: 'text-pink-500',
    bgColor: 'bg-pink-100'
  },
];

export const CropSupportPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-pink-50/20 to-red-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === 'malayalam' ? 'തിരികെ' : 'Back'}
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="malayalam-text text-2xl text-primary font-bold">
              {language === 'malayalam' ? 'വിള സഹായം' : 'Crop Support'}
            </h1>
            <p className="english-subtext">
              {language === 'malayalam' 
                ? 'കീടനാശിനി, വിള നിർദ്ദേശങ്ങൾ'
                : 'Pest control and crop recommendations'
              }
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            
            return (
              <Card
                key={service.id}
                className="farmer-card cursor-pointer group hover:scale-105 transition-transform duration-300"
                onClick={() => navigate(service.route)}
              >
                <div className="flex flex-col items-center text-center space-y-4 p-8">
                  <div className={`${service.bgColor} group-hover:scale-110 p-8 rounded-2xl transition-all duration-300`}>
                    <Icon className={`h-16 w-16 ${service.color}`} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="malayalam-text text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {language === 'malayalam' ? service.malayalamName : service.englishName}
                    </h3>
                    <p className="english-subtext text-lg leading-relaxed">
                      {language === 'malayalam' ? service.malayalamDesc : service.englishDesc}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};