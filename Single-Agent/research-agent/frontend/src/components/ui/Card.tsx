import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div
      className={twMerge(clsx('glass-panel rounded-xl p-5 shadow-xl transition-all duration-200', className))}
      {...props}
    >
      {children}
    </div>
  );
};
