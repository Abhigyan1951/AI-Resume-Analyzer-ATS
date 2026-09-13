import React from 'react';
import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-[#4F8CFF]/15 text-[#4F8CFF] border-[#4F8CFF]/30',
  secondary: 'bg-[#7C3AED]/15 text-[#a78bfa] border-[#7C3AED]/30',
  success: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30',
  warning: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
  danger: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30',
  info: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  muted: 'bg-[#1F2937] text-[#9CA3AF] border-[#374151]',
};

const dotColors = {
  primary: 'bg-[#4F8CFF]',
  secondary: 'bg-[#7C3AED]',
  success: 'bg-[#22C55E]',
  warning: 'bg-[#F59E0B]',
  danger: 'bg-[#EF4444]',
  info: 'bg-sky-400',
  muted: 'bg-[#9CA3AF]',
};

export const Badge = ({
  children,
  variant = 'primary',
  dot = false,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border transition-colors select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
