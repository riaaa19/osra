'use client';

import { cn } from '@/lib/utils';

interface OsraLogoProps {
  className?: string;
  iconOnly?: boolean;
  light?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function OsraLogo({ className, iconOnly, light, size = 'md' }: OsraLogoProps) {
  const px = { sm: 28, md: 36, lg: 44 }[size];
  const textCls = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' }[size];

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg width={px} height={px} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" rx="12" fill="url(#logo-g)" />
        <path d="M22 9L35 16.5V27.5L22 35L9 27.5V16.5L22 9Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" />
        <circle cx="22" cy="22" r="4.5" fill="white" />
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5B3DF5" />
            <stop offset="1" stopColor="#7C4DFF" />
          </linearGradient>
        </defs>
      </svg>
      {!iconOnly && (
        <span className={cn('font-bold tracking-tight', textCls, light ? 'text-white' : 'text-[#5B3DF5]')}>
          OSRA
        </span>
      )}
    </div>
  );
}
