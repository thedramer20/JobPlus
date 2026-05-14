import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  className,
  status,
  onClick,
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  const statusColors = {
    online: 'bg-[#22C55E]',
    offline: 'bg-[#44445A]',
    busy: 'bg-[#EF4444]',
    away: 'bg-[#F59E0B]',
  };

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      className={clsx(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden bg-[#1A1A24] border border-[rgba(255,255,255,0.06)]',
        sizes[size],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className={clsx(
          'font-semibold text-[#8888AA]',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          (size === 'lg' || size === 'xl') && 'text-base',
          size === '2xl' && 'text-lg'
        )}>
          {alt.charAt(0).toUpperCase()}
        </span>
      )}

      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#111118]',
            statusColors[status]
          )}
        />
      )}
    </Component>
  );
};
