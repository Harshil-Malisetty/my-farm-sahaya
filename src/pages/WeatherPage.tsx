import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useWeather } from '@/hooks/useWeather';
import { ArrowLeft, Thermometer, Droplets, Wind, Volume2, MapPin, RefreshCw, Eye, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WeatherPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { speak, isPlaying } = useTextToSpeech();
  const { 
    weatherData, 
    loading, 
    error, 
    districts, 
    selectedDistrict, 
    selectDistrict, 
    refreshWeather,
    getCurrentLocation 
  } = useWeather();

  useEffect(() => {
    // Auto-speak weather info when page loads
    if (weatherData?.current) {
      const weatherText = language === 'malayalam' 
        ? `കാലാവസ്ഥാ വിവരം ${weatherData.location}. ഇന്ന് താപനില ${weatherData.current.temperature} ഡിഗ്രി സെൽഷ്യസ്. ${weatherData.current.condition}. ആർദ്രത ${weatherData.current.humidity} ശതമാനം. കൃഷി ഉപദേശം: ${weatherData.farmingAdvice}`
        : `Weather update for ${weatherData.location}. Current temperature is ${weatherData.current.temperature} degrees Celsius. ${weatherData.current.condition}. Humidity is ${weatherData.current.humidity} percent. Farming advice: ${weatherData.farmingAdvice}`;
      
      setTimeout(() => speak(weatherText), 500);
    }
  }, [language, speak, weatherData]);

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
        {/* Location Selection */}
        <Card className="farmer-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="malayalam-text text-lg font-semibold">
                {language === 'malayalam' ? 'സ്ഥലം' : 'Location'}
              </h3>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={getCurrentLocation}
                disabled={loading}
              >
                <MapPin className="h-4 w-4 mr-1" />
                {language === 'malayalam' ? 'GPS' : 'GPS'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshWeather}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          <Select value={selectedDistrict} onValueChange={selectDistrict}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {loading && (
          <Card className="farmer-card mb-6">
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="malayalam-text">
                {language === 'malayalam' ? 'കാലാവസ്ഥാ വിവരങ്ങൾ ലോഡ് ചെയ്യുന്നു...' : 'Loading weather data...'}
              </p>
            </div>
          </Card>
        )}

        {error && (
          <Card className="farmer-card mb-6 border-red-200 bg-red-50">
            <div className="text-center py-8">
              <p className="text-red-600 malayalam-text">
                {language === 'malayalam' ? 'കാലാവസ്ഥാ വിവരങ്ങൾ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല' : 'Failed to load weather data'}
              </p>
              <p className="text-sm text-red-500 mt-2">{error}</p>
            </div>
          </Card>
        )}

        {weatherData && !loading && (
          <>
            {/* Current Weather */}
            <Card className="farmer-card mb-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{weatherData.current.icon}</div>
                <h2 className="malayalam-text text-4xl mb-2">{weatherData.current.temperature}°C</h2>
                <p className="malayalam-text text-lg text-muted-foreground mb-2">
                  {weatherData.current.condition}
                </p>
                <p className="english-subtext font-semibold">{weatherData.location}</p>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="flex flex-col items-center gap-2 bg-blue-50 p-4 rounded-xl">
                  <Thermometer className="h-6 w-6 text-red-500" />
                  <p className="malayalam-text text-sm">
                    {language === 'malayalam' ? 'താപനില' : 'Temperature'}
                  </p>
                  <p className="english-subtext font-bold">{weatherData.current.temperature}°C</p>
                </div>

                <div className="flex flex-col items-center gap-2 bg-blue-50 p-4 rounded-xl">
                  <Droplets className="h-6 w-6 text-blue-500" />
                  <p className="malayalam-text text-sm">
                    {language === 'malayalam' ? 'ആർദ്രത' : 'Humidity'}
                  </p>
                  <p className="english-subtext font-bold">{weatherData.current.humidity}%</p>
                </div>

                <div className="flex flex-col items-center gap-2 bg-blue-50 p-4 rounded-xl">
                  <Wind className="h-6 w-6 text-gray-500" />
                  <p className="malayalam-text text-sm">
                    {language === 'malayalam' ? 'കാറ്റ്' : 'Wind'}
                  </p>
                  <p className="english-subtext font-bold">{weatherData.current.windSpeed} km/h</p>
                </div>

                <div className="flex flex-col items-center gap-2 bg-blue-50 p-4 rounded-xl">
                  <Droplets className="h-6 w-6 text-indigo-500" />
                  <p className="malayalam-text text-sm">
                    {language === 'malayalam' ? 'മഴ' : 'Rain'}
                  </p>
                  <p className="english-subtext font-bold">{weatherData.current.rainfall} mm</p>
                </div>

                <div className="flex flex-col items-center gap-2 bg-blue-50 p-4 rounded-xl">
                  <Eye className="h-6 w-6 text-green-500" />
                  <p className="malayalam-text text-sm">
                    {language === 'malayalam' ? 'ദൃശ്യത' : 'Visibility'}
                  </p>
                  <p className="english-subtext font-bold">{weatherData.current.visibility} km</p>
                </div>
              </div>
            </Card>

            {/* Farming Advice */}
            <Card className="farmer-card mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="malayalam-text text-lg font-semibold text-green-800 mb-2">
                    {language === 'malayalam' ? 'കൃഷി ഉപദേശം' : 'Farming Advice'}
                  </h3>
                  <p className="malayalam-text text-green-700">
                    {weatherData.farmingAdvice}
                  </p>
                </div>
              </div>
            </Card>

            {/* 4-Day Forecast */}
            <Card className="farmer-card">
              <h3 className="malayalam-text text-xl mb-4">
                {language === 'malayalam' ? '4 ദിവസത്തെ പ്രവചനം' : '4-Day Forecast'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {weatherData.forecast.map((day, index) => {
                  const date = new Date(day.date);
                  const dayName = index === 0 
                    ? (language === 'malayalam' ? 'ഇന്ന്' : 'Today')
                    : date.toLocaleDateString('en', { weekday: 'short' });
                  
                  return (
                    <div key={index} className="text-center bg-sky-50 p-4 rounded-xl">
                      <p className="malayalam-text font-medium mb-2">{dayName}</p>
                      <div className="text-3xl mb-3">{day.icon}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="english-subtext font-bold">{day.maxTemp}°</span>
                          <span className="english-subtext">{day.minTemp}°</span>
                        </div>
                        {day.rainfall > 0 && (
                          <p className="text-xs text-blue-600">
                            🌧️ {day.rainfall}mm
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};