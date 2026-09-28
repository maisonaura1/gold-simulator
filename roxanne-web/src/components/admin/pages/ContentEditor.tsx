'use client'

import { ArrowUpRight, Check, RotateCcw, Save, Undo2 } from 'lucide-react'
import { useCallback, useMemo, useState, useTransition } from 'react'
import { resetContent, saveContent } from '@/lib/admin/actions/content'
import { deepEqual, getIn, setIn, type JsonPath } from '@/lib/admin/json'
import type { PageSection } from '@/lib/admin/sections'
import { UNEXPECTED_ERROR } from '@/lib/admin/types'
import { cn } from '@/lib/cn'
import { useConfirm } from '../ui/Confirm'
import { AdminButton, Badge, Callout, buttonStyles } from '../ui/primitives'
import { useToast } from '../ui/Toast'
import { useUnsavedChanges } from '../ui/UnsavedChanges'
import { Collapsible, EditorContext, GroupFields, describe, isHidden, isObject, previewText } from './fields'

type Value = Record<string, unknown>

interface Card {
  key: string
  title: string
  hint?: string
  path: JsonPath
  value: unknown
}

/**
 * Splits the section into the cards shown on screen: one per group of the
 * page ("Top of the page", "Benefits"…), text fields that sit between groups
 * gathered together, and the Google listing last.
 */
function buildCards(value: Value, hidden: Set<string>, labelRoot: string, sectionLabel: string): Card[] {
  const cards: Card[] = []
  let loose: string[] = []

  const flushLoose = () => {
    if (loose.length === 0) return
    const keys = loose
    loose = []
    const single = keys.length === 1 ? describe(labelRoot, [keys[0]]) : null
    cards.push({
      key: keys.join('+'),
      title: single?.label ?? (labelRoot === 'course' ? 'Course details' : `${sectionLabel} — main text`),
      hint: single?.hint,
      path: [],
      value: Object.fromEntries(keys.map((key) => [key, value[key]])),
    })
  }

  for (const [key, item] of Object.entries(value)) {
    if (key === 'meta' || isHidden(hidden, [key])) continue
    if (typeof item === 'string') {
      loose.push(key)
      continue
    }
    flushLoose()
    const copy = describe(labelRoot, [key])
    cards.push({ key, title: copy.label, hint: copy.hint, path: [key], value: item })
  }
  flushLoose()

  if ('meta' in value && !isHidden(hidden, ['meta'])) {
    const copy = describe(labelRoot, ['meta'])
    cards.push({ key: 'meta', title: copy.label, hint: copy.hint, path: ['meta'], value: value.meta })
  }
  return cards
}

/** Whether anything in a card differs from what is saved (cards of loose fields have no path). */
function cardChanged(card: Card, saved: Value): boolean {
  if (card.path.length) return !deepEqual(getIn(saved, card.path), card.value)
  return Object.entries(card.value as Value).some(([key, value]) => !deepEqual(saved[key], value))
}

export function ContentEditor({
  section,
  labelRoot,
  initialValue,
  template,
  hiddenPaths,
  initiallyEdited,
}: {
  section: Pick<PageSection, 'id' | 'label' | 'href' | 'description' | 'review'>
  labelRoot: string
  initialValue: Value
  template: Value
  hiddenPaths: string[]
  initiallyEdited: boolean
}) {
  const toast = useToast()
  const confirm = useConfirm()
  const [saved, setSaved] = useState(initialValue)
  const [draft, setDraft] = useState(initialValue)
  const [edited, setEdited] = useState(initiallyEdited)
  const [saving, startSave] = useTransition()
  const [resetting, startReset] = useTransition()
  const hidden = useMemo(() => new Set(hiddenPaths), [hiddenPaths])
  const dirty = !deepEqual(draft, saved)
  useUnsavedChanges(dirty)

  const onChange = useCallback((path: JsonPath, next: unknown) => setDraft((current) => setIn(current, path, next)), [])

  const context = useMemo(() => ({ saved, template, hidden, labelRoot, onChange }), [saved, template, hidden, labelRoot, onChange])
  const cards = useMemo(() => buildCards(draft, hidden, labelRoot, section.label), [draft, hidden, labelRoot, section.label])

  const save = () => {
    if (!dirty || saving) return
    const submitted = draft
    startSave(async () => {
      try {
        const result = await saveContent(section.id, submitted)
        if (!result.ok) {
          toast.error(result.error)
          return
        }
        setSaved(result.value)
        // Keep anything typed while saving; otherwise show the cleaned-up saved text.
        setDraft((current) => (deepEqual(current, submitted) ? result.value : current))
        setEdited(!deepEqual(result.value, template))
        toast.success('Saved — your website is updated.')
      } catch {
        toast.error(UNEXPECTED_ERROR)
      }
    })
  }

  const discard = async () => {
    const ok = await confirm({
      title: 'Discard your changes?',
      body: 'The text goes back to what is currently on your website.',
      confirmLabel: 'Discard changes',
      tone: 'danger',
    })
    if (ok) setDraft(saved)
  }

  const reset = async () => {
    const ok = await confirm({
      title: `Restore the original text of “${section.label}”?`,
      body: 'Every change made to this page since it was built will be replaced by the original text. This can’t be undone.',
      confirmLabel: 'Restore original',
      tone: 'danger',
    })
    if (!ok) return
    startReset(async () => {
      try {
        const result = await resetContent(section.id)
        if (!result.ok) {
          toast.error(result.error)
          return
        }
        setSaved(result.value)
        setDraft(result.value)
        setEdited(false)
        toast.success('The original text is back on your website.')
      } catch {
        toast.error(UNEXPECTED_ERROR)
      }
    })
  }

  return (
    <EditorContext.Provider value={context}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          save()
        }}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
            event.preventDefault()
            save()
          }
        }}
        aria-labelledby="editor-title"
        className="max-w-4xl"
      >
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {edited && <Badge tone="sage">Edited</Badge>}
              {section.review?.tone === 'draft' && <Badge tone="warm">Please review</Badge>}
            </div>
            <h1 id="editor-title" className="mt-2 font-display text-[2.25rem] leading-[1.1] text-ink sm:text-[2.75rem]">
              {section.label}
            </h1>
            <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-soft">{section.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={section.href} target="_blank" rel="noopener noreferrer" className={buttonStyles({ size: 'sm' })}>
              View on site
              <ArrowUpRight aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            {edited && (
              <AdminButton size="sm" variant="ghost" onClick={reset} pending={resetting}>
                {!resetting && <RotateCcw aria-hidden />}
                Reset to original
              </AdminButton>
            )}
          </div>
        </header>

        {section.review && (
          <Callout
            tone={section.review.tone === 'draft' ? 'draft' : 'info'}
            title={section.review.tone === 'draft' ? 'Drafted by the web team — please review' : 'Good to know'}
            className="mt-6"
          >
            {section.review.text}
          </Callout>
        )}

        <div className="mt-6 space-y-3">
          {cards.map((card, index) => (
            <Collapsible
              key={card.key}
              title={card.title}
              hint={card.hint}
              preview={previewText(card.value)}
              changed={cardChanged(card, saved)}
              defaultOpen={index === 0}
            >
              {card.path.length === 0 && isObject(card.value) ? (
                <div className="space-y-5">
                  {Object.entries(card.value).map(([key, item], _i, all) => (
                    <GroupFields key={key} path={[key]} value={item} bare={all.length === 1} />
                  ))}
                </div>
              ) : (
                <GroupFields path={card.path} value={card.value} />
              )}
            </Collapsible>
          ))}
        </div>

        {/* Save bar — always visible at the bottom of the screen */}
        <div className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-20 mt-8 lg:bottom-5">
          <div
            className={cn(
              'flex items-center gap-3 rounded-2xl border bg-white/95 px-4 py-3 shadow-lift backdrop-blur-md transition-colors sm:px-5',
              dirty ? 'border-clay/35' : 'border-line',
            )}
          >
            <p className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold" aria-live="polite">
              {dirty ? (
                <>
                  <span className="size-2 shrink-0 rounded-full bg-clay" aria-hidden />
                  <span className="truncate text-ink">
                    Unsaved<span className="max-sm:hidden"> changes</span>
                  </span>
                </>
              ) : (
                <>
                  <Check className="size-4 shrink-0 text-sage-dark" aria-hidden />
                  <span className="truncate text-ink-soft">All changes saved</span>
                </>
              )}
            </p>
            {dirty && (
              <AdminButton size="sm" variant="ghost" onClick={discard} disabled={saving} className="max-sm:px-3">
                <Undo2 aria-hidden />
                <span className="max-sm:sr-only">Discard</span>
              </AdminButton>
            )}
            <AdminButton type="submit" size="sm" variant="primary" pending={saving} disabled={!dirty}>
              {!saving && <Save aria-hidden />}
              {saving ? 'Saving…' : 'Save changes'}
            </AdminButton>
          </div>
        </div>
      </form>
    </EditorContext.Provider>
  )
}
