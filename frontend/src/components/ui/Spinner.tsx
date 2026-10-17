import { Loader2 } from 'lucide-react';

export function Spinner({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-[14px] text-fg-dim" role="status">
      <Loader2 className="h-5 w-5 animate-spin text-gold-400" />
      {label}
    </div>
  );
}

export function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950">
      <Loader2 className="h-6 w-6 animate-spin text-gold-400" aria-label="Cargando" />
    </div>
  );
}
