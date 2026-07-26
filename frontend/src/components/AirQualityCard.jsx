import { memo } from 'react';
import { ShieldAlert, CheckCircle2, AlertCircle, HeartPulse, Wind } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const AirQualityCard = memo(function AirQualityCard({ weather, aqi }) {
  const { t } = useSettings();
  if (!weather) return null;

  const aqiColor = aqi?.colorIndicator || '#22c55e';
  const aqiCategory = aqi?.category || weather.airQualityCategory || 'Good';
  const aqiRecommendation = aqi?.healthRecommendation || 'Air quality is considered satisfactory, and air pollution poses little or no risk.';
  const aqiIndex = weather.airQualityIndex || 1; // EPA scale 1 to 5

  const getAqiPercent = (index) => {
    return Math.min(100, Math.max(20, (index / 5) * 100));
  };

  return (
    <div className="glass-panel-3d card-elevation-hover animate-fade-in" style={{ padding: '1.75rem', height: '100%', display: 'flex', flexDirection: 'column', justify: 'space-between', borderLeft: `5px solid ${aqiColor}` }} role="region" aria-label={t('aqi')}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldAlert size={22} color={aqiColor} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Air Quality Index
            </h3>
          </div>
          <span style={{ 
            background: `${aqiColor}20`, 
            color: aqiColor, 
            padding: '0.35rem 0.85rem', 
            borderRadius: '24px', 
            fontSize: '0.8rem', 
            fontWeight: 800,
            border: `1px solid ${aqiColor}50`,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {aqiCategory}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '4rem', fontWeight: 900, color: aqiColor, lineHeight: 1, letterSpacing: '-2px' }}>
            {aqiIndex}
          </span>
          <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            / 5 (EPA Scale)
          </span>
        </div>

        {/* Color Coded Severity Bar */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative' }}>
          <div style={{
            width: `${getAqiPercent(aqiIndex)}%`,
            height: '100%',
            background: `linear-gradient(90deg, #22c55e 0%, #eab308 50%, #ef4444 100%)`,
            borderRadius: '4px',
            boxShadow: `0 0 12px ${aqiColor}60`,
            transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        </div>
      </div>

      {/* Health Recommendation Advice Box */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '1.1rem',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        <HeartPulse size={20} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
            Health Recommendation
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
            {aqiRecommendation}
          </p>
        </div>
      </div>
    </div>
  );
});

export default AirQualityCard;
