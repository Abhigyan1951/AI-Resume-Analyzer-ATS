import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md shadow-[#2563EB]/20 border border-[#2563EB]/40',
  secondary: 'bg-[var(--surface-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)]',
  ghost: 'bg-transparent hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  danger: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-md shadow-[#DC2626]/20 border border-[#DC2626]/40',
  icon: 'bg-[var(--surface-main)] hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] p-2 rounded-xl',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5 font-medium',
};

export const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isDisabled = false,
      leftIcon,
      rightIcon,
      className,
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isIconOnly = variant === 'icon';

    return (
      <motion.button
        ref={ref}
        type={type}
        whileHover={{ scale: isDisabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isDisabled || isLoading ? 1 : 0.98 }}
        transition={{ duration: 0.15, ease: 'easeInOut' }}
        disabled={isDisabled || isLoading}
        onClick={onClick}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#4F8CFF]/50 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer',
          variants[variant],
          !isIconOnly && sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
