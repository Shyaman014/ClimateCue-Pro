import { memo } from 'react';
import { Sunrise, Sunset, Sun, Moon, Sparkles, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const SolarCycleCard = memo(function SolarCycleCard({ weather }) {
  const { t } = useSettings();
  if (!weather) return null;

  const now = Date.now() / 1000;

  const formatTime = (unixTimestamp) => {
    if (!unixTimestamp) return '--:--';
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateSolarProgress = () => {
    if (!weather.sunrise || !weather.sunset) return 50;
    const totalDay = weather.sunset - weather.sunrise;
    const elapsed = now - weather.sunrise;
    const pct = Math.max(0, Math.min(100, (elapsed / totalDay) * 100));
    return Math.round(pct);
  };

  const getMoonPhase = () => {
    const daysSinceNewMoon = Math.floor((Date.now() / 86400000) % 29.53);
    if (daysSinceNewMoon === 0) return { name: 'New Moon', icon: '🌑', illumination: '0%' };
    if (daysSinceNewMoon < 7) return { name: 'Waxing Crescent', icon: '🌒', illumination: '25%' };
    if (daysSinceNewMoon === 7) return { name: 'First Quarter', icon: '🌓', illumination: '50%' };
    if (daysSinceNewMoon < 15) return { name: 'Waxing Gibbous', icon: '🌔', illumination: '75%' };
    if (daysSinceNewMoon === 15) return { name: 'Full Moon', icon: '🌕', illumination: '100%' };
    if (daysSinceNewMoon < 22) return { name: 'Waning Gibbous', icon: '🌖', illumination: '75%' };
    if (daysSinceNewMoon === 22) return { name: 'Last Quarter', icon: '🌗', illumination: '50%' };
    return { name: 'Waning Crescent', icon: '🌘', illumination: '25%' };
  };

  const solarProgress = calculateSolarProgress();
  const moon = getMoonPhase();
  const isNight = weather.sunrise && weather.sunset && (now < weather.sunrise || now > weather.sunset);

  return (
    <div className="glass-panel-3d card-elevation-hover animate-fade-in" style={{ padding: '1.75rem', height: '100%', display: 'flex', flexDirection: 'column', justify: 'space-between', borderLeft: '5px solid #f97316' }} role="region" aria-label="Sunrise and Sunset Solar Cycle">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sunrise size={22} color="#f97316" />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Sunrise &amp; Sunset
            </h3>
          </div>
          <span style={{ 
            background: isNight ? 'rgba(129, 140, 248, 0.15)' : 'rgba(251, 191, 36, 0.15)', 
            color: isNight ? '#818cf8' : '#fbbf24', 
            padding: '0.35rem 0.85rem', 
            borderRadius: '24px', 
            fontSize: '0.8rem', 
            fontWeight: 800,
            border: isNight ? '1px solid rgba(129, 140, 248, 0.4)' : '1px solid rgba(251, 191, 36, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            {isNight ? <Moon size={14} /> : <Sun size={14} />}
            <span>{isNight ? 'Night Time' : 'Daylight Active'}</span>
          </span>
        </div>

        {/* Solar Progress Bar & Status */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
            <span>Daylight Arc Progress</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{solarProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
            <div style={{
              width: `${solarProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f97316)',
              borderRadius: '4px',
              boxShadow: '0 0 12px rgba(251, 191, 36, 0.6)',
              transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
          </div>
        </div>

        {/* Sunrise / Sunset Times Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem', background: 'rgba(249, 115, 22, 0.15)', borderRadius: '14px', color: '#f97316' }}>
              <Sunrise size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sunrise</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatTime(weather.sunrise)}</div>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '14px', color: '#ef4444' }}>
              <Sunset size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sunset</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatTime(weather.sunset)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lunar Phase Footer */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '1.1rem',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.75rem' }}>{moon.icon}</span>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Lunar Cycle Phase
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>
              {moon.name}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Illumination <strong style={{ color: '#60a5fa' }}>{moon.illumination}</strong>
        </div>
      </div>
    </div>
  );
});

export default SolarCycleCard;
