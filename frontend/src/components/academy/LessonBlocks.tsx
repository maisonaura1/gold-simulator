import clsx from 'clsx';
import { AlertTriangle, KeyRound, Lightbulb } from 'lucide-react';
import type { Block, Section } from '@/content/academy/types';
import { RichText } from '@/components/ui/RichText';
import { Figure } from './Figure';

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return (
        <p className="my-3 text-[16px] leading-[1.75] text-fg-muted">
          <RichText text={block.text} />
        </p>
      );
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag className={clsx('my-3 space-y-2 pl-1 text-[16px] leading-[1.7] text-fg-muted', block.ordered && 'list-none')}>
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              {block.ordered ? (
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-[12px] font-semibold text-gold-300">
                  {i + 1}
                </span>
              ) : (
                <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
              )}
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </Tag>
      );
    }
    case 'callout': {
      const cfg = {
        tip: { icon: Lightbulb, cls: 'border-info/30 bg-info/[0.07]', iconCls: 'text-blue-300', title: 'Consejo' },
        warning: { icon: AlertTriangle, cls: 'border-warn/30 bg-warn/[0.07]', iconCls: 'text-amber-300', title: 'Cuidado' },
        key: { icon: KeyRound, cls: 'border-gold-500/30 bg-gold-500/[0.07]', iconCls: 'text-gold-300', title: 'Idea clave' },
      }[block.tone];
      const Icon = cfg.icon;
      return (
        <div className={clsx('my-5 flex gap-3 rounded-2xl border p-4', cfg.cls)}>
          <Icon className={clsx('mt-0.5 h-5 w-5 shrink-0', cfg.iconCls)} />
          <div>
            <div className={clsx('text-[14px] font-semibold', cfg.iconCls)}>{block.title ?? cfg.title}</div>
            <p className="mt-1 text-[15px] leading-relaxed text-fg-muted">
              <RichText text={block.text} />
            </p>
          </div>
        </div>
      );
    }
    case 'example':
      return (
        <div className="my-5 overflow-hidden rounded-2xl border border-ink-700 bg-ink-900">
          <div className="border-b border-ink-700 bg-ink-800 px-4 py-2.5 text-[13px] font-semibold text-gold-300">
            Ejemplo · <RichText text={block.title} />
          </div>
          <dl className="divide-y divide-ink-750">
            {block.rows.map(([k, v], i) => (
              <div key={i} className="flex items-baseline justify-between gap-4 px-4 py-2.5 text-[15px]">
                <dt className="text-fg-muted">
                  <RichText text={k} />
                </dt>
                <dd className="text-right font-medium num text-fg">
                  <RichText text={v} />
                </dd>
              </div>
            ))}
          </dl>
          {block.note && (
            <p className="border-t border-ink-700 bg-ink-850 px-4 py-3 text-[14px] leading-relaxed text-fg-muted">
              <RichText text={block.note} />
            </p>
          )}
        </div>
      );
    case 'formula':
      return (
        <div className="my-5 rounded-2xl border border-gold-500/25 bg-gradient-to-br from-gold-500/[0.08] to-transparent p-4">
          <div className="eyebrow">{block.label}</div>
          <div className="mt-2 font-mono text-[15px] leading-relaxed text-gold-100 sm:text-[16px]">{block.expr}</div>
          {block.note && (
            <p className="mt-2 text-[14px] text-fg-muted">
              <RichText text={block.note} />
            </p>
          )}
        </div>
      );
    case 'table':
      return (
        <div className="my-5 overflow-x-auto rounded-2xl border border-ink-700">
          <table className="w-full min-w-[420px] text-left text-[14px]">
            <thead className="bg-ink-800 text-[12px] uppercase tracking-wide text-fg-dim">
              <tr>
                {block.headers.map((h) => (
                  <th key={h} className="px-4 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-750 bg-ink-900">
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className={clsx('px-4 py-2.5 num', j === 0 ? 'text-fg' : 'text-fg-muted')}>
                      <RichText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'figure':
      return <Figure name={block.name} caption={block.caption} />;
    default:
      return null;
  }
}

export function LessonSections({ sections }: { sections: Section[] }) {
  return (
    <div>
      {sections.map((s, i) => (
        <section key={i} className="mt-10 first:mt-0">
          <h2 className="text-[21px] font-semibold tracking-tight text-fg">{s.heading}</h2>
          {s.blocks.map((b, j) => (
            <BlockView key={j} block={b} />
          ))}
        </section>
      ))}
    </div>
  );
}
