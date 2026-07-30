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
      primary: 'bg-[hsl(var(--accent-primary))] text-white hover:bg-[hsl(var(--accent-hover))] active:bg-[hsl(var(--accent-pressed))]',
      secondary: 'bg-[hsl(var(--surface-secondary))] text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--border))]',
      outline: 'border border-[hsl(var(--border))] text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--surface-secondary))]',
      ghost: 'text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--surface-secondary))]',
      danger: 'bg-[hsl(var(--error))] text-white hover:opacity-90',
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
          'inline-flex items-center justify-center rounded-[var(--radius)] transition-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-primary))] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer',
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
