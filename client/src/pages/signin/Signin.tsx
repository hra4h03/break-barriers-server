import React from 'react';
import { Dash } from '../../components/dash/dash';
import { Input } from '../../components/input/input';

export const SignIn = (): JSX.Element => {
  return (
    <div className="bg-gray-600">
      <div className="pt-16 w-10/12 mx-auto h-screen md:grid items-center grid-cols-2 gap-4">
        <div className="my-2 md:my-0">
          <img
            className="w-full h-full object-contain"
            src="/assets/app.png"
            alt="Application"
          />
          <Dash />
        </div>
        <div>
          <h1 className="text-5xl text-gray-300 mb-8 font-sans font-semibold">
            Break Barriers
          </h1>
          <div className="border shadow-sm py-3 my-1 rounded-md flex justify-center items-center bg-yellow-100">
            <i className="text-green-700 fas fa-check mr-4"></i>
            <span className="font-semibold font-sans text-green-700">
              Get more by using this app!!
            </span>
          </div>
          <Dash />

          {/* <% if (error) { %>
        <div className="bg-gray-300 font-semibold text-center"><%= error %></div> 
      <% } %> */}
          <form
            id="form"
            className="flex flex-col w-full"
            action="/users/create/"
            method="POST"
          >
            <Input placeholder="Username: " type="text" name="username" />
            <Input placeholder="Email: " type="email" name="email" />
            <Input
              placeholder="Password: at least 6 character "
              type="password"
              name="password"
            />
            <div className="flex justify-between items-center">
              <button
                className="my-2 rounded-md focus:ring-4 font-semibold disabled:opacity-50 px-4 py-2 text-gray-300 bg-gray-900"
                type="submit"
              >
                Send
              </button>
              <span className="text-gray-300">
                Already have an account?{' '}
                <a href="/login/" className="underline text-blue-300">
                  Login here
                </a>
                .
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
