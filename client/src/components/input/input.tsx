import React from 'react';

export const Input = ({ ...props }) => {
  return (
    <input
      className="mb-2 focus:outline-none dark:bg-gray-500 dark:text-gray-100 rounded-md focus:ring-4 px-4 py-3 font-sans"
      {...props}
    />
  );
};
