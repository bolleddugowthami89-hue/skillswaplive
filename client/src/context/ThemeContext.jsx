import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  {
    id: 'midnight',
    name: 'Midnight Cosmic',
    icon: '🌙',
    description: 'Deep space blue with indigo & purple neon',
    colors: {
      bg: '#0b0f19',
      surface: 'rgba(17, 24, 39, 0.75)',
      primary: '#6366f1',
      secondary: '#a855f7',
      accent: '#ec4899',
      border: 'rgba(255, 255, 255, 0.08)',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
    },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    icon: '⚡',
    description: 'Obsidian dark with electric cyan & hot magenta',
    colors: {
      bg: '#05070e',
      surface: 'rgba(10, 15, 28, 0.8)',
      primary: '#00f0ff',
      secondary: '#ff007f',
      accent: '#ffe600',
      border: 'rgba(0, 240, 255, 0.18)',
      text: '#f8fafc',
      textMuted: '#a5b4fc',
    },
  },
  {
    id: 'emerald',
    name: 'Emerald Matrix',
    icon: '🌲',
    description: 'Deep pine forest with luminous mint & jade',
    colors: {
      bg: '#04130f',
      surface: 'rgba(6, 26, 20, 0.8)',
      primary: '#10b981',
      secondary: '#06b6d4',
      accent: '#34d399',
      border: 'rgba(16, 185, 129, 0.15)',
      text: '#ecfdf5',
      textMuted: '#6ee7b7',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Nebula',
    icon: '🌅',
    description: 'Warm obsidian plum with amber & rose fire',
    colors: {
      bg: '#120815',
      surface: 'rgba(28, 14, 33, 0.8)',
      primary: '#f43f5e',
      secondary: '#f59e0b',
      accent: '#ec4899',
      border: 'rgba(244, 63, 94, 0.18)',
      text: '#fff1f2',
      textMuted: '#fda4af',
    },
  },
  {
    id: 'kage',
    name: 'Kage Crimson',
    icon: '⛩️',
    description: 'ThreeUI Zen aesthetic with crimson & smoked glass',
    colors: {
      bg: '#08080a',
      surface: 'rgba(18, 18, 22, 0.85)',
      primary: '#e0231c',
      secondary: '#f97316',
      accent: '#ffffff',
      border: 'rgba(224, 35, 28, 0.2)',
      text: '#fafafa',
      textMuted: '#a1a1aa',
    },
  },
  {
    id: 'light',
    name: 'Obsidian Light',
    icon: '☀️',
    description: 'Crisp pearl canvas with vibrant indigo accents',
    colors: {
      bg: '#f8fafc',
      surface: 'rgba(255, 255, 255, 0.85)',
      primary: '#4f46e5',
      secondary: '#7c3aed',
      accent: '#db2777',
      border: 'rgba(15, 23, 42, 0.1)',
      text: '#0f172a',
      textMuted: '#64748b',
    },
  },
];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('skillswap_theme') || 'midnight';
  });

  useEffect(() => {
    localStorage.setItem('skillswap_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Set theme class on html/body
    document.documentElement.className = `theme-${theme}`;
  }, [theme]);

  const currentThemeConfig = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES, currentThemeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
