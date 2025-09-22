import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { ArrowLeft, Star, Droplets, Clock, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CropRecommenderPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { speak, isPlaying } = useTextToSpeech();

  const seasonalCrops = [
    {
      name: language === 'malayalam' ? 'നെല്ല് (ജീരകശാലി)' : 'Rice (Jeerakasali)',
      season: language === 'malayalam' ? 'മഴക്കാലം' : 'Monsoon',
      duration: language === 'malayalam' ? '120 ദിവസം' : '120 days',
      waterNeed: language === 'malayalam' ? 'കൂടിയ വെള്ളം' : 'High water',
      yield: language === 'malayalam' ? '25-30 ക്വിന്റൽ/ഏക്കർ' : '25-30 quintal/acre',
      profit: '₹40,000-50,000',
      benefits: language === 'malayalam' 
        ? ['പ്രധാന ഭക്ഷ്യവിള', 'നല്ല വിപണി', 'സാമ്പത്തിക സുരക്ഷ']
        : ['Staple food crop', 'Good market', 'Economic security']
    },
    {
      name: language === 'malayalam' ? 'തക്കാളി' : 'Tomato',
      season: language === 'malayalam' ? 'വേനൽക്കാലം' : 'Summer',
      duration: language === 'malayalam' ? '90 ദിവസം' : '90 days',
      waterNeed: language === 'malayalam' ? 'മദ്ധ്യമം' : 'Medium water',
      yield: language === 'malayalam' ? '150-200 ക്വിന്റൽ/ഏക്കർ' : '150-200 quintal/acre',
      profit: '₹80,000-1,20,000',
      benefits: language === 'malayalam'
        ? ['വേഗത്തിലുള്ള വളർച്ച', 'കൂടിയ വിലവും വരുമാനവും', 'വർഷം മുഴുവനും വിപണി']
        : ['Fast growing', 'High price & profit', 'Year-round market']
    },
    {
      name: language === 'malayalam' ? 'മുളക് (പച്ച മുളക്)' : 'Chilli (Green)',
      season: language === 'malayalam' ? 'വർഷം മുഴുവൻ' : 'Year-round',
      duration: language === 'malayalam' ? '150 ദിവസം' : '150 days',
      waterNeed: language === 'malayalam' ? 'മദ്ധ്യമം' : 'Medium water',
      yield: language === 'malayalam' ? '60-80 ക്വിന്റൽ/ഏക്കർ' : '60-80 quintal/acre',
      profit: '₹70,000-90,000',
      benefits: language === 'malayalam'
        ? ['എല്ലാ സീസണിലും കൃഷി', 'കേരളത്തിൽ നല്ല ഡിമാൻഡ്', 'സ്ഥിരമായ വരുമാനം']
        : ['All season farming', 'Good demand in Kerala', 'Steady income']
    }
  ];

  useEffect(() => {
    const pageText = language === 'malayalam' 
      ? `വിള നിർദ്ദേശം പേജ്. ഇവിടെ നിങ്ങൾക്ക് ഈ സീസണിലെ മികച്ച മൂന്ന് വിളകൾ കാണാം. നെല്ല് ജീരകശാലി ഇനം മഴക്കാലത്തിന് നല്ലത്. നൂറ്റിയിരുപത് ദിവസം കൊണ്ട് തയ്യാറാകും. തക്കാളി വേനൽക്കാലത്തിന് അനുയോജ്യം.`
      : `Crop recommendation page. Here you can see the top three crops for this season. Rice Jeerakasali variety is good for monsoon season and takes one hundred twenty days to mature. Tomato is suitable for summer season.`;
    
    setTimeout(() => speak(pageText), 500);
  }, [language, speak]);

  const handleReadPage = () => {
    const fullPageText = language === 'malayalam' 
      ? `സീസണൽ വിള നിർദ്ദേശങ്ങൾ. ഒന്നാം സ്ഥാനം നെല്ല് ജീരകശാലി. മഴക്കാലത്തിന് അനുയോജ്യം. നൂറ്റിയിരുപത് ദിവസം കൊണ്ട് തയ്യാറാകും. ഇരുപത്തിയഞ്ച് മുതൽ മുപ്പത് ക്വിന്റൽ വരെ വിളവ്. നാൽപതിനായിരം മുതൽ അൻപതിനായിരം രൂപ വരെ ലാഭം. രണ്ടാം സ്ഥാനം തക്കാളി. വേനൽക്കാലത്തിന് അനുയോജ്യം. തൊണ്ണൂറു ദിവസം കൊണ്ട് തയ്യാറാകും. നൂറ്റിയൻപത് മുതൽ ഇരുന്നൂറ് ക്വിന്റൽ വരെ വിളവ്. മൂന്നാം സ്ഥാനം പച്ച മുളക്. വർഷം മുഴുവനും കൃഷി ചെയ്യാം.`
      : `Seasonal crop recommendations. First position: Rice Jeerakasali suitable for monsoon season, ready in one hundred twenty days with twenty-five to thirty quintal yield and forty to fifty thousand rupees profit. Second position: Tomato suitable for summer, ready in ninety days with one hundred fifty to two hundred quintal yield. Third position: Green chilli can be grown year-round.`;
    
    speak(fullPageText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
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
              {t('cropRecommender')}
            </h1>
            <p className="english-subtext">
              {t('cropRecommenderDesc')}
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
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="malayalam-text text-2xl mb-2">
              {language === 'malayalam' ? 'ഈ സീസണിലെ മികച്ച 3 വിളകൾ' : 'Top 3 Crops This Season'}
            </h2>
            <p className="english-subtext">
              {language === 'malayalam' ? 'കേരളത്തിലെ കാലാവസ്ഥയ്ക്ക് അനുയോജ്യം' : 'Suitable for Kerala climate'}
            </p>
          </div>

          {seasonalCrops.map((crop, index) => (
            <Card key={index} className="farmer-card relative">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl relative">
                  <Star className="h-8 w-8 text-white" />
                  <span className="absolute -top-2 -right-2 bg-white text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h3 className="malayalam-text text-xl mb-3">{crop.name}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-lg">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">{crop.season}</p>
                        <p className="malayalam-text text-sm">{crop.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {language === 'malayalam' ? 'വെള്ളം' : 'Water need'}
                        </p>
                        <p className="malayalam-text text-sm">{crop.waterNeed}</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        {language === 'malayalam' ? 'പ്രതീക്ഷിക്കാവുന്ന ലാഭം' : 'Expected profit'}
                      </p>
                      <p className="text-lg font-bold text-green-600">{crop.profit}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="malayalam-text text-sm">
                      <span className="font-medium">
                        {language === 'malayalam' ? 'വിളവ്: ' : 'Yield: '}
                      </span>
                      {crop.yield}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="malayalam-text font-semibold text-sm">
                      {language === 'malayalam' ? 'പ്രത്യേകതകൾ:' : 'Benefits:'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {crop.benefits.map((benefit, i) => (
                        <span 
                          key={i} 
                          className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-full text-sm malayalam-text"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};