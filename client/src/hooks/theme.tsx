import { useEffect, useState } from 'react';

export type THEME = 'dark' | 'light' | 'system';

interface ITheme {
  setTheme: React.Dispatch<React.SetStateAction<THEME>>;
  theme: THEME;
}

const defaultTheme = localStorage.theme ?? 'system';
export function useTheme(): ITheme {
  const [theme, setTheme] = useState<THEME>(defaultTheme);

  useEffect(() => {
    localStorage.theme = theme;
    if (
      theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else document.documentElement.classList.remove('dark');
  }, [theme]);
  return { setTheme, theme };
}
