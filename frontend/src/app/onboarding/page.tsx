'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { LogoIcon } from '@/components/ui/LogoIcon';
import Link from 'next/link';

const STEPS = [
  {
    id: 'simulate',
    icon: '◈',
    title: 'Tu primera simulación',
    subtitle: 'Entra al mercado con $10,000 virtuales',
  },
  {
    id: 'score',
    icon: '▦',
    title: 'Tu Trader Score',
    subtitle: 'Un número que mejora con cada trade',
  },
  {
    id: 'mission',
    icon: '⬡',
    title: 'Tu primera misión',
    subtitle: 'Objetivos que construyen disciplina real',
  },
];

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            borderRadius: 9999,
            background: i === current ? '#c9a84c' : i < current ? '#2dcc6f' : '#1d2029',
            transition: 'all 0.3s',
          }}
        />
      ))}
    </div>
  );
}

function Step1() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-sm" style={{ background: '#0f1117', border: '1px solid #1d2029' }}>
        <div style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, fontFamily: 'monospace' }}>
          Cómo funciona una simulación
        </div>
        <div className="space-y-3">
          {[
            { n: '01', text: 'Elige dirección — BUY si crees que el oro sube, SELL si baja' },
            { n: '02', text: 'Pon tu Stop Loss (SL) para limitar pérdidas y Take Profit (TP) para asegurar ganancias' },
            { n: '03', text: 'El simulador avanza las velas reales de XAUUSD hasta que se toca el SL o TP' },
            { n: '04', text: 'Recibes tu evaluación — Trader Score, R:R ratio y análisis del trade' },
          ].map(({ n, text }) => (
            <div key={n} className="flex items-start gap-3">
              <span style={{ color: '#c9a84c', fontFamily: 'monospace', fontWeight: 700, fontSize: 11, flexShrink: 0, marginTop: 1 }}>{n}</span>
              <span style={{ color: '#8893a8', fontSize: 12, lineHeight: 1.6 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-sm" style={{ background: '#0a1a0e', border: '1px solid #2dcc6f33' }}>
        <div className="flex items-center gap-2 mb-2">
          <span style={{ color: '#2dcc6f', fontSize: 10 }}>✓</span>
          <span style={{ color: '#2dcc6f', fontSize: 11, fontWeight: 600 }}>Tienes 20 simulaciones gratis</span>
        </div>
        <p style={{ color: '#6b7385', fontSize: 11, lineHeight: 1.6 }}>
          Sin tarjeta de crédito. Sin capital real. Solo tú, los datos históricos de XAUUSD y la disciplina que vas a construir.
        </p>
      </div>

      {/* Mini mock order entry */}
      <div className="p-4 rounded-sm font-mono" style={{ background: '#07080b', border: '1px solid #2c2410' }}>
        <div style={{ color: '#c9a84c', fontSize: 9, letterSpacing: 2, marginBottom: 10 }}>VISTA PREVIA · ORDER ENTRY</div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-center py-2 rounded-sm text-xs font-bold" style={{ background: '#1a6b3a', color: '#2dcc6f', border: '1px solid #2dcc6f33' }}>▲ BUY</div>
          <div className="text-center py-2 rounded-sm text-xs" style={{ background: '#141720', color: '#6b7385', border: '1px solid #1d2029' }}>▼ SELL</div>
        </div>
        {[
          { label: 'Precio entrada', value: '3 342.50', color: '#c8cdd8' },
          { label: 'Stop Loss',      value: '3 330.00', color: '#e84040' },
          { label: 'Take Profit',    value: '3 367.00', color: '#2dcc6f' },
          { label: 'R:R',            value: '2.08 : 1', color: '#c9a84c' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex justify-between text-xs mb-1.5">
            <span style={{ color: '#6b7385' }}>{label}</span>
            <span style={{ color, fontWeight: 600 }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step2() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 200); }, []);

  const grades = [
    { range: '85–100', label: 'Elite', color: '#22c55e', desc: 'Gestión de riesgo perfecta, R:R profesional, consistencia alta' },
    { range: '70–84',  label: 'Advanced', color: '#4ade80', desc: 'Sólido. Pequeños ajustes en entradas o tamaño de posición' },
    { range: '55–69',  label: 'Intermediate', color: '#f59e0b', desc: 'Mejorar R:R o reducir riesgo por trade' },
    { range: '40–54',  label: 'Beginner', color: '#f97316', desc: 'Revisar criterios de entrada y gestión de capital' },
    { range: '0–39',   label: 'Critical', color: '#ef4444', desc: 'Riesgo elevado — estudiar antes de seguir' },
  ];

  return (
    <div className="space-y-5">
      {/* Score display */}
      <div className="flex items-center justify-center py-6 rounded-sm" style={{ background: '#0f1117', border: '1px solid #1d2029' }}>
        <div className="text-center">
          <div style={{
            color: '#c9a84c',
            fontFamily: 'monospace',
            fontWeight: 800,
            fontSize: animated ? 64 : 0,
            lineHeight: 1,
            transition: 'font-size 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            ?
          </div>
          <div style={{ color: '#3a3f4d', fontSize: 11, marginTop: 8 }}>Tu score después de tu primer trade</div>
          <div className="flex gap-1 justify-center mt-3">
            {[1,2,3,4].map((i) => (
              <div key={i} style={{ width: 24, height: 5, borderRadius: 9999, background: '#1d2029' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Grade table */}
      <div className="rounded-sm overflow-hidden" style={{ border: '1px solid #1d2029' }}>
        <div className="px-3 py-2" style={{ background: '#0f1117', borderBottom: '1px solid #1d2029' }}>
          <span style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace' }}>Escala de Trader Score</span>
        </div>
        {grades.map(({ range, label, color, desc }) => (
          <div key={label} className="flex items-start gap-3 px-3 py-2.5" style={{ borderBottom: '1px solid #0f1117' }}>
            <div style={{ flexShrink: 0, minWidth: 40 }}>
              <div style={{ color, fontFamily: 'monospace', fontWeight: 700, fontSize: 10 }}>{range}</div>
            </div>
            <div>
              <div style={{ color, fontSize: 11, fontWeight: 600, marginBottom: 2 }}>{label}</div>
              <div style={{ color: '#3a3f4d', fontSize: 10, lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ color: '#3a3f4d', fontSize: 11, textAlign: 'center', lineHeight: 1.6 }}>
        El score se calcula en base a R:R ratio, riesgo por trade, win rate y consistencia. Mejora con cada simulación.
      </p>
    </div>
  );
}

function Step3() {
  const missions = [
    {
      icon: '🎯',
      title: 'Primera sangre',
      desc: 'Completa tu primera simulación con SL y TP definidos',
      xp: '+50 XP',
      difficulty: 'Principiante',
      color: '#f59e0b',
    },
    {
      icon: '⚖️',
      title: 'Disciplina de riesgo',
      desc: 'Completa 3 trades con riesgo ≤ 2% del balance en cada uno',
      xp: '+100 XP',
      difficulty: 'Principiante',
      color: '#f59e0b',
    },
    {
      icon: '📈',
      title: 'R:R profesional',
      desc: 'Consigue un trade con R:R ≥ 2:1',
      xp: '+75 XP',
      difficulty: 'Principiante',
      color: '#f59e0b',
    },
  ];

  return (
    <div className="space-y-4">
      <p style={{ color: '#8893a8', fontSize: 12, lineHeight: 1.7 }}>
        Las misiones convierten la práctica en progreso medible. Cada misión refuerza un hábito que los traders profesionales llevan años construyendo.
      </p>

      <div className="space-y-2">
        {missions.map((m) => (
          <div key={m.title} className="flex items-start gap-3 p-3 rounded-sm" style={{ background: '#0f1117', border: '1px solid #1d2029' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{m.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span style={{ color: '#c8cdd8', fontSize: 12, fontWeight: 600 }}>{m.title}</span>
                <span style={{ color: '#c9a84c', fontSize: 10, fontFamily: 'monospace', fontWeight: 700 }}>{m.xp}</span>
              </div>
              <p style={{ color: '#6b7385', fontSize: 11, lineHeight: 1.5 }}>{m.desc}</p>
              <span style={{ color: m.color, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'monospace' }}>{m.difficulty}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-sm" style={{ background: '#0d1008', border: '1px solid #c9a84c33' }}>
        <div style={{ color: '#c9a84c', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>¿Por qué importan las misiones?</div>
        <p style={{ color: '#6b7385', fontSize: 11, lineHeight: 1.6 }}>
          Los traders que siguen un plan estructurado tienen un Trader Score promedio 73% más alto que los que simulan sin objetivos. Las misiones son ese plan.
        </p>
      </div>
    </div>
  );
}

const STEP_CONTENT = [<Step1 key="s1" />, <Step2 key="s2" />, <Step3 key="s3" />];

const STEP_CTA = [
  'Entendido — vamos al trade →',
  'Ver mi score en vivo →',
  'Empezar mi primera misión →',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && !isAuthenticated()) router.replace('/auth/register');
  }, [ready, isAuthenticated, router]);

  if (!ready) return null;

  const isLast = step === STEPS.length - 1;

  function next() {
    if (isLast) {
      localStorage.setItem('gt_onboarded', '1');
      router.replace('/trade');
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #07080b 0%, #0d0e12 100%)' }}>
      <div className="w-full" style={{ maxWidth: 480 }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <LogoIcon size={20} />
            <span style={{ color: '#e8b84b', fontWeight: 700, fontSize: 13 }}>GoldTrader</span>
          </div>
          <StepDots current={step} />
          <button
            onClick={() => { localStorage.setItem('gt_onboarded', '1'); router.replace('/dashboard'); }}
            style={{ color: '#3a3f4d', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Saltar →
          </button>
        </div>

        {/* Step header */}
        <div className="mb-6">
          <div style={{ color: '#c9a84c', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 6 }}>
            Paso {step + 1} de {STEPS.length}
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span style={{ color: '#c9a84c', fontSize: 22 }}>{STEPS[step].icon}</span>
            <h1 style={{ color: '#e8ecf4', fontWeight: 800, fontSize: 20, lineHeight: 1.2 }}>{STEPS[step].title}</h1>
          </div>
          <p style={{ color: '#6b7385', fontSize: 13 }}>{STEPS[step].subtitle}</p>
        </div>

        {/* Content */}
        <div className="mb-8">
          {STEP_CONTENT[step]}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          className="w-full py-3 rounded-sm font-bold text-sm transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #c9a84c, #a8893c)', color: '#000', border: 'none', cursor: 'pointer' }}
        >
          {STEP_CTA[step]}
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: 12, color: '#3a3f4d', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ← Volver
          </button>
        )}

        {/* Progress bar */}
        <div className="mt-6 h-0.5 rounded-full overflow-hidden" style={{ background: '#1d2029' }}>
          <div style={{
            height: '100%',
            width: `${((step + 1) / STEPS.length) * 100}%`,
            background: 'linear-gradient(90deg, #c9a84c, #e8c96d)',
            borderRadius: 9999,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>
    </div>
  );
}
