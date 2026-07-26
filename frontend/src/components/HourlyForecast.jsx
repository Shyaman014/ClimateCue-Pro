import { memo } from 'react';
import { Clock, Droplets } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatTemp } from '../utils/unitUtils';

const HourlyForecast = memo(function HourlyForecast({ hourly }) {
  const { tempUnit, t } = useSettings();
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="glass-panel-3d animate-fade-in" style={{ padding: '1.5rem', overflow: 'hidden' }} role="region" aria-label={t('hourlyForecast')}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <Clock size={18} color="var(--accent-color)" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>{t('hourlyForecast')}</h3>
      </div>

      <div style={{
        display: 'flex',
        gap: '1rem',
        overflowX: 'auto',
        paddingBottom: '0.75rem',
        scrollSnapType: 'x mandatory'
      }}
      tabIndex={0}
      aria-label="Hourly weather scrollable list"
      >
        {hourly.map((item, idx) => (
          <div
            key={idx}
            className="glass-card card-elevation-hover"
            style={{
              minWidth: '130px',
              flex: '0 0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              padding: '1.25rem 0.75rem',
              scrollSnapAlign: 'start',
              background: idx === 0 ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.22), rgba(56, 189, 248, 0.08))' : 'rgba(15, 23, 42, 0.45)',
              borderColor: idx === 0 ? 'rgba(56, 189, 248, 0.5)' : 'var(--glass-border)',
              borderRadius: '20px',
              boxShadow: idx === 0 ? '0 10px 25px -5px rgba(56, 189, 248, 0.25)' : 'none'
            }}
            tabIndex={0}
            aria-label={`${idx === 0 ? 'Now' : item.timeFormatted}: ${formatTemp(item.temperature, tempUnit)}, ${item.condition}, rain chance ${item.rainProbability}%`}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: idx === 0 ? 700 : 600, color: idx === 0 ? 'var(--text-accent)' : 'var(--text-secondary)' }}>
              {idx === 0 ? 'Now' : item.timeFormatted}
            </div>

            {/* Tiny 3D Weather Illustration Badge Container */}
            <div className="floating-badge" style={{
              width: '60px',
              height: '60px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.02))',
              boxShadow: '0 6px 15px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              margin: '0.2rem 0'
            }}>
              <img
                src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                alt={item.condition}
                style={{ width: '52px', height: '52px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.35))' }}
              />
            </div>

            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatTemp(item.temperature, tempUnit, false)}&deg;
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: item.rainProbability > 30 ? '#38bdf8' : 'var(--text-secondary)',
              background: item.rainProbability > 30 ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              padding: '0.25rem 0.6rem',
              borderRadius: '20px',
              border: item.rainProbability > 30 ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid transparent'
            }}>
              <Droplets size={12} />
              <span>{item.rainProbability}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default HourlyForecast;
