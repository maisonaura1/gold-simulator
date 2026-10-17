import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CandlestickChart,
  CheckCircle2,
  ChevronDown,
  Crosshair,
  GraduationCap,
  History,
  LineChart,
  NotebookPen,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { LandingNav } from '@/components/landing/LandingNav';
import { HeroMock } from '@/components/landing/HeroMock';
import { PlanCards } from '@/components/billing/PlanCards';
import { ButtonLink } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { ALL_LESSONS, LEVELS, PRACTICE_COUNT, TOTAL_MINUTES } from '@/lib/academy';
import { FREE_SIMULATIONS } from '@/lib/plans';

const FAQ = [
  {
    q: '¿Necesito experiencia previa?',
    a: 'No. La primera etapa empieza explicando qué es el XAU/USD, cómo se cotiza y cuánto vale cada movimiento. Si ya operas, al registrarte te recomendamos por qué lección empezar.',
  },
  {
    q: '¿Se usa dinero real?',
    a: 'No. Practicas con una cuenta demo de $10,000 ficticios. Nunca conectamos con tu bróker ni movemos dinero real.',
  },
  {
    q: '¿De dónde salen los precios del simulador?',
    a: 'De velas H1 históricas reales del oro. Cuando simulas una operación, el simulador reproduce esas velas y comprueba qué se toca antes: tu stop o tu objetivo.',
  },
  {
    q: '¿Qué incluye la versión gratis?',
    a: `Todas las lecciones y tests de la academia, el diario y ${FREE_SIMULATIONS} simulaciones. Con Pro tienes simulaciones ilimitadas, todas las prácticas y la exportación de tu diario.`,
  },
  {
    q: '¿Me garantizáis que voy a ganar dinero?',
    a: 'No, y desconfía de quien lo haga. Te enseñamos a gestionar el riesgo, a seguir un plan y a medir tus resultados. Operar en mercados reales conlleva riesgo de pérdida.',
  },
  {
    q: '¿Puedo cancelar Pro cuando quiera?',
    a: 'Sí. Gestionas la suscripción desde tu cuenta con un clic y mantienes el acceso hasta el final del periodo pagado.',
  },
];

export default function LandingPage() {
  const hours = Math.round(TOTAL_MINUTES / 60);
  return (
    <div className="overflow-x-hidden bg-ink-950">
      <LandingNav />

      {/* Hero */}
      <section className="relative px-4 pb-20 pt-32 sm:px-6 lg:pb-28 lg:pt-40">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gold-500/[0.08] blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-[13px] font-medium text-gold-200">
              <GraduationCap className="h-4 w-4" /> Academia de trading de oro en español
            </div>
            <h1 className="mt-6 text-[40px] font-semibold leading-[1.08] tracking-tight text-fg sm:text-[54px]">
              Aprende a operar oro <span className="gold-text">paso a paso</span> y practica sin arriesgar tu dinero
            </h1>
            <p className="mt-5 max-w-xl text-[18px] leading-relaxed text-fg-muted">
              {ALL_LESSONS.length} lecciones claras, un simulador con datos reales del XAU/USD y un diario que te dice qué mejorar. Primero aprendes, luego
              practicas, después revisas.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/auth/register" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                Empezar gratis
              </ButtonLink>
              <ButtonLink href="#temario" size="lg" variant="secondary">
                Ver el temario
              </ButtonLink>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-fg-muted">
              {['Sin tarjeta', `${LEVELS.length} etapas`, `${PRACTICE_COUNT} prácticas guiadas`, 'Dinero 100% ficticio'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-gold-400" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <HeroMock />
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="scroll-mt-20 border-t border-ink-800 px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="eyebrow">Cómo funciona</div>
            <h2 className="mt-2 text-[32px] font-semibold tracking-tight text-fg sm:text-[40px]">Un método en tres pasos que repites cada día</h2>
            <p className="mt-3 text-[17px] text-fg-muted">Leer no basta. Cada idea importante se convierte en un ejercicio que haces en el simulador y que luego revisas con números.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: BookOpen, t: '1. Aprende', d: 'Lecciones de 5 a 12 minutos con ejemplos resueltos, ilustraciones y un test al final para comprobar que lo has entendido.' },
              { icon: CandlestickChart, t: '2. Practica', d: 'Cada práctica abre el simulador con sus reglas: riesgo máximo, relación beneficio/riesgo mínima y motivo escrito. El simulador lo comprueba solo.' },
              { icon: NotebookPen, t: '3. Revisa', d: 'Tu diario calcula tu porcentaje de acierto, tu R:R medio, tu drawdown y tu curva de capital, y te dice qué corregir.' },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="card card-pad">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-[19px] font-semibold text-fg">{t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Temario */}
      <section id="temario" className="scroll-mt-20 border-t border-ink-800 bg-ink-900/40 px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="eyebrow">Temario</div>
              <h2 className="mt-2 text-[32px] font-semibold tracking-tight text-fg sm:text-[40px]">De cero a tu propio plan de trading</h2>
              <p className="mt-3 text-[17px] text-fg-muted">
                {LEVELS.length} etapas, {ALL_LESSONS.length} lecciones y unas {hours} horas de contenido. Todo el temario es gratis.
              </p>
            </div>
            <ButtonLink href="/auth/register" variant="secondary">
              Empezar la etapa 1
            </ButtonLink>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {LEVELS.map((level) => (
              <details key={level.id} className="group card card-pad">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-[16px] font-bold text-gold-300">{level.number}</div>
                    <ChevronDown className="mt-2 h-5 w-5 text-fg-dim transition group-open:rotate-180" />
                  </div>
                  <h3 className="mt-4 text-[18px] font-semibold text-fg">{level.title}</h3>
                  <p className="mt-1 text-[14px] text-gold-200/80">{level.subtitle}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-fg-muted">{level.description}</p>
                  <p className="mt-3 text-[13px] text-fg-dim">
                    {level.lessons.length} lecciones · {level.lessons.filter((l) => l.practice).length} prácticas · ver lecciones
                  </p>
                </summary>
                <ol className="mt-4 space-y-2 border-t border-ink-700 pt-4">
                  {level.lessons.map((l, i) => (
                    <li key={l.id} className="flex gap-2 text-[14px] text-fg-muted">
                      <span className="w-5 shrink-0 text-fg-dim num">{i + 1}.</span>
                      <span>
                        {l.title}
                        {l.practice && <Target className="ml-1.5 inline h-3.5 w-3.5 text-gold-400" aria-label="Incluye práctica" />}
                      </span>
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Simulador */}
      <section id="simulador" className="scroll-mt-20 border-t border-ink-800 px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="eyebrow">Simulador</div>
            <h2 className="mt-2 text-[32px] font-semibold tracking-tight text-fg sm:text-[40px]">Comete los errores de principiante aquí, no con tu dinero</h2>
            <p className="mt-3 text-[17px] text-fg-muted">
              Una cuenta demo de $10,000 sobre velas reales del oro. El panel de órdenes calcula tu riesgo antes de entrar y no te deja operar sin stop.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: LineChart, t: 'Gráfico profesional', d: '7 temporalidades, medias móviles, Bollinger, RSI, MACD y volumen.' },
                { icon: Crosshair, t: 'Herramientas de dibujo', d: 'Líneas, zonas y Fibonacci para marcar tu análisis.' },
                { icon: ShieldCheck, t: 'Riesgo calculado', d: 'Elige el % que arriesgas y el tamaño se ajusta solo.' },
                { icon: History, t: 'Modo replay', d: 'Vuelve a cualquier fecha y avanza vela a vela sin ver el futuro.' },
              ].map(({ icon: Icon, t, d }) => (
                <li key={t} className="flex gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                  <div>
                    <div className="text-[15px] font-semibold text-fg">{t}</div>
                    <div className="text-[14px] text-fg-muted">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="card card-pad">
            <div className="text-[13px] font-semibold uppercase tracking-wide text-fg-dim">Tras cada operación recibes una revisión</div>
            <div className="mt-4 rounded-2xl border border-ink-700 bg-ink-900 p-5">
              <div className="text-[13px] text-fg-dim">Objetivo alcanzado</div>
              <div className="text-[30px] font-bold num text-green-400">+$200.00</div>
              <ul className="mt-4 space-y-2.5 text-[14px] text-fg-muted">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" /> Riesgo del 1%: así sobrevives a las rachas malas.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" /> R:R de 1:2: con acertar 1 de cada 3 ya no pierdes dinero.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" /> Anotaste el motivo: podrás revisarlo en tu diario.
                </li>
              </ul>
            </div>
            <p className="mt-4 text-[13px] text-fg-dim">Ejemplo ilustrativo. Una sola operación no dice nada: lo que cuenta es repetir buenas decisiones.</p>
          </div>
        </div>
      </section>

      {/* Precios */}
      <section id="precios" className="scroll-mt-20 border-t border-ink-800 bg-ink-900/40 px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">Precios</div>
            <h2 className="mt-2 text-[32px] font-semibold tracking-tight text-fg sm:text-[40px]">La academia es gratis. La práctica ilimitada, Pro.</h2>
            <p className="mt-3 text-[17px] text-fg-muted">Empieza sin tarjeta. Pásate a Pro cuando quieras practicar sin límite.</p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_2fr]">
            <div className="flex flex-col rounded-2xl border border-ink-700 bg-ink-850 p-5">
              <div className="text-[15px] font-semibold text-fg">Gratis</div>
              <div className="mt-2 text-[32px] font-bold tracking-tight text-fg">€0</div>
              <div className="text-[13px] text-fg-dim">Para siempre</div>
              <ul className="mt-4 flex-1 space-y-2">
                {[`Las ${ALL_LESSONS.length} lecciones y sus tests`, `${FREE_SIMULATIONS} simulaciones`, 'Diario y estadísticas', 'Retos y progreso'].map((f) => (
                  <li key={f} className="flex gap-2 text-[14px] text-fg-muted">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/auth/register" variant="secondary" block className="mt-5">
                Crear cuenta gratis
              </ButtonLink>
            </div>
            <PlanCards hrefPrefix="/auth/register?plan=" />
          </div>
          <p className="mt-6 text-center text-[13px] text-fg-dim">Pago seguro con Stripe. Cancela cuando quieras desde tu cuenta.</p>
        </div>
      </section>

      {/* Preguntas */}
      <section id="preguntas" className="scroll-mt-20 border-t border-ink-800 px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <div className="eyebrow">Preguntas frecuentes</div>
            <h2 className="mt-2 text-[32px] font-semibold tracking-tight text-fg sm:text-[40px]">Antes de empezar</h2>
          </div>
          <div className="mt-10 divide-y divide-ink-750 rounded-2xl border border-ink-700 bg-ink-850">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-5 py-4 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium text-fg">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-fg-dim transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-br from-gold-500/[0.14] via-ink-850 to-ink-900 px-6 py-14 text-center sm:px-12">
          <h2 className="text-[30px] font-semibold tracking-tight text-fg sm:text-[38px]">Tu primera lección dura {ALL_LESSONS[0].minutes} minutos</h2>
          <p className="mx-auto mt-3 max-w-xl text-[17px] text-fg-muted">Crea tu cuenta, elige tu nivel y empieza hoy. Sin tarjeta y sin arriesgar dinero.</p>
          <ButtonLink href="/auth/register" size="lg" className="mt-8" iconRight={<ArrowRight className="h-4 w-4" />}>
            Empezar gratis
          </ButtonLink>
        </div>
      </section>

      <footer className="border-t border-ink-800 px-4 py-10 sm:px-6" style={{ paddingBottom: 'calc(2.5rem + var(--safe-bottom))' }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Logo />
            <p className="mt-4 text-[12px] leading-relaxed text-fg-dim">
              GoldTrader MT es una plataforma educativa. Nada de lo publicado es asesoramiento financiero ni una recomendación de inversión. Los CFD y
              productos apalancados son complejos y conllevan un riesgo alto de perder dinero rápidamente. Los resultados en el simulador no garantizan
              resultados futuros.
            </p>
          </div>
          <nav className="flex gap-6 text-[14px] text-fg-muted">
            <Link href="/auth/login" className="hover:text-fg">
              Entrar
            </Link>
            <Link href="/terms" className="hover:text-fg">
              Términos
            </Link>
            <Link href="/privacy" className="hover:text-fg">
              Privacidad
            </Link>
          </nav>
        </div>
        <p className="mx-auto mt-8 max-w-6xl text-[12px] text-fg-dim">© {new Date().getFullYear()} GoldTrader MT</p>
      </footer>
    </div>
  );
}
