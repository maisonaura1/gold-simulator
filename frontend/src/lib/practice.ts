import type { Practice } from '@/content/academy/types';
import { fmtPct } from '@/lib/format';

export interface PracticeCheck {
  label: string;
  ok: boolean;
}

export interface TradeForCheck {
  side: 'BUY' | 'SELL';
  riskPct: number;
  rr: number;
  notes: string;
}

export function describeRules(p: Practice): string[] {
  const out: string[] = ['Que la operación tenga stop loss y take profit'];
  const r = p.rules;
  if (r.maxRiskPct != null) out.push(`Riesgo máximo del ${fmtPct(r.maxRiskPct, { decimals: r.maxRiskPct % 1 ? 1 : 0 })} del balance`);
  if (r.minRR != null) out.push(`Relación beneficio/riesgo de al menos 1:${r.minRR}`);
  if (r.requireNotes) out.push('Que escribas por qué abres la operación');
  if (r.side) out.push(r.side === 'BUY' ? 'Que sea una compra' : 'Que sea una venta');
  if ((p.count ?? 1) > 1) out.push(`${p.count} operaciones que cumplan las reglas`);
  return out;
}

// Margen del 3%: el precio se mueve entre que calculas la orden y la envías.
export function checkPractice(p: Practice, t: TradeForCheck): PracticeCheck[] {
  const r = p.rules;
  const checks: PracticeCheck[] = [];
  if (r.maxRiskPct != null) checks.push({ label: `Riesgo ≤ ${r.maxRiskPct}%`, ok: t.riskPct > 0 && t.riskPct <= r.maxRiskPct * 1.03 });
  if (r.minRR != null) checks.push({ label: `R:R ≥ 1:${r.minRR}`, ok: t.rr >= r.minRR * 0.97 });
  if (r.requireNotes) checks.push({ label: 'Motivo escrito', ok: t.notes.trim().length >= 3 });
  if (r.side) checks.push({ label: r.side === 'BUY' ? 'Compra' : 'Venta', ok: t.side === r.side });
  return checks;
}
