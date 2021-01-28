import React, { useEffect } from 'react';
import appImg from '../../assets/app.png';
import { useTheme } from '../../hooks/theme';

export const Profile = (): JSX.Element => {
  const { setTheme } = useTheme();
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/auth/user');
      const data = await res.json();
      console.log(data);
    })();
  }, []);

  return (
    <div className="App">
      <p className="text-2xl font-bold bg-gray-100 text-gray-800 dark:text-gray-50 dark:bg-gray-800">
        profileasdfasd page
      </p>

      <button onClick={() => setTheme('system')}>system</button>
      <button onClick={() => setTheme('light')}>light</button>
      <button onClick={() => setTheme('dark')}>dark</button>
      <img src={appImg} alt="" className="h-20 w-32 object-cover" />
    </div>
  );
};
