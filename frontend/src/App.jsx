import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import axiosClient from './api/axiosClient';
import './index.css';

import { SettingsProvider } from './context/SettingsContext';
import SettingsModal from './components/SettingsModal';
import Navbar from './components/Navbar';
import FavoritesBar from './components/FavoritesBar';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import HourlyForecast from './components/HourlyForecast';
import SevenDayForecast from './components/SevenDayForecast';
import AdvancedMetricsGrid from './components/AdvancedMetricsGrid';
import SkeletonLoader from './components/SkeletonLoader';
import ErrorDisplay from './components/ErrorDisplay';
import { WifiOff, Sparkles } from 'lucide-react';

import AtmosphericBackground from './components/AtmosphericBackground';
import AirQualityCard from './components/AirQualityCard';
import SolarCycleCard from './components/SolarCycleCard';
const WeatherCharts = lazy(() => import('./components/WeatherCharts'));
const WeatherMap = lazy(() => import('./components/WeatherMap'));

// API URLs are handled by axiosClient internally

function WeatherAppContent() {
  const [city, setCity] = useState('London');
  const [coords, setCoords] = useState(null); // { lat, lon } when using location
  
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [aqiData, setAqiData] = useState(null);
  
  const [favorites, setFavorites] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Show temporary toast notification
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Back online! Reconnected to network 🌐');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('You are offline. Displaying cached data ⚠️');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load preferences (favorites & history) on mount
  const fetchPreferences = useCallback(async () => {
    try {
      // Removed redundant health check to avoid race conditions with fetchAllWeather

      const [favRes, histRes] = await Promise.all([
        axiosClient.get('favorites'),
        axiosClient.get('history')
      ]);
      setFavorites(favRes.data || []);
      setSearchHistory(histRes.data || []);
    } catch (e) {
      // Silently fall back if backend preferences are empty or initializing
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  // Fetch all weather data when city or coordinates change
  const fetchAllWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // API Health Check
      try {
        let healthUrl = axiosClient.defaults.baseURL;
        if (healthUrl.includes('/api/weather')) {
          healthUrl = healthUrl.replace(/\/api\/weather\/?$/, '/api/health');
        } else {
          healthUrl = healthUrl.replace(/\/$/, '') + '/api/health';
        }
        await axiosClient.get(healthUrl, { timeout: 5000 });
      } catch (healthErr) {
        throw new Error('Backend is unavailable. It might be starting up from sleep mode.');
      }

      const queryParams = coords 
        ? `lat=${coords.lat}&lon=${coords.lon}` 
        : `city=${encodeURIComponent(city)}`;

      const [currentRes, hourlyRes, dailyRes, aqiRes] = await Promise.all([
        axiosClient.get(`current?${queryParams}`),
        axiosClient.get(`hourly?${queryParams}`),
        axiosClient.get(`forecast?${queryParams}`),
        axiosClient.get(`air-quality?${queryParams}`)
      ]);

      setWeatherData(currentRes.data);
      setHourlyData(hourlyRes.data || []);
      setDailyData(dailyRes.data || []);
      setAqiData(aqiRes.data || null);

      // Refresh history list after a successful search
      fetchPreferences();
    } catch (err) {
      const errMsg = err.userFriendlyMessage || err.message || 'Failed to fetch weather data from server';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [city, coords, fetchPreferences]);

  useEffect(() => {
    fetchAllWeather();
  }, [fetchAllWeather]);

  // Auto-retry polling when Railway backend is asleep/unavailable
  useEffect(() => {
    if (!error) return;
    
    const errLower = error.toLowerCase();
    const isServerError = errLower.includes('unavailable') || errLower.includes('network') || errLower.includes('timeout') || errLower.includes('sleep');
    
    if (!isServerError) return;

    const intervalId = setInterval(async () => {
      try {
        let healthUrl = axiosClient.defaults.baseURL;
        if (healthUrl.includes('/api/weather')) {
          healthUrl = healthUrl.replace(/\/api\/weather\/?$/, '/api/health');
        } else {
          healthUrl = healthUrl.replace(/\/$/, '') + '/api/health';
        }
        
        // Use native fetch to bypass axios interceptors for a fast ping
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const res = await fetch(healthUrl, { 
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (res.ok) {
          clearInterval(intervalId);
          console.log('Backend is awake! Resuming app...');
          setError(null);
          fetchAllWeather();
        }
      } catch (e) {
        // Backend still asleep or network down, keep waiting...
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [error, fetchAllWeather]);

  // Dynamic Background style class
  const getBackgroundClass = () => {
    if (!weatherData) return 'app-container bg-sunny';
    const cond = weatherData.condition?.toLowerCase() || '';
    if (cond.includes('rain') || cond.includes('drizzle')) return 'app-container bg-rainy';
    if (cond.includes('thunder') || cond.includes('storm')) return 'app-container bg-storm';
    if (cond.includes('snow') || cond.includes('ice')) return 'app-container bg-snow';
    if (cond.includes('cloud') || cond.includes('overcast')) return 'app-container bg-cloudy';
    if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze')) return 'app-container bg-fog';
    
    // Check if currently night
    const now = Date.now() / 1000;
    if (weatherData.sunrise && weatherData.sunset && (now < weatherData.sunrise || now > weatherData.sunset)) {
      return 'app-container bg-night';
    }
    return 'app-container bg-sunny';
  };

  // Handlers
  const handleSearch = (searchedCity) => {
    setCoords(null);
    setCity(searchedCity);
  };

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      return;
    }
    showToast('Detecting your GPS coordinates... 📍');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
        showToast('Location identified! Fetching local forecast...');
      },
      (error) => {
        setError('Location permission denied. Please enable geolocation in your browser settings or search manually.');
        showToast('Location access denied ❌');
      }
    );
  };

  const isFavorite = weatherData && favorites.some(
    f => f.cityName?.toLowerCase() === weatherData.cityName?.toLowerCase()
  );

  const handleToggleFavorite = async (weather) => {
    try {
      if (isFavorite) {
        await axiosClient.delete(`favorites?cityName=${encodeURIComponent(weather.cityName)}`);
        showToast(`Removed ${weather.cityName} from favorites ⭐`);
      } else {
        const favDto = {
          cityName: weather.cityName,
          country: 'Global',
          latitude: weather.latitude,
          longitude: weather.longitude,
          addedAt: Date.now()
        };
        await axiosClient.post(`favorites`, favDto);
        showToast(`Added ${weather.cityName} to favorites! ⭐`);
      }
      fetchPreferences();
    } catch (e) {
      showToast('Failed to update favorites');
    }
  };

  const handleRemoveFavorite = async (cityName) => {
    try {
      await axiosClient.delete(`favorites?cityName=${encodeURIComponent(cityName)}`);
      showToast(`Removed ${cityName} from favorites`);
      fetchPreferences();
    } catch (e) {
      showToast('Failed to remove location');
    }
  };

  const handleClearHistory = async () => {
    try {
      await axiosClient.delete(`history`);
      setSearchHistory([]);
      showToast('Search history cleared 🗑️');
    } catch (e) {
      showToast('Failed to clear search history');
    }
  };

  return (
    <div className={getBackgroundClass()}>
      <AtmosphericBackground weatherData={weatherData} />
      
      {/* Settings Modal */}
      <SettingsModal />

      {/* Floating Toast Notification Banner */}
      {toast && (
        <div className="glass-panel animate-fade-in" style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          padding: '0.8rem 1.5rem',
          background: 'rgba(14, 165, 233, 0.95)',
          color: 'white',
          fontWeight: 600,
          borderRadius: '16px',
          boxShadow: '0 20px 30px rgba(0,0,0,0.5)',
          zIndex: 1000,
          border: '1px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>{toast}</span>
        </div>
      )}

      {/* Offline Alert Banner */}
      {!isOnline && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.9)',
          color: 'white',
          textAlign: 'center',
          padding: '0.6rem 1rem',
          fontWeight: 700,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backdropFilter: 'blur(8px)'
        }}>
          <WifiOff size={18} />
          <span>You are currently offline. Weather updates may be delayed or showing cached values.</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <Navbar
        onSearch={handleSearch}
        onLocationRequest={handleLocationRequest}
        favorites={favorites}
        searchHistory={searchHistory}
        onSelectCity={handleSearch}
        onClearHistory={handleClearHistory}
      />

      <main className="main-content">
        
        {/* Quick Access Favorites Bar */}
        <FavoritesBar
          favorites={favorites}
          onSelectCity={handleSearch}
          onRemoveFavorite={handleRemoveFavorite}
        />

        {/* Loading State: Skeleton Shimmer */}
        {loading && <SkeletonLoader />}

        {/* Error State */}
        {!loading && error && (
          <ErrorDisplay
            error={error}
            onRetry={fetchAllWeather}
            onReset={() => {
              setError(null);
              setCoords(null);
              setCity('London');
            }}
          />
        )}

        {/* Main Dashboard Content */}
        {!loading && !error && weatherData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* 1. ONE Premium Hero Weather Card */}
            <CurrentWeatherCard
              weather={weatherData}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              onShowToast={showToast}
            />

            {/* 2. Weather Metrics Grid (6 Core Physical Metrics) */}
            <AdvancedMetricsGrid weather={weatherData} />

            {/* 3. Hourly Forecast (24-Hour Timeline) */}
            <HourlyForecast hourly={hourlyData} />

            {/* 4. 7-Day Forecast */}
            <SevenDayForecast daily={dailyData} />

            {/* 5. Air Quality Section (AQI & Health Recommendations) */}
            <AirQualityCard weather={weatherData} aqi={aqiData} />

            {/* 6. Radar Map (Interactive Vercel/Leaflet Map) */}
            <Suspense fallback={<div className="skeleton" style={{ height: '380px', borderRadius: '24px' }} />}>
              <WeatherMap weather={weatherData} />
            </Suspense>

            {/* 7. Sunrise & Sunset Section (Solar Arc & Moon Phase) */}
            <SolarCycleCard weather={weatherData} />

            {/* 8. Weather Details & Interactive Trend Charts */}
            <Suspense fallback={<div className="skeleton" style={{ height: '350px', borderRadius: '24px' }} />}>
              <WeatherCharts hourly={hourlyData} />
            </Suspense>
            
          </div>
        )}

      </main>
      
      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem 1rem 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <Sparkles size={16} color="#38bdf8" /> ClimateCue Premium 3D Weather Platform &bull; Built with Java Spring Boot &amp; React Vite
        </p>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <WeatherAppContent />
    </SettingsProvider>
  );
}
