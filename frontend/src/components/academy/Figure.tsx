import type { FigureName } from '@/content/academy/types';
import type { ReactNode } from 'react';

// Ilustraciones didácticas en SVG. Esquemas simplificados, no datos reales.

const C = {
  up: '#22c55e',
  down: '#ef4444',
  gold: '#ddb54a',
  text: '#a3a9b8',
  dim: '#6f7687',
  grid: '#262a35',
  line: '#d7dae2',
  zoneUp: 'rgba(34,197,94,0.12)',
  zoneDown: 'rgba(239,68,68,0.12)',
  zoneGold: 'rgba(221,181,74,0.12)',
};

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 560 260" role="img" aria-label={label} className="h-auto w-full" fontFamily="ui-sans-serif, system-ui, sans-serif">
      <rect x="0" y="0" width="560" height="260" rx="14" fill="#0d0f13" />
      {[52, 104, 156, 208].map((y) => (
        <line key={y} x1="16" x2="544" y1={y} y2={y} stroke={C.grid} strokeDasharray="2 6" />
      ))}
      {children}
    </svg>
  );
}

function T({ x, y, children, color = C.text, anchor = 'start', size = 12, weight = 500 }: { x: number; y: number; children: ReactNode; color?: string; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number }) {
  return (
    <text x={x} y={y} fill={color} fontSize={size} fontWeight={weight} textAnchor={anchor}>
      {children}
    </text>
  );
}

function path(points: [number, number][]) {
  return points.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
}

function Line({ pts, color = C.line, width = 2.5 }: { pts: [number, number][]; color?: string; width?: number }) {
  return <path d={path(pts)} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" />;
}

function Dot({ x, y, color = C.gold }: { x: number; y: number; color?: string }) {
  return <circle cx={x} cy={y} r={4.5} fill={color} stroke="#0d0f13" strokeWidth={2} />;
}

function CandleAnatomy() {
  return (
    <Frame label="Anatomía de una vela alcista y una bajista">
      {/* Alcista */}
      <line x1="150" x2="150" y1="30" y2="230" stroke={C.up} strokeWidth="3" />
      <rect x="120" y="70" width="60" height="110" rx="4" fill={C.up} />
      <T x={150} y={22} anchor="middle" color={C.up} weight={600}>Vela alcista</T>
      <T x={196} y={34}>Máximo</T>
      <T x={196} y={76}>Cierre</T>
      <T x={196} y={180}>Apertura</T>
      <T x={196} y={232}>Mínimo</T>
      <T x={104} y={54} anchor="end" color={C.dim}>Mecha superior</T>
      <T x={104} y={130} anchor="end" color={C.dim}>Cuerpo</T>
      <T x={104} y={210} anchor="end" color={C.dim}>Mecha inferior</T>
      {/* Bajista */}
      <line x1="420" x2="420" y1="40" y2="222" stroke={C.down} strokeWidth="3" />
      <rect x="390" y="78" width="60" height="96" rx="4" fill={C.down} />
      <T x={420} y={22} anchor="middle" color={C.down} weight={600}>Vela bajista</T>
      <T x={466} y={44}>Máximo</T>
      <T x={466} y={84}>Apertura</T>
      <T x={466} y={176}>Cierre</T>
      <T x={466} y={224}>Mínimo</T>
    </Frame>
  );
}

function TrendStructure() {
  const pts: [number, number][] = [[40, 220], [110, 160], [150, 190], [230, 110], [275, 145], [360, 70], [405, 105], [500, 36]];
  return (
    <Frame label="Tendencia alcista con máximos y mínimos crecientes">
      <Line pts={pts} />
      <line x1="150" y1="190" x2="405" y2="105" stroke={C.up} strokeDasharray="5 5" strokeWidth="1.5" />
      {[[110, 160], [230, 110], [360, 70], [500, 36]].map(([x, y], i) => (
        <g key={`h${i}`}>
          <Dot x={x} y={y} color={C.up} />
          <T x={x} y={y - 12} anchor="middle" color={C.up} size={11}>Máx. más alto</T>
        </g>
      ))}
      {[[150, 190], [275, 145], [405, 105]].map(([x, y], i) => (
        <g key={`l${i}`}>
          <Dot x={x} y={y} color={C.gold} />
          <T x={x} y={y + 22} anchor="middle" color={C.gold} size={11}>Mín. más alto</T>
        </g>
      ))}
    </Frame>
  );
}

function SupportResistance() {
  return (
    <Frame label="Precio rebotando entre una zona de soporte y una de resistencia">
      <rect x="16" y="46" width="528" height="26" fill={C.zoneDown} />
      <rect x="16" y="186" width="528" height="26" fill={C.zoneUp} />
      <T x={28} y={40} color={C.down} weight={600}>Resistencia (zona)</T>
      <T x={28} y={232} color={C.up} weight={600}>Soporte (zona)</T>
      <Line pts={[[30, 150], [90, 196], [150, 104], [205, 62], [265, 150], [320, 200], [385, 120], [440, 58], [500, 140], [540, 120]]} />
      {[[90, 196], [320, 200]].map(([x, y]) => <Dot key={x} x={x} y={y} color={C.up} />)}
      {[[205, 62], [440, 58]].map(([x, y]) => <Dot key={x} x={x} y={y} color={C.down} />)}
    </Frame>
  );
}

function RiskReward() {
  return (
    <Frame label="Entrada, stop loss y take profit con relación 1:2">
      <rect x="150" y="40" width="300" height="100" fill={C.zoneUp} />
      <rect x="150" y="140" width="300" height="50" fill={C.zoneDown} />
      <line x1="150" x2="450" y1="40" y2="40" stroke={C.up} strokeWidth="2" />
      <line x1="150" x2="450" y1="140" y2="140" stroke={C.line} strokeWidth="2" strokeDasharray="6 4" />
      <line x1="150" x2="450" y1="190" y2="190" stroke={C.down} strokeWidth="2" />
      <T x={140} y={44} anchor="end" color={C.up} weight={600}>Take profit 3360.00</T>
      <T x={140} y={144} anchor="end" color={C.line} weight={600}>Entrada 3350.00</T>
      <T x={140} y={194} anchor="end" color={C.down} weight={600}>Stop loss 3345.00</T>
      <T x={300} y={95} anchor="middle" color={C.up}>Beneficio posible: $10 de precio (2R)</T>
      <T x={300} y={170} anchor="middle" color={C.down}>Riesgo: $5 de precio (1R)</T>
      <T x={470} y={120} color={C.gold} weight={700} size={16}>R:R 1:2</T>
      <T x={300} y={226} anchor="middle" color={C.dim} size={11}>Ejemplo de compra: arriesgas 1 para intentar ganar 2</T>
    </Frame>
  );
}

function Fibonacci() {
  const levels: [string, number, string][] = [
    ['0% · máximo', 40, C.gold],
    ['38.2%', 40 + 180 * 0.382, C.text],
    ['50%', 40 + 180 * 0.5, C.text],
    ['61.8%', 40 + 180 * 0.618, C.gold],
    ['100% · mínimo', 220, C.gold],
  ];
  return (
    <Frame label="Retroceso de Fibonacci trazado sobre un impulso alcista">
      <rect x="210" y={40 + 180 * 0.5} width="330" height={180 * 0.118} fill={C.zoneGold} />
      {levels.map(([label, y, color]) => (
        <g key={label}>
          <line x1="40" x2="540" y1={y} y2={y} stroke={color} strokeDasharray="5 5" strokeWidth="1.2" />
          <T x={544} y={y - 4} anchor="end" color={color} size={11}>{label}</T>
        </g>
      ))}
      <Line pts={[[40, 220], [90, 170], [115, 185], [200, 40], [250, 95], [290, 75], [330, 140], [370, 120], [440, 70], [520, 36]]} />
      <Dot x={40} y={220} />
      <Dot x={200} y={40} />
      <Dot x={330} y={140} color={C.up} />
      <T x={330} y={162} anchor="middle" color={C.up} size={11}>Rebote en la zona 50–61.8%</T>
    </Frame>
  );
}

function Sessions() {
  const x = (h: number) => 40 + (h / 24) * 480;
  const rows: [string, number, number, string][] = [
    ['Asia (Tokio)', 0, 9, '#60a5fa'],
    ['Londres', 8, 17, C.gold],
    ['Nueva York', 13, 22, C.up],
  ];
  return (
    <Frame label="Sesiones del mercado en horario UTC">
      <rect x={x(13)} y="40" width={x(17) - x(13)} height="150" fill={C.zoneGold} />
      <T x={(x(13) + x(17)) / 2} y={34} anchor="middle" color={C.gold} weight={600} size={11}>Solape Londres–NY</T>
      {rows.map(([name, a, b, color], i) => (
        <g key={name}>
          <rect x={x(a)} y={56 + i * 44} width={x(b) - x(a)} height="26" rx="7" fill={color} fillOpacity="0.85" />
          <T x={x(a) + 8} y={74 + i * 44} color="#0d0f13" weight={700} size={12}>{name}</T>
        </g>
      ))}
      <line x1={x(0)} x2={x(24)} y1="200" y2="200" stroke={C.grid} strokeWidth="2" />
      {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => (
        <g key={h}>
          <line x1={x(h)} x2={x(h)} y1="196" y2="204" stroke={C.dim} />
          <T x={x(h)} y={222} anchor="middle" color={C.dim} size={11}>{`${String(h).padStart(2, '0')}:00`}</T>
        </g>
      ))}
      <T x={280} y={246} anchor="middle" color={C.dim} size={11}>Horas UTC aproximadas (horario de invierno)</T>
    </Frame>
  );
}

function DrawdownRecovery() {
  const rows: [number, number][] = [[10, 11.1], [20, 25], [30, 42.9], [50, 100], [75, 300]];
  const w = (v: number) => (v / 300) * 300;
  return (
    <Frame label="Ganancia necesaria para recuperar una pérdida">
      <T x={40} y={30} color={C.down} weight={600}>Pérdida</T>
      <T x={200} y={30} color={C.up} weight={600}>Ganancia necesaria para volver al inicio</T>
      {rows.map(([loss, gain], i) => {
        const y = 48 + i * 40;
        return (
          <g key={loss}>
            <rect x="40" y={y} width={(loss / 100) * 120} height="22" rx="5" fill={C.down} fillOpacity="0.8" />
            <T x={48 + (loss / 100) * 120} y={y + 16} color={C.text} size={12}>{`−${loss}%`}</T>
            <rect x="200" y={y} width={Math.max(4, w(gain))} height="22" rx="5" fill={C.up} fillOpacity="0.8" />
            <T x={208 + Math.max(4, w(gain))} y={y + 16} color={C.text} size={12} weight={600}>{`+${gain}%`}</T>
          </g>
        );
      })}
    </Frame>
  );
}

function PullbackSetup() {
  return (
    <Frame label="Retroceso a una zona dentro de una tendencia alcista">
      <rect x="200" y="140" width="190" height="30" fill={C.zoneGold} />
      <T x={206} y={186} color={C.gold} size={11}>Zona de soporte / retroceso</T>
      <Line pts={[[30, 220], [100, 150], [140, 175], [230, 70], [300, 150], [330, 140], [360, 155], [450, 60], [530, 30]]} />
      <line x1="230" x2="545" y1="70" y2="70" stroke={C.up} strokeDasharray="5 5" />
      <T x={540} y={64} anchor="end" color={C.up} size={11}>Máximo anterior (objetivo)</T>
      <line x1="330" x2="460" y1="196" y2="196" stroke={C.down} strokeWidth="2" />
      <T x={466} y={200} color={C.down} size={11}>Stop bajo la zona</T>
      <Dot x={360} y={155} color={C.up} />
      <T x={360} y={132} anchor="middle" color={C.up} size={11} weight={600}>Entrada con confirmación</T>
    </Frame>
  );
}

function BreakoutRetest() {
  return (
    <Frame label="Ruptura de una resistencia y retesteo como soporte">
      <line x1="16" x2="544" y1="110" y2="110" stroke={C.gold} strokeWidth="2" strokeDasharray="7 5" />
      <T x={24} y={102} color={C.gold} weight={600} size={11}>Resistencia → nuevo soporte</T>
      <Line pts={[[30, 190], [80, 120], [120, 170], [170, 116], [210, 165], [250, 120], [290, 60], [340, 104], [370, 96], [440, 50], [530, 30]]} />
      <Dot x={290} y={60} color={C.up} />
      <T x={290} y={48} anchor="middle" color={C.up} size={11}>Ruptura</T>
      <Dot x={340} y={104} color={C.gold} />
      <T x={340} y={132} anchor="middle" color={C.gold} size={11} weight={600}>Retesteo: entrada</T>
      <line x1="320" x2="420" y1="140" y2="140" stroke={C.down} strokeWidth="2" />
      <T x={426} y={144} color={C.down} size={11}>Stop bajo el nivel</T>
    </Frame>
  );
}

function Range() {
  return (
    <Frame label="Mercado en rango entre dos extremos">
      <rect x="16" y="40" width="528" height="30" fill={C.zoneDown} />
      <rect x="16" y="180" width="528" height="30" fill={C.zoneUp} />
      <rect x="16" y="105" width="528" height="40" fill="rgba(255,255,255,0.03)" />
      <T x={28} y={34} color={C.down} weight={600}>Techo del rango: buscar ventas</T>
      <T x={28} y={230} color={C.up} weight={600}>Suelo del rango: buscar compras</T>
      <T x={536} y={130} anchor="end" color={C.dim} size={11}>Centro: evitar</T>
      <Line pts={[[30, 120], [80, 52], [140, 195], [200, 60], [260, 192], [320, 56], [380, 196], [440, 64], [500, 150], [540, 130]]} />
    </Frame>
  );
}

const FIGURES: Record<FigureName, () => JSX.Element> = {
  'candle-anatomy': CandleAnatomy,
  'trend-structure': TrendStructure,
  'support-resistance': SupportResistance,
  'risk-reward': RiskReward,
  fibonacci: Fibonacci,
  sessions: Sessions,
  'drawdown-recovery': DrawdownRecovery,
  'pullback-setup': PullbackSetup,
  'breakout-retest': BreakoutRetest,
  range: Range,
};

export function Figure({ name, caption }: { name: FigureName; caption: string }) {
  const F = FIGURES[name];
  if (!F) return null;
  return (
    <figure className="my-5 overflow-hidden rounded-2xl border border-ink-700 bg-ink-900">
      <F />
      <figcaption className="border-t border-ink-700 px-4 py-2.5 text-[13px] text-fg-muted">{caption}</figcaption>
    </figure>
  );
}
