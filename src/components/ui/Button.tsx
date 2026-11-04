import { forwardRef, type ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      active = false,
      className = '',
      type = 'button',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap shrink-0 rounded-lg transition-colors duration-150 cursor-pointer disabled:opacity-45 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950';

    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        'bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 shadow-2xs',
      secondary: active
        ? 'bg-blue-700 text-white dark:bg-blue-600 dark:text-white border border-blue-700 dark:border-blue-500'
        : 'bg-white text-zinc-800 border border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-800 dark:hover:bg-zinc-800',
      icon: active
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/80',
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: variant === 'icon' ? 'h-9 w-9 p-0' : 'h-9 px-3 text-xs',
      md: variant === 'icon' ? 'h-10 w-10 p-0' : 'h-10 px-4 text-sm',
      lg: variant === 'icon' ? 'h-11 w-11 p-0' : 'h-11 px-5 text-sm',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
