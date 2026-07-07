'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { CornerFrame } from '@/components/ui/CornerFrame';

// ─── Static data ──────────────────────────────────────────────────────────────

const FEATURES: { icon: string; title: string; body: string; mock?: 'equity' | 'order' }[] = [
  { icon: '◈', title: 'Real XAUUSD Data',       body: 'Train on 2 years of real historical gold spot prices with authentic bid/ask spreads and 8 timeframes — from 1 minute to monthly.' },
  { icon: '◎', title: 'Risk Calculator',         body: 'Calculate position size, stop-loss, take-profit and R:R ratio before every trade. The habit that separates profitable traders.', mock: 'order' },
  { icon: '▦', title: 'Performance Analytics',  body: 'Trader Score, win rate, drawdown, equity curve and behaviour analysis after every session. See exactly where you lose money.', mock: 'equity' },
  { icon: '⬡', title: 'Zero Capital at Risk',   body: 'Use virtual capital. Learn real trading mechanics — entries, exits, position sizing — without putting a single euro on the line.' },
  { icon: '◇', title: 'XAUUSD Only Focus',      body: 'Full focus on gold spot. One instrument, mastered deeply. The way professional desks and top prop firm traders operate.' },
  { icon: '◉', title: 'Missions & XP',          body: 'Structured learning paths, daily missions and XP rewards to build consistency. Progress is tracked, not just practised.' },
];

const STEPS = [
  { n: '01', title: 'Create your free account', body: 'Sign up in 30 seconds. No credit card required. Instant access to your first 10 free simulations.' },
  { n: '02', title: 'Load a gold session',       body: 'Pick a historical scenario or replay live XAUUSD data from real London, New York or Asian sessions.' },
  { n: '03', title: 'Trade and review',          body: 'Enter positions, set SL/TP, review your Trader Score and analytics after each session. Iterate.' },
];

const TIERS = [
  {
    name: 'Free', price: '€0', period: 'forever — no card required', highlight: false,
    cta: 'Start free now', href: '/auth/register',
    features: ['10 trade simulations included', 'Basic stats: win rate & P/L', 'XAUUSD chart with 5 timeframes', 'Risk calculator', 'Community missions & XP'],
    locked:   ['Full performance analytics', 'Equity curve & max drawdown', 'Trader Score & coaching tips', 'Unlimited sessions', 'All 8 timeframes (M1–MN)', 'Trade journal & export'],
  },
  {
    name: 'Pro', price: '€9.95', period: 'one-time · lifetime access', highlight: true,
    cta: 'Unlock everything →', href: '/auth/register?plan=pro',
    features: ['Unlimited trade simulations', 'Full analytics dashboard', 'Equity curve & max drawdown', 'Trader Score + coaching tips', 'All 8 timeframes — M1 to Monthly', 'Trade journal & session export', 'All missions unlocked', 'Priority support'],
    locked: [],
  },
];

const FAQS = [
  { q: 'Is this a real brokerage or demo account?',         a: 'Neither — it\'s a pure simulator. No real money, no broker connection. You practice using historical XAUUSD data in a completely safe environment. Nothing connects to any live market.' },
  { q: 'What happens after I use my 10 free simulations?',  a: 'You\'ll see a prompt to upgrade. The €9.95 one-time payment unlocks unlimited sessions forever — no monthly fees, no recurring charges. Pay once, practice indefinitely.' },
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

function FeatureCard({ icon, title, body, mock }: { icon: string; title: string; body: string; mock?: 'equity' | 'order' }) {
  return (
    <div className="p-5 rounded-sm" style={{ background: '#0f1117', border: '1px solid #1d2029' }}>
      <div style={{ color: '#c9a84c', fontSize: 20, marginBottom: 10 }}>{icon}</div>
      <div style={{ color: '#e8ecf4', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{title}</div>
      <div style={{ color: '#6b7385', fontSize: 12, lineHeight: 1.6 }}>{body}</div>
      {mock === 'equity' && <MiniEquityCurve />}
      {mock === 'order'  && <MiniOrderEntry />}
    </div>
  );
}

function PricingCard({ tier }: { tier: typeof TIERS[0] }) {
  return (
    <div className="p-6 rounded-sm flex flex-col" style={{
      background: tier.highlight ? '#0d1008' : '#0b0d11',
      border: `1px solid ${tier.highlight ? '#c9a84c55' : '#1d2029'}`,
      boxShadow: tier.highlight ? '0 0 60px rgba(201,168,76,0.1)' : 'none',
      minWidth: 260, flex: 1,
    }}>
      {tier.highlight && (
        <div className="text-center text-xs font-mono uppercase tracking-widest mb-4 py-1 rounded-sm"
          style={{ background: '#c9a84c22', color: '#c9a84c', border: '1px solid #c9a84c44' }}>
          ◆ Best value
        </div>
      )}
      <div style={{ color: '#6b7385', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{tier.name}</div>
      <div style={{ color: tier.highlight ? '#e8c96d' : '#c8cdd8', fontSize: 36, fontWeight: 800, fontFamily: 'monospace', lineHeight: 1 }}>{tier.price}</div>
      <div style={{ color: '#6b7385', fontSize: 10, marginTop: 4, marginBottom: 20 }}>{tier.period}</div>
      <ul className="space-y-2 mb-6 flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2" style={{ fontSize: 12, color: '#c8cdd8' }}>
            <span style={{ color: '#2dcc6f', marginTop: 1, flexShrink: 0 }}>✓</span> {f}
          </li>
        ))}
        {tier.locked.map((f) => (
          <li key={f} className="flex items-start gap-2" style={{ fontSize: 12, color: '#3a3f4d' }}>
            <span style={{ marginTop: 1, flexShrink: 0 }}>—</span> {f}
          </li>
        ))}
      </ul>
      <Link href={tier.href} className="block text-center py-3 rounded-sm text-sm font-bold tracking-wide" style={{
        background: tier.highlight ? 'linear-gradient(135deg, #c9a84c, #a8893c)' : '#141720',
        color: tier.highlight ? '#000' : '#c9a84c',
        border: `1px solid ${tier.highlight ? 'transparent' : '#2c2410'}`,
        textDecoration: 'none',
      }}>
        {tier.cta}
      </Link>
    </div>
  );
}

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
        <span style={{ color: '#c8cdd8', fontSize: 13, fontWeight: 500 }}>{q}</span>
        <span style={{
          color: '#c9a84c', fontSize: 14, flexShrink: 0,
          transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'rotate(0)',
        }}>+</span>
      </button>
      {open && (
        <div className="pb-4" style={{ color: '#6b7385', fontSize: 12, lineHeight: 1.8 }}>{a}</div>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [ready, setReady] = useState(false);
  const [publicStats, setPublicStats] = useState<{ totalUsers: number; totalTrades: number } | null>(null);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setReady(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/stats/public`)
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

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 py-3 border-b sticky top-0 z-40"
        style={{ borderColor: '#1d2029', background: 'rgba(7,8,11,0.92)', backdropFilter: 'blur(12px)' }}>
        <div style={{ color: '#c9a84c', fontWeight: 800, fontSize: 14, letterSpacing: 2, fontFamily: 'monospace' }}>
          ◆ GOLDTRADER
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

      {/* ── Hero ── */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-10 text-center">
        <GoldLabel>XAUUSD Gold Spot Simulator — Real data. Zero risk.</GoldLabel>
        <h1 className="font-black leading-tight mb-5"
          style={{ fontSize: 'clamp(28px,5vw,54px)', color: '#e8ecf4' }}>
          The simulator that trades{' '}
          <span style={{ color: '#c9a84c' }}>like a real desk.</span>
        </h1>
        <p className="max-w-xl mx-auto mb-8"
          style={{ color: '#8893a8', fontSize: 15, lineHeight: 1.8 }}>
          Practice XAUUSD on 2 years of real historical data. Build risk discipline, track your Trader Score, and prepare for prop firm challenges — without risking a single euro.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/auth/register"
            className="px-7 py-3 rounded-sm font-bold text-sm transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#c9a84c,#a8893c)', color: '#000', textDecoration: 'none' }}>
            Start practicing free →
          </Link>
          <a href="#preview"
            className="px-7 py-3 rounded-sm text-sm"
            style={{ background: '#0f1117', color: '#8893a8', border: '1px solid #1d2029', textDecoration: 'none' }}>
            See the product ↓
          </a>
        </div>
        <p style={{ color: '#3a3f4d', fontSize: 11, marginTop: 12 }}>
          No credit card · 10 free simulations · Instant access · 30-day refund guarantee
        </p>

        {/* Real social proof — only with real data */}
        {publicStats && publicStats.totalUsers > 0 && (
          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm font-mono text-xs"
              style={{ background: '#0f1117', border: '1px solid #2c2410' }}>
              <span style={{ color: '#c9a84c' }}>◆</span>
              <span style={{ color: '#c8cdd8', fontWeight: 700 }}>+{publicStats.totalUsers.toLocaleString()}</span>
              <span style={{ color: '#6b7385' }}>traders registered</span>
            </div>
            {publicStats.totalTrades > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm font-mono text-xs"
                style={{ background: '#0f1117', border: '1px solid #2c2410' }}>
                <span style={{ color: '#2dcc6f' }}>▦</span>
                <span style={{ color: '#c8cdd8', fontWeight: 700 }}>{publicStats.totalTrades.toLocaleString()}</span>
                <span style={{ color: '#6b7385' }}>simulations completed</span>
              </div>
            )}
          </div>
        )}

        <FakeTicker />
      </section>

      {/* ── Stats bar ── */}
      <div className="border-y" style={{ borderColor: '#1d2029', background: '#0b0d11' }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-center gap-8 flex-wrap">
          {[
            ['XAUUSD',      'Gold Spot — one instrument, mastered'],
            ['8 timeframes','M1 · M5 · M15 · H1 · H4 · D1 · W1 · MN'],
            ['2yr history', 'Real historical price data'],
            ['€9.95',       'Full Pro access — one-time, lifetime'],
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
        <section id="preview" className="max-w-5xl mx-auto px-6 py-16">
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
        </section>
      </CornerFrame>

      {/* ── Features ── */}
      <CornerFrame>
        <section id="features" className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-center font-bold mb-2" style={{ color: '#e8ecf4', fontSize: 22 }}>Everything you need to improve</h2>
          <p className="text-center mb-10" style={{ color: '#6b7385', fontSize: 13 }}>
            Built specifically for gold spot traders who want measurable, repeatable progress.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </section>
      </CornerFrame>

      {/* ── How it works ── */}
      <section className="border-y py-14" style={{ borderColor: '#1d2029', background: '#0b0d11' }}>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-center font-bold mb-10" style={{ color: '#e8ecf4', fontSize: 22 }}>How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div style={{ color: '#c9a84c', fontFamily: 'monospace', fontSize: 30, fontWeight: 800, lineHeight: 1, marginBottom: 10 }}>{s.n}</div>
                <div style={{ color: '#e8ecf4', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{s.title}</div>
                <div style={{ color: '#6b7385', fontSize: 12, lineHeight: 1.7 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-center font-bold mb-2" style={{ color: '#e8ecf4', fontSize: 22 }}>Who uses GoldTrader</h2>
        <p className="text-center mb-10" style={{ color: '#6b7385', fontSize: 13 }}>
          Three types of traders. One simulator built for all of them.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {USE_CASES.map((u) => (
            <div key={u.profile} className="p-6 rounded-sm flex flex-col gap-4"
              style={{ background: '#0f1117', border: `1px solid ${u.color}22` }}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">{u.icon}</div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest mb-1"
                    style={{ color: u.color }}>
                    {u.tag}
                  </div>
                  <div style={{ color: '#e8ecf4', fontWeight: 700, fontSize: 14 }}>{u.profile}</div>
                </div>
              </div>
              <div style={{ color: '#6b7385', fontSize: 11, fontStyle: 'italic', borderLeft: `2px solid ${u.color}33`, paddingLeft: 10 }}>
                {u.context}
              </div>
              <div style={{ color: '#8893a8', fontSize: 12, lineHeight: 1.7 }}>
                {u.outcome}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <CornerFrame>
        <section id="pricing" className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-center font-bold mb-2" style={{ color: '#e8ecf4', fontSize: 22 }}>Simple, honest pricing</h2>
          <p className="text-center mb-4" style={{ color: '#6b7385', fontSize: 13 }}>
            Start free. Upgrade once. No subscriptions, no surprises, no hidden fees.
          </p>
          {/* ROI framing */}
          <div className="text-center mb-8 px-4 py-3 mx-auto max-w-xl rounded-sm"
            style={{ background: '#0d1008', border: '1px solid #c9a84c22' }}>
            <span style={{ color: '#c9a84c', fontFamily: 'monospace', fontSize: 11 }}>
              ◆ One-time payment · Lifetime access · 30-day money-back guarantee
            </span>
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            {TIERS.map((t) => <PricingCard key={t.name} tier={t} />)}
          </div>
          <p className="text-center mt-6" style={{ color: '#3a3f4d', fontSize: 11 }}>
            iDEAL · Credit & debit card · Secure checkout via Stripe · Data protected under GDPR
          </p>
        </section>
      </CornerFrame>

      {/* ── FAQ ── */}
      <section id="faq" className="border-t py-14" style={{ borderColor: '#1d2029', background: '#0b0d11' }}>
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-center font-bold mb-10" style={{ color: '#e8ecf4', fontSize: 22 }}>Frequently asked questions</h2>
          {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
        </div>
      </section>

      {/* ── Email capture ── */}
      <section className="border-t py-12" style={{ borderColor: '#1d2029' }}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <h3 style={{ color: '#e8ecf4', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
            Not ready to sign up yet?
          </h3>
          <p style={{ color: '#6b7385', fontSize: 12, marginBottom: 20 }}>
            Leave your email and we'll let you know when we add new features — no spam, one email max per month.
          </p>
          <EmailCapture />
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="border-t py-14 text-center" style={{ borderColor: '#1d2029', background: '#09090d' }}>
        <GoldLabel>◆ Start today</GoldLabel>
        <h2 className="font-bold mb-4" style={{ color: '#e8ecf4', fontSize: 22 }}>
          Your first 10 simulations are free
        </h2>
        <p style={{ color: '#6b7385', fontSize: 13, marginBottom: 20 }}>
          No credit card. No subscription. Just practice.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/auth/register"
            className="inline-block px-8 py-3 rounded-sm font-bold text-sm transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#c9a84c,#a8893c)', color: '#000', textDecoration: 'none' }}>
            Create free account →
          </Link>
          <a href="#pricing"
            className="inline-block px-8 py-3 rounded-sm text-sm"
            style={{ background: '#0f1117', color: '#8893a8', border: '1px solid #1d2029', textDecoration: 'none' }}>
            View pricing
          </a>
        </div>
        <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
          {['✓ No credit card', '✓ Instant access', '✓ 30-day refund', '✓ GDPR compliant'].map((t) => (
            <span key={t} style={{ color: '#3a3f4d', fontSize: 11 }}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t px-6 py-6" style={{ borderColor: '#1d2029', background: '#07080b' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div style={{ color: '#3a3f4d', fontSize: 11, fontFamily: 'monospace' }}>◆ GOLDTRADER · XAUUSD Simulator · Not financial advice</div>
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
