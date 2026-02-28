import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';

import generateLocalStorageKey from '@/utils/generateLocalStorageKey';

import { tradersLightColors, tradersDarkColors } from './colors';

type ThemeMode = 'light' | 'dark';

const TRADERS_THEME_KEY = generateLocalStorageKey('traders-theme');

interface TradersThemeModeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const TradersThemeModeContext = createContext<TradersThemeModeContextValue>({
  mode: 'light',
  setMode: () => {},
});

export const useTradersThemeMode = () => useContext(TradersThemeModeContext);

interface TradersThemeProviderProps {
  children: ReactNode;
}

const getSystemPreference = (): ThemeMode =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const TradersThemeProvider = ({
  children,
}: TradersThemeProviderProps) => {
  const [isUserChosen, setIsUserChosen] = useState(
    () => !!localStorage.getItem(TRADERS_THEME_KEY),
  );

  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(TRADERS_THEME_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      /* SSR/Private Browsing 대응 */
    }
    return getSystemPreference();
  });

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    setIsUserChosen(true);
    try {
      localStorage.setItem(TRADERS_THEME_KEY, newMode);
    } catch {
      /* SSR/Private Browsing 대응 */
    }
  }, []);

  useEffect(() => {
    if (isUserChosen) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setModeState(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [isUserChosen]);

  const resolvedColors =
    mode === 'dark' ? tradersDarkColors : tradersLightColors;

  return (
    <TradersThemeModeContext.Provider value={{ mode, setMode }}>
      <EmotionThemeProvider
        theme={(base) => ({ ...base, traders: resolvedColors })}
      >
        {children}
      </EmotionThemeProvider>
    </TradersThemeModeContext.Provider>
  );
};
