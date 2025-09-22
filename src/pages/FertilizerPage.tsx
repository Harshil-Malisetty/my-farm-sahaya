import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { ArrowLeft, Leaf, DollarSign, TrendingUp, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FertilizerPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { speak, isPlaying } = useTextToSpeech();

  const fertilizerData = {
    recommendations: [
      {
        name: language === 'malayalam' ? 'യൂറിയ' : 'Urea',
        price: '₹280/kg',
        usage: language === 'malayalam' ? 'നെല്ലിന് 40kg/ഏക്കർ' : 'Rice: 40kg/acre',
        benefit: language === 'malayalam' ? 'നൈട്രജൻ വർധിപ്പിക്കുന്നു' : 'Increases nitrogen'
      },
      {
        name: language === 'malayalam' ? 'പൊട്ടാഷ്' : 'Potash',
        price: '₹320/kg',
        usage: language === 'malayalam' ? 'പച്ചക്കറികൾക്ക് 25kg/ഏക്കർ' : 'Vegetables: 25kg/acre',
        benefit: language === 'malayalam' ? 'വേരുകൾ ശക്തിപ്പെടുത്തുന്നു' : 'Strengthens roots'
      },
      {
        name: language === 'malayalam' ? 'ഫോസ്ഫറസ്' : 'Phosphorus',
        price: '₹350/kg',
        usage: language === 'malayalam' ? 'പൂവിടുന്ന ചെടികൾക്ക് 20kg/ഏക്കർ' : 'Flowering plants: 20kg/acre',
        benefit: language === 'malayalam' ? 'പൂക്കളും കായ്കളും വർധിപ്പിക്കുന്നു' : 'Increases flowers & fruits'
      }
    ],
    soilTips: [
      language === 'malayalam' ? 'മണ്ണിന്റെ pH 6.0-7.0 ആയി നിലനിർത്തുക' : 'Maintain soil pH 6.0-7.0',
      language === 'malayalam' ? 'ജൈവവളം മാസത്തിലൊരിക്കൽ ചേർക്കുക' : 'Add organic matter monthly',
      language === 'malayalam' ? 'വേനൽക്കാലത്ത് വെള്ളം കൂടുതൽ നൽകുക' : 'Increase watering in summer'
    ]
  };

  useEffect(() => {
    const pageText = language === 'malayalam' 
      ? `വളം, മണ്ണ് പരിപാലന പേജ്. ഇവിടെ നിങ്ങൾക്ക് വിവിധ വളങ്ങളുടെ വിലയും ഉപയോഗവും കാണാം. ഇന്നത്തെ വിപണി വില അനുസരിച്ച് യൂറിയ രണ്ടു നൂറ്റിയെൺപത് രൂപ കിലോഗ്രാമിന്. മണ്ണിന്റെ പി എച്ച് ആറിൽ നിന്ന് ഏഴ് വരെ നിലനിർത്തുക.`
      : `Fertilizer and soil care page. Here you can see prices and usage of various fertilizers. Today's market price for urea is two hundred eighty rupees per kilogram. Maintain soil pH between six to seven.`;
    
    setTimeout(() => speak(pageText), 500);
  }, [language, speak]);

  const handleReadPage = () => {
    const fullPageText = language === 'malayalam' 
      ? `വളം, മണ്ണ് പരിപാലന വിവരങ്ങൾ. ഇന്നത്തെ ശുപാർശകൾ. യൂറിയ രണ്ടു നൂറ്റിയെൺപത് രൂപ കിലോഗ്രാമിന്. നെല്ലിന് നാൽപത് കിലോഗ്രാം ഏക്കറിന്. പൊട്ടാഷ് മുന്നൂറ്റിയിരുപത് രൂപ കിലോഗ്രാമിന്. പച്ചക്കറികൾക്ക് ഇരുപത്തിയഞ്ച് കിലോഗ്രാം ഏക്കറിന്. മണ്ണ് പരിപാലന നുറുങ്ങുകൾ. മണ്ണിന്റെ പി എച്ച് ആറിൽ നിന്ന് ഏഴ് വരെ നിലനിർത്തുക. ജൈവവളം മാസത്തിലൊരിക്കൽ ചേർക്കുക.`
      : `Fertilizer and soil care information. Today's recommendations. Urea costs two hundred eighty rupees per kilogram. For rice, use forty kilograms per acre. Potash costs three hundred twenty rupees per kilogram. For vegetables, use twenty five kilograms per acre. Soil care tips. Maintain soil pH between six to seven. Add organic matter monthly.`;
    
    speak(fullPageText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
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
              {t('fertilizer')}
            </h1>
            <p className="english-subtext">
              {t('fertilizerDesc')}
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
        {/* Market Prices */}
        <Card className="farmer-card mb-6">
          <h2 className="malayalam-text text-xl mb-4 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            {language === 'malayalam' ? 'ഇന്നത്തെ വിപണി വില' : 'Today\'s Market Prices'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fertilizerData.recommendations.map((item, index) => (
              <div key={index} className="bg-green-50 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <h3 className="malayalam-text font-semibold">{item.name}</h3>
                </div>
                <p className="text-2xl font-bold text-green-700 mb-2">{item.price}</p>
                <p className="english-subtext mb-1">{item.usage}</p>
                <p className="text-sm text-muted-foreground">{item.benefit}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Soil Care Tips */}
        <Card className="farmer-card">
          <h2 className="malayalam-text text-xl mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
            {language === 'malayalam' ? 'മണ്ണ് പരിപാലന നുറുങ്ങുകൾ' : 'Soil Care Tips'}
          </h2>
          
          <div className="space-y-3">
            {fertilizerData.soilTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 bg-emerald-50 p-4 rounded-xl">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="malayalam-text">{tip}</p>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};