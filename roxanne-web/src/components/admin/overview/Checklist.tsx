'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { useState, useTransition } from 'react'
import { setDraftCopyReviewed } from '@/lib/admin/actions/settings'
import type { ChecklistItem } from '@/lib/admin/overview'
import { UNEXPECTED_ERROR } from '@/lib/admin/types'
import { cn } from '@/lib/cn'
import { useToast } from '../ui/Toast'

function StatusDot({ done }: { done: boolean }) {
  return (
    <span
      className={cn(
        'mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border transition-colors',
        done ? 'border-sage-dark bg-sage-dark text-white' : 'border-ink/20 bg-white',
      )}
      aria-hidden
    >
      {done && <Check className="size-3.5" strokeWidth={3} />}
    </span>
  )
}

export function Checklist({ items }: { items: ChecklistItem[] }) {
  const toast = useToast()
  const [, startTransition] = useTransition()
  // The manual tick is local state so the checkbox reacts instantly (no flicker while saving).
  const [reviewed, setReviewed] = useState(() => items.some((item) => item.manual && item.done))
  const optimistic = items.map((item) => (item.manual ? { ...item, done: reviewed } : item))

  const done = optimistic.filter((item) => item.done).length
  const percent = Math.round((done / optimistic.length) * 100)

  const toggleManual = (checked: boolean) => {
    setReviewed(checked)
    startTransition(async () => {
      try {
        const result = await setDraftCopyReviewed(checked)
        if (!result.ok) {
          setReviewed(!checked)
          toast.error(result.error)
        } else if (checked) {
          toast.success('Nice — marked as reviewed.')
        }
      } catch {
        setReviewed(!checked)
        toast.error(UNEXPECTED_ERROR)
      }
    })
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-ink/[0.07]"
          role="progressbar"
          aria-label="Launch checklist progress"
          aria-valuemin={0}
          aria-valuemax={optimistic.length}
          aria-valuenow={done}
        >
          <div className="h-full rounded-full bg-clay transition-[width] duration-500" style={{ width: `${percent}%` }} />
        </div>
        <p className="shrink-0 text-sm font-semibold text-ink">
          {done} of {optimistic.length} done
        </p>
      </div>

      {done === optimistic.length && (
        <p className="mt-4 rounded-xl bg-sage/10 px-4 py-3 text-sm font-medium text-sage-dark">
          Everything is ready — your website is set for launch.
        </p>
      )}

      <ul className="mt-5 divide-y divide-line">
        {optimistic.map((item) =>
          item.manual ? (
            <li key={item.id} className="flex items-start gap-3.5 py-4 first:pt-0 last:pb-0">
              <input
                id={`checklist-${item.id}`}
                type="checkbox"
                checked={item.done}
                onChange={(event) => toggleManual(event.target.checked)}
                className="peer sr-only"
              />
              <label
                htmlFor={`checklist-${item.id}`}
                className="cursor-pointer rounded-full peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-clay"
              >
                <StatusDot done={item.done} />
              </label>
              <div className="min-w-0 flex-1">
                <label
                  htmlFor={`checklist-${item.id}`}
                  className={cn('block cursor-pointer font-semibold', item.done ? 'text-ink-soft' : 'text-ink')}
                >
                  {item.label}
                </label>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{item.hint}</p>
                <p className="mt-1 text-[0.8125rem] text-ink-soft">
                  {item.done ? 'Marked as reviewed.' : 'Tick the circle once you’ve read them.'}{' '}
                  <Link href={item.href} className="font-semibold text-clay underline-offset-4 hover:underline">
                    Open Pages
                  </Link>
                </p>
              </div>
            </li>
          ) : (
            <li key={item.id} className="flex items-start gap-3.5 py-4 first:pt-0 last:pb-0">
              <StatusDot done={item.done} />
              <div className="min-w-0 flex-1">
                <p className={cn('font-semibold', item.done ? 'text-ink-soft' : 'text-ink')}>
                  {item.label}
                  <span className="sr-only">{item.done ? ' — done' : ' — to do'}</span>
                </p>
                {!item.done && <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{item.hint}</p>}
              </div>
              {!item.done && (
                <Link
                  href={item.href}
                  className="group inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-clay transition hover:text-clay-dark"
                >
                  {item.action}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  <span className="sr-only">: {item.label}</span>
                </Link>
              )}
            </li>
          ),
        )}
      </ul>
    </div>
  )
}
