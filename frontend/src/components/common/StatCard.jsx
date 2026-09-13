import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';

const colorStyles = {
  primary: 'from-[#2563EB]/20 to-[#2563EB]/5 text-[#2563EB] border-[#2563EB]/30',
  secondary: 'from-[#0EA5E9]/20 to-[#0EA5E9]/5 text-[#0EA5E9] border-[#0EA5E9]/30',
  success: 'from-[#16A34A]/20 to-[#16A34A]/5 text-[#16A34A] border-[#16A34A]/30',
  warning: 'from-[#D97706]/20 to-[#D97706]/5 text-[#D97706] border-[#D97706]/30',
  danger: 'from-[#DC2626]/20 to-[#DC2626]/5 text-[#DC2626] border-[#DC2626]/30',
};

const iconBg = {
  primary: 'bg-[#2563EB]/15 text-[#2563EB]',
  secondary: 'bg-[#0EA5E9]/15 text-[#0EA5E9]',
  success: 'bg-[#16A34A]/15 text-[#16A34A]',
  warning: 'bg-[#D97706]/15 text-[#D97706]',
  danger: 'bg-[#DC2626]/15 text-[#DC2626]',
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
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {value}
            </h3>
            {trendValue && (
              <span
                className={cn(
                  'inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-md',
                  trend === 'up' ? 'text-[#16A34A] bg-[#16A34A]/10' : 'text-[#DC2626] bg-[#DC2626]/10'
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
        <p className="text-xs text-[var(--text-secondary)] mt-4 pt-3 border-t border-[var(--border-subtle)]">
          {subtitle}
        </p>
      )}
    </Card>
  );
};

export default StatCard;
