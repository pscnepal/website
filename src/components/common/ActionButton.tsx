import React, { forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export type ActionButtonColor =
  | 'blue'
  | 'crimson'
  | 'emerald'
  | 'amber'
  | 'zinc'
  | 'purple'
  | 'red';

export type ActionButtonVariant = 'solid' | 'outline' | 'subtle' | 'ghost';
export type ActionButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ActionButtonProps {
  /** Text label displayed inside button (can be omitted for icon-only buttons) */
  label?: React.ReactNode;
  /** Mandatory title / tooltip explaining the action for accessibility & user guidance */
  title: string;
  /** Primary semantic color theme */
  color?: ActionButtonColor;
  /** Visual button style */
  variant?: ActionButtonVariant;
  /** Button dimensions */
  size?: ActionButtonSize;
  /** Optional icon component */
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  /** Position of icon relative to label */
  iconPosition?: 'left' | 'right';
  /** Click event handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** If provided, renders as an internal React Router Link */
  to?: string;
  /** If provided, renders as an external HTML anchor tag */
  href?: string;
  /** Download attribute when href is provided */
  download?: boolean | string;
  /** Open in new tab when href is provided */
  target?: string;
  rel?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom accessible label */
  ariaLabel?: string;
  /** Custom styling classes */
  className?: string;
  /** Active toggle state (for pressed toggles) */
  active?: boolean;
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
}

const COLOR_MAP: Record<
  ActionButtonColor,
  Record<ActionButtonVariant, string>
> = {
  blue: {
    solid:
      'bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 shadow-2xs border-blue-700 dark:border-blue-600',
    outline:
      'border-blue-300 dark:border-blue-700/80 text-blue-700 dark:text-blue-300 bg-white/80 dark:bg-zinc-900/80 hover:bg-blue-50/70 dark:hover:bg-blue-950/50 hover:border-blue-400 dark:hover:border-blue-600',
    subtle:
      'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/80 hover:bg-blue-100/70 dark:hover:bg-blue-900/60',
    ghost:
      'text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-transparent',
  },
  crimson: {
    solid:
      'bg-crimson-700 hover:bg-crimson-800 text-white dark:bg-crimson-600 dark:hover:bg-crimson-500 shadow-2xs border-crimson-700 dark:border-crimson-600',
    outline:
      'border-crimson-300 dark:border-crimson-700/80 text-crimson-700 dark:text-crimson-400 bg-white/80 dark:bg-zinc-900/80 hover:bg-crimson-50/70 dark:hover:bg-crimson-950/50 hover:border-crimson-400 dark:hover:border-crimson-600',
    subtle:
      'bg-crimson-50 dark:bg-crimson-950/50 text-crimson-800 dark:text-crimson-300 border-crimson-200 dark:border-crimson-800/80 hover:bg-crimson-100/70 dark:hover:bg-crimson-900/60',
    ghost:
      'text-crimson-700 dark:text-crimson-400 hover:bg-crimson-50 dark:hover:bg-crimson-950/50 border-transparent',
  },
  emerald: {
    solid:
      'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-2xs border-emerald-600 dark:border-emerald-500',
    outline:
      'border-emerald-300 dark:border-emerald-700/80 text-emerald-700 dark:text-emerald-300 bg-white/80 dark:bg-zinc-900/80 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/50 hover:border-emerald-400 dark:hover:border-emerald-600',
    subtle:
      'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/60',
    ghost:
      'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border-transparent',
  },
  amber: {
    solid:
      'bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-600 dark:hover:bg-amber-500 shadow-2xs border-amber-600 dark:border-amber-500',
    outline:
      'border-amber-300 dark:border-amber-700/80 text-amber-700 dark:text-amber-400 bg-white/80 dark:bg-zinc-900/80 hover:bg-amber-50/70 dark:hover:bg-amber-950/50 hover:border-amber-400 dark:hover:border-amber-600',
    subtle:
      'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80 hover:bg-amber-100/70 dark:hover:bg-amber-900/60',
    ghost:
      'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 border-transparent',
  },
  purple: {
    solid:
      'bg-purple-700 hover:bg-purple-800 text-white dark:bg-purple-600 dark:hover:bg-purple-500 shadow-2xs border-purple-700 dark:border-purple-600',
    outline:
      'border-purple-300 dark:border-purple-700/80 text-purple-700 dark:text-purple-300 bg-white/80 dark:bg-zinc-900/80 hover:bg-purple-50/70 dark:hover:bg-purple-950/50 hover:border-purple-400 dark:hover:border-purple-600',
    subtle:
      'bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/80 hover:bg-purple-100/70 dark:hover:bg-purple-900/60',
    ghost:
      'text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 border-transparent',
  },
  red: {
    solid:
      'bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-500 shadow-2xs border-red-600 dark:border-red-500',
    outline:
      'border-red-300 dark:border-red-700/80 text-red-700 dark:text-red-400 bg-white/80 dark:bg-zinc-900/80 hover:bg-red-50/70 dark:hover:bg-red-950/50 hover:border-red-400 dark:hover:border-red-600',
    subtle:
      'bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/80 hover:bg-red-100/70 dark:hover:bg-red-900/60',
    ghost:
      'text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 border-transparent',
  },
  zinc: {
    solid:
      'bg-zinc-900 hover:bg-zinc-950 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 shadow-2xs border-zinc-900 dark:border-zinc-100',
    outline:
      'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-950 dark:hover:text-zinc-100',
    subtle:
      'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-700/80 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 hover:text-zinc-950 dark:hover:text-zinc-100',
    ghost:
      'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-100 border-transparent',
  },
};

const SIZE_MAP: Record<ActionButtonSize, { btn: string; icon: string }> = {
  xs: {
    btn: 'h-6 px-2 text-[11px] gap-1 rounded-md',
    icon: 'w-3 h-3',
  },
  sm: {
    btn: 'h-7 px-2.5 text-xs gap-1.5 rounded-md',
    icon: 'w-3.5 h-3.5',
  },
  md: {
    btn: 'h-8 px-3 text-xs sm:text-[13px] gap-1.5 rounded-lg',
    icon: 'w-3.5 h-3.5',
  },
  lg: {
    btn: 'h-10 px-4 text-sm gap-2 rounded-xl',
    icon: 'w-4 h-4',
  },
};

const ICON_ONLY_SIZE_MAP: Record<ActionButtonSize, string> = {
  xs: 'w-6 h-6 p-0 rounded-md',
  sm: 'w-7 h-7 p-0 rounded-md',
  md: 'w-8 h-8 p-0 rounded-lg',
  lg: 'w-10 h-10 p-0 rounded-xl',
};

export const ActionButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ActionButtonProps
>(
  (
    {
      label,
      title,
      color = 'zinc',
      variant = 'outline',
      size = 'sm',
      icon: Icon,
      iconPosition = 'left',
      onClick,
      to,
      href,
      download,
      target,
      rel,
      disabled = false,
      ariaLabel,
      className = '',
      type = 'button',
      active,
      ...rest
    },
    ref
  ) => {
    const isIconOnly = !label && Boolean(Icon);
    const sizeConfig = SIZE_MAP[size];

    const baseClasses =
      'inline-flex items-center justify-center font-medium whitespace-nowrap shrink-0 transition-all border select-none cursor-pointer disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-zinc-950';

    const colorClasses = COLOR_MAP[color][variant];
    const dimensionClasses = isIconOnly
      ? ICON_ONLY_SIZE_MAP[size]
      : sizeConfig.btn;
    const activeClasses = active
      ? 'ring-2 ring-blue-500/40 dark:ring-blue-400/40'
      : '';

    const fullClassName = `${baseClasses} ${colorClasses} ${dimensionClasses} ${activeClasses} ${className}`.trim();

    const content = (
      <>
        {Icon && iconPosition === 'left' && (
          <Icon className={`${sizeConfig.icon} shrink-0`} />
        )}
        {label && <span>{label}</span>}
        {Icon && iconPosition === 'right' && (
          <Icon className={`${sizeConfig.icon} shrink-0`} />
        )}
      </>
    );

    const commonProps = {
      title,
      'aria-label': ariaLabel || title,
      'aria-pressed': typeof active === 'boolean' ? active : undefined,
      className: fullClassName,
      ...rest,
    };

    // Render as React Router Link
    if (to && !disabled) {
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          to={to}
          onClick={onClick as any}
          {...commonProps}
        >
          {content}
        </Link>
      );
    }

    // Render as external anchor link
    if (href && !disabled) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          download={download}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : rel}
          onClick={onClick as any}
          {...commonProps}
        >
          {content}
        </a>
      );
    }

    // Standard HTML Button
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        onClick={onClick as any}
        {...commonProps}
      >
        {content}
      </button>
    );
  }
);

ActionButton.displayName = 'ActionButton';
