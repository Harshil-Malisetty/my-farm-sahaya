import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { ArrowLeft, Zap, Droplets, Smartphone, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIAssistant } from '@/components/AIAssistant';

export const ModernFarmingPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { speak, isPlaying } = useTextToSpeech();

  const techniques = [
    {
      title: language === 'malayalam' ? 'ഡ്രിപ്പ് ഇറിഗേഷൻ' : 'Drip Irrigation',
      icon: Droplets,
      description: language === 'malayalam' 
        ? 'വെള്ളം 60% വരെ ലാഭിക്കാം. വേരുകളിലേക്ക് നേരിട്ട് വെള്ളം എത്തിക്കുന്നു.'
        : 'Save up to 60% water. Direct water delivery to roots.',
      benefits: language === 'malayalam' 
        ? ['വെള്ളം സാശ്രയം', 'കളയുടെ കുറവ്', 'കൂടിയ വിളവ്']
        : ['Water conservation', 'Reduced weeds', 'Higher yield']
    },
    {
      title: language === 'malayalam' ? 'സ്മാർട്ട് സെൻസറുകൾ' : 'Smart Sensors',
      icon: Smartphone,
      description: language === 'malayalam'
        ? 'മണ്ണിന്റെ ഈർപ്പവും പി എച്ചും തത്സമയം അറിയാം. മൊബൈലിൽ അലേർട്ട് വരും.'
        : 'Real-time soil moisture and pH monitoring. Mobile alerts available.',
      benefits: language === 'malayalam'
        ? ['ഓട്ടോമാറ്റിക് നനയ്ക്കൽ', 'വളം കുറയ്ക്കൽ', 'സമയം ലാഭിക്കൽ']
        : ['Automated watering', 'Reduced fertilizer', 'Time saving']
    },
    {
      title: language === 'malayalam' ? 'സോളാർ പവർ' : 'Solar Power',
      icon: Zap,
      description: language === 'malayalam'
        ? 'സൗര ഊർജ്ജം ഉപയോഗിച്ച് പമ്പുകൾ പ്രവർത്തിപ്പിക്കാം. വൈദ്യുതി ബില്ല് ഇല്ല.'
        : 'Run pumps with solar energy. Zero electricity bills.',
      benefits: language === 'malayalam'
        ? ['പൈസ ലാഭിക്കൽ', 'പരിസ്ഥിതി സൗഹൃദം', '24 മണിക്കൂർ പവർ']
        : ['Cost savings', 'Environment friendly', '24 hour power']
    }
  ];

  useEffect(() => {
    const pageText = language === 'malayalam' 
      ? `ആധുനിക കൃഷി രീതികൾ പേജ്. ഇവിടെ നിങ്ങൾക്ക് നൂതന കൃഷി സാങ്കേതികവിദ്യകൾ കാണാം. ഡ്രിപ്പ് ഇറിഗേഷൻ ഉപയോഗിച്ച് വെള്ളം അറുപത് ശതമാനം വരെ ലാഭിക്കാം. സ്മാർട്ട് സെൻസറുകൾ ഉപയോഗിച്ച് മണ്ണിന്റെ അവസ്ഥ തത്സമയം അറിയാം.`
      : `Modern farming techniques page. Here you can see innovative agricultural technologies. Using drip irrigation, you can save up to sixty percent water. Smart sensors help monitor soil conditions in real-time.`;
    
    setTimeout(() => speak(pageText), 500);
  }, [language, speak]);

  const handleReadPage = () => {
    const fullPageText = language === 'malayalam' 
      ? `ആധുനിക കൃഷി സാങ്കേതികവിദ്യകൾ. ഡ്രിപ്പ് ഇറിഗേഷൻ സിസ്റ്റം. വെള്ളം അറുപത് ശതമാനം വരെ ലാഭിക്കാം. വേരുകളിലേക്ക് നേരിട്ട് വെള്ളം എത്തിക്കുന്നു. കളയുടെ കുറവും കൂടിയ വിളവും ഉണ്ടാകും. സ്മാർട്ട് സെൻസറുകൾ. മണ്ണിന്റെ ഈർപ്പവും പി എച്ചും തത്സമയം അറിയാം. മൊബൈലിൽ അലേർട്ട് വരും. സോളാർ പവർ സിസ്റ്റം. സൗര ഊർജ്ജം ഉപയോഗിച്ച് പമ്പുകൾ പ്രവർത്തിപ്പിക്കാം. വൈദ്യുതി ബില്ല് ഇല്ല.`
      : `Modern farming technologies. Drip irrigation system can save up to sixty percent water with direct root delivery. Reduces weeds and increases yield. Smart sensors monitor soil moisture and pH in real-time with mobile alerts. Solar power system runs pumps with solar energy and zero electricity bills.`;
    
    speak(fullPageText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
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
              {t('modernFarming')}
            </h1>
            <p className="english-subtext">
              {t('modernFarmingDesc')}
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
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {techniques.map((technique, index) => {
            const Icon = technique.icon;
            return (
              <Card key={index} className="farmer-card">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="malayalam-text text-xl mb-3">{technique.title}</h2>
                    <p className="malayalam-text text-muted-foreground mb-4">
                      {technique.description}
                    </p>
                    
                    <div className="space-y-2">
                      <h3 className="malayalam-text font-semibold text-sm">
                        {language === 'malayalam' ? 'ഗുണങ്ങൾ:' : 'Benefits:'}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {technique.benefits.map((benefit, i) => (
                          <span 
                            key={i} 
                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm malayalam-text"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>

      {/* AI Assistant */}
      <AIAssistant 
        pageContext={{
          pageName: 'modern-farming',
          pageData: techniques,
          contextualPrompt: language === 'malayalam'
            ? `ആധുനിക കൃഷി പേജിൽ നിന്ന്: ഡ്രിപ്പ് ഇറിഗേഷൻ (60% വെള്ളം ലാഭിക്കാം), സ്മാർട്ട് സെൻസറുകൾ (മണ്ണിന്റെ ഈർപ്പം നിരീക്ഷണം), സോളാർ പവർ (0 വൈദ്യുതി ബില്ല്) എന്നീ സാങ്കേതികവിദ്യകൾ ലഭ്യം. ആധുനിക കൃഷി സാങ്കേതികവിദ്യകൾ, ചെലവ് കുറയ്ക്കാനുള്ള മാർഗ്ഗങ്ങൾ, സമയം ലാഭിക്കാനുള്ള രീതികൾ എന്നിവയെ കുറിച്ച് ഉപദേശം നൽകുക.`
            : `Modern farming context: Available technologies - Drip irrigation (saves 60% water), Smart sensors (soil monitoring), Solar power (zero electricity bill). Provide advice on modern farming technologies, cost reduction methods, time-saving techniques, and implementation strategies for small farmers.`
        }}
      />
    </div>
  );
};