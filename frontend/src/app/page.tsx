'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';

// ─── data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '◈',
    title: 'Real XAUUSD Data',
    body: 'Practice on historical gold spot prices with realistic bid/ask spreads and live market replay.',
  },
  {
    icon: '◎',
    title: 'Risk Calculator',
    body: 'Calculate position size, stop-loss, take-profit and R:R ratio before every trade. Build discipline.',
  },
  {
    icon: '▦',
    title: 'Performance Analytics',
    body: 'Trader Score, win rate, drawdown, equity curve and behaviour analysis after every session.',
  },
  {
    icon: '⬡',
    title: 'Zero Risk',
    body: 'Use virtual capital. Learn real trading mechanics without putting real money on the line.',
  },
  {
    icon: '◇',
    title: 'XAUUSD Only',
    body: 'Full focus on gold spot. One instrument, mastered deeply — the way professional desks operate.',
  },
  {
    icon: '◉',
    title: 'Missions & XP',
    body: 'Structured learning paths, daily missions and XP rewards to build consistency over time.',
  },
];

const STEPS = [
  { n: '01', title: 'Create your free account', body: 'Sign up in 30 seconds. No credit card required.' },
  { n: '02', title: 'Load a gold session', body: 'Pick a historical scenario or replay live XAUUSD data.' },
  { n: '03', title: 'Trade and review', body: 'Enter positions, set SL/TP, review your performance score.' },
];

const TIERS = [
  {
    name: 'Free',
    price: '€0',
    period: 'forever',
    cta: 'Start free',
    href: '/auth/register',
    highlight: false,
    features: [
      '10 trade simulations included',
      'Basic stats: win rate & P/L',
      'XAUUSD chart & replay',
      'Risk calculator',
      'Community missions',
    ],
    locked: [
      'Full performance analytics',
      'Equity curve & drawdown',
      'Trader Score & coaching',
      'Unlimited sessions',
      'Trade journal & export',
    ],
  },
  {
    name: 'Pro',
    price: '€9.95',
    period: 'one-time · lifetime access',
    cta: 'Unlock everything',
    href: '/auth/register?plan=pro',
    highlight: true,
    features: [
      'Unlimited trade simulations',
      'Full analytics dashboard',
      'Equity curve & max drawdown',
      'Trader Score + coaching tips',
      'Trade journal & export',
      'All missions unlocked',
      'Priority support',
    ],
    locked: [],
  },
];

// ─── components ───────────────────────────────────────────────────────────────

function GoldDot() {
  return <span style={{ color: '#c9a84c', marginRight: 6 }}>◆</span>;
}

function FeatureCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div
      className="p-5 rounded-sm"
      style={{ background: '#0f1117', border: '1px solid #1d2029' }}
    >
      <div style={{ color: '#c9a84c', fontSize: 20, marginBottom: 12 }}>{icon}</div>
      <div style={{ color: '#e8ecf4', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{title}</div>
      <div style={{ color: '#6b7385', fontSize: 12, lineHeight: 1.6 }}>{body}</div>
    </div>
  );
}

function PricingCard({ tier }: { tier: typeof TIERS[0] }) {
  return (
    <div
      className="p-6 rounded-sm flex flex-col"
      style={{
        background: tier.highlight ? '#0d1008' : '#0b0d11',
        border: `1px solid ${tier.highlight ? '#c9a84c44' : '#1d2029'}`,
        boxShadow: tier.highlight ? '0 0 40px rgba(201,168,76,0.08)' : 'none',
        minWidth: 260,
        flex: 1,
      }}
    >
      {tier.highlight && (
        <div
          className="text-center text-xs font-mono uppercase tracking-widest mb-4 py-1 rounded-sm"
          style={{ background: '#c9a84c22', color: '#c9a84c', border: '1px solid #c9a84c33' }}
        >
          Most popular
        </div>
      )}
      <div style={{ color: '#6b7385', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
        {tier.name}
      </div>
      <div style={{ color: tier.highlight ? '#e8c96d' : '#c8cdd8', fontSize: 32, fontWeight: 800, fontFamily: 'monospace', lineHeight: 1 }}>
        {tier.price}
      </div>
      <div style={{ color: '#6b7385', fontSize: 10, marginTop: 4, marginBottom: 20 }}>{tier.period}</div>

      <ul className="space-y-2 mb-6 flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2" style={{ fontSize: 12, color: '#c8cdd8' }}>
            <span style={{ color: '#2dcc6f', marginTop: 1 }}>✓</span> {f}
          </li>
        ))}
        {tier.locked.map((f) => (
          <li key={f} className="flex items-start gap-2" style={{ fontSize: 12, color: '#3a3f4d' }}>
            <span style={{ marginTop: 1 }}>—</span> {f}
          </li>
        ))}
      </ul>

      <Link
        href={tier.href}
        className="block text-center py-2.5 rounded-sm text-sm font-bold tracking-wide transition-all"
        style={{
          background: tier.highlight ? 'linear-gradient(135deg, #c9a84c, #a8893c)' : '#141720',
          color: tier.highlight ? '#000' : '#c9a84c',
          border: `1px solid ${tier.highlight ? 'transparent' : '#2c2410'}`,
          textDecoration: 'none',
        }}
      >
        {tier.cta}
      </Link>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && isAuthenticated()) router.replace('/dashboard');
  }, [ready, isAuthenticated, router]);

  if (!ready) return null;
  if (ready && isAuthenticated()) return null;

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: '#07080b', color: '#c8cdd8' }}
    >
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{ borderColor: '#1d2029', background: '#09090d' }}
      >
        <div style={{ color: '#c9a84c', fontWeight: 800, fontSize: 14, letterSpacing: 2, fontFamily: 'monospace' }}>
          ◆ GOLDTRADER
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" style={{ color: '#8893a8', fontSize: 12, textDecoration: 'none' }}>
            Log in
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-1.5 rounded-sm text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #a8893c)', color: '#000', textDecoration: 'none' }}
          >
            Start free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div
          className="inline-block text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-sm mb-6"
          style={{ background: '#0f1117', border: '1px solid #2c2410', color: '#c9a84c' }}
        >
          XAUUSD Gold Spot Simulator
        </div>
        <h1
          className="font-black leading-tight mb-5"
          style={{ fontSize: 'clamp(28px, 5vw, 52px)', color: '#e8ecf4' }}
        >
          Practice Gold Trading.{' '}
          <span style={{ color: '#c9a84c' }}>Build Real Skills.</span>
        </h1>
        <p
          className="max-w-xl mx-auto mb-8"
          style={{ color: '#8893a8', fontSize: 15, lineHeight: 1.7 }}
        >
          The professional XAUUSD simulator for traders who want to sharpen
          entries, exits and risk management — without risking real capital.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/auth/register"
            className="px-6 py-3 rounded-sm font-bold text-sm"
            style={{
              background: 'linear-gradient(135deg, #c9a84c, #a8893c)',
              color: '#000',
              textDecoration: 'none',
            }}
          >
            Start practicing free →
          </Link>
          <Link
            href="/auth/login"
            className="px-6 py-3 rounded-sm text-sm"
            style={{
              background: '#0f1117',
              color: '#8893a8',
              border: '1px solid #1d2029',
              textDecoration: 'none',
            }}
          >
            I have an account
          </Link>
        </div>
        <p style={{ color: '#3a3f4d', fontSize: 11, marginTop: 14 }}>
          No credit card required · 10 free simulations included
        </p>
      </section>

      {/* Stats bar */}
      <div
        className="border-y"
        style={{ borderColor: '#1d2029', background: '#0b0d11' }}
      >
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-center gap-8 flex-wrap">
          {[
            ['XAUUSD', 'Gold Spot Only'],
            ['$0', 'Capital at risk'],
            ['Real data', 'Live market replay'],
            ['Free start', 'No card needed'],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <div style={{ color: '#c9a84c', fontWeight: 700, fontSize: 14, fontFamily: 'monospace' }}>{val}</div>
              <div style={{ color: '#6b7385', fontSize: 10, marginTop: 1 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2
          className="text-center font-bold mb-2"
          style={{ color: '#e8ecf4', fontSize: 22 }}
        >
          Everything you need to improve
        </h2>
        <p className="text-center mb-10" style={{ color: '#6b7385', fontSize: 13 }}>
          Built specifically for gold spot traders who want measurable progress.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* How it works */}
      <section
        className="border-y py-14"
        style={{ borderColor: '#1d2029', background: '#0b0d11' }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-center font-bold mb-10" style={{ color: '#e8ecf4', fontSize: 22 }}>
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div
                  style={{
                    color: '#c9a84c',
                    fontFamily: 'monospace',
                    fontSize: 28,
                    fontWeight: 800,
                    lineHeight: 1,
                    marginBottom: 10,
                  }}
                >
                  {s.n}
                </div>
                <div style={{ color: '#e8ecf4', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                  {s.title}
                </div>
                <div style={{ color: '#6b7385', fontSize: 12, lineHeight: 1.6 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-6 py-16" id="pricing">
        <h2 className="text-center font-bold mb-2" style={{ color: '#e8ecf4', fontSize: 22 }}>
          Simple pricing
        </h2>
        <p className="text-center mb-10" style={{ color: '#6b7385', fontSize: 13 }}>
          Start free. Upgrade once. No subscriptions, no surprises.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          {TIERS.map((t) => <PricingCard key={t.name} tier={t} />)}
        </div>
        <p className="text-center mt-6" style={{ color: '#3a3f4d', fontSize: 11 }}>
          One-time payment · Lifetime access · iDEAL & card accepted
        </p>
      </section>

      {/* CTA footer */}
      <section
        className="border-t py-14 text-center"
        style={{ borderColor: '#1d2029', background: '#09090d' }}
      >
        <div style={{ color: '#c9a84c', fontSize: 10, letterSpacing: 3, marginBottom: 10, textTransform: 'uppercase', fontFamily: 'monospace' }}>
          ◆ Start today
        </div>
        <h2 className="font-bold mb-4" style={{ color: '#e8ecf4', fontSize: 20 }}>
          Your first 10 simulations are free
        </h2>
        <p style={{ color: '#6b7385', fontSize: 13, marginBottom: 20 }}>
          No credit card. No subscription. Just practice.
        </p>
        <Link
          href="/auth/register"
          className="inline-block px-8 py-3 rounded-sm font-bold text-sm"
          style={{
            background: 'linear-gradient(135deg, #c9a84c, #a8893c)',
            color: '#000',
            textDecoration: 'none',
          }}
        >
          Create free account →
        </Link>
      </section>

      {/* Footer */}
      <footer
        className="border-t px-6 py-6 flex items-center justify-between flex-wrap gap-4"
        style={{ borderColor: '#1d2029', background: '#07080b' }}
      >
        <div style={{ color: '#3a3f4d', fontSize: 11, fontFamily: 'monospace' }}>
          ◆ GOLDTRADER · XAUUSD Simulator
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login"  style={{ color: '#3a3f4d', fontSize: 11, textDecoration: 'none' }}>Login</Link>
          <Link href="/auth/register" style={{ color: '#3a3f4d', fontSize: 11, textDecoration: 'none' }}>Register</Link>
          <Link href="#pricing" style={{ color: '#3a3f4d', fontSize: 11, textDecoration: 'none' }}>Pricing</Link>
        </div>
      </footer>
    </div>
  );
}
