import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';

const colorStyles = {
  primary: 'from-[#4F8CFF]/20 to-[#4F8CFF]/5 text-[#4F8CFF] border-[#4F8CFF]/30',
  secondary: 'from-[#7C3AED]/20 to-[#7C3AED]/5 text-[#a78bfa] border-[#7C3AED]/30',
  success: 'from-[#22C55E]/20 to-[#22C55E]/5 text-[#22C55E] border-[#22C55E]/30',
  warning: 'from-[#F59E0B]/20 to-[#F59E0B]/5 text-[#F59E0B] border-[#F59E0B]/30',
  danger: 'from-[#EF4444]/20 to-[#EF4444]/5 text-[#EF4444] border-[#EF4444]/30',
};

const iconBg = {
  primary: 'bg-[#4F8CFF]/15 text-[#4F8CFF]',
  secondary: 'bg-[#7C3AED]/15 text-[#a78bfa]',
  success: 'bg-[#22C55E]/15 text-[#22C55E]',
  warning: 'bg-[#F59E0B]/15 text-[#F59E0B]',
  danger: 'bg-[#EF4444]/15 text-[#EF4444]',
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'primary',
  className,
}) => {
  return (
    <Card hover className={cn('relative overflow-hidden group', className)}>
      {/* Background Accent Blur */}
      <div
        className={cn(
          'absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-40',
          colorStyles[color]
        )}
      />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-[#F9FAFB] tracking-tight">
              {value}
            </h3>
            {trendValue && (
              <span
                className={cn(
                  'inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-md',
                  trend === 'up' ? 'text-[#22C55E] bg-[#22C55E]/10' : 'text-[#EF4444] bg-[#EF4444]/10'
                )}
              >
                {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {trendValue}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={cn('p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110', iconBg[color])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-[#9CA3AF] mt-4 pt-3 border-t border-[#1F2937]/60">
          {subtitle}
        </p>
      )}
    </Card>
  );
};

export default StatCard;
