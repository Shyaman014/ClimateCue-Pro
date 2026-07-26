import { memo } from 'react';
import { Calendar, Droplets } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatTemp } from '../utils/unitUtils';

const SevenDayForecast = memo(function SevenDayForecast({ daily }) {
  const { tempUnit, t } = useSettings();
  if (!daily || daily.length === 0) return null;

  const minOverall = Math.min(...daily.map(d => d.tempMin));
  const maxOverall = Math.max(...daily.map(d => d.tempMax));
  const rangeOverall = Math.max(1, maxOverall - minOverall);

  return (
    <div className="glass-panel-3d animate-fade-in" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }} role="region" aria-label={t('sevenDayForecast')}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <Calendar size={18} color="var(--accent-color)" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>{t('sevenDayForecast')}</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'space-between' }} role="list">
        {daily.map((day, idx) => {
          const leftPercent = ((day.tempMin - minOverall) / rangeOverall) * 100;
          const widthPercent = Math.max(15, ((day.tempMax - day.tempMin) / rangeOverall) * 100);

          return (
            <div
              key={idx}
              role="listitem"
              className="card-elevation-hover"
              tabIndex={0}
              aria-label={`${day.dayName}: ${day.description}, low ${formatTemp(day.tempMin, tempUnit)}, high ${formatTemp(day.tempMax, tempUnit)}, rain chance ${day.rainProbability}%`}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 140px',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                background: idx === 0 ? 'linear-gradient(90deg, rgba(56, 189, 248, 0.18), rgba(56, 189, 248, 0.05))' : 'rgba(15, 23, 42, 0.45)',
                borderRadius: '16px',
                border: idx === 0 ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: idx === 0 ? '0 8px 20px -5px rgba(56, 189, 248, 0.2)' : 'none'
              }}
            >
              {/* Day Name & Rain Chance */}
              <div>
                <div style={{ fontWeight: idx === 0 ? 800 : 600, color: idx === 0 ? 'var(--text-accent)' : 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {day.dayName}
                </div>
                {day.rainProbability > 15 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700, marginTop: '2px' }}>
                    <Droplets size={12} /> {day.rainProbability}%
                  </div>
                )}
              </div>

              {/* Tiny 3D Illustration Badge & Description */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="floating-badge" style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.02))',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                    alt={day.condition}
                    style={{ width: '36px', height: '36px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}
                  />
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {day.description}
                </span>
              </div>

              {/* High / Low Temperature Range Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, width: '35px', textAlign: 'right' }}>
                  {formatTemp(day.tempMin, tempUnit, false)}&deg;
                </span>

                <div style={{
                  position: 'relative',
                  flex: 1,
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  minWidth: '50px'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #38bdf8, #f59e0b)',
                    borderRadius: '3px',
                    boxShadow: '0 0 8px rgba(56, 189, 248, 0.4)'
                  }} />
                </div>

                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 800, width: '35px', textAlign: 'right' }}>
                  {formatTemp(day.tempMax, tempUnit, false)}&deg;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default SevenDayForecast;
