import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  visibility: number;
  condition: string;
  icon: string;
}

interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  rainfall: number;
  condition: string;
  icon: string;
}

interface WeatherResponse {
  current: WeatherData;
  forecast: ForecastDay[];
  location: string;
  farmingAdvice: string;
}

const kerala_districts_coords = {
  "Kochi": { lat: 9.931233, lon: 76.267303 },
  "Thrissur": { lat: 10.530345, lon: 76.214729 },
  "Palakkad": { lat: 10.784703, lon: 76.653145 },
  "Alappuzha": { lat: 9.498067, lon: 76.338844 },
  "Kozhikode": { lat: 11.258753, lon: 75.780411 },
  "Malappuram": { lat: 11.072035, lon: 76.074005 },
  "Kannur": { lat: 11.874477, lon: 75.370369 },
  "Kollam": { lat: 8.893212, lon: 76.614143 },
  "Pathanamthitta": { lat: 9.2648, lon: 76.7870 },
  "Idukki": { lat: 9.8790, lon: 77.1473 }
};

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Kochi');

  const getWeatherIcon = (code: number, isDay: boolean) => {
    if (code === 0) return isDay ? '☀️' : '🌙';
    if (code <= 3) return '☁️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '🌨️';
    if (code >= 80 && code <= 99) return '⛈️';
    return '☁️';
  };

  const getWeatherCondition = (code: number) => {
    if (code === 0) return 'Clear sky';
    if (code <= 3) return 'Partly cloudy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 99) return 'Thunderstorm';
    return 'Cloudy';
  };

  const generateFarmingAdvice = (current: any, forecast: any[]) => {
    const todayRain = forecast[0]?.precipitation_sum || 0;
    const tomorrowRain = forecast[1]?.precipitation_sum || 0;
    const windSpeed = current.wind_speed_10m || 0;

    if (todayRain > 5) {
      return "Avoid spraying pesticides today due to expected rainfall.";
    }
    if (tomorrowRain > 5) {
      return "Consider completing outdoor activities today before tomorrow's rain.";
    }
    if (windSpeed > 15) {
      return "Delay spraying fertilizers or pesticides due to high wind speeds.";
    }
    if (current.weather_code === 0) {
      return "Good time for transplanting rice seedlings in sunny conditions.";
    }
    return "Monitor weather conditions for optimal farming activities.";
  };

  const fetchWeatherData = async (lat: number, lon: number, locationName: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,visibility,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();

      const current: WeatherData = {
        temperature: Math.round(data.current.temperature_2m),
        humidity: Math.round(data.current.relative_humidity_2m),
        windSpeed: Math.round(data.current.wind_speed_10m * 3.6), // Convert m/s to km/h
        rainfall: 0, // Current rainfall not available in free tier
        visibility: Math.round(data.current.visibility / 1000), // Convert m to km
        condition: getWeatherCondition(data.current.weather_code),
        icon: getWeatherIcon(data.current.weather_code, data.current.is_day)
      };

      const forecast: ForecastDay[] = data.daily.time.slice(0, 4).map((date: string, index: number) => ({
        date,
        maxTemp: Math.round(data.daily.temperature_2m_max[index]),
        minTemp: Math.round(data.daily.temperature_2m_min[index]),
        rainfall: Math.round(data.daily.precipitation_sum[index] || 0),
        condition: getWeatherCondition(data.daily.weather_code[index]),
        icon: getWeatherIcon(data.daily.weather_code[index], true)
      }));

      const farmingAdvice = generateFarmingAdvice(data.current, data.daily);

      setWeatherData({
        current,
        forecast,
        location: locationName,
        farmingAdvice
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          fetchWeatherData(latitude, longitude, 'Current Location');
        },
        () => {
          // Fallback to Kochi if geolocation fails
          const kochi = kerala_districts_coords.Kochi;
          setLocation(kochi);
          fetchWeatherData(kochi.lat, kochi.lon, 'Kochi');
        }
      );
    } else {
      // Fallback to Kochi if geolocation not supported
      const kochi = kerala_districts_coords.Kochi;
      setLocation(kochi);
      fetchWeatherData(kochi.lat, kochi.lon, 'Kochi');
    }
  };

  const selectDistrict = (district: string) => {
    const coords = kerala_districts_coords[district as keyof typeof kerala_districts_coords];
    if (coords) {
      setSelectedDistrict(district);
      setLocation(coords);
      fetchWeatherData(coords.lat, coords.lon, district);
    }
  };

  const refreshWeather = () => {
    if (location) {
      const locationName = selectedDistrict || 'Current Location';
      fetchWeatherData(location.lat, location.lon, locationName);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    weatherData,
    loading,
    error,
    districts: Object.keys(kerala_districts_coords),
    selectedDistrict,
    selectDistrict,
    refreshWeather,
    getCurrentLocation
  };
};