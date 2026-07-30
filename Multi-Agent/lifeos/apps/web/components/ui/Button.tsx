import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-accent-primary text-white hover:bg-accent-hover active:bg-accent-pressed shadow-sm',
      secondary: 'bg-surface-secondary text-text-primary hover:bg-border',
      outline: 'border border-border text-text-primary hover:bg-surface-secondary',
      ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary',
      danger: 'bg-rose-600 text-white hover:bg-rose-700',
    };

    const sizeStyles = {
      sm: 'h-8 px-3 text-xs font-medium',
      md: 'h-10 px-4 text-sm font-medium',
      lg: 'h-12 px-6 text-base font-medium',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl transition-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
