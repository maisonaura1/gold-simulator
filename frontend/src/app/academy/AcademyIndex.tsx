'use client';
import Link from 'next/link';
import clsx from 'clsx';
import { CheckCircle2, ChevronRight, Clock, PlayCircle, Target } from 'lucide-react';
import { PageHeader } from '@/components/layout/AppShell';
import { ProgressBar, ProgressRing } from '@/components/ui/Progress';
import { ButtonLink } from '@/components/ui/Button';
import { useProgress } from '@/store/progress.store';
import { currentLesson, isDone, levelProgress, overallProgress } from '@/lib/catalog';
import { useCatalog } from '@/components/academy/CatalogProvider';

export function AcademyIndex() {
  const lessons = useProgress((s) => s.lessons);
  const catalog = useCatalog();
  const { levels: LEVELS, totalMinutes: TOTAL_MINUTES, practiceCount: PRACTICE_COUNT } = catalog;
  const overall = overallProgress(catalog, lessons);
  const next = currentLesson(catalog, lessons);

  return (
    <div>
      <PageHeader
        eyebrow="Academia GoldTrader"
        title="Aprende a operar oro, paso a paso"
        text={`${LEVELS.length} etapas, ${overall.total} lecciones (unas ${Math.round(TOTAL_MINUTES / 60)} horas de lectura) y ${PRACTICE_COUNT} prácticas en el simulador. Cada lección termina con un test.`}
      />

      <div className="card card-pad mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">
        <ProgressRing value={overall.pct} size={84} stroke={7} />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] text-fg-dim">
            {overall.done === 0 ? 'Empieza por aquí' : overall.done === overall.total ? '¡Academia completada!' : 'Continúa donde lo dejaste'}
          </div>
          <div className="mt-0.5 truncate text-[18px] font-semibold text-fg">{next.title}</div>
          <div className="mt-0.5 text-[13px] text-fg-muted">
            Etapa {next.level.number} · {next.level.title} · {next.minutes} min
          </div>
        </div>
        <ButtonLink href={`/academy/${next.id}`} icon={<PlayCircle className="h-4 w-4" />}>
          {overall.done === 0 ? 'Empezar la academia' : 'Continuar'}
        </ButtonLink>
      </div>

      <ol className="space-y-6">
        {LEVELS.map((level) => {
          const p = levelProgress(level, lessons);
          return (
            <li key={level.id} className="card overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-ink-700 p-5 sm:flex-row sm:items-center sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-[18px] font-bold text-gold-300">
                  {level.number}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-medium uppercase tracking-wide text-fg-dim">Etapa {level.number} · {level.subtitle}</div>
                  <h2 className="text-[19px] font-semibold text-fg">{level.title}</h2>
                  <p className="mt-0.5 text-[14px] text-fg-muted">{level.description}</p>
                </div>
                <div className="w-full sm:w-40">
                  <div className="mb-1.5 flex justify-between text-[12px] text-fg-dim">
                    <span>Progreso</span>
                    <span className="num">
                      {p.done}/{p.total}
                    </span>
                  </div>
                  <ProgressBar value={p.pct} />
                </div>
              </div>
              <ul className="divide-y divide-ink-750">
                {level.lessons.map((lesson, i) => {
                  const done = isDone(lessons, lesson.id);
                  const isNext = lesson.id === next.id && !done;
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/academy/${lesson.id}`}
                        className={clsx('flex items-center gap-4 px-5 py-3.5 transition hover:bg-ink-800 sm:px-6', isNext && 'bg-gold-500/[0.05]')}
                      >
                        <span
                          className={clsx(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[13px] font-semibold',
                            done ? 'border-up/40 bg-up/10 text-green-300' : isNext ? 'border-gold-400/60 text-gold-300' : 'border-ink-600 text-fg-dim',
                          )}
                        >
                          {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className={clsx('truncate text-[15px] font-medium', done ? 'text-fg-muted' : 'text-fg')}>{lesson.title}</div>
                          <div className="mt-0.5 flex items-center gap-3 text-[12px] text-fg-dim">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" /> {lesson.minutes} min
                            </span>
                            {lesson.practice && (
                              <span className={clsx('inline-flex items-center gap-1', lessons[lesson.id]?.practiceDone ? 'text-green-400' : 'text-gold-300')}>
                                <Target className="h-3.5 w-3.5" /> Práctica
                              </span>
                            )}
                          </div>
                        </div>
                        {isNext && <span className="hidden text-[12px] font-semibold text-gold-300 sm:block">Siguiente</span>}
                        <ChevronRight className="h-4 w-4 shrink-0 text-fg-dim" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-center text-[12px] text-fg-dim">
        Contenido educativo. No es asesoramiento financiero. Operar con apalancamiento conlleva un riesgo alto de perder dinero.
      </p>
    </div>
  );
}
