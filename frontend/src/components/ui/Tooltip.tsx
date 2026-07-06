'use client';
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'right' | 'left';
  width?: number;
  className?: string;
}

export function Tooltip({ text, children, side = 'top', width = 220, className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible) return;
    const hide = () => setVisible(false);
    document.addEventListener('scroll', hide, true);
    return () => document.removeEventListener('scroll', hide, true);
  }, [visible]);

  const posClass = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    right:  'left-full top-1/2 -translate-y-1/2 ml-1.5',
    left:   'right-full top-1/2 -translate-y-1/2 mr-1.5',
  }[side];

  return (
    <span
      ref={ref}
      className={clsx('relative inline-flex items-center cursor-help', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          className="absolute z-[9999] pointer-events-none"
          style={{ width }}
          // eslint-disable-next-line react/no-unknown-property
        >
          <span className={clsx('absolute', posClass)}>
            <span className="block bg-[#0e1118] border border-[#3b82f6]/40 text-[10px] text-[#c8cdd8] leading-relaxed px-2.5 py-2 shadow-xl whitespace-normal">
              {text}
            </span>
          </span>
        </span>
      )}
    </span>
  );
}

// Convenience: wraps a label text with an info icon
export function TipLabel({ label, tip, side }: { label: string; tip: string; side?: TooltipProps['side'] }) {
  return (
    <Tooltip text={tip} side={side ?? 'top'}>
      <span>{label}</span>
      <span className="ml-1 text-[#3b82f6]/60 text-[9px] select-none">ⓘ</span>
    </Tooltip>
  );
}
