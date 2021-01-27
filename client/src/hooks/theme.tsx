import { useEffect } from 'react';

type THEME = 'dark' | 'light' | 'system';

export const useTheme = () => {
  useEffect(() => {
    return localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark');
  }, []);

  const setTheme = (theme: THEME): void => {
    if (theme === 'dark') {
      localStorage.theme = 'dark';
      document.documentElement.classList.add('dark');
      return;
    }
    if (theme === 'light') {
      localStorage.theme = 'light';
      document.documentElement.classList.remove('dark');
      return;
    }
    if (theme === 'system') {
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? setTheme('dark')
        : setTheme('light');
      return;
    }
  };

  return { setTheme };
};
