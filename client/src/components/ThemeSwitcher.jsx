import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { useTheme, THEMES } from '../context/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, setTheme, currentThemeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/60 text-slate-200 text-xs font-medium transition-all backdrop-blur-md shadow-sm hover:border-indigo-500/40 group"
        title="Switch Theme"
      >
        <span className="text-sm">{currentThemeConfig.icon}</span>
        <span className="hidden sm:inline font-medium">{currentThemeConfig.name}</span>
        <Palette className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-45 transition-transform duration-300" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel border border-slate-700/80 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1.5 backdrop-blur-xl bg-[#0b0f19]/95">
          <div className="px-3 py-2 border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Theme Themes
            </span>
            <span className="text-[10px] text-slate-500 font-mono">6 Styles</span>
          </div>

          <div className="grid grid-cols-1 gap-1 pt-1 max-h-[340px] overflow-y-auto custom-scrollbar">
            {THEMES.map((t) => {
              const isSelected = t.id === theme;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white shadow-md'
                      : 'hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{t.icon}</span>
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        {t.name}
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        {t.description}
                      </div>
                    </div>
                  </div>

                  {/* Color Swatch Dots */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: t.colors.primary }}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: t.colors.secondary }}
                    />
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 ml-1" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
