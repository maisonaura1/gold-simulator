'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { CheckCircle2, CircleSlash, Target, TrendingDown, TrendingUp, XCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button, ButtonLink } from '@/components/ui/Button';
import { fmtPct, fmtPrice, fmtRR, fmtUsd } from '@/lib/format';
import type { PracticeCheck } from '@/lib/practice';
import type { SimulationResult, Trade } from '@/types';
import type { SubmittedOrder } from './OrderPanel';

export interface PracticeOutcome {
  lessonId: string;
  lessonTitle: string;
  checks: PracticeCheck[];
  hits: number;
  needed: number;
}

function feedback(o: SubmittedOrder): { ok: boolean; text: string }[] {
  const out: { ok: boolean; text: string }[] = [];
  if (o.riskPct <= 1) out.push({ ok: true, text: `Riesgo del ${fmtPct(o.riskPct, { decimals: 2 })}: conservador, así sobrevives a las rachas malas.` });
  else if (o.riskPct <= 2) out.push({ ok: true, text: `Riesgo del ${fmtPct(o.riskPct, { decimals: 2 })}: dentro del límite razonable (≤ 2%).` });
  else out.push({ ok: false, text: `Riesgo del ${fmtPct(o.riskPct, { decimals: 2 })}: demasiado alto. Con 5 pérdidas seguidas perderías cerca del ${Math.round(o.riskPct * 5)}% de la cuenta.` });
  if (o.rr >= 2) out.push({ ok: true, text: `R:R de ${fmtRR(o.rr)}: con acertar 1 de cada 3 ya no pierdes dinero.` });
  else if (o.rr >= 1) out.push({ ok: false, text: `R:R de ${fmtRR(o.rr)}: necesitas acertar mucho para ser rentable. Busca al menos 1:2.` });
  else out.push({ ok: false, text: `R:R de ${fmtRR(o.rr)}: arriesgas más de lo que puedes ganar.` });
  if (o.notes.trim().length >= 3) out.push({ ok: true, text: 'Anotaste el motivo: podrás revisarlo en tu diario.' });
  else out.push({ ok: false, text: 'No escribiste el motivo. Sin motivo no hay forma de saber qué funciona.' });
  return out;
}

export function ResultModal({
  result,
  practice,
  onClose,
}: {
  result: { order: SubmittedOrder; trade: Trade; simulation: SimulationResult } | null;
  practice: PracticeOutcome | null;
  onClose: () => void;
}) {
  if (!result) return null;
  const { order, simulation: s } = result;
  const win = s.resultUsd > 0;
  const loss = s.resultUsd < 0;
  const Icon = s.outcome === 'TP_HIT' ? TrendingUp : s.outcome === 'SL_HIT' ? TrendingDown : CircleSlash;
  const title = s.outcome === 'TP_HIT' ? 'Objetivo alcanzado' : s.outcome === 'SL_HIT' ? 'Stop loss tocado' : 'Sin resultado claro';
  const practicePassed = practice?.checks.every((c) => c.ok);

  return (
    <Modal open onClose={onClose} size="md">
      <div className="text-center">
        <div
          className={clsx(
            'mx-auto flex h-14 w-14 items-center justify-center rounded-2xl',
            win && 'bg-up/15 text-green-300',
            loss && 'bg-down/15 text-red-300',
            !win && !loss && 'bg-ink-750 text-fg-muted',
          )}
        >
          <Icon className="h-7 w-7" />
        </div>
        <h2 className="mt-3 text-[20px] font-semibold text-fg">{title}</h2>
        <div className={clsx('mt-1 text-[34px] font-bold num tracking-tight', win ? 'text-green-400' : loss ? 'text-red-400' : 'text-fg')}>
          {fmtUsd(s.resultUsd, { sign: true })}
        </div>
        <div className="text-[13px] text-fg-dim">
          {fmtPct(s.resultPct, { sign: true, decimals: 2 })} de la cuenta · duró unas {s.candlesTraversed} h
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-700 bg-ink-700 text-[13px]">
        {[
          [order.side === 'BUY' ? 'Compra a' : 'Venta a', fmtPrice(order.entry)],
          ['Salida', fmtPrice(s.exitPrice)],
          ['Tamaño', `${order.lots.toFixed(2)} lotes`],
          ['Riesgo', fmtPct(s.riskPct, { decimals: 2 })],
          ['Stop / objetivo', `${fmtPrice(order.sl)} / ${fmtPrice(order.tp)}`],
          ['R:R', fmtRR(s.rrRatio)],
        ].map(([k, v]) => (
          <div key={k} className="bg-ink-900 px-3 py-2.5">
            <dt className="text-fg-dim">{k}</dt>
            <dd className="font-medium num text-fg">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5">
        <div className="text-[13px] font-semibold text-fg">Cómo lo hiciste</div>
        <ul className="mt-2 space-y-2">
          {feedback(order).map((f) => (
            <li key={f.text} className="flex gap-2 text-[14px] text-fg-muted">
              {f.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />}
              {f.text}
            </li>
          ))}
        </ul>
        <p className="mt-3 rounded-xl bg-ink-800 px-3 py-2.5 text-[13px] text-fg-muted">
          Una sola operación no dice si lo haces bien. Lo que cuenta es repetir buenas decisiones durante muchas operaciones.
        </p>
      </div>

      {practice && (
        <div className={clsx('mt-5 rounded-2xl border p-4', practicePassed ? 'border-up/40 bg-up/[0.07]' : 'border-warn/40 bg-warn/[0.07]')}>
          <div className="flex items-center gap-2 text-[14px] font-semibold text-fg">
            <Target className="h-4 w-4 text-gold-400" /> Práctica: {practice.lessonTitle}
          </div>
          <ul className="mt-2 space-y-1">
            {practice.checks.map((c) => (
              <li key={c.label} className="flex items-center gap-2 text-[13px] text-fg-muted">
                {c.ok ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <XCircle className="h-4 w-4 text-red-300" />}
                {c.label}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[13px] text-fg-muted">
            {practicePassed
              ? practice.hits >= practice.needed
                ? '¡Práctica completada! Se ha guardado en tu progreso.'
                : `Operación válida: llevas ${practice.hits} de ${practice.needed}.`
              : 'Esta operación no cumple todas las reglas de la práctica. Ajusta y vuelve a intentarlo.'}
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Button variant="secondary" onClick={onClose}>
          Nueva operación
        </Button>
        {practice && practicePassed && practice.hits >= practice.needed ? (
          <ButtonLink href={`/academy/${practice.lessonId}`}>Volver a la lección</ButtonLink>
        ) : (
          <ButtonLink href="/journal" variant="secondary">
            Ver mi diario
          </ButtonLink>
        )}
      </div>
      {!practice && (
        <p className="mt-4 text-center text-[12px] text-fg-dim">
          ¿Dudas con el tamaño o el stop? Repasa{' '}
          <Link href="/academy/n2-tamano-posicion" className="link">
            cómo calcular el tamaño de posición
          </Link>
          .
        </p>
      )}
    </Modal>
  );
}
