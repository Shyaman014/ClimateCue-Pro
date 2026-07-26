import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Sun, Moon, Laptop, History, Star, X, CloudRain, Settings as SettingsIcon } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Navbar({ 
  onSearch, 
  onLocationRequest, 
  favorites, 
  searchHistory, 
  onSelectCity, 
  onClearHistory 
}) {
  const { theme, setTheme, openSettings, t } = useSettings();
  const [searchInput, setSearchInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setShowDropdown(false);
    }
  };

  const handleSelect = (cityName) => {
    setSearchInput(cityName);
    onSelectCity(cityName);
    setShowDropdown(false);
  };

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-5 h-5 text-amber-500" />;
    if (theme === 'dark') return <Moon className="w-5 h-5 text-sky-400" />;
    return <Laptop className="w-5 h-5 text-slate-400" />;
  };

  return (
    <nav className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', position: 'sticky', top: '1rem', zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => onSelectCity('London')}>
          <div style={{ 
            background: 'var(--accent-gradient)', 
            padding: '0.6rem', 
            borderRadius: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)'
          }}>
            <CloudRain size={24} color="white" className="animate-float" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
              Climate<span style={{ color: 'var(--accent-color)' }}>Cue</span>
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>PRO WEATHER PLATFORM</span>
          </div>
        </div>

        {/* Autocomplete & Search Bar */}
        <div style={{ flex: '1 1 320px', maxWidth: '500px', position: 'relative' }} ref={dropdownRef}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', position: 'relative' }}>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder={t('searchPlaceholder')}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.8rem',
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid var(--glass-border)',
                borderRadius: '14px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} 
            />
            {searchInput && (
              <button 
                type="button" 
                onClick={() => setSearchInput('')}
                style={{ position: 'absolute', right: '4.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
            <button
              type="submit"
              className="btn-primary"
              style={{
                position: 'absolute',
                right: '0.3rem',
                top: '0.3rem',
                bottom: '0.3rem',
                padding: '0 1rem',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Search
            </button>
          </form>

          {/* Dropdown for Recent Searches & Favorites */}
          {showDropdown && (searchHistory.length > 0 || favorites.length > 0) && (
            <div className="glass-panel" style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              left: 0,
              right: 0,
              padding: '1rem',
              maxHeight: '380px',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              zIndex: 100,
              borderRadius: '16px'
            }}>
              {favorites.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <Star size={12} color="#f59e0b" fill="#f59e0b" /> Favorite Cities
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {favorites.map((fav, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelect(fav.cityName)}
                        className="glass-button"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: '8px' }}
                      >
                        {fav.cityName}, {fav.country}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchHistory.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <History size={12} /> Recent Searches
                    </span>
                    <button 
                      onClick={onClearHistory} 
                      style={{ background: 'none', border: 'none', color: 'var(--danger-color)', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Clear All
                    </button>
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {searchHistory.map((item, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => handleSelect(item.cityName)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.6rem 0.8rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            transition: 'background 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <History size={14} color="var(--text-secondary)" />
                          <span style={{ fontWeight: 500 }}>{item.cityName}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons: Location, Theme & Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onLocationRequest}
            className="glass-button"
            style={{ borderColor: 'rgba(56, 189, 248, 0.3)', color: 'var(--text-accent)' }}
            title={t('currentLocation')}
            aria-label={t('currentLocation')}
          >
            <MapPin size={18} />
            <span style={{ display: 'inline-block' }}>{t('currentLocation')}</span>
          </button>

          <button
            onClick={cycleTheme}
            className="glass-button"
            style={{ padding: '0.6rem', borderRadius: '12px' }}
            title={`Theme: ${theme.toUpperCase()} (Click to toggle)`}
            aria-label={`Theme: ${theme}`}
          >
            {getThemeIcon()}
          </button>

          <button
            onClick={openSettings}
            className="glass-button"
            style={{ padding: '0.6rem', borderRadius: '12px', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b' }}
            title={t('settings')}
            aria-label={t('settings')}
          >
            <SettingsIcon size={18} />
          </button>
        </div>

      </div>
    </nav>
  );
}
