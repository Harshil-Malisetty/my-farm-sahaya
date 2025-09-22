import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Cloud, 
  Bug, 
  Sprout, 
  Tractor, 
  BookOpen, 
  Lightbulb, 
  Users, 
  TreePine 
} from 'lucide-react';

interface Service {
  id: string;
  icon: React.ElementType;
  route: string;
  malayalamName: string;
  englishName: string;
  malayalamDesc: string;
  englishDesc: string;
}

const services: Service[] = [
  {
    id: 'weather',
    icon: Cloud,
    route: '/weather',
    malayalamName: 'കാലാവസ്ഥ',
    englishName: 'Weather',
    malayalamDesc: 'തത്സമയ കാലാവസ്ഥാ വിവരങ്ങൾ',
    englishDesc: 'Real-time weather updates',
  },
  {
    id: 'pest-disease',
    icon: Bug,
    route: '/pest-disease',
    malayalamName: 'കീടം',
    englishName: 'Pest & Disease',
    malayalamDesc: 'ഫോട്ടോയിലൂടെ കീടങ്ങളെ കണ്ടെത്തുക',
    englishDesc: 'Detect pests through photos',
  },
  {
    id: 'fertilizer',
    icon: Sprout,
    route: '/fertilizer',
    malayalamName: 'വളം',
    englishName: 'Fertilizer & Soil',
    malayalamDesc: 'വിപണി വിലയനുസരിച്ച് വള ശുപാർശകൾ',
    englishDesc: 'Market-based recommendations',
  },
  {
    id: 'modern-farming',
    icon: Tractor,
    route: '/modern-farming',
    malayalamName: 'ആധുനിക കൃഷി',
    englishName: 'Modern Farming',
    malayalamDesc: 'മണ്ണിനും വിളയ്ക്കും അനുയോജ്യമായ ആധുനിക രീതികൾ',
    englishDesc: 'Modern techniques for your crops',
  },
  {
    id: 'farm-diary',
    icon: BookOpen,
    route: '/farm-diary',
    malayalamName: 'കൃഷി ദിനപതി',
    englishName: 'Farm Diary',
    malayalamDesc: 'ദൈനംദിന കൃഷി പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്തുക',
    englishDesc: 'Log daily farming activities',
  },
  {
    id: 'crop-recommender',
    icon: Lightbulb,
    route: '/crop-recommender',
    malayalamName: 'വിള നിർദ്ദേശം',
    englishName: 'Crop Recommender',
    malayalamDesc: 'സീസണനുസരിച്ച് മികച്ച 3 വിളകൾ',
    englishDesc: 'Top 3 seasonal crop suggestions',
  },
  {
    id: 'farmer-groups',
    icon: Users,
    route: '/farmer-groups',
    malayalamName: 'കൂട്ടായ്മ',
    englishName: 'Farmer Groups',
    malayalamDesc: 'ശബ്ദത്തിലൂടെ കർഷകരുമായി ചാറ്റ്',
    englishDesc: 'Chat with farmers using voice',
  },
  {
    id: 'virtual-farm',
    icon: TreePine,
    route: '/virtual-farm',
    malayalamName: 'വെർച്വൽ ഫാം',
    englishName: 'Virtual Farm',
    malayalamDesc: 'ദൃശ്യമായ കൃഷിയിടം ഘട്ടം ഘട്ടമായി',
    englishDesc: 'Visual farm growth tracking',
  },
];

export const ServicesGrid = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleServiceClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="malayalam-text text-2xl mb-2">
          {language === 'malayalam' ? 'സേവനങ്ങൾ' : 'Services'}
        </h2>
        <p className="english-subtext">
          {language === 'malayalam' 
            ? 'നിങ്ങളുടെ കൃഷിയെ മുന്നോട്ട് കൊണ്ടുപോകാൻ ആവശ്യമായ എല്ലാ സേവനങ്ങളും'
            : 'All the services you need to advance your farming'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          
          return (
            <button
              key={service.id}
              onClick={() => handleServiceClick(service.route)}
              className="service-button text-left group"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 group-hover:bg-primary/20 p-4 rounded-2xl transition-colors duration-300">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="malayalam-text text-foreground group-hover:text-primary transition-colors duration-300">
                    {language === 'malayalam' ? service.malayalamName : service.englishName}
                  </h3>
                  <p className="english-subtext text-xs leading-relaxed">
                    {language === 'malayalam' ? service.malayalamDesc : service.englishDesc}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};