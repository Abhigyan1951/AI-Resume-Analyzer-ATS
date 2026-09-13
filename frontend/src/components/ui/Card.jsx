import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const variants = {
  default: 'glass-card',
  elevated: 'glass-elevated',
  soft: 'glass-soft',
};

export const Card = ({
  children,
  variant = 'default',
  hover = false,
  className,
  onClick,
  ...props
}) => {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover
    ? {
        whileHover: { y: -4, transition: { duration: 0.2, ease: 'easeOut' } },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={cn(
        'rounded-2xl p-6 transition-all duration-200 text-[var(--text-primary)] border border-[var(--border-subtle)]',
        variants[variant],
        hover && 'cursor-pointer hover:border-[#2563EB]/40 hover:shadow-xl hover:shadow-[#2563EB]/5',
        className
      )}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardHeader = ({ children, className, ...props }) => (
  <div className={cn('flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn('text-lg font-semibold text-[var(--text-primary)] tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className, ...props }) => (
  <p className={cn('text-sm text-[var(--text-secondary)] mt-0.5', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={cn('', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={cn('pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);

export default Card;
