'use client';

interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 20, className }: LogoIconProps) {
  const id = `gt-g-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5d76e" />
          <stop offset="100%" stopColor="#a0711c" />
        </linearGradient>
      </defs>
      {/* wick */}
      <line x1="10" y1="1" x2="10" y2="19" stroke="#e8b84b" strokeWidth="1.5" strokeLinecap="round" />
      {/* body */}
      <rect x="5" y="5" width="10" height="11" rx="1.5" fill={`url(#${id})`} />
    </svg>
  );
}

interface LogoLockupProps {
  iconSize?: number;
  textSize?: number;
  sub?: string;
  className?: string;
}

export function LogoLockup({ iconSize = 20, textSize = 14, sub, className }: LogoLockupProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <LogoIcon size={iconSize} />
      <div>
        <div style={{ color: '#e8b84b', fontWeight: 700, fontSize: textSize, letterSpacing: '0.02em', lineHeight: 1 }}>
          GoldTrader
        </div>
        {sub && (
          <div style={{ color: '#555', fontSize: textSize * 0.7, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
