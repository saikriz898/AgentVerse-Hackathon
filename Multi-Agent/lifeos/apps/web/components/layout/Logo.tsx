import React from 'react';

export const Logo: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 28,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Precision Geometric Architectural Monogram Logo for LifeOS */}
      <path
        d="M16 3L27.25 9.5V22.5L16 29L4.75 22.5V9.5L16 3Z"
        className="stroke-accent-primary"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 3V15.5M27.25 9.5L16 15.5M4.75 9.5L16 15.5"
        className="stroke-accent-primary"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 15.5V29M27.25 22.5L16 15.5M4.75 22.5L16 15.5"
        className="stroke-accent-primary opacity-60"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 2"
      />
    </svg>
  );
};
