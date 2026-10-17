'use client';
import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { CandlestickChart, CheckCircle2, Download, Lock, Target } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { useBilling } from '@/store/billing.store';
import { PageHeader } from '@/components/layout/AppShell';
import { Stat } from '@/components/ui/Stat';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Empty } from '@/components/ui/Empty';
import { Spinner } from '@/components/ui/Spinner';
import { EquityChart, WeeklyChart } from '@/components/journal/Charts';
import { MonthCalendar } from '@/components/journal/MonthCalendar';
import { fmtDateTime, fmtPct, fmtPrice, fmtRR, fmtUsd } from '@/lib/format';
import { isPositiveFinding, stripLeadingSymbols } from '@/lib/text';
import { START_BALANCE } from '@/lib/trading';
import type { DailyStats, SimAccount, Stats, Trade } from '@/types';

type Filter = 'all' | 'win' | 'loss';

export function Journal() {
  const { data: stats, loading } = useApi<Stats>('/stats');
  const { data: daily } = useApi<DailyStats>('/stats/daily');
  const { data: trades } = useApi<Trade[]>('/trades');
  const { data: account } = useApi<SimAccount>('/account');
  const { status, openPaywall } = useBilling();
  const [filter, setFilter] = useState<Filter>('all');
  const [exporting, setExporting] = useState(false);

  const list = useMemo(() => {
    const all = trades ?? [];
    if (filter === 'win') return all.filter((t) => (t.resultUsd ?? 0) > 0);
    if (filter === 'loss') return all.filter((t) => (t.resultUsd ?? 0) < 0);
    return all;
  }, [trades, filter]);

  const exportCsv = async () => {
    if (!status?.paid) return openPaywall('upgrade');
    setExporting(true);
    try {
      const res = await api.get('/stats/export/csv', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'goldtrader-diario.csv';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  if (loading && !stats) return <Spinner />;

  const empty = !stats || stats.totalTrades === 0;
  const expectancy = stats && stats.totalTrades > 0 ? stats.totalPnl / stats.totalTrades : 0;

  return (
    <div>
      <PageHeader
        eyebrow="Revisa"
        title="Tu diario de trading"
        text="Cada simulación queda registrada con su motivo. Revísalo cada semana: aquí se ve si sigues tu plan."
        action={
          !empty && (
            <Button variant="secondary" size="sm" loading={exporting} onClick={exportCsv} icon={status?.paid ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />}>
              Exportar CSV
            </Button>
          )
        }
      />

      {empty ? (
        <div className="card">
          <Empty
            icon={<CandlestickChart className="h-6 w-6" />}
            title="Tu diario está vacío"
            text="Cuando simules operaciones, aquí verás tu porcentaje de acierto, tu curva de capital y en qué mejorar."
            action={<ButtonLink href="/trade">Abrir el simulador</ButtonLink>}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            <Stat label="Resultado total" value={fmtUsd(stats.totalPnl, { sign: true })} tone={stats.totalPnl >= 0 ? 'up' : 'down'} />
            <Stat label="% de acierto" value={fmtPct(stats.winRate)} sub={`${stats.wins} G · ${stats.losses} P`} />
            <Stat label="R:R medio" value={`1:${stats.avgRR.toFixed(1)}`} tone={stats.avgRR >= 2 ? 'gold' : undefined} />
            <Stat label="Riesgo medio" value={fmtPct(stats.avgRisk, { decimals: 2 })} tone={stats.avgRisk > 2 ? 'down' : 'up'} />
            <Stat label="Drawdown máx." value={fmtPct(stats.maxDrawdown)} tone={stats.maxDrawdown > 10 ? 'down' : undefined} />
            <Stat label="Media por operación" value={fmtUsd(expectancy, { sign: true })} tone={expectancy >= 0 ? 'up' : 'down'} sub="Tu esperanza real" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="card card-pad lg:col-span-2">
              <h2 className="text-[16px] font-semibold text-fg">Curva de capital</h2>
              <p className="text-[13px] text-fg-dim">Cómo ha evolucionado tu balance demo operación a operación.</p>
              <div className="mt-4">
                <EquityChart data={stats.equityCurve} start={account?.initialBalance ?? START_BALANCE} />
              </div>
            </div>
            <div className="card card-pad">
              <h2 className="text-[16px] font-semibold text-fg">Qué dicen tus números</h2>
              <ul className="mt-4 space-y-3">
                {stats.behaviours.map((b) => (
                  <li key={b} className="flex gap-2.5 text-[14px] text-fg-muted">
                    {isPositiveFinding(b) ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" /> : <Target className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />}
                    {stripLeadingSymbols(b)}
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl bg-ink-800 p-3 text-[13px] text-fg-muted">
                Racha ganadora máx.: <span className="font-semibold text-fg num">{stats.winStreak}</span> · Racha perdedora máx.:{' '}
                <span className="font-semibold text-fg num">{stats.lossStreak}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card card-pad">
              <h2 className="text-[16px] font-semibold text-fg">Resultado por semana</h2>
              <div className="mt-4">
                <WeeklyChart data={stats.weeklyPnl} />
              </div>
            </div>
            <div className="card card-pad">
              <h2 className="mb-3 text-[16px] font-semibold text-fg">Calendario</h2>
              <MonthCalendar data={daily} />
            </div>
          </div>

          <div className="card">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-6">
              <h2 className="text-[16px] font-semibold text-fg">Operaciones</h2>
              <div className="flex gap-1 rounded-xl border border-ink-700 bg-ink-900 p-1">
                {(
                  [
                    ['all', 'Todas'],
                    ['win', 'Ganadoras'],
                    ['loss', 'Perdedoras'],
                  ] as [Filter, string][]
                ).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setFilter(id)}
                    className={clsx('rounded-lg px-3 py-1 text-[13px] font-medium transition', filter === id ? 'bg-ink-750 text-fg' : 'text-fg-dim hover:text-fg')}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[720px] text-[13px]">
                <thead className="text-left text-[11px] uppercase tracking-wide text-fg-dim">
                  <tr className="border-b border-ink-750">
                    <th className="px-5 py-2 font-semibold sm:px-6">Fecha</th>
                    <th className="px-2 py-2 font-semibold">Tipo</th>
                    <th className="px-2 py-2 font-semibold">Lotes</th>
                    <th className="px-2 py-2 font-semibold">Entrada → salida</th>
                    <th className="px-2 py-2 font-semibold">Riesgo</th>
                    <th className="px-2 py-2 font-semibold">R:R</th>
                    <th className="px-2 py-2 font-semibold">Motivo</th>
                    <th className="px-5 py-2 text-right font-semibold sm:px-6">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-750">
                  {list.map((t) => (
                    <tr key={t.id} className="text-fg-muted">
                      <td className="whitespace-nowrap px-5 py-2.5 text-fg-dim sm:px-6">{fmtDateTime(t.entryAt)}</td>
                      <td className={clsx('px-2 py-2.5 font-medium', t.type === 'BUY' ? 'text-green-300' : 'text-red-300')}>{t.type === 'BUY' ? 'Compra' : 'Venta'}</td>
                      <td className="px-2 py-2.5 num">{t.lot.toFixed(2)}</td>
                      <td className="whitespace-nowrap px-2 py-2.5 num">
                        {fmtPrice(t.entryPrice)} → {fmtPrice(t.exitPrice)}
                      </td>
                      <td className={clsx('px-2 py-2.5 num', (t.riskPct ?? 0) > 2 && 'text-red-300')}>{fmtPct(t.riskPct, { decimals: 2 })}</td>
                      <td className={clsx('px-2 py-2.5 num', (t.rrRatio ?? 0) >= 2 && 'text-gold-300')}>{fmtRR(t.rrRatio)}</td>
                      <td className="max-w-[260px] truncate px-2 py-2.5" title={t.notes ?? ''}>
                        {t.notes || <span className="text-fg-dim">—</span>}
                      </td>
                      <td className={clsx('px-5 py-2.5 text-right font-semibold num sm:px-6', (t.resultUsd ?? 0) >= 0 ? 'text-green-400' : 'text-red-400')}>
                        {fmtUsd(t.resultUsd, { sign: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {list.length === 0 && <p className="px-6 py-8 text-center text-[14px] text-fg-dim">No hay operaciones con este filtro.</p>}
            </div>
            <p className="px-5 py-4 text-[12px] text-fg-dim sm:px-6">Se muestran tus últimas 200 operaciones.</p>
          </div>
        </div>
      )}
    </div>
  );
}
