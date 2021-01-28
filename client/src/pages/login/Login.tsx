import React from 'react';
import { Dash } from '../../components/dash/dash';
import { Input } from '../../components/input/input';
import AppImg from '../../assets/app.png';
import { useTheme } from '../../hooks/theme';
import { ThemeSelect } from '../../components/theme-select/themeSelect';

export const Login = (): JSX.Element => {
  const {} = useTheme();
  return (
    <div className="dark:bg-gray-600 bg-gray-50">
      <div className="pt-16 w-10/12 mx-auto h-screen md:grid items-center grid-cols-2 gap-4 ">
        <div className="my-2 md:my-0">
          <img
            className="w-full h-full object-contain"
            src={AppImg}
            alt="Application"
          />
          <Dash />
        </div>
        <div className="mx-auto md:mx-0">
          <h1 className="text-5xl mb-8 font-sans font-semibold dark:text-gray-200 text-gray-800">
            Break Barriers
          </h1>
          <a
            href="/auth/google/"
            className="overflow-hidden w-full h-12 relative flex items-center rounded-md dark:bg-gray-900 bg-white shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 focus:bg-gray-800"
          >
            <div className="h-full absolute inset-y-0 left-0">
              <img
                src="https://banner2.cleanpng.com/20180723/btg/kisspng-google-logo-google-search-google-images-g-suite-google-adwords-5b5695e47fdc94.0743248315324011245237.jpg"
                className="h-full p-2 rounded-md dark:bg-white bg-gray-200"
                alt="google banner"
              />
            </div>
            <span className="mx-auto dark:text-gray-200 text-gray-700 text-lg font-medium font-sans">
              Log in by Google
            </span>
          </a>
          <Dash />

          <form
            className="flex flex-col w-full"
            action="/api/auth/login/"
            method="POST"
          >
            <Input placeholder="Username: " type="text" name="username" />
            <Input placeholder="Password: " type="password" name="password" />
            <div className="flex justify-between items-center">
              <input
                className="my-2 rounded-md cursor-pointer shadow-lg focus:ring-4 font-semibold  px-4 py-2 text-gray-200 bg-gray-900"
                type="submit"
                value="Send"
              />
              <span className="dark:text-gray-200 text-gray-700">
                Create an account{' '}
                <a
                  href="/signin/"
                  className="dark:text-blue-300 text-blue-500 underline"
                >
                  here.
                </a>
              </span>
            </div>
          </form>
        </div>
        <ThemeSelect />
      </div>
    </div>
  );
};
