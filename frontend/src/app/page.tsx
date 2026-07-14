'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { CornerFrame } from '@/components/ui/CornerFrame';
import { LogoIcon } from '@/components/ui/LogoIcon';

// ─── Static data ──────────────────────────────────────────────────────────────

const FEATURES: { icon: string; title: string; body: string; mock?: 'equity' | 'order' | 'data' | 'zero' | 'focus' | 'xp' }[] = [
  { icon: '◈', title: 'Real XAUUSD Data',       body: 'Train on 2 years of real historical gold spot prices with authentic bid/ask spreads and 8 timeframes — from 1 minute to monthly.', mock: 'data' },
  { icon: '◎', title: 'Risk Calculator',         body: 'Calculate position size, stop-loss, take-profit and R:R ratio before every trade. The habit that separates profitable traders.', mock: 'order' },
  { icon: '▦', title: 'Performance Analytics',  body: 'Trader Score, win rate, drawdown, equity curve and behaviour analysis after every session. See exactly where you lose money.', mock: 'equity' },
  { icon: '⬡', title: 'Zero Capital at Risk',   body: 'Use virtual capital. Learn real trading mechanics — entries, exits, position sizing — without putting a single euro on the line.', mock: 'zero' },
  { icon: '◇', title: 'XAUUSD Only Focus',      body: 'Full focus on gold spot. One instrument, mastered deeply. The way professional desks and top prop firm traders operate.', mock: 'focus' },
  { icon: '◉', title: 'Missions & XP',          body: 'Structured learning paths, daily missions and XP rewards to build consistency. Progress is tracked, not just practised.', mock: 'xp' },
];

const STEPS = [
  { n: '01', icon: '⚡', title: 'Crea tu cuenta gratis', body: 'Registro en 30 segundos. Sin tarjeta. Acceso inmediato a tus primeras 20 simulaciones gratuitas.' },
  { n: '02', icon: '📊', title: 'Carga una sesión XAUUSD', body: 'Elige un escenario histórico o reproduce datos reales de sesiones London, NY o Asian con 8 timeframes.' },
  { n: '03', icon: '🏆', title: 'Opera y analiza', body: 'Abre posiciones, fija SL/TP, revisa tu Trader Score y las métricas de challenge tras cada sesión.' },
];

const PRO_FEATURES = [
  'Unlimited trade simulations',
  'Full analytics dashboard',
  'Equity curve & max drawdown',
  'Trader Score + coaching tips',
  'All 8 timeframes — M1 to Monthly',
  'Trade journal & session export',
  'All missions unlocked',
  'Priority support',
];

const PROPFIRM_FEATURES = [
  'Everything in Pro',
  'Challenge mode — FTMO / Funded Next rules',
  'Daily drawdown alert (< 5% threshold)',
  'Max drawdown tracker (< 10%)',
  'Consistency score per session',
  'CSV export — blotter + P/L history',
  'Dedicated onboarding call',
];

const FAQS = [
  { q: 'Is this a real brokerage or demo account?',         a: 'Neither — it\'s a pure simulator. No real money, no broker connection. You practice using historical XAUUSD data in a completely safe environment. Nothing connects to any live market.' },
  { q: 'What happens after I use my 20 free simulations?',  a: 'You\'ll see an upgrade prompt. Choose the plan that fits you: Monthly (€9.95/mo) or Annual (€79/yr — best value, saves €40 vs monthly). For prop firm candidates, the Prop Firm plan (€149/yr) adds challenge-mode metrics, CSV export and verified badge.' },
  { q: 'Is the market data real?',                          a: 'Yes. We source real historical XAUUSD spot price data with authentic bid/ask spreads. Scenarios replay at real market timing. The only thing that isn\'t real is the capital at risk.' },
  { q: 'Can I track my progress over time?',                a: 'Pro users get a full analytics dashboard: equity curve, drawdown history, Trader Score trend and session-by-session breakdown. You can see exactly which sessions you improved and where you still lose money.' },
  { q: 'Do I need trading experience to start?',            a: 'No. The missions and academy section cover everything from reading a candlestick chart to building a complete trading plan with risk rules. Beginners start with the guided modules; experienced traders go straight to the simulator.' },
  { q: 'Is there a 30-day refund guarantee?',               a: 'Yes. If you\'re not satisfied with the Pro plan within 30 days of purchase, email us and we\'ll refund you in full. No questions asked. See our Terms for details.' },
  { q: 'What timeframes are available?',                    a: 'Free users get 1H, 4H, D1, W1 and MN. Pro users get all 8 timeframes: M1, M5, M15, H1, H4, D1, W1 and MN — covering everything from scalping to macro analysis.' },
];

// Who it's for — honest use-case profiles (not fake testimonials)
const USE_CASES = [
  {
    icon: '📈',
    profile: 'The Self-Taught Trader',
    context: 'No formal training · Learning from YouTube and books · First 6 months',
    outcome: 'Discovers real risk discipline before touching real capital. The Trader Score reveals emotional patterns invisible in paper trades.',
    tag: 'BEGINNER PATH',
    color: '#4a6cf7',
  },
  {
    icon: '🏆',
    profile: 'The Prop Firm Candidate',
    context: 'Preparing for FTMO, Funded Next or similar challenge · Has real trading experience',
    outcome: 'Uses the blotter workflow and drawdown tracking to simulate challenge conditions. Builds the consistency metric that prop firms actually measure.',
    tag: 'PROP FIRM PREP',
    color: '#c9a84c',
  },
  {
    icon: '⚡',
    profile: 'The Experienced Swing Trader',
    context: 'Already profitable · Wants to test new setups without real risk',
    outcome: 'Replays specific historical sessions to validate entry rules against real XAUUSD data before deploying them live.',
    tag: 'STRATEGY TESTING',
    color: '#2dcc6f',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function GoldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-block text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-sm mb-6"
      style={{ background: '#0f1117', border: '1px solid #2c2410', color: '#c9a84c' }}>
      {children}
    </div>
  );
}

function CandlestickHero3D({ fullscreen = false }: { fullscreen?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const W = fullscreen ? window.innerWidth : 430;
      const H = fullscreen ? window.innerHeight : 490;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.scale(dpr, dpr);
    }
    resize();
    if (fullscreen) window.addEventListener('resize', resize);

    const NUM_RAYS = 72;
    const FAN_RAD = (170 / 2) * (Math.PI / 180);
    const UP = -Math.PI / 2;
    const rayAngles: number[] = Array.from({ length: NUM_RAYS }, (_, i) =>
      UP - FAN_RAD + (i / (NUM_RAYS - 1)) * FAN_RAD * 2
    );

    interface Particle { ray: number; t: number; speed: number; size: number; bullish: boolean; }
    function mkParticle(tInit = 0): Particle {
      return { ray: Math.floor(Math.random() * NUM_RAYS), t: tInit, speed: 0.0010 + Math.random() * 0.0025, size: 0.5 + Math.random() * 1.2, bullish: Math.random() > 0.42 };
    }
    const particles: Particle[] = Array.from({ length: 90 }, () => mkParticle(Math.random() * 0.88));

    function envelope(t: number) { if (t < 0.12) return t / 0.12; if (t > 0.88) return (1 - t) / 0.12; return 1; }

    function bodyColor(t: number, bullish: boolean, alpha: number): string {
      const blend = Math.min(1, t / 0.55);
      const [gr, gg, gb] = bullish ? [45, 204, 111] : [232, 64, 64];
      return `rgba(${Math.round(201+(gr-201)*blend)},${Math.round(168+(gg-168)*blend)},${Math.round(76+(gb-76)*blend)},${alpha})`;
    }

    let raf: number;
    let lastTs = 0;

    function draw(ts: number) {
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      const FX = W / 2;
      const FY = H * 0.82;
      const MAX_R = Math.sqrt(W * W + H * H);

      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createRadialGradient(FX, FY, 0, FX, FY, MAX_R * 0.60);
      bg.addColorStop(0, 'rgba(201,168,76,0.16)'); bg.addColorStop(0.18, 'rgba(80,40,5,0.07)'); bg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      ctx.lineWidth = 0.55;
      for (let i = 0; i < NUM_RAYS; i++) {
        const a = rayAngles[i];
        ctx.strokeStyle = 'rgba(201,168,76,0.04)';
        ctx.beginPath(); ctx.moveTo(FX, FY); ctx.lineTo(FX + Math.cos(a) * MAX_R, FY + Math.sin(a) * MAX_R); ctx.stroke();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.t += p.speed * (dt / (1/60));
        if (p.t >= 1) { particles.splice(i, 1); particles.push(mkParticle(0)); continue; }
        const dist = p.t * MAX_R;
        const a = rayAngles[p.ray];
        const px = FX + Math.cos(a) * dist;
        const py = FY + Math.sin(a) * dist;
        if (px < -40 || px > W + 40 || py < -40 || py > H + 40) continue;
        const alpha = envelope(p.t) * 0.92;
        const sc = p.size * (0.65 + p.t * 0.65);
        const bW = 5 * sc, bH = 12 * sc, wkW = Math.max(0.8, sc), wkH = bH * 0.40;
        ctx.save(); ctx.translate(px, py); ctx.rotate(a + Math.PI / 2);
        ctx.fillStyle = `rgba(201,168,76,${alpha * 0.55})`; ctx.fillRect(-wkW/2, -bH/2 - wkH, wkW, wkH);
        ctx.fillStyle = bodyColor(p.t, p.bullish, alpha);
        if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(-bW/2, -bH/2, bW, bH, bW * 0.20); ctx.fill(); }
        else { ctx.fillRect(-bW/2, -bH/2, bW, bH); }
        ctx.fillStyle = `rgba(201,168,76,${alpha * 0.55})`; ctx.fillRect(-wkW/2, bH/2, wkW, wkH);
        ctx.restore();
      }

      const targetCount = fullscreen ? 240 : 160;
      while (particles.length < targetCount) particles.push(mkParticle(Math.random() * 0.20));

      const fgG = ctx.createRadialGradient(FX, FY, 0, FX, FY, 58);
      fgG.addColorStop(0, 'rgba(255,245,160,0.98)'); fgG.addColorStop(0.30, 'rgba(201,168,76,0.60)');
      fgG.addColorStop(0.65, 'rgba(150,100,20,0.18)'); fgG.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fgG; ctx.beginPath(); ctx.arc(FX, FY, 58, 0, Math.PI * 2); ctx.fill();

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); if (fullscreen) window.removeEventListener('resize', resize); };
  }, [fullscreen]);

  return (
    <div style={fullscreen
      ? { position: 'absolute', inset: 0 }
      : { position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 490 }
    }>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}

const EQUITY_POINTS = [
  [0,180],[60,165],[120,155],[180,170],[240,145],[300,130],[360,115],[420,125],[480,100],[540,85],[600,70],[660,80],[720,60],[780,45],[840,55],[900,35],
];

function MiniEquityCurve() {
  const W = 320; const H = 120;
  const path = EQUITY_POINTS.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x * W / 900},${y * H / 210}`).join(' ');
  const area = `${path} L${W},${H} L0,${H} Z`;

  return (
    <div style={{ background: '#07080b', border: '1px solid #1d2029', borderRadius: 4, padding: '8px 4px 4px', marginTop: 12 }}>
      <div className="flex items-center justify-between px-2 mb-1">
        <span style={{ color: '#6b7385', fontSize: 9, letterSpacing: 1 }}>EQUITY CURVE</span>
        <span style={{ color: '#2dcc6f', fontSize: 9, fontFamily: 'monospace', fontWeight: 700 }}>+31.2%</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={80} preserveAspectRatio="none">
        <defs>
          <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2dcc6f" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2dcc6f" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[40, 80, 120].map((y) => (
          <line key={y} x1="0" y1={y * H / 210} x2={W} y2={y * H / 210} stroke="#1d2029" strokeWidth="1" />
        ))}
        <path d={area} fill="url(#eqGrad)" />
        <path d={path} stroke="#2dcc6f" strokeWidth="1.5" fill="none" />
        {([[240,145,'+12%'],[480,100,'+24%'],[840,55,'+31%']] as [number,number,string][]).map(([x, y, label]) => (
          <g key={label}>
            <circle cx={x * W / 900} cy={y * H / 210} r={2.5} fill="#c9a84c" />
            <text x={x * W / 900 + 5} y={y * H / 210 - 4} fill="#c9a84c" fontSize={7} fontFamily="monospace">{label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function MiniOrderEntry() {
  return (
    <div style={{ background: '#07080b', border: '1px solid #1d2029', borderRadius: 4, padding: 10, marginTop: 12, fontFamily: 'monospace' }}>
      <div style={{ color: '#c9a84c', fontSize: 9, letterSpacing: 1, marginBottom: 8 }}>ORDER ENTRY · XAUUSD</div>
      <div className="grid grid-cols-2 gap-1 mb-2">
        <div style={{ background: '#1a6b3a', border: '1px solid #2dcc6f33', color: '#2dcc6f', fontSize: 10, fontWeight: 700, textAlign: 'center', padding: '4px 0', borderRadius: 3 }}>▲ BUY</div>
        <div style={{ background: '#141720', border: '1px solid #1d2029', color: '#6b7385', fontSize: 10, textAlign: 'center', padding: '4px 0', borderRadius: 3 }}>▼ SELL</div>
      </div>
      {[
        { label: 'Entry', value: '3342.50', color: '#c8cdd8' },
        { label: 'SL',    value: '3330.00', color: '#e84040' },
        { label: 'TP',    value: '3367.00', color: '#2dcc6f' },
        { label: 'Risk',  value: '1.00%',   color: '#c9a84c' },
      ].map(({ label, value, color }) => (
        <div key={label} className="flex justify-between" style={{ fontSize: 9, marginBottom: 3 }}>
          <span style={{ color: '#6b7385' }}>{label}</span>
          <span style={{ color, fontWeight: 600 }}>{value}</span>
        </div>
      ))}
      <div style={{ marginTop: 8, background: 'linear-gradient(135deg,#2c2410,#1a1508)', border: '1px solid #c9a84c44', color: '#c9a84c', fontSize: 9, textAlign: 'center', padding: '4px 0', borderRadius: 3 }}>
        R:R 2.08 · CONFIRM ORDER
      </div>
    </div>
  );
}

function MiniDataBadges() {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {['M1','M5','M15','H1','H4','D1','W1','MN'].map((tf) => (
        <span key={tf} className="font-mono text-xs px-2 py-0.5 rounded"
          style={{ background: '#141720', border: '1px solid #2c2410', color: '#c9a84c' }}>{tf}</span>
      ))}
      <span className="font-mono text-xs px-2 py-0.5 rounded"
        style={{ background: '#0a1a0e', border: '1px solid #2dcc6f33', color: '#2dcc6f' }}>2yr real data</span>
    </div>
  );
}

function MiniZeroRisk() {
  return (
    <div className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded"
      style={{ background: '#141720', border: '1px solid #1d2029' }}>
      <div style={{ fontSize: 22 }}>🛡️</div>
      <div>
        <div className="font-mono text-xs" style={{ color: '#2dcc6f', fontWeight: 700 }}>€0 en riesgo</div>
        <div style={{ fontSize: 10, color: '#6b7385', marginTop: 1 }}>Capital virtual · misma mecánica real</div>
      </div>
    </div>
  );
}

function MiniCandleFocus() {
  return (
    <div className="mt-4 flex items-center justify-between px-3 py-2.5 rounded"
      style={{ background: '#141720', border: '1px solid #2c2410' }}>
      <div>
        <div style={{ color: '#c9a84c', fontSize: 18, lineHeight: 1 }}>◆</div>
        <div className="font-mono text-xs mt-1" style={{ color: '#c9a84c', fontWeight: 700 }}>XAUUSD</div>
        <div style={{ fontSize: 10, color: '#6b7385' }}>Gold Spot</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 10, color: '#6b7385' }}>1 instrumento</div>
        <div style={{ fontSize: 10, color: '#6b7385' }}>dominado en profundidad</div>
        <div className="font-mono text-xs mt-1" style={{ color: '#2dcc6f' }}>como los pros</div>
      </div>
    </div>
  );
}

function MiniXPBar() {
  return (
    <div className="mt-4 space-y-2">
      {[['Gestión de riesgo', 78], ['Disciplina diaria', 55], ['Consistency', 90]].map(([label, pct]) => (
        <div key={label as string}>
          <div className="flex justify-between mb-0.5">
            <span style={{ fontSize: 10, color: '#6b7385' }}>{label}</span>
            <span className="font-mono" style={{ fontSize: 10, color: '#c9a84c' }}>{pct}%</span>
          </div>
          <div style={{ height: 4, background: '#1d2029', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#c9a84c,#ffe082)', borderRadius: 2 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function FeatureCard({ icon, title, body, mock }: { icon: string; title: string; body: string; mock?: string }) {
  return (
    <div className="p-5 rounded-sm" style={{ background: '#0f1117', border: '1px solid #1d2029' }}>
      <div style={{ color: '#c9a84c', fontSize: 20, marginBottom: 10 }}>{icon}</div>
      <div style={{ color: '#e8ecf4', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{title}</div>
      <div style={{ color: '#6b7385', fontSize: 14, lineHeight: 1.7 }}>{body}</div>
      {mock === 'equity' && <MiniEquityCurve />}
      {mock === 'order'  && <MiniOrderEntry />}
      {mock === 'data'   && <MiniDataBadges />}
      {mock === 'zero'   && <MiniZeroRisk />}
      {mock === 'focus'  && <MiniCandleFocus />}
      {mock === 'xp'     && <MiniXPBar />}
    </div>
  );
}

function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');

  return (
    <section id="pricing" className="max-w-6xl mx-auto px-8 py-16">
      <h2 className="text-center font-bold mb-2" style={{ color: '#e8ecf4', fontSize: 22 }}>Simple, honest pricing</h2>
      <p className="text-center mb-1" style={{ color: '#6b7385', fontSize: 13 }}>
        Start free. Upgrade when you're ready.
      </p>
      <p className="text-center mb-6 font-mono text-xs" style={{ color: '#c9a84c' }}>
        Un challenge de €300 que fallas = 4 años de GoldTrader Pro
      </p>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <button
          onClick={() => setBilling('monthly')}
          className="px-4 py-1.5 rounded-sm text-xs font-medium transition-colors"
          style={{
            background: billing === 'monthly' ? '#141720' : 'transparent',
            color: billing === 'monthly' ? '#c8cdd8' : '#3a3f4d',
            border: `1px solid ${billing === 'monthly' ? '#1d2029' : 'transparent'}`,
            cursor: 'pointer',
          }}
        >Monthly</button>
        <button
          onClick={() => setBilling('annual')}
          className="px-4 py-1.5 rounded-sm text-xs font-medium transition-colors"
          style={{
            background: billing === 'annual' ? '#141720' : 'transparent',
            color: billing === 'annual' ? '#c8cdd8' : '#3a3f4d',
            border: `1px solid ${billing === 'annual' ? '#1d2029' : 'transparent'}`,
            cursor: 'pointer',
          }}
        >Annual</button>
        <span className="text-xs font-mono px-2 py-0.5 rounded-sm" style={{ background: '#0d1a08', color: '#2dcc6f', border: '1px solid #2dcc6f33' }}>
          Ahorra 33%
        </span>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        {/* Free */}
        <div className="p-6 rounded-sm flex flex-col" style={{ background: '#0b0d11', border: '1px solid #1d2029', minWidth: 210, flex: 1, maxWidth: 260 }}>
          <div style={{ color: '#6b7385', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Free</div>
          <div style={{ color: '#c8cdd8', fontSize: 36, fontWeight: 800, fontFamily: 'monospace', lineHeight: 1 }}>€0</div>
          <div style={{ color: '#6b7385', fontSize: 10, marginTop: 4, marginBottom: 20 }}>forever · no card required</div>
          <ul className="space-y-2 mb-6 flex-1">
            {['20 trade simulations', 'Basic stats: win rate & P/L', 'XAUUSD chart · 5 timeframes', 'Risk calculator', 'Missions & XP'].map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs" style={{ color: '#c8cdd8' }}>
                <span style={{ color: '#2dcc6f', flexShrink: 0 }}>✓</span> {f}
              </li>
            ))}
            {['Full analytics', 'Equity curve', 'Trader Score', 'All 8 timeframes'].map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs" style={{ color: '#3a3f4d' }}>
                <span style={{ flexShrink: 0 }}>—</span> {f}
              </li>
            ))}
          </ul>
          <Link href="/auth/register" className="block text-center py-2.5 rounded-sm text-xs font-bold" style={{ background: '#141720', color: '#c9a84c', border: '1px solid #2c2410', textDecoration: 'none' }}>
            Start free
          </Link>
        </div>

        {/* Pro subscription */}
        <div className="p-6 rounded-sm flex flex-col" style={{ background: '#0d1008', border: '1px solid #c9a84c55', boxShadow: '0 0 60px rgba(201,168,76,0.08)', minWidth: 210, flex: 1, maxWidth: 260 }}>
          <div className="text-center text-xs font-mono uppercase tracking-widest mb-4 py-1 rounded-sm"
            style={{ background: '#c9a84c22', color: '#c9a84c', border: '1px solid #c9a84c44' }}>
            {billing === 'annual' ? '◆ Best value' : '◆ Pro'}
          </div>
          <div style={{ color: '#6b7385', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Pro</div>
          <div style={{ color: '#e8c96d', fontSize: 36, fontWeight: 800, fontFamily: 'monospace', lineHeight: 1 }}>
            {billing === 'monthly' ? '€9.95' : '€79'}
          </div>
          <div style={{ color: '#6b7385', fontSize: 10, marginTop: 4, marginBottom: 2 }}>
            {billing === 'monthly' ? 'por mes · cancela cuando quieras' : 'por año · cancela cuando quieras'}
          </div>
          {billing === 'annual' && (
            <div style={{ color: '#2dcc6f', fontSize: 10, marginBottom: 16 }}>≈ €6.58/mes · ahorras €40 vs mensual</div>
          )}
          {billing === 'monthly' && <div style={{ marginBottom: 16 }} />}
          <ul className="space-y-2 mb-6 flex-1">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs" style={{ color: '#c8cdd8' }}>
                <span style={{ color: '#2dcc6f', flexShrink: 0 }}>✓</span> {f}
              </li>
            ))}
          </ul>
          <Link
            href={`/auth/register?plan=${billing}`}
            className="block text-center py-2.5 rounded-sm text-xs font-bold"
            style={{ background: 'linear-gradient(135deg,#c9a84c,#a8893c)', color: '#000', textDecoration: 'none' }}
          >
            {billing === 'annual' ? 'Get annual access →' : 'Get monthly access →'}
          </Link>
        </div>

        {/* Prop Firm */}
        <div className="p-6 rounded-sm flex flex-col" style={{ background: '#080d14', border: '1px solid #4a6cf755', boxShadow: '0 0 60px rgba(74,108,247,0.06)', minWidth: 210, flex: 1, maxWidth: 260 }}>
          <div className="text-center text-xs font-mono uppercase tracking-widest mb-4 py-1 rounded-sm"
            style={{ background: '#4a6cf722', color: '#4a6cf7', border: '1px solid #4a6cf744' }}>
            ◈ B2B · Prop Firm
          </div>
          <div style={{ color: '#8893a8', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Prop Firm</div>
          <div style={{ color: '#a8b8f0', fontSize: 36, fontWeight: 800, fontFamily: 'monospace', lineHeight: 1 }}>€149</div>
          <div style={{ color: '#6b7385', fontSize: 10, marginTop: 4, marginBottom: 2 }}>per year · per firm</div>
          <div style={{ color: '#4a6cf7', fontSize: 10, marginBottom: 16 }}>≈ €12.40/mo · billed annually</div>
          <ul className="space-y-2 mb-6 flex-1">
            {PROPFIRM_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs" style={{ color: f === 'Everything in Pro' ? '#8893a8' : '#c8cdd8' }}>
                <span style={{ color: '#4a6cf7', flexShrink: 0 }}>✓</span> {f}
              </li>
            ))}
          </ul>
          <a
            href="mailto:hello@goldtrader.app?subject=Prop%20Firm%20Plan%20enquiry"
            className="block text-center py-2.5 rounded-sm text-xs font-bold"
            style={{ background: 'linear-gradient(135deg,#c9a84c,#a8893c)', color: '#000', textDecoration: 'none' }}
          >
            Contact us →
          </a>
          <p className="text-center mt-2" style={{ color: '#3a3f4d', fontSize: 10 }}>Custom volume pricing for &gt;5 seats</p>
        </div>
      </div>

      <p className="text-center mt-6" style={{ color: '#3a3f4d', fontSize: 11 }}>
        iDEAL · Credit & debit card · Stripe · 30-day refund guarantee · GDPR compliant
      </p>
    </section>
  );
}

// Keep for potential reuse

function FakeTicker() {
  const [price, setPrice] = useState(3342.50);
  const [dir,   setDir]   = useState<1 | -1>(1);

  useEffect(() => {
    const id = setInterval(() => {
      setPrice((p) => {
        const delta = (Math.random() - 0.48) * 0.40;
        const next  = Math.round((p + delta) * 100) / 100;
        setDir(delta >= 0 ? 1 : -1);
        return next;
      });
    }, 800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-center gap-6 flex-wrap mt-6 mb-2">
      <div className="flex items-center gap-2 px-4 py-2 rounded-sm font-mono text-sm"
        style={{ background: '#0f1117', border: '1px solid #2c2410' }}>
        <span style={{ color: '#c9a84c', fontWeight: 700 }}>XAUUSD</span>
        <span style={{ color: dir === 1 ? '#2dcc6f' : '#e84040', fontWeight: 800, fontSize: 18, minWidth: 70, textAlign: 'right' }}>
          {price.toFixed(2)}
        </span>
        <span style={{ color: dir === 1 ? '#2dcc6f' : '#e84040', fontSize: 11 }}>{dir === 1 ? '▲' : '▼'}</span>
      </div>
      <div className="flex items-center gap-3 font-mono text-xs" style={{ color: '#6b7385' }}>
        <span>BID <span style={{ color: '#2dcc6f' }}>{(price - 0.10).toFixed(2)}</span></span>
        <span>ASK <span style={{ color: '#e84040' }}>{(price + 0.10).toFixed(2)}</span></span>
        <span>SPD <span style={{ color: '#c9a84c' }}>0.20</span></span>
      </div>
    </div>
  );
}

function FakeMiniChart() {
  const W = 600; const H = 220;
  const points = [
    [0,120],[40,110],[80,130],[120,100],[160,115],[200,95],[240,105],[280,80],[320,90],[360,75],[400,85],[440,65],[480,78],[520,60],[560,70],[600,55],
  ];
  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  const area = `${path} L${W},${H} L0,${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[40, 80, 120, 160].map((y) => (
        <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="#1d2029" strokeWidth="1" />
      ))}
      {[100, 200, 300, 400, 500].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2={H} stroke="#1d2029" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#chartGrad)" />
      <path d={path} stroke="#c9a84c" strokeWidth="1.5" fill="none" />
      <circle cx={560} cy={60} r="3" fill="#c9a84c" />
    </svg>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto max-w-4xl mt-12 mb-2" style={{ perspective: '1200px' }}>
      <div style={{
        position: 'absolute', inset: 0, margin: 'auto',
        width: '60%', height: '40%', top: '30%',
        background: 'radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        background: '#0b0d11', border: '1px solid #2c2410', borderRadius: 8, overflow: 'hidden',
        transform: 'rotateX(4deg)', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px #1d2029',
      }}>
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#0f1117', borderBottom: '1px solid #1d2029' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e84040' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f0b429' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2dcc6f' }} />
          <div className="flex-1 mx-4 px-3 py-1 rounded text-xs font-mono text-center"
            style={{ background: '#141720', color: '#6b7385', border: '1px solid #1d2029', maxWidth: 300, margin: '0 auto' }}>
            goldtrader.app/trade
          </div>
        </div>
        {/* Desk header */}
        <div className="flex items-center gap-4 px-4 py-1.5 font-mono text-xs overflow-hidden"
          style={{ background: 'linear-gradient(180deg,#0d0e12,#09090d)', borderBottom: '1px solid #2c2410' }}>
          <span style={{ color: '#c9a84c', fontWeight: 700 }}>◆ Bullion Desk</span>
          <span style={{ color: '#e8c96d', fontWeight: 700 }}>XAUUSD</span>
          <span style={{ color: '#6b7385' }}>BID <span style={{ color: '#2dcc6f' }}>3342.40</span></span>
          <span style={{ color: '#6b7385' }}>ASK <span style={{ color: '#e84040' }}>3342.60</span></span>
          <span style={{ color: '#6b7385' }}>SPD <span style={{ color: '#c9a84c' }}>0.20</span></span>
          <span style={{ color: '#6b7385' }}>SESSION <span style={{ color: '#c8cdd8' }}>LONDON</span></span>
          <span style={{ color: '#6b7385' }}>NET FLOW <span style={{ color: '#2dcc6f' }}>+25 oz BUY</span></span>
        </div>
        {/* Workspace */}
        <div className="flex" style={{ height: 260 }}>
          <div className="flex-1 relative overflow-hidden" style={{ borderRight: '1px solid #1d2029' }}>
            <FakeMiniChart />
            <div className="absolute bottom-3 left-3 font-mono text-xs" style={{ color: '#6b7385' }}>
              XAUUSD · 1H · <span style={{ color: '#c9a84c' }}>3342.50</span>
            </div>
          </div>
          <div className="flex flex-col shrink-0 p-3 gap-2" style={{ width: 180, background: '#0b0d11' }}>
            <div style={{ color: '#c9a84c', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>Order Entry</div>
            <div className="px-2 py-1 rounded text-xs font-mono" style={{ background: '#0f1117', border: '1px solid #2c2410', color: '#e8c96d' }}>
              XAUUSD <span style={{ color: '#6b7385', fontSize: 9 }}>LOCKED</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="text-center py-1.5 rounded text-xs font-bold" style={{ background: '#1a6b3a', color: '#2dcc6f', border: '1px solid #2dcc6f33' }}>▲ BUY</div>
              <div className="text-center py-1.5 rounded text-xs font-bold" style={{ background: '#141720', color: '#6b7385', border: '1px solid #1d2029' }}>▼ SELL</div>
            </div>
            <div className="px-2 py-1 rounded text-xs font-mono" style={{ background: '#141720', border: '1px solid #1d2029', color: '#c8cdd8' }}>10.0 oz</div>
            <div className="px-2 py-1 rounded text-xs font-mono" style={{ background: '#141720', border: '1px solid #1d2029', color: '#c8cdd8' }}>3342.50</div>
            <div className="text-center py-1.5 rounded text-xs font-bold mt-auto"
              style={{ background: 'linear-gradient(135deg,#2c2410,#1a1508)', color: '#c9a84c', border: '1px solid #c9a84c44' }}>
              ◆ DRAFT BUY
            </div>
          </div>
        </div>
        {/* Blotter */}
        <div style={{ borderTop: '1px solid #1d2029', background: '#09090d' }}>
          <div className="px-3 py-1.5 flex items-center gap-3 font-mono text-xs" style={{ borderBottom: '1px solid #0f1117' }}>
            {['ALL','DRAFT','SUBMITTED','APPROVED','REJECTED'].map((s, i) => (
              <span key={s} style={{ color: i === 0 ? '#c9a84c' : '#3a3f4d', borderBottom: i === 0 ? '1px solid #c9a84c' : 'none', paddingBottom: 2 }}>{s}</span>
            ))}
          </div>
          {[
            { side: 'BUY',  oz: '10.0', price: '3342.50', status: 'APPROVED',  statusColor: '#2dcc6f' },
            { side: 'SELL', oz: '5.0',  price: '3338.20', status: 'SUBMITTED', statusColor: '#f0b429' },
            { side: 'BUY',  oz: '20.0', price: '3310.00', status: 'DRAFT',     statusColor: '#6b7385' },
          ].map((o, i) => (
            <div key={i} className="flex items-center gap-4 px-3 py-1.5 font-mono text-xs" style={{ borderBottom: '1px solid #0b0d11' }}>
              <span style={{ color: o.side === 'BUY' ? '#2dcc6f' : '#e84040', fontWeight: 700, minWidth: 36 }}>{o.side === 'BUY' ? '▲' : '▼'} {o.side}</span>
              <span style={{ color: '#8893a8' }}>XAUUSD</span>
              <span style={{ color: '#8893a8' }}>{o.oz} oz</span>
              <span style={{ color: '#8893a8' }}>@ {o.price}</span>
              <span style={{ color: o.statusColor, fontSize: 9, letterSpacing: 1, marginLeft: 'auto' }}>{o.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #1d2029' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <span style={{ color: '#c8cdd8', fontSize: 15, fontWeight: 500 }}>{q}</span>
        <span style={{
          color: '#c9a84c', fontSize: 14, flexShrink: 0,
          transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'rotate(0)',
        }}>+</span>
      </button>
      {open && (
        <div className="pb-4" style={{ color: '#6b7385', fontSize: 14, lineHeight: 1.8 }}>{a}</div>
      )}
    </div>
  );
}

function EmailCapture() {
  const [email, setEmail] = useState('');
  const [done,  setDone]  = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setDone(true);
  }

  return (
    <div className="max-w-md mx-auto">
      {done ? (
        <div className="text-center py-3 px-6 rounded-sm font-mono text-sm"
          style={{ background: '#0a1a0e', border: '1px solid #2dcc6f33', color: '#2dcc6f' }}>
          ✓ You're on the list — we'll be in touch.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-sm text-sm font-mono"
            style={{
              background: '#0f1117', border: '1px solid #2c2410',
              color: '#c8cdd8', outline: 'none',
            }}
          />
          <button type="submit" className="px-5 py-2.5 rounded-sm text-sm font-bold shrink-0"
            style={{ background: '#141720', color: '#c9a84c', border: '1px solid #2c2410', cursor: 'pointer' }}>
            Notify me
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Who Uses Section with B2C/B2B toggle ────────────────────────────────────

const B2C_CASES = USE_CASES;
const B2B_CASES = [
  {
    icon: '🏢',
    profile: 'Prop Firm — Preselección',
    context: 'La firma busca candidatos que ya dominen las métricas antes del challenge',
    outcome: 'Integra GoldTrader como herramienta de warm-up oficial: los candidatos llegan con drawdown y consistency ya trabajados, y la tasa de paso sube.',
    tag: 'PROP FIRM OPS',
    color: '#c9a84c',
  },
  {
    icon: '🎓',
    profile: 'Academia de Trading',
    context: 'Cursos online o presenciales con prácticas sobre oro',
    outcome: 'Sustituye el demo broker genérico por un simulador especializado XAUUSD con Trader Score que el alumno puede incluir en su portfolio.',
    tag: 'FORMACIÓN',
    color: '#4a6cf7',
  },
  {
    icon: '📡',
    profile: 'Comunidad / Telegram de señales',
    context: 'Grupo de señales XAUUSD con cientos de suscriptores activos',
    outcome: 'Ofrece GoldTrader Pro como beneficio de membresía premium. Los miembros practican las señales en el simulador antes de ejecutarlas en real.',
    tag: 'COMUNIDAD',
    color: '#2dcc6f',
  },
];

function WhoUsesSection() {
  const [tab, setTab] = useState<'b2c' | 'b2b'>('b2c');
  const cases = tab === 'b2c' ? B2C_CASES : B2B_CASES;
  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <h2 className="text-center font-bold mb-3" style={{ color: '#e8ecf4', fontSize: 28 }}>¿Para quién es GoldTrader?</h2>
      <p className="text-center mb-6" style={{ color: '#6b7385', fontSize: 16 }}>
        Traders individuales y negocios que entrenan en XAUUSD.
      </p>
      {/* Toggle */}
      <div className="flex justify-center mb-10">
        <div className="flex rounded-sm overflow-hidden" style={{ border: '1px solid #1d2029' }}>
          {([['b2c', 'Traders individuales'], ['b2b', 'Empresas & Academias']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className="px-5 py-2 text-xs font-mono uppercase tracking-wide transition-colors"
              style={{
                background: tab === key ? '#c9a84c' : '#0f1117',
                color: tab === key ? '#08090c' : '#6b7385',
                fontWeight: tab === key ? 700 : 400,
                border: 'none', cursor: 'pointer',
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cases.map((u) => (
          <div key={u.profile} className="p-6 rounded-sm flex flex-col gap-4"
            style={{ background: '#0f1117', border: `1px solid ${u.color}22` }}>
            <div className="flex items-start gap-3">
              <div className="text-2xl">{u.icon}</div>
              <div>
                <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: u.color }}>{u.tag}</div>
                <div style={{ color: '#e8ecf4', fontWeight: 700, fontSize: 16 }}>{u.profile}</div>
              </div>
            </div>
            <div style={{ color: '#6b7385', fontSize: 13, fontStyle: 'italic', borderLeft: `2px solid ${u.color}33`, paddingLeft: 12 }}>
              {u.context}
            </div>
            <div style={{ color: '#8893a8', fontSize: 14, lineHeight: 1.8 }}>{u.outcome}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [ready, setReady] = useState(false);
  const [publicStats, setPublicStats] = useState<{ totalUsers: number; totalTrades: number } | null>(null);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setReady(true);
    fetch('/api/stats/public')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setPublicStats(d))
      .catch(() => null);
  }, []);

  useEffect(() => {
    if (ready && isAuthenticated()) router.replace('/dashboard');
  }, [ready, isAuthenticated, router]);

  if (!ready) return null;
  if (isAuthenticated()) return null;

  return (
    <div className="landing-scroll min-h-screen font-sans" style={{ background: '#07080b', color: '#c8cdd8' }}>

      {/* ── Global keyframes ── */}
      <style>{`
        @keyframes candleGlow {
          0%, 100% { opacity: 0.8; transform: translate(-50%,-50%) scale(1); }
          50%      { opacity: 1;   transform: translate(-50%,-50%) scale(1.12); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pillSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-text { animation: heroFadeUp 0.7s ease both; }
        .hero-text-delay-1 { animation: heroFadeUp 0.7s 0.1s ease both; }
        .hero-text-delay-2 { animation: heroFadeUp 0.7s 0.22s ease both; }
        .hero-text-delay-3 { animation: heroFadeUp 0.7s 0.36s ease both; }
        .hero-text-delay-4 { animation: heroFadeUp 0.7s 0.50s ease both; }
        .hero-pill { animation: pillSlide 0.5s ease both; }
        .hero-3d   { animation: heroFadeUp 0.9s 0.15s ease both; }
      `}</style>

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 py-3 border-b sticky top-0 z-40"
        style={{ borderColor: '#1d2029', background: 'rgba(7,8,11,0.92)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2">
          <LogoIcon size={22} />
          <span style={{ color: '#e8b84b', fontWeight: 700, fontSize: 14, letterSpacing: '0.02em' }}>GoldTrader</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-xs" style={{ color: '#6b7385' }}>
          <a href="#features" style={{ color: '#6b7385', textDecoration: 'none' }} className="hover:text-[#c8cdd8] transition-colors">Features</a>
          <a href="#pricing"  style={{ color: '#6b7385', textDecoration: 'none' }} className="hover:text-[#c8cdd8] transition-colors">Pricing</a>
          <a href="#faq"      style={{ color: '#6b7385', textDecoration: 'none' }} className="hover:text-[#c8cdd8] transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" style={{ color: '#8893a8', fontSize: 12, textDecoration: 'none' }}>Log in</Link>
          <Link href="/auth/register"
            className="px-4 py-1.5 rounded-sm text-xs font-bold transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#c9a84c,#a8893c)', color: '#000', textDecoration: 'none' }}>
            Start free →
          </Link>
        </div>
      </nav>

      {/* ── Hero — full width, animation as background ── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
        {/* Animation — absolute background layer */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <CandlestickHero3D fullscreen />
        </div>

        {/* Soft radial backdrop so text reads cleanly over the animation */}
        <div className="absolute pointer-events-none" style={{
          zIndex: 0,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%', maxWidth: 820,
          height: '75%',
          background: 'radial-gradient(ellipse at center, rgba(8,9,12,0.78) 30%, rgba(8,9,12,0.30) 70%, transparent 100%)',
          filter: 'blur(2px)',
        }} />

        {/* Content — centrado sobre la animación */}
        <div className="relative flex flex-col items-center text-center px-6 pt-28 pb-16" style={{ zIndex: 1 }}>

          {/* Announcement pill */}
          <div className="hero-pill flex items-center gap-2 mb-8 w-fit px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(15,17,23,0.80)', border: '1px solid #2c2410', backdropFilter: 'blur(8px)' }}>
            <span style={{ color: '#c9a84c', fontSize: 10 }}>◆</span>
            <span style={{ color: '#c8cdd8', fontSize: 11, fontWeight: 600 }}>Acceso beta</span>
            <span style={{ color: '#6b7385', fontSize: 11 }}>· Solo 47 plazas disponibles</span>
            <span style={{ color: '#c9a84c', fontSize: 11 }}>→</span>
          </div>

          {/* Ticker */}
          <div className="mb-6">
            <FakeTicker />
          </div>

          {/* Headline */}
          <h1 className="hero-text font-black leading-[1.08] mb-5"
            style={{ fontSize: 'clamp(36px,5.5vw,72px)', color: '#e8ecf4', letterSpacing: '-0.02em', maxWidth: 820 }}>
            ¿Pasarías el challenge{' '}
            <span style={{
              background: 'linear-gradient(135deg,#FFE082,#C9A84C)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>antes de poner dinero real?</span>
          </h1>

          <p className="hero-text-delay-1 mb-8"
            style={{ color: '#8893a8', fontSize: 16, lineHeight: 1.8, maxWidth: 580 }}>
            Los challenges (FTMO, Funded Next) cuestan entre <strong style={{ color: '#c8cdd8' }}>€150–€1.500</strong> y el <strong style={{ color: '#c8cdd8' }}>85% los fallan en la primera semana</strong>. GoldTrader te permite practicar exactamente las métricas que te evalúan, sobre datos reales de XAUUSD, sin arriesgar nada.
          </p>

          {/* Prop firm metrics preview */}
          <div className="hero-text-delay-2 flex flex-wrap justify-center gap-2 mb-8">
            {[
              { label: 'Max DD', value: '< 10%', ok: true },
              { label: 'Daily DD', value: '< 5%', ok: true },
              { label: 'Consistency', value: '≥ 70/100', ok: false },
              { label: 'Avg R:R', value: '≥ 2:1', ok: false },
            ].map(({ label, value, ok }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-sm font-mono text-xs"
                style={{ background: 'rgba(15,17,23,0.75)', border: `1px solid ${ok ? '#2dcc6f33' : '#1d2029'}`, backdropFilter: 'blur(6px)' }}>
                <span style={{ color: ok ? '#2dcc6f' : '#e84040', fontSize: 10 }}>{ok ? '✓' : '✗'}</span>
                <span style={{ color: '#6b7385' }}>{label}</span>
                <span style={{ color: ok ? '#2dcc6f' : '#e84040', fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          {publicStats && publicStats.totalTrades >= 10 && (
            <div className="flex items-center justify-center gap-2 mb-5 px-4 py-2 rounded-full w-fit mx-auto"
              style={{ background: 'rgba(15,17,23,0.75)', border: '1px solid rgba(45,204,111,0.25)', backdropFilter: 'blur(8px)' }}>
              <span style={{ color: '#2dcc6f', fontSize: 10 }}>▦</span>
              <span className="font-mono text-xs" style={{ color: '#2dcc6f', fontWeight: 700 }}>{publicStats.totalTrades.toLocaleString()}</span>
              <span className="font-mono text-xs" style={{ color: '#6b7385' }}>simulaciones completadas por traders como tú</span>
            </div>
          )}

          {/* CTAs */}
          <div className="hero-text-delay-3 flex items-center justify-center gap-3 flex-wrap mb-6">
            <Link href="/auth/register"
              className="px-8 py-3.5 rounded-sm font-bold text-sm transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#c9a84c,#a8893c)', color: '#000', textDecoration: 'none' }}>
              Empezar gratis — 20 simulaciones →
            </Link>
            <a href="#preview"
              className="px-8 py-3.5 rounded-sm text-sm transition-colors hover:text-[#c8cdd8]"
              style={{ background: 'rgba(15,17,23,0.70)', color: '#6b7385', border: '1px solid #1d2029', textDecoration: 'none', backdropFilter: 'blur(6px)' }}>
              Ver demo ↓
            </a>
          </div>

          {/* Trust micro-text */}
          <p className="hero-text-delay-4 flex flex-wrap justify-center gap-4" style={{ fontSize: 11 }}>
            {[
              ['🔒', 'Sin tarjeta de crédito'],
              ['📊', 'Datos reales Twelve Data'],
              ['✓', '20 simulaciones gratis'],
              ['↩', 'Garantía 30 días'],
            ].map(([icon, text]) => (
              <span key={text as string} style={{ color: '#6b7385' }}>
                <span style={{ marginRight: 4 }}>{icon}</span>{text as string}
              </span>
            ))}
          </p>

          {publicStats && publicStats.totalTrades >= 50 && (
            <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-sm font-mono text-xs"
              style={{ background: 'rgba(15,17,23,0.75)', border: '1px solid #1d2029', backdropFilter: 'blur(6px)' }}>
              <span style={{ color: '#2dcc6f' }}>▦</span>
              <span style={{ color: '#c8cdd8', fontWeight: 700 }}>{publicStats.totalTrades.toLocaleString()}</span>
              <span style={{ color: '#6b7385' }}>simulaciones completadas</span>
            </div>
          )}
        </div>
      </section>

      {/* ── Hero product teaser — below the split hero ── */}
      <section className="max-w-6xl mx-auto px-8 pb-10">
        {/* Hero product teaser — 16:9 mock of the trading desk */}
        <div className="relative mx-auto mt-10" style={{ maxWidth: 720, borderRadius: 8, overflow: 'hidden', border: '1px solid #2c2410', boxShadow: '0 0 80px rgba(201,168,76,0.10), 0 40px 80px rgba(0,0,0,0.5)' }}>
          {/* Browser bar */}
          <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#0f1117', borderBottom: '1px solid #1d2029' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e84040' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f0b429' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2dcc6f' }} />
            <div className="mx-auto px-3 py-0.5 rounded font-mono text-xs" style={{ background: '#141720', color: '#6b7385', border: '1px solid #1d2029' }}>
              goldtrader.app/trade
            </div>
          </div>
          {/* Desk header */}
          <div className="flex items-center gap-4 px-4 py-1.5 font-mono text-xs overflow-hidden" style={{ background: '#09090d', borderBottom: '1px solid #2c2410' }}>
            <span style={{ color: '#c9a84c', fontWeight: 700 }}>◆ Bullion Desk</span>
            <span style={{ color: '#e8c96d', fontWeight: 700 }}>XAUUSD</span>
            <span style={{ color: '#6b7385' }}>BID <span style={{ color: '#2dcc6f' }}>3342.40</span></span>
            <span style={{ color: '#6b7385' }}>ASK <span style={{ color: '#e84040' }}>3342.60</span></span>
            <span style={{ color: '#6b7385' }}>SESSION <span style={{ color: '#c8cdd8' }}>LONDON</span></span>
            <span className="ml-auto font-mono text-xs px-2 py-0.5 rounded-sm" style={{ background: '#0a1a0e', color: '#2dcc6f', border: '1px solid #2dcc6f33' }}>
              Trader Score 84/100
            </span>
          </div>
          {/* Main workspace */}
          <div className="flex" style={{ height: 200, background: '#07080b' }}>
            {/* Chart area */}
            <div className="flex-1 relative overflow-hidden" style={{ borderRight: '1px solid #1d2029' }}>
              <FakeMiniChart />
              <div className="absolute bottom-2 left-3 font-mono text-xs" style={{ color: '#6b7385' }}>XAUUSD · 1H · <span style={{ color: '#c9a84c' }}>3342.50</span></div>
              {/* Annotated trade */}
              <div className="absolute" style={{ top: '38%', left: '62%', transform: 'translateY(-50%)' }}>
                <div className="font-mono text-xs px-2 py-1 rounded-sm" style={{ background: '#1a6b3a', border: '1px solid #2dcc6f55', color: '#2dcc6f' }}>▲ BUY +14.2 oz</div>
              </div>
            </div>
            {/* Order panel */}
            <div className="flex flex-col shrink-0 p-3 gap-2" style={{ width: 160, background: '#0b0d11' }}>
              <div style={{ color: '#c9a84c', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' }}>Open Trade</div>
              <div className="flex justify-between font-mono text-xs"><span style={{ color: '#6b7385' }}>Entry</span><span style={{ color: '#c8cdd8' }}>3330.50</span></div>
              <div className="flex justify-between font-mono text-xs"><span style={{ color: '#6b7385' }}>SL</span><span style={{ color: '#e84040' }}>3320.00</span></div>
              <div className="flex justify-between font-mono text-xs"><span style={{ color: '#6b7385' }}>TP</span><span style={{ color: '#2dcc6f' }}>3355.00</span></div>
              <div className="flex justify-between font-mono text-xs"><span style={{ color: '#6b7385' }}>P/L</span><span style={{ color: '#2dcc6f', fontWeight: 700 }}>+$340.50</span></div>
              <div className="flex justify-between font-mono text-xs"><span style={{ color: '#6b7385' }}>R:R</span><span style={{ color: '#c9a84c', fontWeight: 700 }}>2.33:1</span></div>
              <div className="mt-auto text-center py-1.5 rounded-sm text-xs font-bold" style={{ background: '#0a1a0e', color: '#2dcc6f', border: '1px solid #2dcc6f33' }}>CLOSE TRADE</div>
            </div>
          </div>
          {/* Stats bar */}
          <div className="flex items-center gap-6 px-4 py-2 font-mono text-xs" style={{ background: '#0b0d11', borderTop: '1px solid #1d2029' }}>
            <span style={{ color: '#6b7385' }}>Win rate <span style={{ color: '#2dcc6f', fontWeight: 700 }}>73%</span></span>
            <span style={{ color: '#6b7385' }}>Drawdown <span style={{ color: '#2dcc6f', fontWeight: 700 }}>-3.2%</span></span>
            <span style={{ color: '#6b7385' }}>Consistency <span style={{ color: '#c9a84c', fontWeight: 700 }}>78/100</span></span>
            <span style={{ color: '#6b7385' }}>Sessions <span style={{ color: '#c8cdd8', fontWeight: 700 }}>14</span></span>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="border-y" style={{ borderColor: '#1d2029', background: '#0b0d11' }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-center gap-8 flex-wrap">
          {[
            ['XAUUSD',      'Gold Spot — one instrument, mastered'],
            ['8 timeframes','M1 · M5 · M15 · H1 · H4 · D1 · W1 · MN'],
            ['2yr history', 'Real historical price data'],
            ['€79/yr',       'Acceso Pro completo — plan anual, cancela cuando quieras'],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <div style={{ color: '#c9a84c', fontWeight: 700, fontSize: 14, fontFamily: 'monospace' }}>{val}</div>
              <div style={{ color: '#6b7385', fontSize: 10, marginTop: 1 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Product preview ── */}
      <CornerFrame>
        <section id="preview" className="max-w-7xl mx-auto px-8 py-16">
          <div className="text-center mb-2">
            <GoldLabel>Live product preview</GoldLabel>
            <h2 className="font-bold" style={{ color: '#e8ecf4', fontSize: 22 }}>
              A real trading desk. Zero risk.
            </h2>
            <p style={{ color: '#6b7385', fontSize: 13, marginTop: 6 }}>
              Gold ticker, order blotter, full audit workflow — exactly how institutional desks operate.
            </p>
          </div>
          <ProductPreview />
          {/* CTA secundario bajo el product mock */}
          <div className="flex justify-center mt-8">
            <Link href="/auth/register"
              className="px-8 py-3 rounded-sm font-bold text-sm transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#c9a84c,#a8893c)', color: '#000', textDecoration: 'none' }}>
              Probar en el simulador →
            </Link>
          </div>
        </section>
      </CornerFrame>

      {/* ── Features ── */}
      <CornerFrame>
        <section id="features" className="max-w-7xl mx-auto px-8 py-16">
          <h2 className="text-center font-bold mb-3" style={{ color: '#e8ecf4', fontSize: 28 }}>Las 4 razones por las que el 85% falla — y cómo las trabajamos</h2>
          <p className="text-center mb-12" style={{ color: '#6b7385', fontSize: 16 }}>
            Cada feature resuelve una causa concreta de fallo en los challenges de prop firm.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </section>
      </CornerFrame>

      {/* ── How it works ── */}
      <section className="border-y py-16" style={{ borderColor: '#1d2029', background: '#0b0d11' }}>
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-center font-bold mb-12" style={{ color: '#e8ecf4', fontSize: 28 }}>Cómo funciona</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center flex flex-col items-center">
                <div className="flex items-center justify-center mb-4 rounded-full"
                  style={{ width: 68, height: 68, background: '#0f1117', border: '1px solid #2c2410', fontSize: 28 }}>
                  {s.icon}
                </div>
                <div className="font-mono text-xs mb-2" style={{ color: '#c9a84c55', fontWeight: 700 }}>{s.n}</div>
                <div style={{ color: '#e8ecf4', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{s.title}</div>
                <div style={{ color: '#6b7385', fontSize: 14, lineHeight: 1.8 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <WhoUsesSection />

      {/* ── Prop Firm B2B Banner ── */}
      <section className="border-y py-12" style={{ borderColor: '#4a6cf733', background: 'linear-gradient(135deg,#07080b 0%,#080d14 100%)' }}>
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="text-xs font-mono uppercase tracking-widest mb-3 px-2 py-1 inline-block rounded-sm"
                style={{ background: '#4a6cf722', color: '#4a6cf7', border: '1px solid #4a6cf744' }}>
                ◈ For Prop Firm Operators
              </div>
              <h2 className="font-bold mb-4" style={{ color: '#e8ecf4', fontSize: 24 }}>
                Prepare your candidates before they hit the challenge.
              </h2>
              <p style={{ color: '#6b7385', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                Run your prop firm's screening process with a simulator that enforces FTMO-style rules — daily drawdown &lt;5%, max drawdown &lt;10%, consistency score — on real XAUUSD data. Give every candidate an equal baseline before they trade real capital.
              </p>
              <div className="flex flex-wrap gap-2">
                {['FTMO-style rules enforced', 'Real XAUUSD data', 'CSV blotter export', 'Consistency scoring', 'Daily DD alerts'].map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-sm font-mono"
                    style={{ background: '#0f1520', color: '#8893a8', border: '1px solid #4a6cf733' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0 p-6 rounded-sm" style={{ background: '#0b0e1a', border: '1px solid #4a6cf744', minWidth: 260 }}>
              <div className="font-mono text-xs space-y-3">
                {[
                  { label: 'Daily drawdown',   value: '-2.3%',  limit: '< 5%',  ok: true },
                  { label: 'Max drawdown',      value: '-6.1%',  limit: '< 10%', ok: true },
                  { label: 'Consistency score', value: '78/100', limit: '≥ 70',  ok: true },
                  { label: 'Winning days',      value: '9 / 14', limit: '',       ok: true },
                ].map(({ label, value, limit, ok }) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <span style={{ color: '#6b7385' }}>{label}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ color: ok ? '#2dcc6f' : '#e84040', fontWeight: 700 }}>{value}</span>
                      {limit && <span style={{ color: '#3a3f4d', fontSize: 9 }}>{limit}</span>}
                      <span style={{ color: ok ? '#2dcc6f' : '#e84040', fontSize: 10 }}>{ok ? '✓' : '✗'}</span>
                    </div>
                  </div>
                ))}
                <div className="pt-2 mt-2" style={{ borderTop: '1px solid #1d2029' }}>
                  <div className="flex items-center justify-between">
                    <span style={{ color: '#8893a8', fontSize: 11 }}>Challenge status</span>
                    <span className="px-2 py-0.5 rounded-sm font-bold text-xs"
                      style={{ background: '#0a1a0e', color: '#2dcc6f', border: '1px solid #2dcc6f33' }}>
                      PASSING ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <CornerFrame>
        <PricingSection />
      </CornerFrame>

      {/* ── FAQ ── */}
      <section id="faq" className="border-t py-14" style={{ borderColor: '#1d2029', background: '#0b0d11' }}>
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-center font-bold mb-10" style={{ color: '#e8ecf4', fontSize: 22 }}>Frequently asked questions</h2>
          {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
        </div>
      </section>

      {/* ── Final CTA — cierre emocional ── */}
      <section className="border-t py-20 text-center relative overflow-hidden" style={{ borderColor: '#1d2029', background: '#07080b' }}>
        {/* Glow de fondo */}
        <div className="absolute pointer-events-none" style={{
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 600, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div className="relative max-w-3xl mx-auto px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(201,168,76,0.10)', border: '1px solid rgba(201,168,76,0.25)' }}>
            <span style={{ color: '#c9a84c', fontSize: 10 }}>◆</span>
            <span style={{ color: '#c9a84c', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em' }}>EMPIEZA HOY · GRATIS</span>
          </div>
          <h2 className="font-black mb-4" style={{ fontSize: 'clamp(28px,4vw,48px)', color: '#e8ecf4', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            ¿Listo para entrenar antes<br />
            <span style={{ background: 'linear-gradient(135deg,#FFE082,#C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              del challenge?
            </span>
          </h2>
          <p style={{ color: '#6b7385', fontSize: 14, marginBottom: 32, lineHeight: 1.7 }}>
            Un challenge de €300 que fallas cuesta más que <strong style={{ color: '#8893a8' }}>4 años de GoldTrader Pro</strong>.<br />
            Tus primeras 20 simulaciones son gratis. Sin tarjeta.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
            <Link href="/auth/register"
              className="inline-block px-9 py-4 rounded-sm font-bold text-sm transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#c9a84c,#a8893c)', color: '#000', textDecoration: 'none', fontSize: 15 }}>
              Empezar gratis — 20 simulaciones →
            </Link>
            <a href="#pricing"
              className="inline-block px-9 py-4 rounded-sm text-sm transition-colors hover:text-[#c8cdd8]"
              style={{ background: 'transparent', color: '#6b7385', border: '1px solid #1d2029', textDecoration: 'none' }}>
              Ver planes
            </a>
          </div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[['🔒','Sin tarjeta'], ['⚡','Acceso inmediato'], ['↩','Garantía 30 días'], ['🇪🇺','GDPR compliant']].map(([icon,text]) => (
              <span key={text} style={{ color: '#3a3f4d', fontSize: 11 }}>{icon} {text}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guide download + Email capture ── */}
      <section className="border-t py-16" style={{ borderColor: '#1d2029', background: '#09090d' }}>
        <div className="max-w-3xl mx-auto px-8">

          {/* Guía descargable */}
          <div className="rounded-lg p-8 mb-10 text-center" style={{
            background: 'linear-gradient(135deg, #0f1117 0%, #141720 100%)',
            border: '1px solid #2c2410',
          }}>
            {/* Badge clicable */}
            <Link href="/guide" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(201,168,76,0.10)', border: '1px solid rgba(201,168,76,0.30)',
                       textDecoration: 'none', transition: 'border-color .2s' }}>
              <span style={{ color: '#c9a84c', fontSize: 10 }}>◆</span>
              <span style={{ color: '#c9a84c', fontSize: 11, fontWeight: 700, letterSpacing: '0.10em' }}>
                CHALLENGE PREP GUIDE · GRATIS
              </span>
              <span style={{ color: '#6b7385', fontSize: 10 }}>→</span>
            </Link>

            <h3 className="font-black mb-3" style={{ fontSize: 22, color: '#e8ecf4', letterSpacing: '-.02em' }}>
              15 capítulos para dominar el oro<br />
              <span style={{ background: 'linear-gradient(135deg,#FFE082,#C9A84C)',
                             WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                             backgroundClip: 'text' }}>desde cero hasta el challenge</span>
            </h3>
            <p style={{ color: '#6b7385', fontSize: 13, lineHeight: 1.7, marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
              Trading de oro, gestión de riesgo, cómo usar el simulador y las 4 reglas
              exactas que evalúan los prop firms. Gratuita, sin registro.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {['15 capítulos','XAUUSD · Oro','Gestión de riesgo','Prop firm rules','Descarga en PDF'].map(t => (
                <span key={t} className="font-mono text-xs px-3 py-1 rounded"
                  style={{ background: '#08090c', border: '1px solid #1d2029', color: '#6b7385' }}>{t}</span>
              ))}
            </div>
            <Link href="/guide"
              className="inline-block px-8 py-3 rounded-sm font-bold text-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#c9a84c,#a8893c)', color: '#000', textDecoration: 'none' }}>
              Leer la guía completa →
            </Link>
          </div>

          {/* Email capture */}
          <div className="text-center">
            <h4 className="font-bold mb-2" style={{ color: '#e8ecf4', fontSize: 15 }}>
              ¿Prefieres recibirla por email?
            </h4>
            <p style={{ color: '#6b7385', fontSize: 13, marginBottom: 20, lineHeight: 1.65 }}>
              Te enviamos la guía + novedades del simulador. Sin spam, máximo un email al mes.
            </p>
            <EmailCapture />
          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t px-6 py-6" style={{ borderColor: '#1d2029', background: '#07080b' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2" style={{ color: '#3a3f4d', fontSize: 11 }}>
            <LogoIcon size={14} />
            <span>GoldTrader · XAUUSD Simulator · Not financial advice</span>
          </div>
          <div className="flex gap-5 flex-wrap">
            {[
              ['Log in',   '/auth/login'],
              ['Register', '/auth/register'],
              ['Pricing',  '#pricing'],
              ['FAQ',      '#faq'],
              ['Privacy',  '/privacy'],
              ['Terms',    '/terms'],
            ].map(([l, h]) => (
              <a key={l} href={h} style={{ color: '#3a3f4d', fontSize: 11, textDecoration: 'none' }}
                className="hover:text-[#6b7385] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
