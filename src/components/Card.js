import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`p-4 rounded shadow ${className}`}>{children}</div>
);

export const CardHeader = ({ children }) => <div className="mb-4">{children}</div>;
export const CardTitle = ({ children }) => <h2 className="text-lg font-semibold">{children}</h2>;
export const CardContent = ({ children }) => <div>{children}</div>;