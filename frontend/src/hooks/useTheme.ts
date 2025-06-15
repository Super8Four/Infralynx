import { useState, useCallback, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface UseThemeOptions {
  initialTheme?: Theme;
  storageKey?: string;
}

export const useTheme = ({
  initialTheme = 'system',
  storageKey = 'theme',
}: UseThemeOptions = {}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return initialTheme;
    }

    const storedTheme = localStorage.getItem(storageKey) as Theme;
    return storedTheme || initialTheme;
  });

  const applyTheme = useCallback(
    (newTheme: Theme) => {
      const root = window.document.documentElement;
      const isDark =
        newTheme === 'dark' ||
        (newTheme === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      root.classList.remove('light', 'dark');
      root.classList.add(isDark ? 'dark' : 'light');
    },
    []
  );

  const setThemeAndStore = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme);
      localStorage.setItem(storageKey, newTheme);
      applyTheme(newTheme);
    },
    [storageKey, applyTheme]
  );

  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  const toggleTheme = useCallback(() => {
    setThemeAndStore(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setThemeAndStore]);

  return {
    theme,
    setTheme: setThemeAndStore,
    toggleTheme,
    isDark: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
  };
}; 