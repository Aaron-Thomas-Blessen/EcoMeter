import React from "react";

export const Alert = ({ children, variant }) => (
  <div className={`alert ${variant}`}>{children}</div>
);

export const AlertTitle = ({ children }) => <strong>{children}</strong>;

export const AlertDescription = ({ children }) => <div>{children}</div>;
