import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Wheat, 
  Bug, 
  Settings,
  MessageCircle
} from 'lucide-react';

interface ServiceCategory {
  id: string;
  icon: React.ElementType;
  route: string;
  malayalamName: string;
  englishName: string;
  malayalamDesc: string;
  englishDesc: string;
  bgGradient: string;
  iconColor: string;
}

const serviceCategories: ServiceCategory[] = [
  {
    id: 'field-care',
    icon: Wheat,
    route: '/field-care',
    malayalamName: 'പാട പരിചരണം',
    englishName: 'Field Care',
    malayalamDesc: 'കാലാവസ്ഥ, വളം, ആധുനിക കൃഷി രീതികൾ',
    englishDesc: 'Weather, fertilizers, and modern farming techniques',
    bgGradient: 'from-green-500 to-emerald-600',
    iconColor: 'text-white'
  },
  {
    id: 'crop-support',
    icon: Bug,
    route: '/crop-support',
    malayalamName: 'വിള സഹായം',
    englishName: 'Crop Support',
    malayalamDesc: 'കീടനാശിനി, വിള നിർദ്ദേശങ്ങൾ',
    englishDesc: 'Pest control and crop recommendations',
    bgGradient: 'from-orange-500 to-red-500',
    iconColor: 'text-white'
  },
  {
    id: 'farm-management',
    icon: Settings,
    route: '/farm-management',
    malayalamName: 'ഫാം മാനേജ്മെന്റ്',
    englishName: 'Farm Management',
    malayalamDesc: 'ദിനപതി, കർഷക കൂട്ടായ്മ, വെർച്വൽ ഫാം',
    englishDesc: 'Diary, farmer groups, and virtual farm',
    bgGradient: 'from-blue-500 to-teal-600',
    iconColor: 'text-white'
  },
  {
    id: 'ai-chat',
    icon: MessageCircle,
    route: '/chatbot',
    malayalamName: 'AI സഹായി',
    englishName: 'AI Assistant',
    malayalamDesc: 'സ്മാർട്ട് AI ചാറ്റ്ബോട്ട് സഹായം',
    englishDesc: 'Smart AI chatbot assistance',
    bgGradient: 'from-purple-500 to-pink-600',
    iconColor: 'text-white'
  },
];

export const ServicesGrid = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleCategoryClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h2 className="malayalam-text text-3xl font-bold mb-4 text-primary">
          {language === 'malayalam' ? 'സേവനങ്ങൾ' : 'Services'}
        </h2>
        <p className="english-subtext text-lg max-w-2xl mx-auto">
          {language === 'malayalam' 
            ? 'നിങ്ങളുടെ കൃഷിയെ മുന്നോട്ട് കൊണ്ടുപോകാൻ ആവശ്യമായ എല്ലാ സേവനങ്ങളും'
            : 'All the services you need to advance your farming journey'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {serviceCategories.map((category) => {
          const Icon = category.icon;
          
          return (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.route)}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className={`bg-gradient-to-br ${category.bgGradient} rounded-3xl p-8 text-white h-full min-h-[280px] flex flex-col justify-between shadow-xl hover:shadow-2xl transition-shadow duration-300`}>
                <div className="text-center space-y-6">
                  <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl mx-auto w-fit group-hover:bg-white/30 transition-colors duration-300">
                    <Icon className={`h-16 w-16 ${category.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="malayalam-text text-2xl font-bold">
                      {language === 'malayalam' ? category.malayalamName : category.englishName}
                    </h3>
                    <p className="english-subtext text-lg leading-relaxed text-white font-medium drop-shadow-sm">
                      {language === 'malayalam' ? category.malayalamDesc : category.englishDesc}
                    </p>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <div className="inline-flex items-center text-white/80 group-hover:text-white transition-colors duration-300">
                    <span className="english-subtext font-medium">
                      {language === 'malayalam' ? 'കൂടുതൽ അറിയുക' : 'Learn More'}
                    </span>
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};