'use client';
import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fmtUsd } from '@/lib/format';
import type { DailyStats } from '@/types';

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const monthFmt = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function MonthCalendar({ data }: { data: DailyStats | undefined }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const byDay = useMemo(() => new Map((data?.days ?? []).map((d) => [d.date, d])), [data]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = (new Date(year, month, 1).getDay() + 6) % 7; // lunes = 0
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const key = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const monthTotal = (data?.months ?? []).find((m) => m.month === `${year}-${String(month + 1).padStart(2, '0')}`)?.pnl ?? 0;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="rounded-lg p-1.5 text-fg-dim hover:bg-ink-800 hover:text-fg" aria-label="Mes anterior">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-center">
          <div className="text-[14px] font-semibold text-fg">{capitalize(monthFmt.format(cursor))}</div>
          <div className={clsx('text-[12px] num', monthTotal > 0 ? 'text-green-400' : monthTotal < 0 ? 'text-red-400' : 'text-fg-dim')}>
            {monthTotal ? fmtUsd(monthTotal, { sign: true }) : 'Sin operaciones'}
          </div>
        </div>
        <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="rounded-lg p-1.5 text-fg-dim hover:bg-ink-800 hover:text-fg" aria-label="Mes siguiente">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="pb-1 text-[11px] font-medium text-fg-dim">
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          if (d == null) return <div key={`e${i}`} />;
          const info = byDay.get(key(d));
          return (
            <div
              key={d}
              title={info ? `${info.trades} operaciones · ${fmtUsd(info.pnl, { sign: true })}` : undefined}
              className={clsx(
                'flex aspect-square flex-col items-center justify-center rounded-lg border text-[11px]',
                !info && 'border-ink-750 text-fg-dim',
                info && info.pnl > 0 && 'border-up/30 bg-up/10 text-green-200',
                info && info.pnl < 0 && 'border-down/30 bg-down/10 text-red-200',
                info && info.pnl === 0 && 'border-ink-600 bg-ink-800 text-fg-muted',
              )}
            >
              <span>{d}</span>
              {info && <span className="hidden text-[10px] num sm:block">{fmtUsd(info.pnl, { decimals: 0, sign: true })}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
