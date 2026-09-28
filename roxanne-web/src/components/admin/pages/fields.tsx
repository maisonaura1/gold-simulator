'use client'

import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash, TriangleAlert } from 'lucide-react'
import { createContext, useContext, useId, useState, type ReactNode } from 'react'
import { describeField } from '@/lib/admin/labels'
import { blankCopy, deepEqual, getIn, type JsonPath } from '@/lib/admin/json'
import { cn } from '@/lib/cn'
import { AutoTextarea } from '../ui/AutoTextarea'
import { useConfirm } from '../ui/Confirm'
import { FieldHint, inputStyles } from '../ui/primitives'

/* ───────────────────────────── Context ─────────────────────────────── */

interface EditorContextValue {
  saved: unknown
  template: unknown
  /** Dotted paths (without list positions) that must not be shown. */
  hidden: Set<string>
  /** Prefix used to look up labels: the content section ("home") or "course". */
  labelRoot: string
  /** Item templates for lists that start empty (dotted path without list positions). */
  listSamples: Record<string, unknown>
  onChange: (path: JsonPath, value: unknown) => void
}

export const EditorContext = createContext<EditorContextValue | null>(null)

function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext)
  if (!ctx) throw new Error('Field components must be used inside <EditorContext>')
  return ctx
}

/* ───────────────────────────── Helpers ─────────────────────────────── */

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const keyPath = (path: JsonPath) => path.filter((part): part is string => typeof part === 'string')

export function describe(labelRoot: string, path: JsonPath) {
  return describeField([labelRoot, ...keyPath(path)].filter(Boolean))
}

export function isHidden(hidden: Set<string>, path: JsonPath) {
  return hidden.has(keyPath(path).join('.'))
}

/** First non-empty text inside a value — used as a preview for collapsed groups. */
export function previewText(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (Array.isArray(value)) {
    for (const item of value) {
      const text = previewText(item)
      if (text) return text
    }
    return ''
  }
  if (isObject(value)) {
    for (const item of Object.values(value)) {
      const text = previewText(item)
      if (text) return text
    }
  }
  return ''
}

function fieldId(path: JsonPath) {
  return `field-${path.join('-')}`
}

const SAFE_HREF = /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i

function ChangedDot({ changed }: { changed: boolean }) {
  if (!changed) return null
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-clay">
      <span className="size-1.5 rounded-full bg-clay" aria-hidden />
      Changed
    </span>
  )
}

/* ───────────────────────────── Text field ──────────────────────────── */

function TextField({ path, value, hideLabel = false }: { path: JsonPath; value: string; hideLabel?: boolean }) {
  const { saved, template, labelRoot, onChange } = useEditor()
  const copy = describe(labelRoot, path)
  const id = fieldId(path)
  const savedValue = getIn(saved, path)
  const templateValue = getIn(template, path)
  const changed = typeof savedValue === 'string' && savedValue !== value
  // Decide single- vs multi-line from the saved/original text, never from what is being typed.
  const long =
    Boolean(copy.long) ||
    (typeof templateValue === 'string' && (templateValue.length > 80 || templateValue.includes('\n'))) ||
    (typeof savedValue === 'string' && (savedValue.length > 80 || savedValue.includes('\n')))
  const isHref = keyPath(path).at(-1) === 'href'
  const unsafeHref = isHref && value.trim() !== '' && !SAFE_HREF.test(value.trim())
  const over = copy.limit !== undefined && value.length > copy.limit
  const describedBy = [copy.hint && `${id}-hint`, copy.limit && `${id}-count`, unsafeHref && `${id}-warn`].filter(Boolean).join(' ')

  return (
    <div>
      <div className={hideLabel ? 'sr-only' : 'flex items-baseline justify-between gap-3'}>
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {copy.label}
        </label>
        <ChangedDot changed={changed} />
      </div>
      <div className={hideLabel ? undefined : 'mt-1.5'}>
        {long ? (
          <AutoTextarea
            id={id}
            value={value}
            onChange={(event) => onChange(path, event.target.value)}
            aria-describedby={describedBy || undefined}
            minRows={2}
          />
        ) : (
          <input
            id={id}
            type="text"
            value={value}
            onChange={(event) => onChange(path, event.target.value)}
            aria-describedby={describedBy || undefined}
            className={inputStyles}
            spellCheck={!isHref}
            autoComplete="off"
          />
        )}
      </div>
      {(copy.hint || copy.limit) && (
        <div className="flex items-start justify-between gap-4">
          {copy.hint ? <FieldHint id={`${id}-hint`}>{copy.hint}</FieldHint> : <span />}
          {copy.limit && (
            <p
              id={`${id}-count`}
              className={cn('mt-1.5 shrink-0 text-[0.8125rem] tabular-nums', over ? 'font-semibold text-clay-dark' : 'text-ink-soft')}
            >
              {value.length} / {copy.limit}
              {over && <span className="sr-only"> characters — a bit long, Google may cut it off</span>}
            </p>
          )}
        </div>
      )}
      {unsafeHref && (
        <p id={`${id}-warn`} className="mt-1.5 flex items-start gap-1.5 text-[0.8125rem] font-medium text-clay-dark">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Links must start with “/” (a page of your site) or “https://”. Otherwise the home page is used.
        </p>
      )}
    </div>
  )
}

/* ───────────────────────────── Groups ──────────────────────────────── */

/** Collapsible block with a preview of its text while closed. */
export function Collapsible({
  title,
  hint,
  preview,
  changed,
  defaultOpen = false,
  level = 'card',
  children,
}: {
  title: string
  hint?: string
  preview?: string
  changed?: boolean
  defaultOpen?: boolean
  level?: 'card' | 'nested'
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()
  const card = level === 'card'

  return (
    <section className={cn(card ? 'rounded-2xl border border-line bg-white' : 'rounded-xl border border-line bg-ivory/60')}>
      <h3 className="m-0 font-sans">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            'flex w-full items-start gap-3 text-left transition-colors',
            card ? 'rounded-2xl px-5 py-4 hover:bg-ivory/60 sm:px-6' : 'rounded-xl px-4 py-3 hover:bg-cream/50',
          )}
        >
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className={cn('text-ink', card ? 'font-display text-[1.4rem] leading-tight' : 'text-[0.9375rem] font-semibold')}>
                {title}
              </span>
              <ChangedDot changed={Boolean(changed)} />
            </span>
            {!open && preview && (
              <span className="mt-0.5 line-clamp-1 text-sm font-normal text-ink-soft">{preview}</span>
            )}
            {open && hint && <span className="mt-0.5 block text-sm font-normal text-ink-soft">{hint}</span>}
          </span>
          <ChevronDown
            className={cn('mt-1 size-5 shrink-0 text-ink-soft transition-transform duration-200', open && 'rotate-180')}
            aria-hidden
          />
        </button>
      </h3>
      <div id={panelId} hidden={!open} className={cn(card ? 'px-5 pb-6 sm:px-6' : 'px-4 pb-4')}>
        {children}
      </div>
    </section>
  )
}

function ObjectFields({ path, value }: { path: JsonPath; value: Record<string, unknown> }) {
  const { hidden } = useEditor()
  const entries = Object.entries(value).filter(([key]) => !isHidden(hidden, [...path, key]))
  return (
    <div className="space-y-5">
      {entries.map(([key, item]) => (
        <Field key={key} path={[...path, key]} value={item} />
      ))}
    </div>
  )
}

/* ─────────────────────────────── Lists ─────────────────────────────── */

function ItemControls({
  index,
  count,
  label,
  onMove,
  onRemove,
}: {
  index: number
  count: number
  label: string
  onMove: (to: number) => void
  onRemove: () => void
}) {
  const button =
    'grid size-9 place-items-center rounded-full text-ink-soft transition hover:bg-ink/[0.06] hover:text-ink disabled:pointer-events-none disabled:opacity-30'
  return (
    <div className="flex shrink-0 items-center">
      <button type="button" className={button} onClick={() => onMove(index - 1)} disabled={index === 0} aria-label={`Move ${label} up`}>
        <ArrowUp className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        className={button}
        onClick={() => onMove(index + 1)}
        disabled={index === count - 1}
        aria-label={`Move ${label} down`}
      >
        <ArrowDown className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        className={cn(button, 'hover:bg-blush hover:text-clay-dark')}
        onClick={onRemove}
        aria-label={`Remove ${label}`}
      >
        <Trash className="size-4" aria-hidden />
      </button>
    </div>
  )
}

function ListField({ path, value, hideLegend = false }: { path: JsonPath; value: unknown[]; hideLegend?: boolean }) {
  const { saved, template, labelRoot, listSamples, onChange } = useEditor()
  const confirm = useConfirm()
  const copy = describe(labelRoot, path)
  const savedList = getIn(saved, path)
  const changed = !deepEqual(savedList, value)
  const sample =
    value[0] ?? (getIn(template, path) as unknown[] | undefined)?.[0] ?? listSamples[path.filter((p) => typeof p === 'string').join('.')] ?? ''
  const objects = isObject(sample)
  const itemNoun = (copy.add ?? 'Add an item').replace(/^Add (an? )?/, '')

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return
    const next = [...value]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(path, next)
    // Keep keyboard focus on the item that moved.
    requestAnimationFrame(() => {
      const direction = to < from ? 'up' : 'down'
      const target =
        document.querySelector<HTMLButtonElement>(`[data-list="${path.join('.')}"][data-index="${to}"] [aria-label^="Move"][aria-label$="${direction}"]`) ??
        document.querySelector<HTMLButtonElement>(`[data-list="${path.join('.')}"][data-index="${to}"] [aria-label^="Move"]:not(:disabled)`)
      target?.focus()
    })
  }

  const remove = async (index: number) => {
    const text = previewText(value[index])
    const ok = await confirm({
      title: `Remove this ${itemNoun}?`,
      body: (
        <>
          {text && <span className="mb-2 block font-medium text-ink">“{text.length > 120 ? `${text.slice(0, 120)}…` : text}”</span>}
          It disappears from your website when you save. Until then you can still discard your changes.
        </>
      ),
      confirmLabel: 'Remove',
      tone: 'danger',
    })
    if (ok) onChange(path, value.filter((_, i) => i !== index))
  }

  const add = () => {
    onChange(path, [...value, blankCopy(sample)])
    requestAnimationFrame(() => {
      const items = document.querySelectorAll<HTMLElement>(`[data-list="${path.join('.')}"]`)
      items[items.length - 1]?.querySelector<HTMLElement>('input, textarea')?.focus()
    })
  }

  return (
    <fieldset className="min-w-0">
      <legend
        className={hideLegend ? 'sr-only' : 'flex w-full items-baseline justify-between gap-3 text-sm font-semibold text-ink'}
      >
        <span>{copy.label}</span>
        <ChangedDot changed={changed} />
      </legend>
      {copy.hint && !hideLegend && <FieldHint>{copy.hint}</FieldHint>}

      {value.length === 0 ? (
        <p className={cn('rounded-xl border border-dashed border-line px-4 py-3 text-sm text-ink-soft', !hideLegend && 'mt-2')}>
          Nothing here yet.
        </p>
      ) : (
        <ol className={cn('space-y-2.5', !hideLegend && 'mt-2')}>
          {value.map((item, index) => {
            const itemPath = [...path, index]
            const label = `${itemNoun} ${index + 1}`
            return (
              <li key={index} data-list={path.join('.')} data-index={index}>
                {objects && isObject(item) ? (
                  <div className="rounded-xl border border-line bg-ivory/60">
                    <div className="flex items-center gap-2 border-b border-line py-1.5 pr-1.5 pl-4">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-clay ring-1 ring-line">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                        {previewText(item) || <span className="font-normal text-ink-soft italic">New {itemNoun}</span>}
                      </span>
                      <ItemControls
                        index={index}
                        count={value.length}
                        label={label}
                        onMove={(to) => move(index, to)}
                        onRemove={() => remove(index)}
                      />
                    </div>
                    <div className="p-4">
                      <ObjectFields path={itemPath} value={item} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-1.5">
                    <span className="mt-2.5 grid size-6 shrink-0 place-items-center rounded-full bg-cream text-xs font-bold text-clay">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <ListText path={itemPath} value={typeof item === 'string' ? item : ''} label={label} long={Boolean(copy.long)} />
                    </div>
                    <div className="mt-1">
                      <ItemControls
                        index={index}
                        count={value.length}
                        label={label}
                        onMove={(to) => move(index, to)}
                        onRemove={() => remove(index)}
                      />
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      )}

      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full border border-dashed border-clay/40 px-4 text-sm font-semibold text-clay transition hover:border-clay hover:bg-clay/5"
      >
        <Plus className="size-4" aria-hidden />
        {copy.add ?? 'Add an item'}
      </button>
    </fieldset>
  )
}

/** One line of a text list (no visible label — the number and the list title describe it). */
function ListText({ path, value, label, long }: { path: JsonPath; value: string; label: string; long: boolean }) {
  const { saved, template, onChange } = useEditor()
  const savedValue = getIn(saved, path)
  const templateValue = getIn(template, path)
  const multiline =
    long ||
    (typeof templateValue === 'string' && templateValue.length > 80) ||
    (typeof savedValue === 'string' && savedValue.length > 80)
  return multiline ? (
    <AutoTextarea aria-label={label} value={value} onChange={(event) => onChange(path, event.target.value)} minRows={2} />
  ) : (
    <input
      type="text"
      aria-label={label}
      value={value}
      onChange={(event) => onChange(path, event.target.value)}
      className={inputStyles}
      autoComplete="off"
    />
  )
}

/* ───────────────────────────── Dispatcher ──────────────────────────── */

export function Field({ path, value, bare = false }: { path: JsonPath; value: unknown; bare?: boolean }) {
  const { saved, labelRoot } = useEditor()
  if (typeof value === 'string') return <TextField path={path} value={value} hideLabel={bare} />
  if (Array.isArray(value)) return <ListField path={path} value={value} hideLegend={bare} />
  if (isObject(value)) {
    const copy = describe(labelRoot, path)
    return (
      <Collapsible
        level="nested"
        title={copy.label}
        hint={copy.hint}
        preview={previewText(value)}
        changed={!deepEqual(getIn(saved, path), value)}
      >
        <ObjectFields path={path} value={value} />
      </Collapsible>
    )
  }
  return null
}

/**
 * Fields of a top-level card. A card holding a single text or list doesn't
 * repeat its title as a label (`bare`).
 */
export function GroupFields({ path, value, bare = false }: { path: JsonPath; value: unknown; bare?: boolean }) {
  if (isObject(value)) return <ObjectFields path={path} value={value} />
  return <Field path={path} value={value} bare={bare || Array.isArray(value)} />
}
