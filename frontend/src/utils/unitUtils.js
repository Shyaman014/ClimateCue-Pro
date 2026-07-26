// Utility functions for unit conversion and internationalization across ClimateCue

export const formatTemp = (celsius, tempUnit = 'C', includeUnit = true) => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
  let val = Number(celsius);
  if (tempUnit === 'F') {
    val = (val * 9) / 5 + 32;
  }
  const rounded = Math.round(val);
  return includeUnit ? `${rounded}°${tempUnit}` : rounded;
};

export const formatWind = (ms, windUnit = 'kmh') => {
  if (ms === null || ms === undefined || isNaN(ms)) return '0 km/h';
  const val = Number(ms);
  switch (windUnit) {
    case 'mph':
      return `${Math.round(val * 2.237)} mph`;
    case 'knots':
      return `${Math.round(val * 1.944)} kts`;
    case 'ms':
      return `${Math.round(val * 10) / 10} m/s`;
    case 'kmh':
    default:
      return `${Math.round(val * 3.6)} km/h`;
  }
};

export const formatDistance = (meters, unitSystem = 'metric') => {
  if (meters === null || meters === undefined || isNaN(meters)) return '--';
  const km = Number(meters) / 1000;
  if (unitSystem === 'imperial') {
    const miles = km * 0.621371;
    return `${Math.round(miles * 10) / 10} mi`;
  }
  return `${Math.round(km * 10) / 10} km`;
};

// UI Translations dictionary
const translations = {
  en: {
    searchPlaceholder: 'Search city or airport...',
    currentLocation: 'Current Location',
    recentSearches: 'Recent Searches',
    savedLocations: 'Saved Locations',
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    wind: 'Wind Speed',
    pressure: 'Pressure',
    visibility: 'Visibility',
    dewPoint: 'Dew Point',
    cloudCover: 'Cloud Cover',
    uvIndex: 'UV Index',
    airQuality: 'Air Quality Index',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    hourlyForecast: '24-Hour Forecast',
    dailyForecast: '7-Day Forecast',
    interactiveTrends: 'Interactive Weather Trends',
    liveRadar: 'Live Radar & Weather Map',
    settings: 'Platform Settings',
    theme: 'Theme Mode',
    tempUnit: 'Temperature Unit',
    windUnit: 'Wind Speed Unit',
    language: 'Language',
    animations: '3D & UI Animations',
    close: 'Close',
    good: 'Good',
    fair: 'Fair',
    moderate: 'Moderate',
    poor: 'Poor',
    veryPoor: 'Very Poor',
    noInternet: 'Offline Mode: Please check your internet connection.',
    retry: 'Try Again'
  },
  es: {
    searchPlaceholder: 'Buscar ciudad o aeropuerto...',
    currentLocation: 'Ubicación actual',
    recentSearches: 'Búsquedas recientes',
    savedLocations: 'Ubicaciones guardadas',
    feelsLike: 'Sensación',
    humidity: 'Humedad',
    wind: 'Viento',
    pressure: 'Presión',
    visibility: 'Visibilidad',
    dewPoint: 'Punto de rocío',
    cloudCover: 'Nubosidad',
    uvIndex: 'Índice UV',
    airQuality: 'Calidad del aire',
    sunrise: 'Amanecer',
    sunset: 'Atardecer',
    hourlyForecast: 'Pronóstico 24 Horas',
    dailyForecast: 'Pronóstico 7 Días',
    interactiveTrends: 'Tendencias interactivas',
    liveRadar: 'Radar en vivo',
    settings: 'Configuración',
    theme: 'Tema',
    tempUnit: 'Unidad de temperatura',
    windUnit: 'Unidad de viento',
    language: 'Idioma',
    animations: 'Animaciones 3D y UI',
    close: 'Cerrar',
    good: 'Bueno',
    fair: 'Aceptable',
    moderate: 'Moderado',
    poor: 'Malo',
    veryPoor: 'Muy malo',
    noInternet: 'Sin conexión: Comprueba tu conexión a internet.',
    retry: 'Reintentar'
  },
  fr: {
    searchPlaceholder: 'Rechercher une ville...',
    currentLocation: 'Position actuelle',
    recentSearches: 'Recherches récentes',
    savedLocations: 'Lieux enregistrés',
    feelsLike: 'Ressenti',
    humidity: 'Humidité',
    wind: 'Vent',
    pressure: 'Pression',
    visibility: 'Visibilité',
    dewPoint: 'Point de rosée',
    cloudCover: 'Couverture nuageuse',
    uvIndex: 'Indice UV',
    airQuality: 'Qualité de l\'air',
    sunrise: 'Lever du soleil',
    sunset: 'Coucher du soleil',
    hourlyForecast: 'Prévisions 24 Heures',
    dailyForecast: 'Prévisions 7 Jours',
    interactiveTrends: 'Tendances Météo',
    liveRadar: 'Radar en direct',
    settings: 'Paramètres',
    theme: 'Thème',
    tempUnit: 'Unité de température',
    windUnit: 'Unité de vent',
    language: 'Langue',
    animations: 'Animations 3D',
    close: 'Fermer',
    good: 'Bon',
    fair: 'Moyen',
    moderate: 'Modéré',
    poor: 'Mauvais',
    veryPoor: 'Très mauvais',
    noInternet: 'Hors ligne : Vérifiez votre connexion internet.',
    retry: 'Réessayer'
  },
  de: {
    searchPlaceholder: 'Stadt oder Flughafen suchen...',
    currentLocation: 'Aktueller Standort',
    recentSearches: 'Letzte Suchanfragen',
    savedLocations: 'Gespeicherte Orte',
    feelsLike: 'Gefühlt wie',
    humidity: 'Luftfeuchtigkeit',
    wind: 'Windgeschwindigkeit',
    pressure: 'Luftdruck',
    visibility: 'Sichtweite',
    dewPoint: 'Taupunkt',
    cloudCover: 'Bewölkung',
    uvIndex: 'UV-Index',
    airQuality: 'Luftqualitätsindex',
    sunrise: 'Sonnenaufgang',
    sunset: 'Sonnenuntergang',
    hourlyForecast: '24-Stunden-Prognose',
    dailyForecast: '7-Tage-Prognose',
    interactiveTrends: 'Interaktive Trends',
    liveRadar: 'Live-Radar & Karte',
    settings: 'Einstellungen',
    theme: 'Design-Modus',
    tempUnit: 'Temperatureinheit',
    windUnit: 'Windeinheit',
    language: 'Sprache',
    animations: '3D- & UI-Animationen',
    close: 'Schließen',
    good: 'Gut',
    fair: 'Akzeptabel',
    moderate: 'Mäßig',
    poor: 'Schlecht',
    veryPoor: 'Sehr schlecht',
    noInternet: 'Offline-Modus: Bitte Internetverbindung prüfen.',
    retry: 'Erneut versuchen'
  },
  ja: {
    searchPlaceholder: '都市や空港を検索...',
    currentLocation: '現在地',
    recentSearches: '最近の検索',
    savedLocations: '保存した場所',
    feelsLike: '体感温度',
    humidity: '湿度',
    wind: '風速',
    pressure: '気圧',
    visibility: '視界',
    dewPoint: '露点',
    cloudCover: '雲量',
    uvIndex: 'UVインデックス',
    airQuality: '空気質指数',
    sunrise: '日の出',
    sunset: '日の入り',
    hourlyForecast: '24時間予報',
    dailyForecast: '7日間予報',
    interactiveTrends: 'インタラクティブな推移',
    liveRadar: 'ライブ気象レーダー',
    settings: '設定',
    theme: 'テーマ',
    tempUnit: '温度単位',
    windUnit: '風速単位',
    language: '言語',
    animations: '3Dアニメーション',
    close: '閉じる',
    good: '良好',
    fair: '普通',
    moderate: '中程度',
    poor: '悪い',
    veryPoor: '非常に悪い',
    noInternet: 'オフライン: インターネット接続を確認してください。',
    retry: '再試行'
  }
};

export const translate = (key, lang = 'en') => {
  const dict = translations[lang] || translations.en;
  return dict[key] || translations.en[key] || key;
};
