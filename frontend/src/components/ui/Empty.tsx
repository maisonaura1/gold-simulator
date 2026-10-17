import type { ReactNode } from 'react';

export function Empty({ icon, title, text, action }: { icon?: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      {icon && <div className="mb-3 rounded-2xl border border-ink-700 bg-ink-800 p-3 text-gold-400">{icon}</div>}
      <h3 className="text-[16px] font-semibold text-fg">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-[14px] text-fg-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
