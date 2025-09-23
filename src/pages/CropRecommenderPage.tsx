import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Star, Droplets, Clock, Volume2, Loader2, TrendingUp, Leaf, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CropRecommenderPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { speak, isPlaying } = useTextToSpeech();
  
  // State for inputs
  const [year, setYear] = useState<string>('2024');
  const [season, setSeason] = useState<string>('');
  const [area, setArea] = useState<string>('');
  
  // State for predictions
  const [predictions, setPredictions] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Get crop recommendations
  const getCropRecommendations = async () => {
    if (!season || !area) {
      setError(language === 'malayalam' ? 'എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കുക' : 'Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.functions.invoke('crop-recommender', {
        body: {
          year: parseInt(year),
          season: season,
          area: parseFloat(area)
        }
      });

      if (error) throw error;
      
      setPredictions(data);
      
      // Speak the results
      const resultText = language === 'malayalam' 
        ? `വിള നിർദ്ദേശങ്ങൾ തയ്യാറായി. മികച്ച വിളകൾ: ${data.topCrops.join(', ')}`
        : `Crop recommendations ready. Top crops: ${data.topCrops.join(', ')}`;
      speak(resultText);
      
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError(language === 'malayalam' ? 'എന്തോ തെറ്റായി. വീണ്ടും ശ്രമിക്കുക' : 'Something went wrong. Please try again');
    } finally {
      setLoading(false);
    }
  };

  // Create dynamic crop data from predictions
  const getCropData = () => {
    if (!predictions) {
      // Return default static data if no predictions
      return [
        {
          name: language === 'malayalam' ? 'നെല്ല് (ജീരകശാലി)' : 'Rice (Jeerakasali)',
          season: language === 'malayalam' ? 'മഴക്കാലം' : 'Monsoon',
          duration: language === 'malayalam' ? '120 ദിവസം' : '120 days',
          waterNeed: language === 'malayalam' ? 'കൂടിയ വെള്ളം' : 'High water',
          yield: language === 'malayalam' ? '25-30 ക്വിന്റൽ/ഏക്കർ' : '25-30 quintal/acre',
          profit: '₹40,000-50,000',
          successRate: '85%',
          fertilizer: 'NPK 20-20-20',
          pesticide: language === 'malayalam' ? 'ജൈവിക കീടനാശിനി' : 'Organic pesticide',
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
          successRate: '78%',
          fertilizer: 'Compost + NPK',
          pesticide: language === 'malayalam' ? 'വേപ്പെണ്ണ' : 'Neem oil',
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
          successRate: '72%',
          fertilizer: language === 'malayalam' ? 'ജൈവ വളം' : 'Organic fertilizer',
          pesticide: language === 'malayalam' ? 'ബയോ കീടനാശിനി' : 'Bio-pesticide',
          benefits: language === 'malayalam'
            ? ['എല്ലാ സീസണിലും കൃഷി', 'കേരളത്തിൽ നല്ല ഡിമാൻഡ്', 'സ്ഥിരമായ വരുമാനം']
            : ['All season farming', 'Good demand in Kerala', 'Steady income']
        }
      ];
    }

    // Create dynamic data from ML predictions
    return predictions.topCrops.map((cropName: string, index: number) => ({
      name: cropName,
      season: season,
      duration: language === 'malayalam' ? `${90 + index * 30} ദിവസം` : `${90 + index * 30} days`,
      waterNeed: predictions.waterRequirements[index] || (language === 'malayalam' ? 'മദ്ധ്യമം' : 'Medium'),
      yield: language === 'malayalam' 
        ? `${predictions.predictedYields[index]} ക്വിന്റൽ/ഏക്കർ` 
        : `${predictions.predictedYields[index]} quintal/acre`,
      profit: `₹${(predictions.predictedYields[index] * 2000).toLocaleString()}-${(predictions.predictedYields[index] * 2500).toLocaleString()}`,
      successRate: `${predictions.successProbability[index]}%`,
      fertilizer: predictions.fertilizerRequirements[index] || 'NPK',
      pesticide: predictions.pesticideRequirements[index] || (language === 'malayalam' ? 'ജൈവിക കീടനാശിനി' : 'Organic pesticide'),
      benefits: language === 'malayalam'
        ? [`${predictions.successProbability[index]}% വിജയ സാധ്യത`, 'ML പ്രവചനം', 'ഡാറ്റാ അധിഷ്ഠിത നിർദ്ദേശം']
        : [`${predictions.successProbability[index]}% success rate`, 'ML prediction', 'Data-driven recommendation']
    }));
  };

  const seasonalCrops = getCropData();

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
          {/* Input Form */}
          <Card className="farmer-card">
            <div className="p-6">
              <h3 className="malayalam-text text-xl mb-4">
                {language === 'malayalam' ? 'വിവരങ്ങൾ നൽകുക' : 'Enter Details'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="year" className="malayalam-text">
                    {language === 'malayalam' ? 'വർഷം' : 'Year'}
                  </Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'malayalam' ? 'വർഷം തിരഞ്ഞെടുക്കുക' : 'Select year'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="season" className="malayalam-text">
                    {language === 'malayalam' ? 'സീസൺ *' : 'Season *'}
                  </Label>
                  <Select value={season} onValueChange={setSeason}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'malayalam' ? 'സീസൺ തിരഞ്ഞെടുക്കുക' : 'Select season'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kharif">{language === 'malayalam' ? 'ഖരീഫ് (മഴക്കാലം)' : 'Kharif (Monsoon)'}</SelectItem>
                      <SelectItem value="Rabi">{language === 'malayalam' ? 'റാബി (വേനൽക്കാലം)' : 'Rabi (Winter)'}</SelectItem>
                      <SelectItem value="Zaid">{language === 'malayalam' ? 'സയീദ് (വേനൽക്കാലം)' : 'Zaid (Summer)'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="area" className="malayalam-text">
                    {language === 'malayalam' ? 'പ്രദേശം (ഹെക്ടർ) *' : 'Area (Hectares) *'}
                  </Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="1.5"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-4 malayalam-text">
                  {error}
                </div>
              )}

              <Button 
                onClick={getCropRecommendations}
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {language === 'malayalam' ? 'വിള നിർദ്ദേശം നേടുക' : 'Get Crop Recommendations'}
              </Button>
            </div>
          </Card>

          <div className="text-center mb-8">
            <h2 className="malayalam-text text-2xl mb-2">
              {language === 'malayalam' ? 'ഈ സീസണിലെ മികച്ച 3 വിളകൾ' : 'Top 3 Crops This Season'}
            </h2>
            <p className="english-subtext">
              {predictions 
                ? (language === 'malayalam' ? 'ML മോഡൽ പ്രവചനങ്ങൾ' : 'ML Model Predictions')
                : (language === 'malayalam' ? 'കേരളത്തിലെ കാലാവസ്ഥയ്ക്ക് അനുയോജ്യം' : 'Suitable for Kerala climate')
              }
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

                  {/* Second row with ML predictions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 bg-emerald-50 p-3 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {language === 'malayalam' ? 'വിജയ സാധ്യത' : 'Success Rate'}
                        </p>
                        <p className="malayalam-text text-sm font-bold text-emerald-600">{crop.successRate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg">
                      <Leaf className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {language === 'malayalam' ? 'വളം' : 'Fertilizer'}
                        </p>
                        <p className="malayalam-text text-sm">{crop.fertilizer}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                      <Shield className="h-4 w-4 text-red-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {language === 'malayalam' ? 'കീടനാശിനി' : 'Pesticide'}
                        </p>
                        <p className="malayalam-text text-sm">{crop.pesticide}</p>
                      </div>
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