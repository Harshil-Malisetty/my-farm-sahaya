import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { ArrowLeft, Camera, Upload, Volume2, Bug, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIAssistant } from '@/components/AIAssistant';

export const PestDiseasePage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { speak, isPlaying } = useTextToSpeech();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalyzing(true);
        // Simulate AI analysis
        setTimeout(() => {
          setAnalyzing(false);
          const resultText = language === 'malayalam' 
            ? 'നിങ്ങളുടെ ചെടിയിൽ ഇലപ്പൊള്ളൽ രോഗം കണ്ടെത്തി. നിയന്ത്രണത്തിനായി കോപ്പർ ഫംഗിസൈഡ് ഉപയോഗിക്കുക.'
            : 'Leaf blight disease detected in your plant. Use copper fungicide for control.';
          speak(resultText);
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const commonPests = [
    {
      name: language === 'malayalam' ? 'ഇലപ്പൊള്ളൽ' : 'Leaf Blight',
      treatment: language === 'malayalam' ? 'കോപ്പർ ഫംഗിസൈഡ്' : 'Copper Fungicide',
      severity: 'medium',
    },
    {
      name: language === 'malayalam' ? 'വേരുചീയൽ' : 'Root Rot',
      treatment: language === 'malayalam' ? 'നീർവാർപ്പ് കുറയ്ക്കുക' : 'Reduce Watering',
      severity: 'high',
    },
    {
      name: language === 'malayalam' ? 'പച്ചപ്പുഴു' : 'Aphids',
      treatment: language === 'malayalam' ? 'നീം എണ്ണ' : 'Neem Oil',
      severity: 'low',
    },
  ];

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
              {t('pestDisease')}
            </h1>
            <p className="english-subtext">
              {t('pestDesc')}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => speak(language === 'malayalam' 
              ? 'കീട നിയന്ത്രണ പേജ്. ഇവിടെ നിങ്ങൾക്ക് ചെടിയുടെ ഫോട്ടോ എടുത്ത് രോഗങ്ങൾ കണ്ടെത്താം.'
              : 'Pest control page. Here you can take plant photos to detect diseases.'
            )}
            disabled={isPlaying}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Image Upload Section */}
        <Card className="farmer-card mb-6">
          <div className="text-center">
            <Bug className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="malayalam-text text-xl mb-4">
              {language === 'malayalam' ? 'ചെടിയുടെ ഫോട്ടോ എടുക്കുക' : 'Take Plant Photo'}
            </h2>
            
            {selectedImage ? (
              <div className="mb-4">
                <img
                  src={selectedImage}
                  alt="Plant analysis"
                  className="max-w-xs mx-auto rounded-lg shadow-md mb-4"
                />
                {analyzing && (
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="malayalam-text">
                      {language === 'malayalam' ? 'വിശകലനം ചെയ്യുന്നു...' : 'Analyzing...'}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 mb-4">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="english-subtext">
                  {language === 'malayalam' ? 'ഇവിടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക' : 'Upload photo here'}
                </p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <label htmlFor="image-upload">
                <Button className="language-toggle cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  {language === 'malayalam' ? 'ഗാലറിയിൽ നിന്നും' : 'From Gallery'}
                </Button>
              </label>
              
              <label htmlFor="image-upload">
                <Button variant="outline" className="cursor-pointer">
                  <Camera className="mr-2 h-4 w-4" />
                  {language === 'malayalam' ? 'ക്യാമറ' : 'Camera'}
                </Button>
              </label>
            </div>
          </div>
        </Card>

        {/* Common Pests & Diseases */}
        <Card className="farmer-card">
          <h3 className="malayalam-text text-xl mb-4">
            {language === 'malayalam' ? 'സാധാരണ രോഗങ്ങൾ' : 'Common Diseases'}
          </h3>
          
          <div className="space-y-4">
            {commonPests.map((pest, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-green-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle 
                    className={`h-6 w-6 ${
                      pest.severity === 'high' ? 'text-red-500' :
                      pest.severity === 'medium' ? 'text-orange-500' :
                      'text-green-500'
                    }`}
                  />
                  <div>
                    <p className="malayalam-text">{pest.name}</p>
                    <p className="english-subtext text-xs">{pest.treatment}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speak(
                    language === 'malayalam' 
                      ? `${pest.name}. ചികിത്സ: ${pest.treatment}`
                      : `${pest.name}. Treatment: ${pest.treatment}`
                  )}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </main>

      {/* AI Assistant */}
      <AIAssistant 
        pageContext={{
          pageName: 'pest-disease',
          pageData: { commonPests, selectedImage, analyzing },
          contextualPrompt: language === 'malayalam'
            ? `കീട-രോഗ നിയന്ത്രണം പേജിൽ നിന്ന്: ${selectedImage ? 'ഒരു ചെടിയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്തു' : 'ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യാൻ കാത്തിരിക്കുന്നു'}. സാധാരണ രോഗങ്ങൾ: ${commonPests.map(p => p.name).join(', ')}. കീട-രോഗ തിരിച്ചറിയൽ, പ്രതിരോധ മാർഗ്ഗങ്ങൾ, ചികിത്സാ രീതികൾ എന്നിവയെ കുറിച്ച് ഉപദേശം നൽകുക.`
            : `Pest and disease control context: ${selectedImage ? 'Plant photo uploaded for analysis' : 'Waiting for photo upload'}. Common issues: ${commonPests.map(p => p.name).join(', ')}. Provide advice on pest identification, prevention methods, organic treatments, and disease management strategies.`
        }}
      />
    </div>
  );
};