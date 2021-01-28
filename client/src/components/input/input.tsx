import React from 'react';

export const Input: React.FC<{ [k: string]: unknown }> = ({ ...props }) => {
  return (
    <input
      className="mb-2 focus:outline-none dark:bg-gray-500 bg-white dark:text-gray-200 shadow-lg rounded-md focus:ring-4 px-4 py-3 font-sans"
      {...props}
    />
  );
};
