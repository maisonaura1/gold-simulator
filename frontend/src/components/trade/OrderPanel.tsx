'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Check, Circle, Minus, Plus } from 'lucide-react';
import { usePricesStore } from '@/store/prices.store';
import { useChartStore } from '@/store/chart.store';
import { useChartLines } from '@/store/chart-lines.store';
import { useBilling } from '@/store/billing.store';
import { useApi } from '@/hooks/useApi';
import { simulateTrade } from '@/hooks/useTrades';
import { Button } from '@/components/ui/Button';
import { apiError, fmtPct, fmtPrice, fmtRR, fmtUsd } from '@/lib/format';
import {
  MAX_LOT,
  MIN_LOT,
  START_BALANCE,
  bidAsk,
  lotsForRisk,
  rewardUsd as calcReward,
  riskLevel,
  riskUsd as calcRisk,
  round2,
  rrRatio,
  validateOrder,
  type Side,
} from '@/lib/trading';
import type { Practice } from '@/content/academy/types';
import type { SimAccount, SimulationResult, Trade } from '@/types';

export interface SubmittedOrder {
  side: Side;
  lots: number;
  entry: number;
  sl: number;
  tp: number;
  riskPct: number;
  rr: number;
  notes: string;
}

const STOP_CHIPS = [3, 5, 10, 15];
const RR_CHIPS = [1.5, 2, 3];
const RISK_CHIPS = [0.5, 1, 2];

export function OrderPanel({
  practice,
  onResult,
}: {
  practice?: Practice;
  onResult: (r: { order: SubmittedOrder; trade: Trade; simulation: SimulationResult }) => void;
}) {
  const price = usePricesStore((s) => s.currentPrice);
  const { bid, ask } = bidAsk(price);
  const { data: account } = useApi<SimAccount>('/account');
  const balance = account?.currentBalance ?? START_BALANCE;
  const setPreview = useChartLines((s) => s.setPreview);
  const clearPreview = useChartLines((s) => s.clearPreview);
  const { status, openPaywall, fetchStatus } = useBilling();

  const [side, setSide] = useState<Side>(practice?.rules.side ?? 'BUY');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [lots, setLots] = useState('0.01');
  const [autoSize, setAutoSize] = useState(true);
  const [riskTarget, setRiskTarget] = useState(Math.min(1, practice?.rules.maxRiskPct ?? 1));
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const entry = side === 'BUY' ? ask : bid;
  const entryRef = useRef(entry);
  entryRef.current = entry;

  const slN = parseFloat(sl) || 0;
  const tpN = parseFloat(tp) || 0;
  const lotsN = parseFloat(lots) || 0;

  const risk = calcRisk(lotsN, entry, slN);
  const reward = calcReward(lotsN, entry, tpN);
  const riskPct = balance > 0 ? (risk / balance) * 100 : 0;
  const rr = slN && tpN ? rrRatio(entry, slN, tpN) : 0;
  const level = riskLevel(riskPct);

  // Tamaño automático según el riesgo elegido (solo cuando cambia el stop o el %)
  useEffect(() => {
    if (!autoSize || !slN || !entryRef.current) return;
    const dist = Math.abs(entryRef.current - slN);
    const l = lotsForRisk(balance, riskTarget, dist);
    setLots(l >= MIN_LOT ? l.toFixed(2) : MIN_LOT.toFixed(2));
  }, [autoSize, slN, riskTarget, balance]);

  // Al entrar o salir del replay el precio salta: los niveles anteriores ya no sirven
  // (se mantienen al avanzar vela a vela, se borran al saltar a otra fecha)
  const replayMode = useChartStore((s) => s.replayMode);
  const replayCursor = useChartStore((s) => s.replayCursor);
  const prevReplay = useRef({ mode: replayMode, cursor: replayCursor });
  useEffect(() => {
    const prev = prevReplay.current;
    const jumped = prev.mode !== replayMode || (replayMode && Math.abs(replayCursor - prev.cursor) > 1);
    prevReplay.current = { mode: replayMode, cursor: replayCursor };
    if (jumped) {
      setSl('');
      setTp('');
    }
  }, [replayMode, replayCursor]);

  useEffect(() => {
    setPreview({ entryPrice: entry || null, sl: slN || null, tp: tpN || null, tradeType: side });
  }, [entry, slN, tpN, side, setPreview]);
  useEffect(() => () => clearPreview(), [clearPreview]);

  const setStopDistance = (d: number) => {
    if (!entry) return;
    const newSl = side === 'BUY' ? entry - d : entry + d;
    setSl(round2(newSl).toFixed(2));
    const currentRR = tpN && slN ? rrRatio(entry, slN, tpN) : 2;
    const newTp = side === 'BUY' ? entry + d * currentRR : entry - d * currentRR;
    setTp(round2(newTp).toFixed(2));
  };

  const setTargetRR = (r: number) => {
    if (!entry || !slN) return;
    const d = Math.abs(entry - slN);
    setTp(round2(side === 'BUY' ? entry + d * r : entry - d * r).toFixed(2));
  };

  const switchSide = (next: Side) => {
    if (next === side) return;
    const newEntry = next === 'BUY' ? ask : bid;
    if (slN && tpN && entry) {
      const dSl = Math.abs(entry - slN);
      const dTp = Math.abs(tpN - entry);
      setSl(round2(next === 'BUY' ? newEntry - dSl : newEntry + dSl).toFixed(2));
      setTp(round2(next === 'BUY' ? newEntry + dTp : newEntry - dTp).toFixed(2));
    }
    setSide(next);
  };

  const stepLots = (delta: number) => {
    setAutoSize(false);
    setLots((v) => Math.min(MAX_LOT, Math.max(MIN_LOT, round2((parseFloat(v) || 0) + delta))).toFixed(2));
  };

  const checks = useMemo(
    () => [
      { label: 'Stop loss puesto', ok: slN > 0 },
      { label: 'Take profit puesto', ok: tpN > 0 },
      { label: 'Riesgo ≤ 2% del balance', ok: riskPct > 0 && riskPct <= 2 },
      { label: 'Relación beneficio/riesgo ≥ 1:2', ok: rr >= 2 },
      { label: 'Motivo de la operación escrito', ok: notes.trim().length >= 3 },
    ],
    [slN, tpN, riskPct, rr, notes],
  );

  const submit = async () => {
    setError('');
    if (!entry) return setError('Esperando el precio del mercado…');
    const invalid = validateOrder(side, entry, slN, tpN);
    if (invalid) return setError(invalid);
    if (lotsN < MIN_LOT || lotsN > MAX_LOT) return setError(`El tamaño debe estar entre ${MIN_LOT} y ${MAX_LOT} lotes.`);
    if (status && !status.canSimulate) return openPaywall('limit');

    setBusy(true);
    const order: SubmittedOrder = { side, lots: lotsN, entry, sl: slN, tp: tpN, riskPct, rr, notes };
    try {
      const res = await simulateTrade({ type: side, lot: lotsN, entryPrice: entry, sl: slN, tp: tpN, notes });
      onResult({ order, ...res });
      setNotes('');
      void fetchStatus();
    } catch (e) {
      const msg = (e as { response?: { status?: number; data?: { message?: string } } })?.response;
      if (msg?.status === 403 && msg.data?.message === 'FREE_LIMIT_REACHED') {
        void fetchStatus();
        openPaywall('limit');
      } else {
        setError(apiError(e, 'No se pudo simular la operación.'));
      }
    } finally {
      setBusy(false);
    }
  };

  const remaining = status && !status.paid ? Math.max(0, status.simulationsLimit - status.simulationsUsed) : null;

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Lado */}
      <div className="grid grid-cols-2 gap-2">
        {(['BUY', 'SELL'] as Side[]).map((s) => {
          const active = side === s;
          const p = s === 'BUY' ? ask : bid;
          const locked = practice?.rules.side && practice.rules.side !== s;
          return (
            <button
              key={s}
              type="button"
              disabled={!!locked}
              onClick={() => switchSide(s)}
              className={clsx(
                'rounded-xl border px-3 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-40',
                active && s === 'BUY' && 'border-up/60 bg-up/10',
                active && s === 'SELL' && 'border-down/60 bg-down/10',
                !active && 'border-ink-700 bg-ink-900 hover:border-ink-600',
              )}
            >
              <div className={clsx('text-[12px] font-semibold', s === 'BUY' ? 'text-green-300' : 'text-red-300')}>
                {s === 'BUY' ? 'Comprar' : 'Vender'}
              </div>
              <div className="text-[18px] font-semibold num text-fg">{fmtPrice(p)}</div>
            </button>
          );
        })}
      </div>
      <div className="-mt-2 text-center text-[11px] text-fg-dim">Spread fijo 0.30 · 1 lote = 100 onzas</div>

      {/* Stop */}
      <div>
        <label className="label" htmlFor="sl">
          Stop loss <span className="text-fg-dim">(precio)</span>
        </label>
        <input id="sl" inputMode="decimal" className="input num" placeholder={side === 'BUY' ? 'Por debajo de la entrada' : 'Por encima de la entrada'} value={sl} onChange={(e) => setSl(e.target.value)} />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {STOP_CHIPS.map((d) => (
            <button key={d} type="button" onClick={() => setStopDistance(d)} className="rounded-lg border border-ink-700 px-2.5 py-1 text-[12px] text-fg-muted transition hover:border-ink-600 hover:text-fg">
              a ${d}
            </button>
          ))}
        </div>
      </div>

      {/* Objetivo */}
      <div>
        <label className="label" htmlFor="tp">
          Take profit <span className="text-fg-dim">(precio)</span>
        </label>
        <input id="tp" inputMode="decimal" className="input num" placeholder={side === 'BUY' ? 'Por encima de la entrada' : 'Por debajo de la entrada'} value={tp} onChange={(e) => setTp(e.target.value)} />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {RR_CHIPS.map((r) => (
            <button
              key={r}
              type="button"
              disabled={!slN}
              onClick={() => setTargetRR(r)}
              className="rounded-lg border border-ink-700 px-2.5 py-1 text-[12px] text-fg-muted transition hover:border-ink-600 hover:text-fg disabled:opacity-40"
            >
              {fmtRR(r)}
            </button>
          ))}
        </div>
      </div>

      {/* Tamaño */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-[13px] font-medium text-fg-muted" htmlFor="lots">
            Tamaño (lotes)
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-[12px] text-fg-dim">
            <input type="checkbox" className="accent-[#ddb54a]" checked={autoSize} onChange={(e) => setAutoSize(e.target.checked)} />
            Calcular por riesgo
          </label>
        </div>
        {autoSize && (
          <div className="mb-2 flex gap-1.5">
            {RISK_CHIPS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRiskTarget(r)}
                className={clsx(
                  'flex-1 rounded-lg border py-1.5 text-[12px] font-medium transition',
                  riskTarget === r ? 'border-gold-400/60 bg-gold-500/10 text-gold-200' : 'border-ink-700 text-fg-muted hover:border-ink-600',
                )}
              >
                Arriesgar {r}%
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <button type="button" onClick={() => stepLots(-0.01)} className="rounded-xl border border-ink-700 px-3 text-fg-muted hover:text-fg" aria-label="Menos lotes">
            <Minus className="h-4 w-4" />
          </button>
          <input
            id="lots"
            inputMode="decimal"
            className="input text-center num"
            value={lots}
            onChange={(e) => {
              setAutoSize(false);
              setLots(e.target.value);
            }}
          />
          <button type="button" onClick={() => stepLots(0.01)} className="rounded-xl border border-ink-700 px-3 text-fg-muted hover:text-fg" aria-label="Más lotes">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1.5 text-[12px] text-fg-dim">
          Cada $1 que se mueve el oro = {fmtUsd(lotsN * 100)} para ti con {lotsN.toFixed(2)} lotes.
        </p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-ink-700 bg-ink-900 p-3 text-center">
        <div>
          <div className="text-[11px] text-fg-dim">Riesgo</div>
          <div className={clsx('text-[15px] font-semibold num', level === 'danger' || level === 'high' ? 'text-red-300' : 'text-fg')}>{risk ? fmtUsd(risk) : '—'}</div>
          <div className={clsx('text-[11px] num', level === 'danger' ? 'text-red-300' : level === 'high' ? 'text-amber-300' : 'text-fg-dim')}>
            {riskPct ? fmtPct(riskPct, { decimals: 2 }) : '—'}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-fg-dim">Beneficio posible</div>
          <div className="text-[15px] font-semibold num text-green-300">{reward ? fmtUsd(reward) : '—'}</div>
        </div>
        <div>
          <div className="text-[11px] text-fg-dim">R:R</div>
          <div className={clsx('text-[15px] font-semibold num', rr >= 2 ? 'text-gold-300' : rr > 0 ? 'text-amber-300' : 'text-fg')}>{fmtRR(rr)}</div>
        </div>
      </div>

      {/* Motivo */}
      <div>
        <label className="label" htmlFor="notes">
          ¿Por qué abres esta operación?
        </label>
        <textarea
          id="notes"
          rows={2}
          maxLength={500}
          className="input resize-none"
          placeholder="Ej.: retroceso a soporte H1 a favor de la tendencia, vela de rechazo"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Checklist */}
      <ul className="space-y-1.5">
        {checks.map((c) => (
          <li key={c.label} className={clsx('flex items-center gap-2 text-[13px]', c.ok ? 'text-fg-muted' : 'text-fg-dim')}>
            {c.ok ? <Check className="h-4 w-4 text-green-400" /> : <Circle className="h-4 w-4 text-ink-600" />}
            {c.label}
          </li>
        ))}
      </ul>

      {error && <p className="rounded-xl border border-down/30 bg-down/10 px-3 py-2 text-[13px] text-red-200">{error}</p>}

      <Button size="lg" block variant={side === 'BUY' ? 'buy' : 'sell'} loading={busy} onClick={submit}>
        {side === 'BUY' ? 'Simular compra' : 'Simular venta'} · {lotsN.toFixed(2)} lotes
      </Button>
      <p className="-mt-2 text-center text-[11px] leading-relaxed text-fg-dim">
        El simulador reproduce velas H1 reales del oro y comprueba qué se toca antes: el stop o el objetivo.
        {remaining != null && (
          <>
            {' '}
            Te quedan <span className="font-semibold text-gold-300">{remaining}</span> simulaciones gratis.
          </>
        )}
      </p>
    </div>
  );
}
