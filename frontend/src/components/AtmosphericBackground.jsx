import { memo } from 'react';
import { useSettings } from '../context/SettingsContext';

// Generate static array of particle properties to avoid re-computations and ensure 60 FPS
const rainParticles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 5.5) + (Math.random() * 3)}%`,
  delay: `${(i * 0.35) % 2.5}s`,
  duration: `${0.9 + (i % 3) * 0.2}s`,
  opacity: 0.3 + (i % 4) * 0.1
}));

const snowParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 5) + (Math.random() * 2)}%`,
  delay: `${(i * 0.4) % 4}s`,
  duration: `${3.5 + (i % 4) * 0.8}s`,
  size: 4 + (i % 3) * 3,
  opacity: 0.4 + (i % 3) * 0.2
}));

const cloudWisps = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  top: `${12 + i * 18}%`,
  left: `${i * 22}%`,
  width: `${260 + i * 60}px`,
  height: `${140 + i * 30}px`,
  delay: `${i * 2}s`,
  duration: `${18 + i * 4}s`,
  opacity: 0.12 + (i % 2) * 0.05
}));

const sunMotes = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  top: `${15 + (i * 7)}%`,
  left: `${10 + (i * 7.5)}%`,
  size: 6 + (i % 4) * 4,
  delay: `${(i * 0.5) % 3}s`,
  duration: `${4 + (i % 3)}s`,
  opacity: 0.25 + (i % 3) * 0.15
}));

const AtmosphericBackground = memo(function AtmosphericBackground({ weatherData }) {
  const { animations } = useSettings();

  if (animations === 'disabled') return null;

  const cond = weatherData?.condition?.toLowerCase() || '';
  const now = Date.now() / 1000;
  const isNight = weatherData?.sunrise && weatherData?.sunset && (now < weatherData.sunrise || now > weatherData.sunset);

  let category = 'clear';
  if (cond.includes('rain') || cond.includes('drizzle')) category = 'rain';
  else if (cond.includes('snow') || cond.includes('ice')) category = 'snow';
  else if (cond.includes('cloud') || cond.includes('overcast') || cond.includes('fog') || cond.includes('haze')) category = 'clouds';
  else if (isNight) category = 'night';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0
    }}>
      {/* 1. RAIN PARTICLES: Diagonal GPU-accelerated water streaks */}
      {category === 'rain' && rainParticles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-50px',
            left: p.left,
            width: '2px',
            height: '35px',
            background: 'linear-gradient(180deg, transparent, rgba(56, 189, 248, 0.7))',
            opacity: p.opacity,
            transform: 'rotate(-15deg)',
            animation: `rainFall ${p.duration} linear infinite`,
            animationDelay: p.delay,
            willChange: 'transform'
          }}
        />
      ))}

      {/* 2. SNOW PARTICLES: Soft drifting snowflakes */}
      {category === 'snow' && snowParticles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ffffff 40%, rgba(224, 242, 254, 0.4) 80%, transparent)',
            opacity: p.opacity,
            animation: `snowDrift ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
            willChange: 'transform'
          }}
        />
      ))}

      {/* 3. CLOUDS: Volumetric layered background cloud strips with depth */}
      {(category === 'clouds' || category === 'rain') && cloudWisps.map(p => (
        <div
          key={p.id}
          className="animate-cloud-drift"
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: p.width,
            height: p.height,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(203, 213, 225, 0.25) 0%, rgba(148, 163, 184, 0.08) 60%, transparent 80%)',
            filter: 'blur(30px)',
            opacity: p.opacity,
            animationDuration: p.duration,
            animationDelay: p.delay,
            willChange: 'transform'
          }}
        />
      ))}

      {/* 4. CLEAR / SUNNY: Gentle floating golden motes */}
      {category === 'clear' && !isNight && sunMotes.map(p => (
        <div
          key={p.id}
          className="animate-float-slow"
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, rgba(245, 158, 11, 0.15) 70%, transparent)',
            opacity: p.opacity,
            animationDuration: p.duration,
            animationDelay: p.delay,
            filter: 'blur(2px)',
            willChange: 'transform'
          }}
        />
      ))}

      {/* Inline Keyframes for 60 FPS GPU-accelerated falling / drifting */}
      <style>{`
        @keyframes rainFall {
          0% { transform: translate3d(0, -50px, 0) rotate(-15deg); }
          100% { transform: translate3d(-120px, 105vh, 0) rotate(-15deg); }
        }
        @keyframes snowDrift {
          0% { transform: translate3d(0, -20px, 0) scale(0.9); }
          50% { transform: translate3d(25px, 50vh, 0) scale(1.1); }
          100% { transform: translate3d(-15px, 105vh, 0) scale(0.9); }
        }
      `}</style>
    </div>
  );
});

export default AtmosphericBackground;
