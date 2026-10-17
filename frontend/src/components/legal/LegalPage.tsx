import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { title: string; body: string }[] }) {
  return (
    <div className="min-h-screen bg-ink-950">
      <header className="border-b border-ink-750 px-4 sm:px-6" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between">
          <Logo />
          <Link href="/" className="text-[14px] text-fg-muted hover:text-fg">
            ← Inicio
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="eyebrow">Legal</div>
        <h1 className="mt-2 text-[32px] font-semibold tracking-tight text-fg">{title}</h1>
        <p className="mt-1 text-[14px] text-fg-dim">Última actualización: {updated}</p>
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-[18px] font-semibold text-fg">{s.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
