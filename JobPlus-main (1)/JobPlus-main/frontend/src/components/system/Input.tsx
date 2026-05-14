import React from 'react';
import clsx from 'clsx';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  size = 'md',
  fullWidth = false,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  return (
    <div className={clsx('flex flex-col gap-2', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[#8888AA]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'rounded-lg border bg-[#111118] text-[#F0F0FF] placeholder-[#44445A] transition-all duration-200',
          'focus:outline-none focus:border-[rgba(108,99,255,0.4)] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.1)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-[#EF4444]' : 'border-[rgba(255,255,255,0.06)]',
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-sm text-[#EF4444]">{error}</span>
      )}
    </div>
  );
};
