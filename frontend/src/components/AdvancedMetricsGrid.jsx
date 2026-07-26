import { memo } from 'react';
import { Sun, Wind, Droplets, Eye, Gauge, Cloud, Activity } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatTemp, formatWind } from '../utils/unitUtils';

const AdvancedMetricsGrid = memo(function AdvancedMetricsGrid({ weather }) {
  const { tempUnit, windUnit, t } = useSettings();
  if (!weather) return null;

  const getUvDescription = (uv) => {
    if (uv <= 2) return { text: 'Low', color: '#10b981', advice: 'No protection needed.' };
    if (uv <= 5) return { text: 'Moderate', color: '#f59e0b', advice: 'Stay in shade near midday.' };
    if (uv <= 7) return { text: 'High', color: '#f97316', advice: 'Wear sunglasses & SPF 30+.' };
    if (uv <= 10) return { text: 'Very High', color: '#ef4444', advice: 'Minimize sun exposure.' };
    return { text: 'Extreme', color: '#a855f7', advice: 'Avoid being outside!' };
  };

  const uvInfo = getUvDescription(weather.uvIndex);
  const formattedDewPoint = formatTemp(weather.dewPoint, tempUnit, false);
  const formattedWind = formatWind(weather.windSpeed, windUnit);
  const formattedGust = formatWind(weather.windGust || weather.windSpeed, windUnit);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} role="region" aria-label={t('advancedMetrics')}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.5rem 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '-0.02em' }}>
        <Activity size={20} color="var(--accent-color)" /> Weather Metrics Grid
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        
        {/* 1. UV Index Card */}
        <div className="glass-panel-3d card-elevation-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sun size={18} color="#fbbf24" /> {t('uvIndex')}
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: uvInfo.color, lineHeight: 1 }}>{weather.uvIndex}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.3rem' }}>{uvInfo.text}</div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem', fontWeight: 500 }}>
            {uvInfo.advice}
          </div>
        </div>

        {/* 2. Humidity & Dew Point Card */}
        <div className="glass-panel-3d card-elevation-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Droplets size={18} color="#38bdf8" /> {t('humidity')} &amp; DEW POINT
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{weather.humidity}%</div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-accent)', marginTop: '0.3rem', fontWeight: 600 }}>
              The dew point is {formattedDewPoint}&deg; right now.
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem', fontWeight: 500 }}>
            {weather.humidity > 65 ? 'High moisture in the air.' : weather.humidity < 30 ? 'Dry atmospheric condition.' : 'Comfortable humidity level.'}
          </div>
        </div>

        {/* 3. Wind Speed & Gust Card */}
        <div className="glass-panel-3d card-elevation-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Wind size={18} color="#818cf8" /> {t('windSpeed')}
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{formattedWind}</div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.3rem', fontWeight: 600 }}>
              Direction: <strong style={{ color: 'var(--text-primary)' }}>{weather.windDirection}</strong>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem', fontWeight: 500 }}>
            Wind gusts up to <strong style={{ color: 'var(--text-primary)' }}>{formattedGust}</strong>
          </div>
        </div>

        {/* 4. Atmospheric Pressure Card */}
        <div className="glass-panel-3d card-elevation-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Gauge size={18} color="#c084fc" /> PRESSURE
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{weather.pressure}</div>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.3rem', fontWeight: 600 }}>hPa (Hectopascals)</div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem', fontWeight: 500 }}>
            {weather.pressure > 1013 ? 'High pressure system &bull; Stable air' : 'Low pressure system &bull; Changing air'}
          </div>
        </div>

        {/* 5. Visibility Card */}
        <div className="glass-panel-3d card-elevation-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Eye size={18} color="#34d399" /> VISIBILITY
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{weather.visibility || 10}</div>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.3rem', fontWeight: 600 }}>km (Kilometers)</div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem', fontWeight: 500 }}>
            {(weather.visibility || 10) >= 10 ? 'Crystal clear atmospheric view.' : 'Slight haze or fog affecting view.'}
          </div>
        </div>

        {/* 6. Cloud Cover Card */}
        <div className="glass-panel-3d card-elevation-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Cloud size={18} color="#94a3b8" /> CLOUD COVER
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{weather.cloudCover || 0}%</div>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.3rem', fontWeight: 600 }}>Sky coverage percentage</div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem', fontWeight: 500 }}>
            {(weather.cloudCover || 0) > 70 ? 'Overcast skies.' : (weather.cloudCover || 0) > 30 ? 'Partly cloudy conditions.' : 'Mostly clear skies.'}
          </div>
        </div>

      </div>
    </div>
  );
});

export default AdvancedMetricsGrid;
