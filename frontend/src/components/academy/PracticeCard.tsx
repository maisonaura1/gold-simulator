import { CheckCircle2, Target } from 'lucide-react';
import type { Practice } from '@/content/academy/types';
import { ButtonLink } from '@/components/ui/Button';
import { RichText } from '@/components/ui/RichText';
import { describeRules } from '@/lib/practice';

export function PracticeCard({ lessonId, practice, done }: { lessonId: string; practice: Practice; done: boolean }) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-ink-700 bg-gradient-to-r from-gold-500/[0.12] to-transparent px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2 text-gold-300">
          <Target className="h-5 w-5" />
          <span className="eyebrow">Práctica en el simulador</span>
        </div>
        <p className="mt-2 text-[16px] font-medium text-fg">
          <RichText text={practice.goal} />
        </p>
      </div>
      <div className="card-pad">
        <ol className="space-y-2.5">
          {practice.steps.map((s, i) => (
            <li key={i} className="flex gap-3 text-[15px] text-fg-muted">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-750 text-[12px] font-semibold text-fg">
                {i + 1}
              </span>
              <span>
                <RichText text={s} />
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-5 rounded-xl border border-ink-700 bg-ink-900 p-4">
          <div className="text-[13px] font-semibold text-fg">El simulador comprobará:</div>
          <ul className="mt-2 space-y-1.5 text-[14px] text-fg-muted">
            {describeRules(practice).map((r) => (
              <li key={r} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold-400" />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <ButtonLink href={`/trade?practica=${lessonId}`} icon={<Target className="h-4 w-4" />}>
            {done ? 'Practicar otra vez' : 'Hacer la práctica'}
          </ButtonLink>
          {done && (
            <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-green-400">
              <CheckCircle2 className="h-4 w-4" /> Práctica completada
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
