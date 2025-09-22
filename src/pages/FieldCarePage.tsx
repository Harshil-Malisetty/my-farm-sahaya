import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Cloud, Sprout, Tractor } from 'lucide-react';

const services = [
  {
    id: 'weather',
    icon: Cloud,
    route: '/weather',
    malayalamName: 'കാലാവസ്ഥ',
    englishName: 'Weather',
    malayalamDesc: 'തത്സമയ കാലാവസ്ഥാ വിവരങ്ങൾ',
    englishDesc: 'Real-time weather updates',
    color: 'text-sky-500',
    bgColor: 'bg-sky-100'
  },
  {
    id: 'fertilizer',
    icon: Sprout,
    route: '/fertilizer',
    malayalamName: 'വളം',
    englishName: 'Fertilizer & Soil',
    malayalamDesc: 'വിപണി വിലയനുസരിച്ച് വള ശുപാർശകൾ',
    englishDesc: 'Market-based recommendations',
    color: 'text-green-500',
    bgColor: 'bg-green-100'
  },
  {
    id: 'modern-farming',
    icon: Tractor,
    route: '/modern-farming',
    malayalamName: 'ആധുനിക കൃഷി',
    englishName: 'Modern Farming',
    malayalamDesc: 'മണ്ണിനും വിളയ്ക്കും അനുയോജ്യമായ ആധുനിക രീതികൾ',
    englishDesc: 'Modern techniques for your crops',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100'
  },
];

export const FieldCarePage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-yellow-50/30">
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
              {language === 'malayalam' ? 'പാട പരിചരണം' : 'Field Care'}
            </h1>
            <p className="english-subtext">
              {language === 'malayalam' 
                ? 'കാലാവസ്ഥ, വളം, ആധുനിക കൃഷി രീതികൾ'
                : 'Weather, fertilizers, and modern farming techniques'
              }
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            
            return (
              <Card
                key={service.id}
                className="farmer-card cursor-pointer group hover:scale-105 transition-transform duration-300"
                onClick={() => navigate(service.route)}
              >
                <div className="flex flex-col items-center text-center space-y-4 p-6">
                  <div className={`${service.bgColor} group-hover:scale-110 p-6 rounded-2xl transition-all duration-300`}>
                    <Icon className={`h-12 w-12 ${service.color}`} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="malayalam-text text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {language === 'malayalam' ? service.malayalamName : service.englishName}
                    </h3>
                    <p className="english-subtext leading-relaxed">
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