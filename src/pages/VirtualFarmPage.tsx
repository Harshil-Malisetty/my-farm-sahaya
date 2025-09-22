import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { ArrowLeft, Sprout, TreePine, Flower, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VirtualFarmPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { speak, isPlaying } = useTextToSpeech();

  const farmStages = [
    {
      stage: language === 'malayalam' ? 'വിത്ത് വിതക്കൽ' : 'Seed Planting',
      icon: Sprout,
      progress: 100,
      date: language === 'malayalam' ? '3 ദിവസം മുമ്പ്' : '3 days ago',
      status: language === 'malayalam' ? 'പൂർത്തിയായി' : 'Completed',
      description: language === 'malayalam' 
        ? 'നെല്ല് വിത്ത് 2 ഏക്കറിൽ വിതച്ചു'
        : 'Rice seeds planted in 2 acres'
    },
    {
      stage: language === 'malayalam' ? 'മുളപ്പിക്കൽ' : 'Germination',
      icon: Sprout,
      progress: 75,
      date: language === 'malayalam' ? 'ഇന്ന്' : 'Today',
      status: language === 'malayalam' ? 'പുരോഗമിക്കുന്നു' : 'In Progress',
      description: language === 'malayalam'
        ? '75% വിത്തുകൾ മുളച്ചു തുടങ്ങി'
        : '75% seeds have started germinating'
    },
    {
      stage: language === 'malayalam' ? 'വളർച്ച' : 'Growth',
      icon: TreePine,
      progress: 0,
      date: language === 'malayalam' ? '10 ദിവസം കൂടി' : 'In 10 days',
      status: language === 'malayalam' ? 'കാത്തിരിക്കുന്നു' : 'Pending',
      description: language === 'malayalam'
        ? 'ചെടികൾ വളരാൻ തുടങ്ങും'
        : 'Plants will start growing'
    },
    {
      stage: language === 'malayalam' ? 'പൂവിടൽ' : 'Flowering',
      icon: Flower,
      progress: 0,
      date: language === 'malayalam' ? '60 ദിവസം കൂടി' : 'In 60 days',
      status: language === 'malayalam' ? 'കാത്തിരിക്കുന്നു' : 'Pending',
      description: language === 'malayalam'
        ? 'നെൽപ്പൂക്കൾ വിരിയും'
        : 'Rice flowers will bloom'
    },
    {
      stage: language === 'malayalam' ? 'വിളവെടുപ്പ്' : 'Harvest',
      icon: TreePine,
      progress: 0,
      date: language === 'malayalam' ? '120 ദിവസം കൂടി' : 'In 120 days',
      status: language === 'malayalam' ? 'കാത്തിരിക്കുന്നു' : 'Pending',
      description: language === 'malayalam'
        ? 'നെല്ല് വിളവെടുക്കാൻ തയ്യാറാകും'
        : 'Rice will be ready for harvest'
    }
  ];

  const farmStats = {
    totalArea: '2 ഏക്കർ / 2 acres',
    cropType: language === 'malayalam' ? 'നെല്ല് (ജീരകശാലി)' : 'Rice (Jeerakasali)',
    plantingDate: language === 'malayalam' ? '3 ദിവസം മുമ്പ്' : '3 days ago',
    expectedHarvest: language === 'malayalam' ? '117 ദിവസം കൂടി' : 'In 117 days',
    currentStage: language === 'malayalam' ? 'മുളപ്പിക്കൽ (75%)' : 'Germination (75%)'
  };

  useEffect(() => {
    const pageText = language === 'malayalam' 
      ? `വെർച്വൽ ഫാം പേജ്. ഇവിടെ നിങ്ങളുടെ ഫാമിന്റെ വളർച്ച ദൃശ്യമായി കാണാം. നിലവിൽ രണ്ട് ഏക്കർ നെല്ല് കൃഷി ചെയ്യുന്നുണ്ട്. വിത്ത് വിതയ്ക്കൽ പൂർത്തിയായി. മുളപ്പിക്കൽ ഘട്ടത്തിൽ എഴുപത്തിയഞ്ച് ശതമാനം പൂർത്തിയായി.`
      : `Virtual farm page. Here you can visually track your farm's growth. Currently farming rice in two acres. Seed planting completed and germination stage is seventy-five percent complete.`;
    
    setTimeout(() => speak(pageText), 500);
  }, [language, speak]);

  const handleReadPage = () => {
    const fullPageText = language === 'malayalam' 
      ? `വെർച്വൽ ഫാം വിവരങ്ങൾ. മൊത്തം വിസ്തീർണ്ണം രണ്ട് ഏക്കർ. നെല്ല് ജീരകശാലി ഇനം കൃഷി ചെയ്യുന്നു. മൂന്ന് ദിവസം മുമ്പ് വിത്ത് വിതച്ചു. നൂറ്റിപ്പതിനേഴ് ദിവസം കൂടി കഴിഞ്ഞാൽ വിളവെടുക്കാം. നിലവിൽ മുളപ്പിക്കൽ ഘട്ടത്തിൽ എഴുപത്തിയഞ്ച് ശതമാനം പൂർത്തിയായി. വിത്ത് വിതയ്ക്കൽ നൂറു ശതമാനം പൂർത്തിയായി. വളർച്ച, പൂവിടൽ, വിളവെടുപ്പ് ഘട്ടങ്ങൾ കാത്തിരിക്കുന്നു.`
      : `Virtual farm information. Total area is two acres growing Rice Jeerakasali variety. Seeds planted three days ago with harvest expected in one hundred seventeen days. Currently in germination stage at seventy-five percent completion. Seed planting one hundred percent complete. Growth, flowering, and harvest stages are pending.`;
    
    speak(fullPageText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Button>
          
          <div className="text-center">
            <h1 className="malayalam-text text-xl text-primary">
              {t('virtualFarm')}
            </h1>
            <p className="english-subtext">
              {t('virtualFarmDesc')}
            </p>
          </div>

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
        {/* Farm Overview */}
        <Card className="farmer-card mb-6">
          <h2 className="malayalam-text text-xl mb-4">
            {language === 'malayalam' ? 'ഫാം വിവരങ്ങൾ' : 'Farm Overview'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <p className="malayalam-text font-semibold mb-1">{farmStats.totalArea}</p>
              <p className="english-subtext text-sm">
                {language === 'malayalam' ? 'വിസ്തീർണ്ണം' : 'Total Area'}
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <p className="malayalam-text font-semibold mb-1">{farmStats.cropType}</p>
              <p className="english-subtext text-sm">
                {language === 'malayalam' ? 'വിള' : 'Crop Type'}
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-xl text-center">
              <p className="malayalam-text font-semibold mb-1">{farmStats.currentStage}</p>
              <p className="english-subtext text-sm">
                {language === 'malayalam' ? 'നിലവിലെ ഘട്ടം' : 'Current Stage'}
              </p>
            </div>
          </div>
        </Card>

        {/* Growth Timeline */}
        <Card className="farmer-card">
          <h2 className="malayalam-text text-xl mb-6">
            {language === 'malayalam' ? 'വളർച്ചയുടെ ഘട്ടങ്ങൾ' : 'Growth Stages'}
          </h2>
          
          <div className="space-y-4">
            {farmStages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div key={index} className="relative">
                  {/* Timeline Line */}
                  {index < farmStages.length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-12 bg-gradient-to-b from-green-300 to-green-100"></div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      stage.progress === 100 
                        ? 'bg-green-500' 
                        : stage.progress > 0 
                          ? 'bg-yellow-500' 
                          : 'bg-gray-300'
                    }`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="malayalam-text text-lg">{stage.stage}</h3>
                        <span className="english-subtext text-sm">{stage.date}</span>
                      </div>
                      
                      <p className="malayalam-text text-muted-foreground mb-3">{stage.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            stage.progress === 100 
                              ? 'bg-green-500' 
                              : stage.progress > 0 
                                ? 'bg-yellow-500' 
                                : 'bg-gray-300'
                          }`}
                          style={{ width: `${stage.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className={`malayalam-text text-sm font-medium ${
                          stage.progress === 100 
                            ? 'text-green-600' 
                            : stage.progress > 0 
                              ? 'text-yellow-600' 
                              : 'text-gray-500'
                        }`}>
                          {stage.status}
                        </span>
                        <span className="english-subtext text-sm">{stage.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
};