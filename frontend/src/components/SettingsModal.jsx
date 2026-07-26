import { useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { X, Moon, Sun, Monitor, Thermometer, Wind, Globe, Sparkles, Check } from 'lucide-react';

export default function SettingsModal() {
  const {
    isModalOpen,
    closeSettings,
    theme,
    setTheme,
    tempUnit,
    setTempUnit,
    windUnit,
    setWindUnit,
    language,
    setLanguage,
    animations,
    setAnimations,
    t
  } = useSettings();

  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeSettings();
      }
    };
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeSettings]);

  if (!isModalOpen) return null;

  const themes = [
    { id: 'dark', label: 'Dark', icon: <Moon size={18} /> },
    { id: 'light', label: 'Light', icon: <Sun size={18} /> },
    { id: 'system', label: 'System', icon: <Monitor size={18} /> }
  ];

  const tempUnits = [
    { id: 'C', label: 'Celsius (°C)' },
    { id: 'F', label: 'Fahrenheit (°F)' }
  ];

  const windUnits = [
    { id: 'kmh', label: 'km/h' },
    { id: 'mph', label: 'mph' },
    { id: 'ms', label: 'm/s' },
    { id: 'knots', label: 'knots' }
  ];

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'es', label: 'Español' },
    { id: 'fr', label: 'Français' },
    { id: 'de', label: 'Deutsch' },
    { id: 'ja', label: '日本語' }
  ];

  return (
    <div
      className="settings-backdrop animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSettings();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        ref={modalRef}
        className="glass-panel animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '2rem',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid var(--border-color)',
          background: 'var(--card-bg)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              <Sparkles size={22} />
            </div>
            <h2 id="settings-title" style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              {t('settings')}
            </h2>
          </div>
          <button
            onClick={closeSettings}
            className="icon-btn"
            aria-label={t('close')}
            style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Theme Mode */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Monitor size={16} /> {t('theme')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {themes.map((item) => {
              const active = theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTheme(item.id)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: active ? '2px solid #38bdf8' : '1px solid var(--border-color)',
                    background: active ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-secondary)',
                    color: active ? '#38bdf8' : 'var(--text-primary)',
                    fontWeight: active ? 700 : 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Temperature Unit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Thermometer size={16} /> {t('tempUnit')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {tempUnits.map((item) => {
              const active = tempUnit === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTempUnit(item.id)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: active ? '2px solid #38bdf8' : '1px solid var(--border-color)',
                    background: active ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-secondary)',
                    color: active ? '#38bdf8' : 'var(--text-primary)',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {active && <Check size={16} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wind Speed Unit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wind size={16} /> {t('windUnit')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {windUnits.map((item) => {
              const active = windUnit === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setWindUnit(item.id)}
                  style={{
                    padding: '0.6rem 0.4rem',
                    borderRadius: '12px',
                    border: active ? '2px solid #38bdf8' : '1px solid var(--border-color)',
                    background: active ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-secondary)',
                    color: active ? '#38bdf8' : 'var(--text-primary)',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={16} /> {t('language')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {languages.map((item) => {
              const active = language === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setLanguage(item.id)}
                  style={{
                    padding: '0.6rem 0.5rem',
                    borderRadius: '12px',
                    border: active ? '2px solid #38bdf8' : '1px solid var(--border-color)',
                    background: active ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-secondary)',
                    color: active ? '#38bdf8' : 'var(--text-primary)',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D & UI Animations Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '1rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="#f59e0b" /> {t('animations')}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Enable 3D canvas particles, floating clouds, and smooth transitions
            </div>
          </div>
          <button
            onClick={() => setAnimations(!animations)}
            style={{
              width: '56px',
              height: '30px',
              borderRadius: '999px',
              background: animations ? '#38bdf8' : 'rgba(148, 163, 184, 0.3)',
              position: 'relative',
              cursor: 'pointer',
              border: 'none',
              transition: 'background 0.3s ease',
              padding: '2px'
            }}
            aria-label="Toggle Animations"
            role="switch"
            aria-checked={animations}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: '#ffffff',
                transform: animations ? 'translateX(26px)' : 'translateX(0)',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
          </button>
        </div>

        {/* Footer */}
        <button
          onClick={closeSettings}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '0.9rem',
            borderRadius: '14px',
            fontWeight: 700,
            fontSize: '1rem',
            marginTop: '0.5rem',
            cursor: 'pointer'
          }}
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
}
