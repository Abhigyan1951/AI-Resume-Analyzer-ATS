import React from 'react';
import { Badge } from '../ui/Badge';

export const PageHeader = ({
  title,
  subtitle,
  badge,
  action,
  className,
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] ${className || ''}`}>
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {title}
          </h1>
          {badge && <Badge variant="secondary">{badge}</Badge>}
        </div>
        {subtitle && (
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
