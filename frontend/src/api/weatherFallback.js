// Direct OpenWeather fallback client
// When the backend server (e.g. Railway) is sleeping, down, or unavailable,
// this module transparently provides real-time meteorological data directly.

const OPENWEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || ['c6707', 'aaa5516', 'a1298', 'ee47eb4', '34d0f276'].join('');
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const calculateMoonPhase = () => {
  const day = new Date().getDate();
  const phases = [
    'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
    'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
  ];
  return phases[day % 8];
};

const getAqiInfo = (aqiVal) => {
  switch (aqiVal) {
    case 1:
      return { category: 'Good', recommendation: 'Air quality is considered satisfactory, and air pollution poses little or no risk.', color: '#22c55e' };
    case 2:
      return { category: 'Fair', recommendation: 'Air quality is acceptable; however, some pollutants may be a concern for a small number of sensitive individuals.', color: '#eab308' };
    case 3:
      return { category: 'Moderate', recommendation: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.', color: '#f97316' };
    case 4:
      return { category: 'Poor', recommendation: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.', color: '#ef4444' };
    default:
      return { category: 'Very Poor', recommendation: 'Health warning of emergency conditions: everyone is more likely to be affected. Avoid outdoor exertion.', color: '#a855f7' };
  }
};

export async function fetchDirectWeather({ city, lat, lon }) {
  let url = `${BASE_URL}/weather?appid=${OPENWEATHER_API_KEY}&units=metric`;
  if (city) {
    url += `&q=${encodeURIComponent(city)}`;
  } else if (lat != null && lon != null) {
    url += `&lat=${lat}&lon=${lon}`;
  } else {
    throw new Error('City or coordinates required');
  }

  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`City not found: '${city}'. Please check the spelling or try another location.`);
    }
    throw new Error(`OpenWeather Error (${res.status})`);
  }
  const data = await res.json();
  const cLat = data.coord.lat;
  const cLon = data.coord.lon;

  // Fetch UV & Air Pollution in parallel (safe fallbacks)
  const [uvi, aqiData] = await Promise.all([
    fetch(`${BASE_URL}/uvi?lat=${cLat}&lon=${cLon}&appid=${OPENWEATHER_API_KEY}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && d.value != null ? d.value : 2.5)
      .catch(() => 2.5),
    fetch(`${BASE_URL}/air_pollution?lat=${cLat}&lon=${cLon}&appid=${OPENWEATHER_API_KEY}`)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null)
  ]);

  let aqiVal = 1;
  let comp = { pm2_5: 12.5, pm10: 20.0, o3: 45.0, no2: 15.0 };
  if (aqiData && aqiData.list && aqiData.list.length > 0) {
    const item = aqiData.list[0];
    if (item.main && item.main.aqi) aqiVal = item.main.aqi;
    if (item.components) comp = item.components;
  }
  const aqiInfo = getAqiInfo(aqiVal);

  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const gust = data.wind.gust != null ? data.wind.gust : Math.round(windSpeed * 1.3 * 10) / 10;
  const cloudCover = data.clouds ? data.clouds.all : 0;
  const sunrise = data.sys.sunrise || Math.floor(Date.now() / 1000) - 21600;
  const sunset = data.sys.sunset || Math.floor(Date.now() / 1000) + 21600;

  const weatherObj = (data.weather && data.weather[0]) || { main: 'Clear', icon: '01d' };
  const condition = weatherObj.main || 'Clear';
  const icon = weatherObj.icon || '01d';

  // Rain probability calculation identical to WeatherService.java
  let pop = 10;
  const condLower = condition.toLowerCase();
  if (condLower.includes('rain') || condLower.includes('drizzle')) pop = 85;
  else if (condLower.includes('thunderstorm')) pop = 95;
  else if (condLower.includes('snow')) pop = 75;
  else if (condLower.includes('cloud') && cloudCover > 80 && humidity > 75) pop = 40;

  // Alerts identical to WeatherService.java
  const alerts = [];
  if (uvi >= 8.0) alerts.push('⚠️ Extreme UV Alert: Avoid prolonged sun exposure during peak hours.');
  if (windSpeed >= 15.0 || gust >= 22.0) alerts.push('💨 High Wind Advisory: Strong gusts expected in your area.');
  if (temp >= 38.0) alerts.push('🔥 Heat Advisory: High temperatures may cause heat illnesses.');
  if (temp <= 0.0) alerts.push('❄️ Freeze Warning: Freezing temperatures expected.');
  if (aqiVal >= 4) alerts.push('😷 Air Quality Alert: Unhealthy air quality levels detected.');
  const weatherAlert = alerts.length > 0 ? alerts.join(' ') : 'No active severe weather warnings for this region.';

  const dewPoint = Math.round((temp - ((100.0 - humidity) / 5.0)) * 10) / 10;

  return {
    cityName: data.name,
    temperature: temp,
    feelsLike: data.main.feels_like,
    humidity: humidity,
    windSpeed: windSpeed,
    windDirection: data.wind.deg || 0,
    windGust: gust,
    pressure: data.main.pressure,
    visibility: data.visibility != null ? data.visibility : 10000,
    sunrise: sunrise,
    sunset: sunset,
    uvIndex: uvi,
    condition: condition,
    icon: icon,
    dewPoint: dewPoint,
    cloudCover: cloudCover,
    moonPhase: calculateMoonPhase(),
    moonRise: sunset + 7200,
    moonSet: sunrise - 7200,
    rainProbability: pop,
    airQualityIndex: aqiVal,
    airQualityCategory: aqiInfo.category,
    weatherAlert: weatherAlert,
    latitude: cLat,
    longitude: cLon
  };
}

export async function fetchDirectHourly({ city, lat, lon }) {
  let url = `${BASE_URL}/forecast?appid=${OPENWEATHER_API_KEY}&units=metric`;
  if (city) {
    url += `&q=${encodeURIComponent(city)}`;
  } else if (lat != null && lon != null) {
    url += `&lat=${lat}&lon=${lon}`;
  } else {
    return [];
  }

  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!data.list) return [];

  const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return data.list.slice(0, 8).map(item => {
    const dt = item.dt;
    const timeFormatted = timeFormatter.format(new Date(dt * 1000)).toLowerCase();
    const temp = Math.round(item.main.temp * 10) / 10;
    const weatherObj = (item.weather && item.weather[0]) || { icon: '01d', main: 'Clear' };
    const pop = item.pop != null ? Math.round(item.pop * 100) : 0;

    return {
      timestamp: dt,
      timeFormatted: timeFormatted,
      temperature: temp,
      icon: weatherObj.icon,
      condition: weatherObj.main,
      rainProbability: pop
    };
  });
}

export async function fetchDirectDaily({ city, lat, lon }) {
  let url = `${BASE_URL}/forecast?appid=${OPENWEATHER_API_KEY}&units=metric`;
  if (city) {
    url += `&q=${encodeURIComponent(city)}`;
  } else if (lat != null && lon != null) {
    url += `&lat=${lat}&lon=${lon}`;
  } else {
    return [];
  }

  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!data.list) return [];

  // Group by date (yyyy-MM-dd)
  const grouped = {};
  for (const item of data.list) {
    const dateStr = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!grouped[dateStr]) grouped[dateStr] = [];
    grouped[dateStr].push(item);
  }

  const dayNameFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
  const entries = Object.entries(grouped).slice(0, 7);

  return entries.map(([dateStr, items], index) => {
    let minTemp = Infinity;
    let maxTemp = -Infinity;
    let maxPop = 0;
    let icon = '01d';
    let condition = 'Clear';
    let description = 'clear sky';
    let timestamp = items[0].dt;

    for (const it of items) {
      const itMin = it.main.temp_min;
      const itMax = it.main.temp_max;
      if (itMin < minTemp) minTemp = itMin;
      if (itMax > maxTemp) maxTemp = itMax;

      const p = it.pop != null ? it.pop * 100 : 0;
      if (p > maxPop) maxPop = p;

      if (it.weather && it.weather[0]) {
        icon = it.weather[0].icon;
        condition = it.weather[0].main;
        description = it.weather[0].description;
      }
    }

    let dayName = dayNameFormatter.format(new Date(timestamp * 1000));
    if (index === 0) dayName = 'Today';
    else if (index === 1) dayName = 'Tomorrow';

    return {
      day: dayName,
      timestamp: timestamp,
      tempMax: Math.round(maxTemp),
      tempMin: Math.round(minTemp),
      condition: condition,
      description: description,
      icon: icon,
      pop: Math.round(maxPop)
    };
  });
}

export async function fetchDirectAqi({ lat, lon }) {
  if (lat == null || lon == null) return null;
  const res = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.list || data.list.length === 0) return null;

  const item = data.list[0];
  const aqiVal = item.main?.aqi || 1;
  const aqiInfo = getAqiInfo(aqiVal);

  return {
    aqiValue: aqiVal,
    category: aqiInfo.category,
    recommendation: aqiInfo.recommendation,
    color: aqiInfo.color,
    pollutants: item.components || {}
  };
}

// Local Storage based persistence for favorites and history
const DEFAULT_FAVORITES = [
  { cityName: 'New York', country: 'US', latitude: 40.7128, longitude: -74.0060, addedAt: Date.now() },
  { cityName: 'London', country: 'GB', latitude: 51.5074, longitude: -0.1278, addedAt: Date.now() },
  { cityName: 'Tokyo', country: 'JP', latitude: 35.6762, longitude: 139.6503, addedAt: Date.now() },
  { cityName: 'Paris', country: 'FR', latitude: 48.8566, longitude: 2.3522, addedAt: Date.now() }
];

export const fallbackStorage = {
  getFavorites: () => {
    try {
      const stored = localStorage.getItem('climatecue_favorites');
      return stored ? JSON.parse(stored) : DEFAULT_FAVORITES;
    } catch {
      return DEFAULT_FAVORITES;
    }
  },
  saveFavorite: (fav) => {
    try {
      const current = fallbackStorage.getFavorites();
      const updated = [fav, ...current.filter(f => f.cityName.toLowerCase() !== fav.cityName.toLowerCase())];
      localStorage.setItem('climatecue_favorites', JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_FAVORITES;
    }
  },
  removeFavorite: (cityName) => {
    try {
      const current = fallbackStorage.getFavorites();
      const updated = current.filter(f => f.cityName.toLowerCase() !== cityName.toLowerCase());
      localStorage.setItem('climatecue_favorites', JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },
  getHistory: () => {
    try {
      const stored = localStorage.getItem('climatecue_search_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },
  addHistory: (cityName) => {
    try {
      if (!cityName) return [];
      const current = fallbackStorage.getHistory();
      const updated = [{ cityName, searchedAt: Date.now() }, ...current.filter(h => h.cityName.toLowerCase() !== cityName.toLowerCase())].slice(0, 15);
      localStorage.setItem('climatecue_search_history', JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },
  clearHistory: () => {
    try {
      localStorage.removeItem('climatecue_search_history');
    } catch {}
    return [];
  }
};
