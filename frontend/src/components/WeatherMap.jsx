import { useState, useRef, useEffect, memo } from 'react';
import { Map, Layers, Cloud, Droplets, Thermometer, Wind, ExternalLink } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create a glowing cyan custom HTML marker that doesn't rely on external asset paths
const createCustomMarker = () => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background: var(--accent-color, #38bdf8);
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 15px rgba(56, 189, 248, 0.8), 0 2px 5px rgba(0,0,0,0.5);
      position: relative;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background: #ffffff;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const WeatherMap = memo(function WeatherMap({ weather }) {
  const { t } = useSettings();
  const [activeLayer, setActiveLayer] = useState('precipitation_new');
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const weatherLayerRef = useRef(null);

  const lat = weather?.latitude || 40.7128;
  const lon = weather?.longitude || -74.0060;

  const layers = [
    { id: 'precipitation_new', name: 'Precipitation', icon: <Droplets size={16} />, color: '#38bdf8' },
    { id: 'clouds_new', name: 'Clouds', icon: <Cloud size={16} />, color: '#94a3b8' },
    { id: 'temp_new', name: 'Temperature', icon: <Thermometer size={16} />, color: '#f59e0b' },
    { id: 'wind_new', name: 'Wind Speed', icon: <Wind size={16} />, color: '#818cf8' },
  ];

  // Initialize and update base Leaflet map and English-only label layers
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: 10,
        zoomControl: true,
        attributionControl: true,
      });

      // 1. Base Layer: CartoDB Dark Matter No-Labels (Guarantees zero non-English native script in basemap tiles)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // 2. English Reference Layer 1: Esri World Dark Gray Reference (City, town, road, and neighborhood labels in English)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Labels &copy; Esri, HERE, Garmin, FAO, NOAA, USGS',
        maxZoom: 16,
      }).addTo(map);

      // 3. English Reference Layer 2: Esri World Boundaries and Places (Countries, administrative regions, and landmarks in English)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
      }).addTo(map);

      const marker = L.marker([lat, lon], { icon: createCustomMarker() }).addTo(map);
      markerRef.current = marker;
      mapRef.current = map;

      // Invalidate size after layout stabilization
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 250);
    } else {
      mapRef.current.setView([lat, lon], mapRef.current.getZoom());
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lon]);
      }
    }
  }, [lat, lon]);

  // Handle active weather radar overlay layer switches
  useEffect(() => {
    if (!mapRef.current) return;

    if (weatherLayerRef.current) {
      mapRef.current.removeLayer(weatherLayerRef.current);
      weatherLayerRef.current = null;
    }

    const apiKey = 'c6707aaa5516a1298ee47eb434d0f276';
    const weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${apiKey}`, {
      opacity: 0.65,
      maxZoom: 18,
      attribution: 'Weather data &copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
    });

    weatherLayer.addTo(mapRef.current);
    weatherLayerRef.current = weatherLayer;
  }, [activeLayer]);

  // Clean up Leaflet instance on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        weatherLayerRef.current = null;
      }
    };
  }, []);

  if (!weather) return null;

  return (
    <div className="glass-panel-3d card-elevation-hover animate-fade-in" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Map size={20} color="var(--accent-color)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{t('liveRadar')}</h3>
        </div>

        {/* Layer Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.25)', padding: '0.3rem', borderRadius: '12px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0 0.5rem', fontWeight: 600 }}>
            <Layers size={14} /> Layers:
          </span>
          {layers.map(layer => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className="glass-button"
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                background: activeLayer === layer.id ? `${layer.color}25` : 'transparent',
                borderColor: activeLayer === layer.id ? layer.color : 'transparent',
                color: activeLayer === layer.id ? layer.color : 'var(--text-secondary)'
              }}
            >
              {layer.icon}
              <span>{layer.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '420px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--glass-border)',
        background: '#1e293b'
      }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

        {/* Overlay Legend Card */}
        <div className="glass-panel" style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(15, 23, 42, 0.85)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          fontSize: '0.85rem',
          zIndex: 1000
        }}>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Active Radar Layer</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {layers.find(l => l.id === activeLayer)?.name} Radar
            </div>
          </div>
          <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Coordinates</div>
            <div style={{ fontWeight: 600, color: 'var(--text-accent)' }}>
              {lat.toFixed(2)}&deg;N, {lon.toFixed(2)}&deg;E
            </div>
          </div>
        </div>

        {/* External Link to Full OWM Radar */}
        <a
          href={`https://openweathermap.org/weathermap?basemap=map&cities=true&layer=${activeLayer}&lat=${lat}&lon=${lon}&zoom=10`}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-button"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(15, 23, 42, 0.85)',
            fontSize: '0.8rem',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            zIndex: 1000
          }}
        >
          <span>Open Full Radar in OWM</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
});

export default WeatherMap;
