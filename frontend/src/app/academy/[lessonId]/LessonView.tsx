'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CandlestickChart, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { LessonSections } from '@/components/academy/LessonBlocks';
import { Quiz } from '@/components/academy/Quiz';
import { PracticeCard } from '@/components/academy/PracticeCard';
import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RichText } from '@/components/ui/RichText';
import { useProgress } from '@/store/progress.store';
import { findLesson } from '@/lib/catalog';
import { useCatalog } from '@/components/academy/CatalogProvider';
import type { Lesson } from '@/content/academy/types';

export function LessonView({ lesson }: { lesson: Lesson }) {
  const lessonId = lesson.id;
  const catalog = useCatalog();
  const meta = findLesson(catalog, lessonId)!;
  const next = catalog.lessons[meta.index + 1];
  const prev = meta.index > 0 ? catalog.lessons[meta.index - 1] : undefined;
  const levelSize = catalog.levels.find((l) => l.id === meta.level.id)?.lessons.length ?? 0;
  const progress = useProgress((s) => s.lessons[lessonId]);
  const saveQuiz = useProgress((s) => s.saveQuiz);
  const done = !!progress?.completedAt;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [lessonId]);

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/academy" className="inline-flex items-center gap-1.5 text-[13px] text-fg-muted hover:text-fg">
        <ArrowLeft className="h-4 w-4" /> Academia
      </Link>

      <header className="mt-4">
        <div className="eyebrow">
          Etapa {meta.level.number} · {meta.level.title} · Lección {meta.position} de {levelSize}
        </div>
        <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight text-fg sm:text-[34px]">{lesson.title}</h1>
        <p className="mt-2 text-[17px] text-fg-muted">{lesson.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge icon={<Clock className="h-3.5 w-3.5" />}>{lesson.minutes} min de lectura</Badge>
          {lesson.practice && <Badge tone="gold">Incluye práctica</Badge>}
          {done && (
            <Badge tone="up" icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
              Completada
            </Badge>
          )}
        </div>
      </header>

      <div className="mt-10">
        <LessonSections sections={lesson.sections} />
      </div>

      <section className="mt-12 rounded-2xl border border-gold-500/25 bg-gold-500/[0.05] p-5 sm:p-6">
        <div className="flex items-center gap-2 text-gold-300">
          <Sparkles className="h-5 w-5" />
          <h2 className="text-[17px] font-semibold">Ideas clave</h2>
        </div>
        <ul className="mt-3 space-y-2">
          {lesson.keyPoints.map((k) => (
            <li key={k} className="flex gap-2.5 text-[15px] text-fg-muted">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <span>
                <RichText text={k} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      {lesson.practice && (
        <div className="mt-8">
          <PracticeCard lessonId={lesson.id} practice={lesson.practice} done={!!progress?.practiceDone} />
        </div>
      )}

      <div className="mt-8" id="test">
        <Quiz key={lesson.id} questions={lesson.quiz} bestScore={progress?.quizScore ?? null} onFinish={(score) => saveQuiz(lesson.id, score)} />
      </div>

      <nav className="mt-10 grid gap-3 border-t border-ink-750 pt-6 sm:grid-cols-2">
        {prev ? (
          <Link href={`/academy/${prev.id}`} className="card flex items-center gap-3 p-4 transition hover:border-ink-600">
            <ArrowLeft className="h-5 w-5 shrink-0 text-fg-dim" />
            <div className="min-w-0">
              <div className="text-[12px] text-fg-dim">Anterior</div>
              <div className="truncate text-[14px] font-medium text-fg">{prev.title}</div>
            </div>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/academy/${next.id}`} className="card flex items-center justify-end gap-3 p-4 text-right transition hover:border-ink-600">
            <div className="min-w-0">
              <div className="text-[12px] text-fg-dim">{done ? 'Siguiente lección' : 'Siguiente (completa el test antes)'}</div>
              <div className="truncate text-[14px] font-medium text-fg">{next.title}</div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-gold-400" />
          </Link>
        ) : (
          <div className="card flex items-center justify-between gap-3 p-4">
            <div>
              <div className="text-[12px] text-fg-dim">Has llegado al final</div>
              <div className="text-[14px] font-medium text-fg">Sigue practicando en el simulador</div>
            </div>
            <ButtonLink href="/trade" size="sm" icon={<CandlestickChart className="h-4 w-4" />}>
              Simulador
            </ButtonLink>
          </div>
        )}
      </nav>
    </article>
  );
}
