'use client'

import { ArrowDown, ArrowUp, Eye, EyeOff, MessageSquareQuote, Pencil, Plus, Trash } from 'lucide-react'
import { useId, useOptimistic, useState, useTransition } from 'react'
import { Modal } from '@/components/ui/Modal'
import type { Testimonial } from '@/content/types'
import {
  deleteTestimonial,
  moveTestimonial,
  saveTestimonial,
  setTestimonialPublished,
  type TestimonialInput,
} from '@/lib/admin/actions/testimonials'
import { UNEXPECTED_ERROR, type ActionResult, type FieldErrors } from '@/lib/admin/types'
import { cn } from '@/lib/cn'
import { AutoTextarea } from '../ui/AutoTextarea'
import { useConfirm } from '../ui/Confirm'
import { AdminButton, Badge, Callout, Card, EmptyState, FieldError, FieldHint, FieldLabel, Switch, inputStyles } from '../ui/primitives'
import { useToast } from '../ui/Toast'

type Change =
  | { type: 'publish'; id: string; published: boolean }
  | { type: 'move'; id: string; direction: 'up' | 'down' }
  | { type: 'delete'; id: string }

function applyChange(list: Testimonial[], change: Change): Testimonial[] {
  if (change.type === 'delete') return list.filter((t) => t.id !== change.id)
  if (change.type === 'publish') return list.map((t) => (t.id === change.id ? { ...t, published: change.published } : t))
  const from = list.findIndex((t) => t.id === change.id)
  const to = change.direction === 'up' ? from - 1 : from + 1
  if (from < 0 || to < 0 || to >= list.length) return list
  const next = [...list]
  ;[next[from], next[to]] = [next[to], next[from]]
  return next
}

const FORMAT_RULE = 'Only real testimonials from clients who agreed to be quoted. Format: Quote + Name, Role, City/Country.'

/**
 * Flips instantly (local state) and follows the saved value when it changes
 * on the server — without remounting, so keyboard focus stays on it.
 */
function PublishSwitch({ published, onToggle }: { published: boolean; onToggle: (next: boolean) => void }) {
  const [on, setOn] = useState(published)
  const [saved, setSaved] = useState(published)
  if (published !== saved) {
    setSaved(published)
    setOn(published)
  }
  return (
    <Switch
      checked={on}
      onChange={(event) => {
        setOn(event.target.checked)
        onToggle(event.target.checked)
      }}
    />
  )
}

export function TestimonialsManager({ testimonials, openNew }: { testimonials: Testimonial[]; openNew: boolean }) {
  const toast = useToast()
  const confirm = useConfirm()
  const [, startTransition] = useTransition()
  const [items, applyOptimistic] = useOptimistic(testimonials, applyChange)
  const [dialog, setDialog] = useState<{ open: boolean; testimonial: Testimonial | null; key: number }>({
    open: openNew,
    testimonial: null,
    key: 0,
  })
  const titleId = useId()
  const published = items.filter((t) => t.published).length

  const run = (change: Change, action: () => Promise<ActionResult>, success?: string) => {
    startTransition(async () => {
      applyOptimistic(change)
      try {
        const result = await action()
        if (!result.ok) toast.error(result.error)
        else if (success) toast.success(success)
      } catch {
        toast.error(UNEXPECTED_ERROR)
      }
    })
  }

  const openEditor = (testimonial: Testimonial | null) => setDialog({ open: true, testimonial, key: Date.now() })

  const closeEditor = () => {
    setDialog((current) => ({ ...current, open: false }))
    if (window.location.search.includes('new=1')) window.history.replaceState(null, '', window.location.pathname)
  }

  const remove = async (testimonial: Testimonial) => {
    const ok = await confirm({
      title: 'Delete this testimonial?',
      body: (
        <>
          The testimonial from <strong className="text-ink">{testimonial.name}</strong> will be removed from your
          dashboard{testimonial.published ? ' and your website' : ''}. You can’t undo this.
        </>
      ),
      confirmLabel: 'Delete testimonial',
      tone: 'danger',
    })
    if (ok) run({ type: 'delete', id: testimonial.id }, () => deleteTestimonial(testimonial.id), 'Testimonial deleted.')
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-[2.25rem] leading-[1.1] text-ink sm:text-[2.75rem]">Testimonials</h1>
          <p className="mt-2.5 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-soft">
            Kind words from your clients, shown on your home page in the order below.
          </p>
        </div>
        {items.length > 0 && (
          <AdminButton variant="primary" onClick={() => openEditor(null)}>
            <Plus aria-hidden />
            Add testimonial
          </AdminButton>
        )}
      </header>

      {items.length > 0 && (
        <Callout
          tone={published > 0 ? 'success' : 'info'}
          title={
            published > 0
              ? `${published} published — the Testimonials section is shown on your home page.`
              : 'None published yet — the Testimonials section stays hidden on your website.'
          }
        >
          The section appears as soon as at least one testimonial is published. {FORMAT_RULE}
        </Callout>
      )}

      {items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<MessageSquareQuote />}
            title="No testimonials yet"
            action={
              <AdminButton variant="primary" onClick={() => openEditor(null)}>
                <Plus aria-hidden />
                Add your first testimonial
              </AdminButton>
            }
          >
            <p>{FORMAT_RULE}</p>
            <p className="mt-2">
              Your home page shows a Testimonials section only once at least one testimonial is published.
            </p>
          </EmptyState>
        </Card>
      ) : (
        <ol className="space-y-3">
          {items.map((testimonial, index) => (
            <li key={testimonial.id}>
              <Card as="article" className={cn('p-5 sm:p-6', !testimonial.published && 'bg-white/60')}>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-ink-soft tabular-nums">#{index + 1}</span>
                      {testimonial.published ? (
                        <Badge tone="sage">
                          <Eye aria-hidden />
                          On your website
                        </Badge>
                      ) : (
                        <Badge tone="muted">
                          <EyeOff aria-hidden />
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <blockquote
                      className={cn(
                        'mt-3 font-display text-[1.35rem] leading-snug [overflow-wrap:anywhere]',
                        testimonial.published ? 'text-ink' : 'text-ink-soft',
                      )}
                    >
                      “{testimonial.quote}”
                    </blockquote>
                    <p className="mt-3 text-sm">
                      <span className="font-semibold text-ink">{testimonial.name}</span>
                      <span className="text-ink-soft">
                        {[testimonial.role, testimonial.location].filter(Boolean).map((part) => ` · ${part}`)}
                      </span>
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-row flex-wrap items-center gap-3 border-t border-line pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-ink">
                      <PublishSwitch
                        published={testimonial.published}
                        onToggle={(next) =>
                          run(
                            { type: 'publish', id: testimonial.id, published: next },
                            () => setTestimonialPublished(testimonial.id, next),
                            next ? 'Published on your website.' : 'Hidden from your website.',
                          )
                        }
                      />
                      Show on website
                    </label>
                    <div className="flex items-center gap-1 sm:mt-1">
                      <AdminButton
                        size="icon"
                        variant="ghost"
                        aria-label={`Move testimonial from ${testimonial.name} up`}
                        disabled={index === 0}
                        onClick={() =>
                          run({ type: 'move', id: testimonial.id, direction: 'up' }, () => moveTestimonial(testimonial.id, 'up'))
                        }
                      >
                        <ArrowUp aria-hidden />
                      </AdminButton>
                      <AdminButton
                        size="icon"
                        variant="ghost"
                        aria-label={`Move testimonial from ${testimonial.name} down`}
                        disabled={index === items.length - 1}
                        onClick={() =>
                          run({ type: 'move', id: testimonial.id, direction: 'down' }, () => moveTestimonial(testimonial.id, 'down'))
                        }
                      >
                        <ArrowDown aria-hidden />
                      </AdminButton>
                      <AdminButton size="sm" variant="secondary" onClick={() => openEditor(testimonial)}>
                        <Pencil aria-hidden />
                        Edit
                        <span className="sr-only"> testimonial from {testimonial.name}</span>
                      </AdminButton>
                      <AdminButton
                        size="icon"
                        variant="ghost"
                        className="hover:bg-blush hover:text-clay-dark"
                        aria-label={`Delete testimonial from ${testimonial.name}`}
                        onClick={() => remove(testimonial)}
                      >
                        <Trash aria-hidden />
                      </AdminButton>
                    </div>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      )}

      <Modal open={dialog.open} onClose={closeEditor} labelledBy={titleId}>
        <TestimonialForm
          key={dialog.key}
          titleId={titleId}
          testimonial={dialog.testimonial}
          onCancel={closeEditor}
          onSaved={(message) => {
            closeEditor()
            toast.success(message)
          }}
        />
      </Modal>
    </div>
  )
}

function TestimonialForm({
  titleId,
  testimonial,
  onCancel,
  onSaved,
}: {
  titleId: string
  testimonial: Testimonial | null
  onCancel: () => void
  onSaved: (message: string) => void
}) {
  const [values, setValues] = useState<TestimonialInput>({
    quote: testimonial?.quote ?? '',
    name: testimonial?.name ?? '',
    role: testimonial?.role ?? '',
    location: testimonial?.location ?? '',
    published: testimonial?.published ?? true,
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string>()
  const [pending, startTransition] = useTransition()

  const set = <K extends keyof TestimonialInput>(key: K, value: TestimonialInput[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    // Clear the message of a field as soon as it is being corrected.
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
    setFormError(undefined)
  }

  const submit = () => {
    startTransition(async () => {
      try {
        const result = await saveTestimonial({ ...values, ...(testimonial ? { id: testimonial.id } : {}) })
        if (result.ok) {
          onSaved(
            testimonial
              ? 'Testimonial updated.'
              : values.published
                ? 'Testimonial added and published on your website.'
                : 'Testimonial added (hidden for now).',
          )
        } else {
          setErrors(result.fieldErrors ?? {})
          setFormError(result.error)
        }
      } catch {
        setFormError(UNEXPECTED_ERROR)
      }
    })
  }

  return (
    <form
      className="p-6 sm:p-9"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
      noValidate
    >
      <h2 id={titleId} className="pr-12 font-display text-[2rem] leading-tight text-ink">
        {testimonial ? 'Edit testimonial' : 'Add a testimonial'}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{FORMAT_RULE}</p>

      <div className="mt-6 space-y-5">
        <div>
          <FieldLabel htmlFor="t-quote">Quote</FieldLabel>
          <div className="mt-1.5">
            <AutoTextarea
              id="t-quote"
              value={values.quote}
              onChange={(event) => set('quote', event.target.value)}
              minRows={4}
              placeholder="What your client said, in their own words"
              aria-invalid={errors.quote ? true : undefined}
              aria-describedby={errors.quote ? 't-quote-error' : undefined}
              maxLength={1500}
            />
          </div>
          <FieldError id="t-quote-error">{errors.quote}</FieldError>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="t-name">Name</FieldLabel>
            <input
              id="t-name"
              value={values.name}
              onChange={(event) => set('name', event.target.value)}
              className={cn(inputStyles, 'mt-1.5')}
              placeholder="e.g. Maria K."
              autoComplete="off"
              maxLength={120}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 't-name-error' : 't-name-hint'}
            />
            {errors.name ? (
              <FieldError id="t-name-error">{errors.name}</FieldError>
            ) : (
              <FieldHint id="t-name-hint">A first name and initial is fine.</FieldHint>
            )}
          </div>
          <div>
            <FieldLabel htmlFor="t-role" optional>
              Role
            </FieldLabel>
            <input
              id="t-role"
              value={values.role}
              onChange={(event) => set('role', event.target.value)}
              className={cn(inputStyles, 'mt-1.5')}
              placeholder="e.g. Senior Associate, law firm"
              autoComplete="off"
              maxLength={160}
            />
            <FieldError>{errors.role}</FieldError>
          </div>
        </div>
        <div>
          <FieldLabel htmlFor="t-location" optional>
            City / Country
          </FieldLabel>
          <input
            id="t-location"
            value={values.location}
            onChange={(event) => set('location', event.target.value)}
            className={cn(inputStyles, 'mt-1.5')}
            placeholder="e.g. Madrid, Spain"
            autoComplete="off"
            maxLength={120}
          />
          <FieldError>{errors.location}</FieldError>
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-white p-4">
          <Switch checked={values.published} onChange={(event) => set('published', event.target.checked)} />
          <span>
            <span className="block text-sm font-semibold text-ink">Show on my website</span>
            <span className="mt-0.5 block text-[0.8125rem] leading-relaxed text-ink-soft">
              Only if your client agreed to be quoted. You can hide it again at any time.
            </span>
          </span>
        </label>
      </div>

      {formError && (
        <p role="alert" className="mt-5 rounded-xl border border-clay/25 bg-blush/45 px-4 py-3 text-sm font-medium text-clay-dark">
          {formError}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <AdminButton variant="secondary" onClick={onCancel}>
          Cancel
        </AdminButton>
        <AdminButton type="submit" variant="primary" pending={pending}>
          {testimonial ? 'Save changes' : 'Add testimonial'}
        </AdminButton>
      </div>
    </form>
  )
}
