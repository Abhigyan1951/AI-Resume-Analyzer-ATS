import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-xl animate-shimmer bg-[#1F2937]/60 border border-[#1F2937]/30',
        className
      )}
      {...props}
    />
  );
};

export const CardSkeleton = () => (
  <div className="rounded-2xl p-6 glass-card border border-[#1F2937] flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="w-10 h-10 rounded-xl" />
    </div>
    <Skeleton className="h-9 w-1/2" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

export default Skeleton;
