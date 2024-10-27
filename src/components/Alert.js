import React from 'react';

export const Alert = ({ children, variant = 'default', className, ...props }) => {
  const baseStyle = 'p-4 rounded-md shadow-md relative';
  const variantStyles = {
    default: 'bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700',
    destructive: 'bg-red-50 border-l-4 border-red-400 text-red-700',
    success: 'bg-green-50 border-l-4 border-green-400 text-green-700'
  };
  
  return (
    <div className={`${baseStyle} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const AlertTitle = ({ children, className }) => (
  <h4 className={`font-semibold ${className}`}>{children}</h4>
);

export const AlertDescription = ({ children, className }) => (
  <p className={`mt-1 ${className}`}>{children}</p>
);