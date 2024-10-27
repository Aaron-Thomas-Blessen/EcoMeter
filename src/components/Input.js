import React from 'react';

export const Input = ({ type = 'text', className, ...props }) => (
  <input
    type={type}
    className={`border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);