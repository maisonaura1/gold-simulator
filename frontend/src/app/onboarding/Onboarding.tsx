'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { ArrowRight, BookOpen, CandlestickChart, Check, NotebookPen } from 'lucide-react';
import { useAuthReady } from '@/hooks/useAuth';
import { useBilling } from '@/store/billing.store';
import { findLesson } from '@/lib/catalog';
import { useCatalog } from '@/components/academy/CatalogProvider';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { FullScreenLoader } from '@/components/ui/Spinner';

type Exp = 'zero' | 'some' | 'regular';
type Goal = 'learn' | 'consistency' | 'funded';

const EXP: { id: Exp; title: string; text: string }[] = [
  { id: 'zero', title: 'Nunca he operado', text: 'Quiero entender desde cero cómo funciona.' },
  { id: 'some', title: 'He operado un poco', text: 'Conozco lo básico, pero sin un método claro.' },
  { id: 'regular', title: 'Opero con regularidad', text: 'Quiero pulir mi estrategia y mi disciplina.' },
];
const GOALS: { id: Goal; title: string; text: string }[] = [
  { id: 'learn', title: 'Aprender bien la base', text: 'Entender el oro, el riesgo y el gráfico.' },
  { id: 'consistency', title: 'Ser más constante', text: 'Gestionar el riesgo y seguir un plan.' },
  { id: 'funded', title: 'Preparar una cuenta de fondeo', text: 'Practicar con límites de pérdida diarios.' },
];

function recommend(exp: Exp, goal: Goal): string {
  if (exp === 'zero') return 'n1-que-es-el-oro';
  if (exp === 'some') return goal === 'learn' ? 'n1-lotes-y-valor' : 'n2-matematica-perdidas';
  if (goal === 'funded') return 'n6-cuentas-fondeo';
  if (goal === 'consistency') return 'n5-que-es-un-setup';
  return 'n3-estructura';
}

export function Onboarding() {
  const router = useRouter();
  const { ready, authed } = useAuthReady();
  const catalog = useCatalog();
  const [step, setStep] = useState(0);
  const [exp, setExp] = useState<Exp | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);

  useEffect(() => {
    if (ready && !authed) router.replace('/auth/login');
  }, [ready, authed, router]);

  if (!ready || !authed) return <FullScreenLoader />;

  const lessonId = exp && goal ? recommend(exp, goal) : 'n1-que-es-el-oro';
  const lesson = findLesson(catalog, lessonId);

  const finish = async (href: string) => {
    try {
      localStorage.setItem('gt_onboarding', JSON.stringify({ exp, goal, at: new Date().toISOString() }));
      const plan = sessionStorage.getItem('pending_plan');
      if (plan === 'monthly' || plan === 'annual') {
        sessionStorage.removeItem('pending_plan');
        const err = await useBilling.getState().checkout(plan);
        if (!err) return;
      }
    } catch {
      /* sin storage: seguimos */
    }
    router.replace(href);
  };

  const Option = ({ active, title, text, onClick }: { active: boolean; title: string; text: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition',
        active ? 'border-gold-400/70 bg-gold-500/10' : 'border-ink-700 bg-ink-850 hover:border-ink-600',
      )}
    >
      <span className={clsx('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border', active ? 'border-gold-400 bg-gold-400 text-ink-950' : 'border-ink-600')}>
        {active && <Check className="h-4 w-4" />}
      </span>
      <span>
        <span className="block text-[16px] font-semibold text-fg">{title}</span>
        <span className="block text-[14px] text-fg-muted">{text}</span>
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-ink-950 px-4 pb-10" style={{ paddingTop: 'calc(1.5rem + var(--safe-top))' }}>
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between">
          <Logo href="/dashboard" />
          <span className="text-[13px] text-fg-dim">Paso {step + 1} de 3</span>
        </div>
        <div className="mt-4 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={clsx('h-1 flex-1 rounded-full', i <= step ? 'bg-gold-400' : 'bg-ink-700')} />
          ))}
        </div>

        {step === 0 && (
          <section className="mt-10 animate-fade-up">
            <h1 className="text-[26px] font-semibold tracking-tight text-fg">¿Cuánta experiencia tienes operando?</h1>
            <p className="mt-1 text-[15px] text-fg-muted">Así te recomendamos por dónde empezar. Puedes ir a cualquier lección cuando quieras.</p>
            <div className="mt-6 space-y-3">
              {EXP.map((o) => (
                <Option key={o.id} active={exp === o.id} title={o.title} text={o.text} onClick={() => setExp(o.id)} />
              ))}
            </div>
            <Button className="mt-8" block size="lg" disabled={!exp} onClick={() => setStep(1)} iconRight={<ArrowRight className="h-4 w-4" />}>
              Continuar
            </Button>
          </section>
        )}

        {step === 1 && (
          <section className="mt-10 animate-fade-up">
            <h1 className="text-[26px] font-semibold tracking-tight text-fg">¿Qué quieres conseguir?</h1>
            <div className="mt-6 space-y-3">
              {GOALS.map((o) => (
                <Option key={o.id} active={goal === o.id} title={o.title} text={o.text} onClick={() => setGoal(o.id)} />
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <Button variant="ghost" onClick={() => setStep(0)}>
                Atrás
              </Button>
              <Button block size="lg" disabled={!goal} onClick={() => setStep(2)} iconRight={<ArrowRight className="h-4 w-4" />}>
                Ver mi ruta
              </Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="mt-10 animate-fade-up">
            <h1 className="text-[26px] font-semibold tracking-tight text-fg">Tu ruta para empezar</h1>
            <p className="mt-1 text-[15px] text-fg-muted">Cada día, repite estos tres pasos:</p>
            <ol className="mt-6 space-y-3">
              {[
                { icon: BookOpen, t: 'Aprende', d: lesson ? `Empieza por «${lesson.title}».` : 'Lee una lección y haz su test.' },
                { icon: CandlestickChart, t: 'Practica', d: 'Aplica la lección en el simulador con tu cuenta demo de $10,000.' },
                { icon: NotebookPen, t: 'Revisa', d: 'Mira tu diario: qué hiciste bien y qué cambiar mañana.' },
              ].map(({ icon: Icon, t, d }, i) => (
                <li key={t} className="card flex gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-fg">
                      {i + 1}. {t}
                    </div>
                    <div className="text-[14px] text-fg-muted">{d}</div>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-xl bg-ink-850 px-4 py-3 text-[13px] text-fg-dim">
              Todo lo que haces aquí es con dinero ficticio. Es la mejor forma de cometer los errores de principiante sin pagarlos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button block size="lg" onClick={() => finish(`/academy/${lessonId}`)} iconRight={<ArrowRight className="h-4 w-4" />}>
                Empezar la lección
              </Button>
              <Button variant="secondary" size="lg" onClick={() => finish('/dashboard')}>
                Ir al inicio
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
