// Matemática de trading compartida por el simulador, la calculadora y las lecciones.
// Debe coincidir con el backend: backend/src/trades (LOT_SIZE_XAU = 100).

export const OZ_PER_LOT = 100;
export const SPREAD = 0.3;
export const START_BALANCE = 10_000;
export const MIN_LOT = 0.01;
export const MAX_LOT = 10;
/** Distancia mínima de SL/TP que acepta el backend. */
export const MIN_STOP_DISTANCE = 0.1;

export type Side = 'BUY' | 'SELL';

/** Dólares que gana o pierde la posición por cada $1 que se mueve el precio. */
export function valuePerDollar(lots: number): number {
  return lots * OZ_PER_LOT;
}

export function riskUsd(lots: number, entry: number, stop: number): number {
  if (!lots || !entry || !stop) return 0;
  return Math.abs(entry - stop) * lots * OZ_PER_LOT;
}

export function rewardUsd(lots: number, entry: number, target: number): number {
  if (!lots || !entry || !target) return 0;
  return Math.abs(target - entry) * lots * OZ_PER_LOT;
}

/** Relación beneficio/riesgo (2 = 1:2). */
export function rrRatio(entry: number, stop: number, target: number): number {
  const risk = Math.abs(entry - stop);
  if (!risk || !target) return 0;
  return Math.abs(target - entry) / risk;
}

/** lotes = riesgo en $ ÷ (distancia al stop × 100), redondeado hacia abajo a 0.01. */
export function lotsForRisk(balance: number, riskPct: number, stopDistance: number): number {
  if (!balance || !riskPct || !stopDistance) return 0;
  const raw = (balance * (riskPct / 100)) / (stopDistance * OZ_PER_LOT);
  const floored = Math.floor(raw * 100) / 100;
  return Math.min(MAX_LOT, floored);
}

export function bidAsk(mid: number): { bid: number; ask: number } {
  if (!mid) return { bid: 0, ask: 0 };
  return { bid: round2(mid - SPREAD / 2), ask: round2(mid + SPREAD / 2) };
}

export function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

/** Comprueba que SL y TP están del lado correcto (mismas reglas que el backend). */
export function validateOrder(side: Side, entry: number, sl: number, tp: number): string | null {
  if (!sl) return 'Pon un stop loss: limita lo que puedes perder.';
  if (!tp) return 'Pon un take profit: define tu objetivo.';
  if (side === 'BUY') {
    if (sl >= entry) return `En una compra el stop va por debajo del precio de entrada (${entry.toFixed(2)}).`;
    if (tp <= entry) return `En una compra el objetivo va por encima del precio de entrada (${entry.toFixed(2)}).`;
  } else {
    if (sl <= entry) return `En una venta el stop va por encima del precio de entrada (${entry.toFixed(2)}).`;
    if (tp >= entry) return `En una venta el objetivo va por debajo del precio de entrada (${entry.toFixed(2)}).`;
  }
  if (Math.abs(entry - sl) < MIN_STOP_DISTANCE) return 'El stop está demasiado cerca (mínimo $0.10).';
  if (Math.abs(tp - entry) < MIN_STOP_DISTANCE) return 'El objetivo está demasiado cerca (mínimo $0.10).';
  return null;
}

export type RiskLevel = 'none' | 'low' | 'ok' | 'high' | 'danger';

export function riskLevel(pct: number): RiskLevel {
  if (!pct) return 'none';
  if (pct <= 1) return 'low';
  if (pct <= 2) return 'ok';
  if (pct <= 3) return 'high';
  return 'danger';
}
