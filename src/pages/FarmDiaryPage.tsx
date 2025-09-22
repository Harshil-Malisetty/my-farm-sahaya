import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { ArrowLeft, Calendar, Plus, Book, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FarmDiaryPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { speak, isPlaying } = useTextToSpeech();

  const diaryEntries = [
    {
      date: language === 'malayalam' ? 'ഇന്ന്' : 'Today',
      activity: language === 'malayalam' ? 'വിത്ത് വിതക്കൽ' : 'Seed Sowing',
      crop: language === 'malayalam' ? 'നെല്ല്' : 'Rice',
      area: '2 ഏക്കർ / 2 acres',
      notes: language === 'malayalam' ? 'കാലാവസ്ഥ നല്ലത്. മണ്ണ് തയ്യാറായി.' : 'Good weather. Soil prepared well.'
    },
    {
      date: language === 'malayalam' ? 'ഇന്നലെ' : 'Yesterday',
      activity: language === 'malayalam' ? 'വള നൽകൽ' : 'Fertilizer Application',
      crop: language === 'malayalam' ? 'തക്കാളി' : 'Tomato',
      area: '0.5 ഏക്കർ / 0.5 acres',
      notes: language === 'malayalam' ? 'യൂറിയ 20 കിലോഗ്രാം ചേർത്തു.' : 'Added 20kg Urea fertilizer.'
    },
    {
      date: language === 'malayalam' ? '2 ദിവസം മുമ്പ്' : '2 days ago',
      activity: language === 'malayalam' ? 'കളയെടുക്കൽ' : 'Weeding',
      crop: language === 'malayalam' ? 'ചേന' : 'Yam',
      area: '1 ഏക്കർ / 1 acre',
      notes: language === 'malayalam' ? 'കൈകൊണ്ട് കളയെടുത്തു. 4 മണിക്കൂർ എടുത്തു.' : 'Manual weeding done. Took 4 hours.'
    }
  ];

  useEffect(() => {
    const pageText = language === 'malayalam' 
      ? `കൃഷി ദിനപതി പേജ്. ഇവിടെ നിങ്ങൾക്ക് ദൈനംദിന കൃഷി പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്താം. ഇന്ന് നെല്ല് വിത്ത് വിതയ്ക്കൽ രണ്ട് ഏക്കറിൽ നടത്തി. കാലാവസ്ഥ നല്ലതാണ്. പുതിയ എൻട്രി ചേർക്കാൻ പ്ലസ് ബട്ടൺ അമർത്തുക.`
      : `Farm diary page. Here you can record daily farming activities. Today completed rice seed sowing in two acres. Weather conditions are good. Press the plus button to add new entries.`;
    
    setTimeout(() => speak(pageText), 500);
  }, [language, speak]);

  const handleReadPage = () => {
    const fullPageText = language === 'malayalam' 
      ? `കൃഷി ദിനപതി വിവരങ്ങൾ. ഇന്നത്തെ പ്രവർത്തനം. നെല്ല് വിത്ത് വിതയ്ക്കൽ രണ്ട് ഏക്കറിൽ. കാലാവസ്ഥ നല്ലത്, മണ്ണ് തയ്യാറായി. ഇന്നലത്തെ പ്രവർത്തനം. തക്കാളിക്ക് വള നൽകൽ അര ഏക്കറിൽ. യൂറിയ ഇരുപത് കിലോഗ്രാം ചേർത്തു. രണ്ട് ദിവസം മുമ്പ് ചേനയിൽ കളയെടുക്കൽ. കൈകൊണ്ട് കളയെടുത്തു, നാലു മണിക്കൂർ എടുത്തു.`
      : `Farm diary information. Today's activity: rice seed sowing in two acres with good weather and well-prepared soil. Yesterday's activity: fertilizer application for tomatoes in half acre, added twenty kilograms urea. Two days ago: manual weeding in yam field, took four hours to complete.`;
    
    speak(fullPageText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
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
              {t('farmDiary')}
            </h1>
            <p className="english-subtext">
              {t('farmDiaryDesc')}
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
        {/* Add New Entry Button */}
        <Card className="farmer-card mb-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="malayalam-text text-xl mb-2">
                {language === 'malayalam' ? 'പുതിയ എൻട്രി ചേർക്കുക' : 'Add New Entry'}
              </h2>
              <p className="english-subtext opacity-90">
                {language === 'malayalam' ? 'ഇന്നത്തെ പ്രവർത്തനം രേഖപ്പെടുത്തുക' : 'Record today\'s activities'}
              </p>
            </div>
            <Button variant="secondary" size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </Card>

        {/* Recent Entries */}
        <div className="space-y-4">
          <h2 className="malayalam-text text-xl flex items-center gap-2 mb-4">
            <Book className="h-6 w-6 text-orange-600" />
            {language === 'malayalam' ? 'സമീപകാല എൻട്രികൾ' : 'Recent Entries'}
          </h2>

          {diaryEntries.map((entry, index) => (
            <Card key={index} className="farmer-card">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="malayalam-text font-semibold">{entry.activity}</h3>
                    <span className="english-subtext text-sm">{entry.date}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    <p className="malayalam-text text-sm">
                      <span className="font-medium">
                        {language === 'malayalam' ? 'വിള: ' : 'Crop: '}
                      </span>
                      {entry.crop}
                    </p>
                    <p className="english-subtext text-sm">
                      <span className="font-medium">
                        {language === 'malayalam' ? 'വിസ്തീർണ്ണം: ' : 'Area: '}
                      </span>
                      {entry.area}
                    </p>
                  </div>
                  
                  <p className="malayalam-text text-sm bg-orange-50 p-3 rounded-lg">
                    {entry.notes}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};