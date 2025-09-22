import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Users, TreePine } from 'lucide-react';

const services = [
  {
    id: 'farm-diary',
    icon: BookOpen,
    route: '/farm-diary',
    malayalamName: 'കൃഷി ദിനപതി',
    englishName: 'Farm Diary',
    malayalamDesc: 'ദൈനംദിന കൃഷി പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്തുക',
    englishDesc: 'Log daily farming activities',
    color: 'text-amber-500',
    bgColor: 'bg-amber-100'
  },
  {
    id: 'farmer-groups',
    icon: Users,
    route: '/farmer-groups',
    malayalamName: 'കൂട്ടായ്മ',
    englishName: 'Farmer Groups',
    malayalamDesc: 'ശബ്ദത്തിലൂടെ കർഷകരുമായി ചാറ്റ്',
    englishDesc: 'Chat with farmers using voice',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100'
  },
  {
    id: 'virtual-farm',
    icon: TreePine,
    route: '/virtual-farm',
    malayalamName: 'വെർച്വൽ ഫാം',
    englishName: 'Virtual Farm',
    malayalamDesc: 'ദൃശ്യമായ കൃഷിയിടം ഘട്ടം ഘട്ടമായി',
    englishDesc: 'Visual farm growth tracking',
    color: 'text-teal-500',
    bgColor: 'bg-teal-100'
  },
];

export const FarmManagementPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-teal-50/20 to-green-50/30">
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
              {language === 'malayalam' ? 'ഫാം മാനേജ്മെന്റ്' : 'Farm Management'}
            </h1>
            <p className="english-subtext">
              {language === 'malayalam' 
                ? 'ദിനപതി, കർഷക കൂട്ടായ്മ, വെർച്വൽ ഫാം'
                : 'Diary, farmer groups, and virtual farm'
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