import { CheckCircle2, Target } from 'lucide-react';

// Maqueta ilustrativa del producto (no son datos reales).
const CANDLES: [number, number, number, number][] = [
  [62, 70, 50, 74], [70, 66, 60, 76], [66, 74, 62, 78], [74, 80, 70, 84], [80, 76, 72, 86],
  [76, 72, 66, 80], [72, 68, 62, 76], [68, 75, 64, 78], [75, 84, 72, 88], [84, 90, 80, 94],
  [90, 86, 82, 96], [86, 82, 78, 90], [82, 80, 74, 86], [80, 88, 78, 92], [88, 96, 84, 100],
  [96, 102, 92, 106], [102, 98, 94, 108], [98, 106, 96, 110], [106, 112, 102, 116], [112, 118, 108, 122],
];

export function HeroMock() {
  const w = 14;
  const gap = 6;
  const y = (v: number) => 162 - (v - 45) * 1.5;
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[32px] bg-gold-500/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-3xl border border-ink-700 bg-ink-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-750 px-4 py-2.5">
          <div className="flex items-center gap-2 text-[12px]">
            <span className="h-2.5 w-2.5 rounded-full bg-down/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-up/70" />
            <span className="ml-2 font-semibold text-fg-muted">Simulador · XAU/USD · H1</span>
          </div>
          <span className="text-[12px] text-green-400">● En directo</span>
        </div>
        <div className="grid sm:grid-cols-[1fr_190px]">
          <svg viewBox="0 0 410 170" className="h-auto w-full bg-[#0b0c10]" aria-hidden="true">
            {[30, 70, 110, 150].map((g) => (
              <line key={g} x1="0" x2="410" y1={g} y2={g} stroke="#161922" />
            ))}
            <rect x="0" y={y(96)} width="410" height={y(84) - y(96)} fill="rgba(221,181,74,0.10)" />
            {CANDLES.map(([o, c, l, h], i) => {
              const x = 10 + i * (w + gap);
              const up = c >= o;
              const color = up ? '#22c55e' : '#ef4444';
              return (
                <g key={i}>
                  <line x1={x + w / 2} x2={x + w / 2} y1={y(h)} y2={y(l)} stroke={color} strokeWidth="1.5" />
                  <rect x={x} y={y(Math.max(o, c))} width={w} height={Math.max(2, Math.abs(c - o) * 1.5)} rx="2" fill={color} />
                </g>
              );
            })}
            <line x1="0" x2="410" y1={y(118)} y2={y(118)} stroke="#d7dae2" strokeDasharray="5 4" />
            <line x1="0" x2="410" y1={y(140)} y2={y(140)} stroke="#22c55e" strokeWidth="1.5" />
            <line x1="0" x2="410" y1={y(107)} y2={y(107)} stroke="#ef4444" strokeWidth="1.5" />
            <text x="404" y={y(140) - 5} textAnchor="end" fill="#22c55e" fontSize="10">Objetivo</text>
            <text x="404" y={y(118) - 5} textAnchor="end" fill="#d7dae2" fontSize="10">Entrada</text>
            <text x="404" y={y(107) + 13} textAnchor="end" fill="#ef4444" fontSize="10">Stop</text>
          </svg>
          <div className="space-y-3 border-t border-ink-750 p-4 sm:border-l sm:border-t-0">
            <div>
              <div className="text-[11px] text-fg-dim">Riesgo</div>
              <div className="text-[16px] font-semibold num text-fg">$100 · 1%</div>
            </div>
            <div>
              <div className="text-[11px] text-fg-dim">Beneficio posible</div>
              <div className="text-[16px] font-semibold num text-green-300">$200</div>
            </div>
            <div>
              <div className="text-[11px] text-fg-dim">Relación R:R</div>
              <div className="text-[16px] font-semibold num text-gold-300">1:2</div>
            </div>
            <ul className="space-y-1 text-[11px] text-fg-muted">
              {['Stop puesto', 'Riesgo ≤ 2%', 'R:R ≥ 1:2', 'Motivo escrito'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-4 hidden w-64 rounded-2xl border border-ink-700 bg-ink-850 p-4 shadow-2xl sm:block">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-gold-300">
          <Target className="h-3.5 w-3.5" /> Práctica de la lección
        </div>
        <div className="mt-1.5 text-[13px] font-medium text-fg">Calcular el tamaño de posición</div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-700">
          <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-gold-500 to-gold-300" />
        </div>
        <div className="mt-1.5 text-[11px] text-fg-dim">3 de 4 reglas cumplidas</div>
      </div>
    </div>
  );
}
