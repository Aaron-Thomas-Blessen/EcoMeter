import React from "react";

export const Card = ({ children }) => (
  <div className="border rounded shadow p-4">{children}</div>
);

export const CardHeader = ({ children }) => (
  <div className="border-b pb-2 mb-2">{children}</div>
);

export const CardTitle = ({ className, children }) => (
  <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
);

export const CardContent = ({ children }) => <div>{children}</div>;
