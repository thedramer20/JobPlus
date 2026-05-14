import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-full transition-all duration-200 ease-out';

  const variants = {
    primary: 'bg-gradient-to-r from-[#6C63FF] to-[#3DCFEF] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-[#00D4AA] text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'bg-transparent text-[#8888AA] border border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white hover:border-[rgba(108,99,255,0.4)]',
    danger: 'bg-[#EF4444] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      drag={false}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};
