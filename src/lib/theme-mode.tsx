import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme, setThemeColors, type ThemeMode } from '../theme';
import { ThemeModeContext } from './use-theme-mode';

const STORAGE_KEY = 'promofire_theme_mode';

function getPreferredMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const initial = getPreferredMode();
    setThemeColors(initial);
    return initial;
  });

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      setThemeColors(next);
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* key заставляет всё дерево перерендериться и подхватить
            обновлённый `colors` из theme.ts (обычные компоненты читают
            его напрямую при рендере, а не через контекст) */}
        <div key={mode}>{children}</div>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
