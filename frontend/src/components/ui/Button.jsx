import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-[#4F8CFF] hover:bg-[#3b79ef] text-white shadow-lg shadow-[#4F8CFF]/20 border border-[#4F8CFF]/30',
  secondary: 'bg-[#1A2235] hover:bg-[#232d44] text-[#F9FAFB] border border-[#1F2937] hover:border-[#374151]',
  ghost: 'bg-transparent hover:bg-[#1A2235] text-[#9CA3AF] hover:text-[#F9FAFB]',
  danger: 'bg-[#EF4444] hover:bg-[#dc2626] text-white shadow-lg shadow-[#EF4444]/20 border border-[#EF4444]/30',
  icon: 'bg-[#111827] hover:bg-[#1A2235] text-[#9CA3AF] hover:text-[#F9FAFB] border border-[#1F2937] p-2 rounded-xl',
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
