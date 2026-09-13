import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl glass-soft border border-[#1F2937] ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-[#1A2235] border border-[#1F2937] flex items-center justify-center text-[#4F8CFF] mb-4 shadow-xl">
          <Icon className="w-7 h-7" />
        </div>
      )}

      <h3 className="text-xl font-semibold text-[#F9FAFB] tracking-tight mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-[#9CA3AF] max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
