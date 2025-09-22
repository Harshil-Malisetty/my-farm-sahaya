import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { ArrowLeft, Cloud, Thermometer, Droplets, Wind, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WeatherPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { speak, isPlaying } = useTextToSpeech();

  const weatherData = {
    location: language === 'malayalam' ? 'കേരളം' : 'Kerala',
    temperature: '28°C',
    condition: language === 'malayalam' ? 'ഭാഗിക മേഘാവൃതം' : 'Partly Cloudy',
    humidity: '75%',
    windSpeed: '12 km/h',
    forecast: [
      { day: language === 'malayalam' ? 'ഇന്ന്' : 'Today', temp: '28°C', icon: Cloud },
      { day: language === 'malayalam' ? 'നാളെ' : 'Tomorrow', temp: '26°C', icon: Cloud },
      { day: language === 'malayalam' ? 'പരിദിവസം' : 'Day After', temp: '29°C', icon: Cloud },
    ],
  };

  useEffect(() => {
    // Auto-speak weather info when page loads
    const weatherText = language === 'malayalam' 
      ? `കാലാവസ്ഥാ വിവരം. ഇന്ന് കേരളത്തിൽ താപനില ഇരുപത്തിയെട്ട് ഡിഗ്രി സെൽഷ്യസ്. ഭാഗിക മേഘാവൃതം. ആർദ്രത എഴുപത്തിയഞ്ച് ശതമാനം.`
      : `Weather update for Kerala. Current temperature is twenty-eight degrees Celsius. Partly cloudy conditions. Humidity is seventy-five percent.`;
    
    setTimeout(() => speak(weatherText), 500);
  }, [language, speak]);

  const handleSpeak = (text: string) => {
    speak(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
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
              {t('weather')}
            </h1>
            <p className="english-subtext">
              {t('weatherDesc')}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSpeak(language === 'malayalam' 
              ? 'കാലാവസ്ഥാ പേജ്. ഇവിടെ നിങ്ങൾക്ക് നിലവിലെ കാലാവസ്ഥയും പ്രവചനവും കാണാം.'
              : 'Weather page. Here you can see current weather and forecast.'
            )}
            disabled={isPlaying}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Current Weather */}
        <Card className="farmer-card mb-6">
          <div className="text-center mb-6">
            <Cloud className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="malayalam-text text-3xl mb-2">{weatherData.temperature}</h2>
            <p className="malayalam-text text-lg text-muted-foreground mb-2">
              {weatherData.condition}
            </p>
            <p className="english-subtext">{weatherData.location}</p>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
              <Thermometer className="h-6 w-6 text-red-500" />
              <div>
                <p className="malayalam-text">
                  {language === 'malayalam' ? 'താപനില' : 'Temperature'}
                </p>
                <p className="english-subtext">{weatherData.temperature}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
              <Droplets className="h-6 w-6 text-blue-500" />
              <div>
                <p className="malayalam-text">
                  {language === 'malayalam' ? 'ആർദ്രത' : 'Humidity'}
                </p>
                <p className="english-subtext">{weatherData.humidity}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
              <Wind className="h-6 w-6 text-gray-500" />
              <div>
                <p className="malayalam-text">
                  {language === 'malayalam' ? 'കാറ്റിന്റെ വേഗത' : 'Wind Speed'}
                </p>
                <p className="english-subtext">{weatherData.windSpeed}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 3-Day Forecast */}
        <Card className="farmer-card">
          <h3 className="malayalam-text text-xl mb-4">
            {language === 'malayalam' ? 'പ്രവചനം' : 'Forecast'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {weatherData.forecast.map((day, index) => {
              const Icon = day.icon;
              return (
                <div key={index} className="text-center bg-sky-50 p-4 rounded-xl">
                  <p className="malayalam-text mb-2">{day.day}</p>
                  <Icon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="english-subtext">{day.temp}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
};