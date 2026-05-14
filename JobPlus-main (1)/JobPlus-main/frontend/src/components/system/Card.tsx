import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glass = false,
  hover = false,
  onClick,
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200 ease-out';

  const variants = glass
    ? 'bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
    : 'bg-[#111118] border border-[rgba(255,255,255,0.06)] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.4)]';

  const hoverStyles = hover
    ? 'hover:translate-y-[-2px] hover:border-[rgba(255,255,255,0.12)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.3)] cursor-pointer'
    : '';

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      whileHover={hover ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={clsx(baseStyles, variants, hoverStyles, className)}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};
