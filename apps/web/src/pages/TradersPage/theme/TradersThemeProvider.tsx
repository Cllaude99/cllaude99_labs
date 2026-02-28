import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';

import { tradersLightColors, tradersDarkColors } from './colors';

type ThemeMode = 'light' | 'dark' | 'system';

const TRADERS_THEME_KEY = 'traders-theme-mode';

interface TradersThemeModeContextValue {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
}

const TradersThemeModeContext = createContext<TradersThemeModeContextValue>({
  mode: 'light',
  resolvedMode: 'light',
  setMode: () => {},
});

export const useTradersThemeMode = () => useContext(TradersThemeModeContext);

interface TradersThemeProviderProps {
  children: ReactNode;
}

export const TradersThemeProvider = ({ children }: TradersThemeProviderProps) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(TRADERS_THEME_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    } catch {
      /* SSR/Private Browsing 대응 */
    }
    return 'light';
  });
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('light');

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(TRADERS_THEME_KEY, newMode);
    } catch {
      /* SSR/Private Browsing 대응 */
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const resolvedMode = mode === 'system' ? systemPreference : mode;
  const resolvedColors = resolvedMode === 'dark' ? tradersDarkColors : tradersLightColors;

  return (
    <TradersThemeModeContext.Provider value={{ mode, resolvedMode, setMode }}>
      <EmotionThemeProvider theme={(base) => ({ ...base, traders: resolvedColors })}>
        {children}
      </EmotionThemeProvider>
    </TradersThemeModeContext.Provider>
  );
};
