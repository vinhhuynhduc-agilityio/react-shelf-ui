import React, { memo } from 'react';
import clsx from 'clsx';

interface AvatarProps {
  src: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  ariaLabel?: string;
}

export const Avatar: React.FC<AvatarProps> = memo(({
  src,
  alt = 'Avatar',
  size = 'medium',
  ariaLabel = '',
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={clsx(
        'rounded-full object-cover',
        size === 'small' && 'w-8 h-8',
        size === 'medium' && 'w-14 h-14',
        size === 'large' && 'w-24 h-24'
      )}
      aria-label={ariaLabel}
    />
  );
});
