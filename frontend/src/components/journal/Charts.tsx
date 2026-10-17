'use client';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fmtUsd } from '@/lib/format';

const axis = { stroke: '#4b5263', fontSize: 11, tickLine: false, axisLine: false } as const;

function Tip({ active, payload, label, kind }: { active?: boolean; payload?: { value: number }[]; label?: string; kind: 'balance' | 'pnl' }) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  return (
    <div className="rounded-xl border border-ink-600 bg-ink-800 px-3 py-2 text-[12px] shadow-xl">
      <div className="text-fg-dim">{label}</div>
      <div className={kind === 'pnl' ? (v >= 0 ? 'font-semibold text-green-300' : 'font-semibold text-red-300') : 'font-semibold text-fg'}>
        {kind === 'pnl' ? fmtUsd(v, { sign: true }) : fmtUsd(v)}
      </div>
    </div>
  );
}

export function EquityChart({ data, start }: { data: { date: string; balance: number }[]; start: number }) {
  // Eje X por número de operación (varias operaciones pueden caer el mismo día)
  const points = [{ date: 'Inicio', balance: start }, ...data.map((d, i) => ({ date: `Op. ${i + 1}`, balance: d.balance }))];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ddb54a" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#ddb54a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#1d2029" vertical={false} />
        <XAxis dataKey="date" {...axis} minTickGap={32} />
        <YAxis {...axis} width={64} domain={['auto', 'auto']} tickFormatter={(v: number) => fmtUsd(v, { decimals: 0 })} />
        <ReferenceLine y={start} stroke="#4b5263" strokeDasharray="4 4" />
        <Tooltip content={<Tip kind="balance" />} />
        <Area type="monotone" dataKey="balance" stroke="#ddb54a" strokeWidth={2} fill="url(#eq)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function WeeklyChart({ data }: { data: { week: string; pnl: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#1d2029" vertical={false} />
        <XAxis dataKey="week" {...axis} minTickGap={16} />
        <YAxis
          {...axis}
          width={64}
          domain={[(min: number) => Math.min(0, min), (max: number) => Math.max(0, max)]}
          tickFormatter={(v: number) => fmtUsd(v, { decimals: 0 })}
        />
        <ReferenceLine y={0} stroke="#4b5263" />
        <Tooltip content={<Tip kind="pnl" />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.week} fill={d.pnl >= 0 ? '#22c55e' : '#ef4444'} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
