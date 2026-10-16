import React from 'react';

interface AppleIconProps {
  children?: React.ReactNode;
  gradient?: 'ruby' | 'emerald' | 'graphite' | 'amber' | 'azure' | 'clay';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  shadow?: boolean;
}

export const AppleIcon: React.FC<AppleIconProps> = ({
  children,
  gradient = 'ruby',
  size = 'md',
  className = '',
  shadow = true,
}) => {
  const gradientStyles: Record<string, string> = {
    ruby: 'from-[#ff334b] via-[#e11d48] to-[#9f1239]',
    emerald: 'from-[#34d399] via-[#059669] to-[#064e3b]',
    graphite: 'from-[#52525b] via-[#27272a] to-[#09090b]',
    amber: 'from-[#fbbf24] via-[#d97706] to-[#78350f]',
    azure: 'from-[#38bdf8] via-[#0284c7] to-[#075985]',
    clay: 'from-[#d97706] via-[#92400e] to-[#451a03]',
  };

  const sizeStyles: Record<string, { box: string; radius: string; iconSize: string }> = {
    sm: { box: 'w-10 h-10', radius: 'rounded-[12px]', iconSize: 'text-sm' },
    md: { box: 'w-14 h-14', radius: 'rounded-[18px]', iconSize: 'text-xl' },
    lg: { box: 'w-20 h-20', radius: 'rounded-[24px]', iconSize: 'text-3xl' },
    xl: { box: 'w-24 h-24', radius: 'rounded-[30px]', iconSize: 'text-4xl' },
    hero: { box: 'w-32 h-32', radius: 'rounded-[38px]', iconSize: 'text-5xl' },
  };

  const currentSize = sizeStyles[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none overflow-hidden bg-gradient-to-b ${gradientStyles[gradient]} ${currentSize.box} ${currentSize.radius} ${
        shadow ? 'shadow-[0_12px_28px_rgba(0,0,0,0.18),_0_2px_8px_rgba(0,0,0,0.08)]' : ''
      } ring-1 ring-inset ring-white/35 transition-transform active:scale-95 ${className}`}
      style={{
        boxShadow: shadow
          ? '0 10px 24px -4px rgba(0,0,0,0.22), 0 2px 6px 0 rgba(0,0,0,0.1), inset 0 1px 1px 0 rgba(255,255,255,0.45)'
          : 'inset 0 1px 1px 0 rgba(255,255,255,0.45)',
      }}
    >
      {/* Apple specular gloss reflection */}
      <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-[inherit]" />

      {/* Subtle bottom ambient bounce reflection */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-b-[inherit]" />

      {/* Content / Symbol */}
      <div className="relative z-10 text-white flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
