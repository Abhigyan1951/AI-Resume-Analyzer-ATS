import React, { useState } from 'react';
import { Eye, EyeOff, Search } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      type = 'text',
      className,
      containerClassName,
      isSearch = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label className="text-xs font-medium text-[#9CA3AF] tracking-wide uppercase">
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {isSearch && !leftIcon && (
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 pointer-events-none" />
          )}

          {leftIcon && (
            <span className="w-4 h-4 text-[#6B7280] absolute left-3.5 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            type={computedType}
            className={cn(
              'w-full bg-[#111827] border border-[#1F2937] text-[#F9FAFB] placeholder-[#6B7280] text-sm rounded-xl py-2.5 px-4 transition-all duration-200 focus:outline-none focus:border-[#4F8CFF] focus:ring-2 focus:ring-[#4F8CFF]/20 disabled:opacity-50 disabled:cursor-not-allowed',
              (leftIcon || isSearch) && 'pl-10',
              (rightIcon || isPassword) && 'pr-10',
              error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20',
              className
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 text-[#6B7280] hover:text-[#9CA3AF] focus:outline-none transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {rightIcon && !isPassword && (
            <span className="w-4 h-4 text-[#6B7280] absolute right-3.5 pointer-events-none flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>

        {error && <span className="text-xs text-[#EF4444] mt-0.5">{error}</span>}
        {helperText && !error && (
          <span className="text-xs text-[#6B7280] mt-0.5">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
