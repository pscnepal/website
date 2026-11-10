import React, { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ActionButtonColor, ActionButtonSize, ActionButtonVariant } from './ActionButton';
import { ActionButton } from './ActionButton';

export interface ActionMenuItem {
  /** Unique identifier for the item */
  id: string;
  /** Display label */
  label: React.ReactNode;
  /** Optional secondary subtitle or hint */
  description?: string;
  /** Icon displayed next to label */
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  /** Semantic color theme for icon and item focus/hover tint */
  color?: ActionButtonColor;
  /** Optional status or count badge */
  badge?: React.ReactNode;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Internal React Router navigation target */
  to?: string;
  /** External navigation link */
  href?: string;
  /** Download attribute if href is provided */
  download?: boolean | string;
  /** External target (e.g. '_blank') */
  target?: string;
  /** Open in new tab safe rel */
  rel?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Highlight as danger / destructive action */
  danger?: boolean;
  /** Render a separator line before this item */
  divider?: boolean;
}

export interface SharedActionMenuProps {
  /** List of action items to render in menu */
  items: ActionMenuItem[];
  /** Optional label on the trigger button (omitted for icon-only button) */
  label?: React.ReactNode;
  /** Custom trigger icon (defaults to MoreHorizontal, or ChevronDown if label is set) */
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  /** Position of icon relative to label */
  iconPosition?: 'left' | 'right';
  /** Accessible title & tooltip for trigger button */
  title?: string;
  /** Trigger button visual color */
  color?: ActionButtonColor;
  /** Trigger button visual variant */
  variant?: ActionButtonVariant;
  /** Trigger button size */
  size?: ActionButtonSize;
  /** Horizontal alignment of dropdown menu */
  align?: 'left' | 'right';
  /** Dropdown menu width class (e.g. 'w-48', 'w-56') */
  width?: string;
  /** Optional title / header displayed at top of the open menu */
  header?: React.ReactNode;
  /** Disabled state for the entire menu trigger */
  disabled?: boolean;
  /** Custom container class */
  className?: string;
  /** Custom trigger button class */
  triggerClassName?: string;
  /** Custom menu dropdown class */
  menuClassName?: string;
}

/** Color mapping for icons and active hover highlights inside menu items */
const ITEM_COLOR_MAP: Record<
  ActionButtonColor,
  {
    icon: string;
    hover: string;
    badge: string;
  }
> = {
  blue: {
    icon: 'text-blue-600 dark:text-blue-400',
    hover: 'hover:bg-blue-50/80 dark:hover:bg-blue-950/50 hover:text-blue-900 dark:hover:text-blue-200',
    badge: 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  crimson: {
    icon: 'text-crimson-600 dark:text-crimson-400',
    hover: 'hover:bg-crimson-50/80 dark:hover:bg-crimson-950/50 hover:text-crimson-900 dark:hover:text-crimson-200',
    badge: 'bg-crimson-50 dark:bg-crimson-950/80 text-crimson-700 dark:text-crimson-300 border-crimson-200 dark:border-crimson-800',
  },
  emerald: {
    icon: 'text-emerald-600 dark:text-emerald-400',
    hover: 'hover:bg-emerald-50/80 dark:hover:bg-emerald-950/50 hover:text-emerald-900 dark:hover:text-emerald-200',
    badge: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  amber: {
    icon: 'text-amber-600 dark:text-amber-400',
    hover: 'hover:bg-amber-50/80 dark:hover:bg-amber-950/50 hover:text-amber-900 dark:hover:text-amber-200',
    badge: 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  purple: {
    icon: 'text-purple-600 dark:text-purple-400',
    hover: 'hover:bg-purple-50/80 dark:hover:bg-purple-950/50 hover:text-purple-900 dark:hover:text-purple-200',
    badge: 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  },
  red: {
    icon: 'text-red-600 dark:text-red-400',
    hover: 'hover:bg-red-50/80 dark:hover:bg-red-950/50 hover:text-red-900 dark:hover:text-red-200',
    badge: 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
  },
  zinc: {
    icon: 'text-zinc-500 dark:text-zinc-400',
    hover: 'hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-zinc-100',
    badge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
  },
};

export function SharedActionMenu({
  items,
  label,
  icon,
  iconPosition = label ? 'right' : 'left',
  title = 'Action menu',
  color = 'zinc',
  variant = 'outline',
  size = 'xs',
  align = 'right',
  width = 'w-56',
  header,
  disabled = false,
  className = '',
  triggerClassName = '',
  menuClassName = '',
}: SharedActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Determine trigger icon
  const TriggerIcon = icon || (label ? ChevronDown : MoreHorizontal);

  return (
    <div ref={menuRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <ActionButton
        label={label}
        icon={TriggerIcon}
        iconPosition={iconPosition}
        title={title}
        color={color}
        variant={variant}
        size={size}
        disabled={disabled || items.length === 0}
        active={isOpen}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`${triggerClassName} ${isOpen ? 'ring-2 ring-blue-500/50' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
      />

      {/* Flyout Menu Dropdown */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
          className={`absolute z-50 mt-1.5 ${width} rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl py-1.5 focus:outline-none animate-in fade-in-50 zoom-in-95 duration-150 ${
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          } ${menuClassName}`}
          onClick={(e) => e.stopPropagation()}
        >
          {header && (
            <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-800">
              {header}
            </div>
          )}

          <div className="py-0.5 space-y-0.5">
            {items.map((item) => {
              const itemColor = item.danger ? 'red' : item.color || 'zinc';
              const colorStyle = ITEM_COLOR_MAP[itemColor];
              const ItemIcon = item.icon;

              const itemBaseClass = `group w-full flex items-start gap-2.5 px-3 py-2 text-left text-xs transition-colors rounded-lg select-none ${
                item.disabled
                  ? 'opacity-40 pointer-events-none cursor-not-allowed'
                  : `cursor-pointer text-zinc-700 dark:text-zinc-300 ${colorStyle.hover}`
              }`;

              const content = (
                <>
                  {ItemIcon && (
                    <ItemIcon
                      className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                        item.disabled ? 'text-zinc-400' : colorStyle.icon
                      }`}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate text-zinc-900 dark:text-zinc-100 group-hover:text-current">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border leading-none ${colorStyle.badge}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                </>
              );

              return (
                <React.Fragment key={item.id}>
                  {item.divider && (
                    <div
                      role="separator"
                      className="my-1 border-t border-zinc-100 dark:border-zinc-800"
                    />
                  )}

                  {item.to && !item.disabled ? (
                    <Link
                      to={item.to}
                      role="menuitem"
                      className={itemBaseClass}
                      onClick={(e) => {
                        setIsOpen(false);
                        item.onClick?.(e);
                      }}
                    >
                      {content}
                    </Link>
                  ) : item.href && !item.disabled ? (
                    <a
                      href={item.href}
                      role="menuitem"
                      download={item.download}
                      target={item.target}
                      rel={item.target === '_blank' ? 'noopener noreferrer' : item.rel}
                      className={itemBaseClass}
                      onClick={(e) => {
                        setIsOpen(false);
                        item.onClick?.(e);
                      }}
                    >
                      {content}
                    </a>
                  ) : (
                    <button
                      type="button"
                      role="menuitem"
                      disabled={item.disabled}
                      className={itemBaseClass}
                      onClick={(e) => {
                        setIsOpen(false);
                        item.onClick?.(e);
                      }}
                    >
                      {content}
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
