import React from 'react';
import { THEME, useTheme } from '../../hooks/theme';

export const ThemeSelect = (): JSX.Element => {
  const { setTheme, theme } = useTheme();
  return (
    <div className="flex justify-end">
      <select
        className="px-2 py-1 rounded shadow-md font-sans"
        value={theme}
        onChange={(e) => setTheme(e.target.value as THEME)}
        name="theme"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
};
