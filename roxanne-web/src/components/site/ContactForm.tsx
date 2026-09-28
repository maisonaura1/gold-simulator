'use client'

import Link from 'next/link'
import { CircleCheck, LoaderCircle, Send } from 'lucide-react'
import { useActionState, useEffect, useId, useRef, useSyncExternalStore } from 'react'
import { sendContactMessage, type ContactField, type ContactState } from '@/app/(site)/contact/actions'
import type { SiteContent } from '@/content/types'
import { WhatsAppIcon } from '@/components/icons/brand'
import { cn } from '@/lib/cn'
import { whatsappHref } from '@/lib/site'
import { useSite } from './site-context'

const initialState: ContactState = { status: 'idle' }

const noopSubscribe = () => () => {}

/** Maps ?topic=… (course slug or "freelance") to one of the form's topics. */
function topicFromQuery(query: string, topics: string[]): string | undefined {
  if (!query) return undefined
  const words = query.toLowerCase().split(/[-\s]+/).filter((w) => w.length > 3)
  // Pick the topic matching the most words ("legal-english" → "Legal English", not "Business English").
  let best: { topic: string; score: number } | undefined
  for (const topic of topics) {
    const score = words.filter((w) => topic.toLowerCase().includes(w)).length
    if (score > 0 && (!best || score > best.score)) best = { topic, score }
  }
  return best?.topic
}

export function ContactForm({ copy }: { copy: SiteContent['contact']['form'] }) {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState)
  const { openConsultation, data } = useSite()
  const startedAt = useRef<HTMLInputElement>(null)
  const id = useId()

  // The page is static, so the ?topic= preset is read on the client only.
  const query = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get('topic') ?? '',
    () => '',
  )
  // Uncontrolled on purpose: React resets forms after each action, and a
  // defaultValue survives that reset where a controlled value would not.
  const presetTopic = topicFromQuery(query, copy.topics) ?? ''
  const defaultTopic = state.values?.topic ?? presetTopic
  const source = query === 'freelance' ? 'freelance-page' : 'contact-page'

  // Time-to-submit spam check: stamp when the form became interactive.
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now())
  }, [])

  if (state.status === 'success') {
    const wa = whatsappHref(data.whatsappNumber, data.global.whatsappMessage)
    return (
      <div role="status" className="flex flex-col items-start rounded-[2rem] bg-navy p-8 text-ivory sm:p-12">
        <CircleCheck className="size-12 text-clay-soft" aria-hidden />
        <h3 className="mt-6 font-display text-4xl leading-tight">{copy.successTitle}</h3>
        <p className="mt-4 max-w-md text-ivory/75">{copy.successBody}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={openConsultation}
            className="inline-flex h-12 items-center justify-center rounded-full bg-ivory px-7 font-semibold text-ink transition hover:bg-white"
          >
            {data.global.consultationCta}
          </button>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ivory/30 px-6 font-semibold transition hover:bg-ivory/10"
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    )
  }

  const error = (field: ContactField) => state.fieldErrors?.[field]
  const describedBy = (field: ContactField) => (error(field) ? `${id}-${field}-error` : undefined)
  const fieldClass = (field: ContactField) =>
    cn(
      'mt-2 block w-full rounded-2xl border bg-white/80 px-4 py-3.5 text-ink shadow-[inset_0_1px_2px_rgb(31_37_51/0.04)] transition placeholder:text-ink-soft/60 focus:border-clay focus:bg-white focus:outline-none focus:ring-4 focus:ring-clay/10',
      error(field) ? 'border-clay' : 'border-line',
    )

  return (
    <form action={formAction} noValidate className="space-y-5" aria-describedby={state.message ? `${id}-form-error` : undefined}>
      {/* Honeypot — hidden from people, irresistible to bots */}
      <div aria-hidden className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />
      <input type="hidden" name="source" value={source} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="text-sm font-semibold">
            {copy.nameLabel}
          </label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            defaultValue={state.values?.name}
            aria-invalid={Boolean(error('name'))}
            aria-describedby={describedBy('name')}
            className={fieldClass('name')}
          />
          <FieldError id={`${id}-name-error`} message={error('name')} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="text-sm font-semibold">
            {copy.emailLabel}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            defaultValue={state.values?.email}
            aria-invalid={Boolean(error('email'))}
            aria-describedby={describedBy('email')}
            className={fieldClass('email')}
          />
          <FieldError id={`${id}-email-error`} message={error('email')} />
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-topic`} className="text-sm font-semibold">
          {copy.topicLabel}
        </label>
        <select
          key={presetTopic}
          id={`${id}-topic`}
          name="topic"
          defaultValue={defaultTopic}
          className={cn(fieldClass('topic'), 'appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3E%3Cpath d=%27M4 6l4 4 4-4%27 fill=%27none%27 stroke=%27%234a5162%27 stroke-width=%271.5%27/%3E%3C/svg%3E")] bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10')}
        >
          <option value="">—</option>
          {copy.topics.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${id}-message`} className="text-sm font-semibold">
          {copy.messageLabel}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={6}
          maxLength={5000}
          defaultValue={state.values?.message}
          aria-invalid={Boolean(error('message'))}
          aria-describedby={describedBy('message')}
          className={cn(fieldClass('message'), 'resize-y')}
        />
        <FieldError id={`${id}-message-error`} message={error('message')} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={Boolean(error('consent'))}
            aria-describedby={describedBy('consent')}
            className="mt-1 size-4 shrink-0 accent-clay"
          />
          <span>
            {copy.consentLabel}{' '}
            <Link href="/privacy" className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-clay">
              Read the Privacy Policy
            </Link>
          </span>
        </label>
        <FieldError id={`${id}-consent-error`} message={error('consent')} />
      </div>

      {state.message && (
        <p id={`${id}-form-error`} role="alert" className="rounded-2xl bg-blush/60 px-4 py-3 text-sm text-clay-dark">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-clay px-8 font-semibold text-white shadow-[0_12px_30px_-14px_rgb(165_83_58/0.8)] transition hover:bg-clay-dark disabled:opacity-70 sm:w-auto"
      >
        {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : <Send className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />}
        {pending ? 'Sending…' : copy.submitLabel}
      </button>
    </form>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 text-sm font-medium text-clay-dark">
      {message}
    </p>
  )
}
