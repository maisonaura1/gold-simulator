'use client';
import { useState } from 'react';
import clsx from 'clsx';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import type { QuizQuestion } from '@/content/academy/types';
import { Button } from '@/components/ui/Button';
import { RichText } from '@/components/ui/RichText';
import { PASS_SCORE } from '@/store/progress.store';

export function Quiz({ questions, onFinish, bestScore }: { questions: QuizQuestion[]; onFinish: (score: number) => void; bestScore: number | null }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const correct = answers.filter((a, i) => a === questions[i].answer).length;
  const score = questions.length ? correct / questions.length : 0;
  const passed = score >= PASS_SCORE;

  const submit = () => {
    setSubmitted(true);
    onFinish(score);
  };

  const retry = () => {
    setAnswers(questions.map(() => null));
    setSubmitted(false);
  };

  return (
    <div className="card card-pad">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="eyebrow">Comprueba lo aprendido</div>
          <h2 className="mt-1 text-[20px] font-semibold text-fg">Test de la lección</h2>
        </div>
        {bestScore != null && !submitted && (
          <span className="text-[13px] text-fg-dim">Tu mejor nota: {Math.round(bestScore * 100)}%</span>
        )}
      </div>
      <p className="mt-1 text-[14px] text-fg-dim">Necesitas acertar al menos 2 de cada 3 preguntas para completar la lección.</p>

      <ol className="mt-6 space-y-7">
        {questions.map((q, qi) => (
          <li key={qi}>
            <p className="text-[16px] font-medium text-fg">
              <span className="mr-2 text-gold-400">{qi + 1}.</span>
              <RichText text={q.q} />
            </p>
            <div className="mt-3 grid gap-2">
              {q.options.map((opt, oi) => {
                const chosen = answers[qi] === oi;
                const isRight = oi === q.answer;
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                    className={clsx(
                      'flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-[15px] transition',
                      !submitted && (chosen ? 'border-gold-400/70 bg-gold-500/10 text-fg' : 'border-ink-700 bg-ink-900 text-fg-muted hover:border-ink-600 hover:text-fg'),
                      submitted && isRight && 'border-up/50 bg-up/10 text-fg',
                      submitted && chosen && !isRight && 'border-down/50 bg-down/10 text-fg',
                      submitted && !chosen && !isRight && 'border-ink-750 bg-ink-900 text-fg-dim',
                    )}
                  >
                    <span
                      className={clsx(
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px]',
                        chosen ? 'border-gold-400 bg-gold-400 text-ink-950' : 'border-ink-600',
                      )}
                    >
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span className="flex-1">
                      <RichText text={opt} />
                    </span>
                    {submitted && isRight && <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />}
                    {submitted && chosen && !isRight && <XCircle className="h-5 w-5 shrink-0 text-red-400" />}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className={clsx('mt-3 rounded-xl px-4 py-3 text-[14px] leading-relaxed', answers[qi] === q.answer ? 'bg-up/[0.07] text-green-200' : 'bg-ink-800 text-fg-muted')}>
                <RichText text={q.explain} />
              </p>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-ink-700 pt-5">
        {!submitted ? (
          <>
            <span className="text-[14px] text-fg-dim">
              {answers.filter((a) => a !== null).length} de {questions.length} respondidas
            </span>
            <Button onClick={submit} disabled={!allAnswered}>
              Corregir test
            </Button>
          </>
        ) : (
          <>
            <div className={clsx('text-[15px] font-semibold', passed ? 'text-green-400' : 'text-amber-300')}>
              {correct} de {questions.length} correctas · {passed ? '¡Lección superada!' : 'Repasa y vuelve a intentarlo'}
            </div>
            <Button variant="secondary" onClick={retry} icon={<RotateCcw className="h-4 w-4" />}>
              Repetir test
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
