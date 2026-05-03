import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  pulse = false,
}) => {
  const variants = {
    default: 'bg-[rgba(255,255,255,0.06)] text-[#8888AA] border-[rgba(255,255,255,0.06)]',
    success: 'bg-[rgba(34,197,94,0.15)] text-[#22C55E] border-[rgba(34,197,94,0.3)]',
    warning: 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-[rgba(245,158,11,0.3)]',
    danger: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444] border-[rgba(239,68,68,0.3)]',
    info: 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6] border-[rgba(59,130,246,0.3)]',
    brand: 'bg-[rgba(108,99,255,0.15)] text-[#6C63FF] border-[rgba(108,99,255,0.3)]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={clsx(
        'inline-flex items-center justify-center rounded-full border font-medium',
        variants[variant],
        sizes[size],
        pulse && 'animate-pulse',
        className
      )}
    >
      {children}
    </motion.span>
  );
};
