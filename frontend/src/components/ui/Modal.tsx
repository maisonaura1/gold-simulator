'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panel}
        tabIndex={-1}
        className={clsx(
          'relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-ink-700 bg-ink-850 p-6 shadow-2xl outline-none animate-fade-up sm:rounded-2xl',
          size === 'sm' && 'sm:max-w-sm',
          size === 'md' && 'sm:max-w-lg',
          size === 'lg' && 'sm:max-w-2xl',
        )}
        style={{ paddingBottom: 'calc(1.5rem + var(--safe-bottom))' }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-fg-dim transition hover:bg-ink-750 hover:text-fg"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
        {title && <h2 className="mb-4 pr-8 text-lg font-semibold text-fg">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
