import React, { useState } from 'react';
import { Dash } from '../../components/dash/dash';
import { Input } from '../../components/input/input';
import AppImg from '../../assets/app.png';
import { useTheme } from '../../hooks/theme';

export const Login = () => {
  const { setTheme } = useTheme();
  const [count, setCount] = useState(0);

  return (
    <div className="bg-gray-600">

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
        <h1 className="text-5xl mb-8 font-sans font-semibold text-gray-200">
          Break Barriers
        </h1>
        <a
          href="/auth/google/"
          className="overflow-hidden w-full h-12 relative flex items-center rounded-md bg-gray-900 hover:bg-gray-800 focus:bg-gray-800"
        >
          <div className="h-full absolute inset-y-0 left-0">
            <img
              src="https://banner2.cleanpng.com/20180723/btg/kisspng-google-logo-google-search-google-images-g-suite-google-adwords-5b5695e47fdc94.0743248315324011245237.jpg"
              className="h-full p-2 rounded-md bg-white"
              alt="google banner"
            />
          </div>
          <span className="mx-auto text-gray-200 text-lg font-medium font-sans">
            Log in by Google
          </span>
        </a>
        <Dash />

        <form
          className="flex flex-col w-full"
          action="/auth/login/"
          method="POST"
        >
          <Input placeholder="Username: " type="text" name="username" />
          <Input placeholder="Password: " type="password" name="password" />
          <div className="flex justify-between items-center">
            <input
              className="my-2 rounded-md focus:ring-4 font-semibold  px-4 py-2 text-gray-200 bg-gray-900"
              type="submit"
              value="Send"
            />
            <span className="text-gray-200">
              Create an account{' '}
              <a href="/signin/" className="text-blue-300 underline">
                here.
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
    </div>

  );
};
