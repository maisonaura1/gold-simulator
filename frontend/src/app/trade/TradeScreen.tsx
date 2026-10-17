'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { ArrowLeft, Radio, Target } from 'lucide-react';
import { PriceChart } from '@/components/trade/PriceChart';
import { OrderPanel, type SubmittedOrder } from '@/components/trade/OrderPanel';
import { ResultModal, type PracticeOutcome } from '@/components/trade/ResultModal';
import { useSocket } from '@/hooks/useSocket';
import { useReplay } from '@/hooks/useReplay';
import { useTrades } from '@/hooks/useTrades';
import { usePricesStore } from '@/store/prices.store';
import { useChartStore } from '@/store/chart.store';
import { useProgress } from '@/store/progress.store';
import { findLesson } from '@/lib/catalog';
import { useCatalog } from '@/components/academy/CatalogProvider';
import { checkPractice, describeRules } from '@/lib/practice';
import { fmtDateTime, fmtPrice, fmtRR, fmtUsd } from '@/lib/format';
import type { SimulationResult, Trade } from '@/types';

export function TradeScreen() {
  useSocket();
  useReplay();
  const params = useSearchParams();
  const catalog = useCatalog();
  const lesson = findLesson(catalog, params.get('practica'));
  const practice = lesson?.practice;
  const connected = usePricesStore((s) => s.connected);
  const price = usePricesStore((s) => s.currentPrice);
  const replay = useChartStore((s) => s.replayMode);
  const hits = useProgress((s) => (lesson ? s.practiceHits[lesson.id] ?? 0 : 0));
  const practiceDone = useProgress((s) => (lesson ? !!s.lessons[lesson.id]?.practiceDone : false));

  const [result, setResult] = useState<{ order: SubmittedOrder; trade: Trade; simulation: SimulationResult } | null>(null);
  const [practiceOutcome, setPracticeOutcome] = useState<PracticeOutcome | null>(null);

  const onResult = (r: { order: SubmittedOrder; trade: Trade; simulation: SimulationResult }) => {
    if (lesson && practice) {
      const checks = checkPractice(practice, { side: r.order.side, riskPct: r.order.riskPct, rr: r.order.rr, notes: r.order.notes });
      const needed = practice.count ?? 1;
      let total = hits;
      if (checks.every((c) => c.ok)) total = useProgress.getState().addPracticeHit(lesson.id, needed);
      setPracticeOutcome({ lessonId: lesson.id, lessonTitle: lesson.title, checks, hits: total, needed });
    } else {
      setPracticeOutcome(null);
    }
    setResult(r);
  };

  return (
    <div className="flex flex-col lg:h-screen">
      {lesson && practice && (
        <div className="border-b border-gold-500/25 bg-gradient-to-r from-gold-500/[0.12] to-transparent px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-gold-300">
                <Target className="h-4 w-4" /> Modo práctica · {lesson.title}
              </div>
              <p className="mt-1 text-[14px] text-fg">{practice.goal}</p>
              <p className="mt-1 text-[12px] text-fg-muted">{describeRules(practice).join(' · ')}</p>
            </div>
            <div className="flex items-center gap-3">
              {(practice.count ?? 1) > 1 && (
                <span className="text-[13px] text-fg-muted num">
                  {Math.min(hits, practice.count ?? 1)} / {practice.count} válidas
                </span>
              )}
              {practiceDone && <span className="text-[13px] font-medium text-green-400">Completada</span>}
              <Link href={`/academy/${lesson.id}`} className="inline-flex items-center gap-1 text-[13px] text-fg-muted hover:text-fg">
                <ArrowLeft className="h-4 w-4" /> Lección
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-ink-750 bg-ink-900 px-4 py-2">
            <div className="flex items-baseline gap-3">
              <h1 className="text-[15px] font-semibold text-fg">Oro · XAU/USD</h1>
              <span className="text-[20px] font-semibold num text-fg">{fmtPrice(price)}</span>
            </div>
            <span className={clsx('inline-flex items-center gap-1.5 text-[12px]', replay ? 'text-gold-300' : connected ? 'text-green-400' : 'text-fg-dim')}>
              <Radio className="h-3.5 w-3.5" />
              {replay ? 'Replay' : connected ? 'En directo' : 'Conectando…'}
            </span>
          </div>
          <div className="h-[56vh] min-h-[340px] lg:h-auto lg:min-h-0 lg:flex-1">
            <PriceChart />
          </div>
          <RecentTrades />
        </section>

        <aside className="w-full shrink-0 border-ink-750 bg-ink-900 lg:w-[370px] lg:overflow-y-auto lg:border-l">
          <div className="border-b border-ink-750 px-4 py-3">
            <h2 className="text-[15px] font-semibold text-fg">Nueva operación</h2>
            <p className="text-[12px] text-fg-dim">Cuenta demo con dinero ficticio</p>
          </div>
          <OrderPanel key={lesson?.id ?? 'libre'} practice={practice} onResult={onResult} />
        </aside>
      </div>

      <ResultModal result={result} practice={practiceOutcome} onClose={() => setResult(null)} />
    </div>
  );
}

function RecentTrades() {
  const { trades } = useTrades();
  const last = trades.slice(0, 5);
  if (last.length === 0) return null;
  return (
    <div className="hidden border-t border-ink-750 bg-ink-900 lg:block">
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-[12px] font-semibold uppercase tracking-wide text-fg-dim">Últimas operaciones</span>
        <Link href="/journal" className="text-[12px] text-gold-300 hover:underline">
          Ver diario
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <tbody className="divide-y divide-ink-750">
            {last.map((t) => (
              <tr key={t.id} className="text-fg-muted">
                <td className="px-4 py-1.5 text-fg-dim">{fmtDateTime(t.entryAt)}</td>
                <td className={clsx('px-2 py-1.5 font-medium', t.type === 'BUY' ? 'text-green-300' : 'text-red-300')}>{t.type === 'BUY' ? 'Compra' : 'Venta'}</td>
                <td className="px-2 py-1.5 num">{t.lot.toFixed(2)} lotes</td>
                <td className="px-2 py-1.5 num">{fmtPrice(t.entryPrice)}</td>
                <td className="px-2 py-1.5 num">{fmtRR(t.rrRatio)}</td>
                <td className={clsx('px-4 py-1.5 text-right font-semibold num', (t.resultUsd ?? 0) >= 0 ? 'text-green-400' : 'text-red-400')}>
                  {fmtUsd(t.resultUsd, { sign: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
