import React from 'react';

export const Button = ({ children, onClick, className, ...props }) => (
  <button
    onClick={onClick}
    className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 ${className}`}
    {...props}
  >
    {children}
  </button>
);