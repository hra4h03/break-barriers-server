import React from 'react';

export const Dash = ({ ...props }: { [x: string]: unknown }): JSX.Element => (
  <hr
    className="rounded-full dark:bg-gray-300 bg-gray-900 h-1 divide-dashed mx-auto my-4"
    {...props}
  />
);
