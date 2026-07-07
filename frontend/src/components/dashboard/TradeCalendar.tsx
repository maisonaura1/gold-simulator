'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface DayData {
  date: string;   // YYYY-MM-DD
  pnl: number;
  trades: number;
  winRate: number;
}

interface DailyStats {
  days: DayData[];
  months: { month: string; pnl: number }[];
}

function fmt(n: number): string {
  const abs = Math.abs(n);
  const s = abs >= 1000 ? `$${(abs / 1000).toFixed(1)}K` : `$${abs.toFixed(0)}`;
  return n < 0 ? `-${s}` : `+${s}`;
}

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function TradeCalendar({ isPropFirm, onExportCsv }: { isPropFirm: boolean; onExportCsv?: () => void }) {
  const [data,    setData]    = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [month,   setMonth]   = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    api.get<DailyStats>('/stats/daily')
      .then((r) => setData(r.data))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-6 rounded-sm flex items-center justify-center" style={{ background: '#0f1117', border: '1px solid #1d2029', minHeight: 200 }}>
      <span style={{ color: '#3a3f4d', fontSize: 11, fontFamily: 'monospace' }}>Loading journal…</span>
    </div>
  );

  // Build lookup
  const dayMap: Record<string, DayData> = {};
  for (const d of data?.days ?? []) dayMap[d.date] = d;

  // Calendar grid for current month
  const [year, mon] = month.split('-').map(Number);
  const firstDay = new Date(year, mon - 1, 1);
  const daysInMonth = new Date(year, mon, 0).getDate();
  const startDow = firstDay.getDay(); // 0=Sun

  const cells: (DayData | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const d = `${month}-${String(i + 1).padStart(2, '0')}`;
      return dayMap[d] ?? null;
    }),
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const monthTotal = data?.months.find((m) => m.month === month)?.pnl ?? 0;
  const tradingDays = cells.filter((c, i) => i >= startDow && c !== null && c.trades > 0).length;

  const prevMonth = () => {
    const d = new Date(year, mon - 2, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };
  const nextMonth = () => {
    const d = new Date(year, mon, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const monthLabel = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="rounded-sm overflow-hidden" style={{ background: '#09090d', border: '1px solid #1d2029' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: '#0f1117', borderBottom: '1px solid #1d2029' }}>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} style={{ color: '#6b7385', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>‹</button>
          <span style={{ color: '#c8cdd8', fontWeight: 700, fontSize: 13 }}>{monthLabel}</span>
          <button onClick={nextMonth} style={{ color: '#6b7385', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>›</button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span style={{ color: '#6b7385', fontSize: 11 }}>Monthly P/L:</span>
            <span style={{ color: monthTotal >= 0 ? '#2dcc6f' : '#e84040', fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}>
              {monthTotal >= 0 ? '+' : ''}{monthTotal >= 1000 || monthTotal <= -1000
                ? `$${(monthTotal / 1000).toFixed(1)}K`
                : `$${monthTotal.toFixed(0)}`}
            </span>
          </div>
          <div className="px-2 py-0.5 rounded-sm text-xs font-mono"
            style={{ background: '#141720', color: '#8893a8', border: '1px solid #1d2029' }}>
            {tradingDays} days
          </div>
          {isPropFirm && onExportCsv && (
            <button
              onClick={onExportCsv}
              className="px-3 py-1 rounded-sm text-xs font-medium"
              style={{ background: '#080d14', color: '#4a6cf7', border: '1px solid #4a6cf744', cursor: 'pointer' }}
            >
              ↓ CSV
            </button>
          )}
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7" style={{ borderBottom: '1px solid #0f1117' }}>
        {DOW.map((d) => (
          <div key={d} className="text-center py-1.5" style={{ color: '#3a3f4d', fontSize: 10, letterSpacing: 1, fontFamily: 'monospace' }}>
            {d.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, idx) => {
          const dayNum = idx - startDow + 1;
          const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
          const hasTrades = cell && cell.trades > 0;
          const positive = cell && cell.pnl >= 0;

          return (
            <div
              key={idx}
              style={{
                minHeight: 70,
                borderRight: (idx + 1) % 7 !== 0 ? '1px solid #0f1117' : 'none',
                borderBottom: '1px solid #0f1117',
                background: !isCurrentMonth
                  ? 'transparent'
                  : hasTrades
                    ? positive
                      ? 'rgba(45,204,111,0.07)'
                      : 'rgba(232,64,64,0.07)'
                    : '#09090d',
                padding: '6px 5px',
                position: 'relative',
              }}
            >
              {isCurrentMonth && (
                <>
                  <div style={{
                    color: hasTrades ? '#c8cdd8' : '#3a3f4d',
                    fontSize: 11,
                    fontFamily: 'monospace',
                    fontWeight: hasTrades ? 600 : 400,
                    marginBottom: 3,
                    textAlign: 'right',
                  }}>
                    {dayNum}
                  </div>
                  {hasTrades && cell && (
                    <div className="flex flex-col gap-0.5">
                      <div style={{
                        color: positive ? '#2dcc6f' : '#e84040',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: 10,
                        textAlign: 'center',
                        lineHeight: 1.2,
                      }}>
                        {fmt(cell.pnl)}
                      </div>
                      <div style={{ color: '#6b7385', fontSize: 9, textAlign: 'center' }}>
                        {cell.trades} {cell.trades === 1 ? 'trade' : 'trades'}
                      </div>
                      <div style={{ color: '#6b7385', fontSize: 9, textAlign: 'center' }}>
                        {cell.winRate}%
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
