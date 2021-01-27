import React, { useState } from 'react';
import appImg from '../../assets/app.png';
import { useTheme } from '../../hooks/theme';

export const App = () => {
  const [count, setCount] = useState(0);
  const { setTheme } = useTheme();

  return (
    <div className="App">
      <p className="text-2xl font-bold bg-gray-100 text-gray-800 dark:text-gray-50 dark:bg-gray-800">
        main page
      </p>

      <button onClick={() => setTheme('system')}>system</button>
      <button onClick={() => setTheme('light')}>light</button>
      <button onClick={() => setTheme('dark')}>dark</button>
      {count}
      <img src={appImg} alt="" className="h-20 w-32 object-cover" />
    </div>
  );
};
