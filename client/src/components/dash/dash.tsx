import React from 'react';

export const Dash = ({ ...props }: { [x: string]: any }): JSX.Element => (
  <hr
    className="rounded-full bg-gray-300 h-1 divide-dashed mx-auto my-4"
    {...props}
  />
);
