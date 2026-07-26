import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { translate } from '../utils/unitUtils';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('climatecue_theme') || 'dark');
  const [tempUnit, setTempUnit] = useState(() => localStorage.getItem('climatecue_temp') || 'C');
  const [windUnit, setWindUnit] = useState(() => localStorage.getItem('climatecue_wind') || 'kmh');
  const [language, setLanguage] = useState(() => localStorage.getItem('climatecue_lang') || 'en');
  const [animations, setAnimations] = useState(() => {
    const saved = localStorage.getItem('climatecue_anim');
    return saved !== null ? saved === 'true' : true;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('climatecue_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('climatecue_temp', tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem('climatecue_wind', windUnit);
  }, [windUnit]);

  useEffect(() => {
    localStorage.setItem('climatecue_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('climatecue_anim', animations ? 'true' : 'false');
    if (!animations) {
      document.documentElement.setAttribute('data-animations', 'disabled');
    } else {
      document.documentElement.removeAttribute('data-animations');
    }
  }, [animations]);

  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const applySystem = (e) => {
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      applySystem(mediaQuery);
      mediaQuery.addEventListener('change', applySystem);
      return () => mediaQuery.removeEventListener('change', applySystem);
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Translation helper bound to current language
  const t = useCallback((key) => translate(key, language), [language]);

  const value = useMemo(() => ({
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
    isModalOpen,
    openSettings: () => setIsModalOpen(true),
    closeSettings: () => setIsModalOpen(false),
    t
  }), [theme, tempUnit, windUnit, language, animations, isModalOpen, t]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
