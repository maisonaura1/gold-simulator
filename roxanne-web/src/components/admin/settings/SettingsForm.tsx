'use client'

import { AtSign, Bell, CalendarDays, ExternalLink, Save, Share2 } from 'lucide-react'
import { useState, useTransition, type ReactNode } from 'react'
import { FacebookIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon, YouTubeIcon } from '@/components/icons/brand'
import { saveSiteSettings, type EditableSettings } from '@/lib/admin/actions/settings'
import { deepEqual } from '@/lib/admin/json'
import { UNEXPECTED_ERROR, type FieldErrors } from '@/lib/admin/types'
import { cn } from '@/lib/cn'
import { AdminButton, Callout, Card, CardHeader, FieldError, FieldHint, FieldLabel, Switch, inputStyles } from '../ui/primitives'
import { useToast } from '../ui/Toast'
import { useUnsavedChanges } from '../ui/UnsavedChanges'

type SocialKey = keyof EditableSettings['socials']

const SOCIALS: { key: SocialKey; label: string; placeholder: string; icon: ReactNode }[] = [
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/in/your-name', icon: <LinkedInIcon className="size-4" /> },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/your-name', icon: <InstagramIcon className="size-4" /> },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://www.facebook.com/your-page', icon: <FacebookIcon className="size-4" /> },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://www.youtube.com/@your-channel', icon: <YouTubeIcon className="size-4" /> },
]

function digits(value: string) {
  return value.replace(/\D/g, '')
}

function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string
  label: string
  hint?: ReactNode
  error?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <div className="mt-1.5">{children}</div>
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : hint && <FieldHint id={`${id}-hint`}>{hint}</FieldHint>}
    </div>
  )
}

export function SettingsForm({ initial, emailConfigured }: { initial: EditableSettings; emailConfigured: boolean }) {
  const toast = useToast()
  const [saved, setSaved] = useState(initial)
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [pending, startTransition] = useTransition()
  const dirty = !deepEqual(values, saved)
  useUnsavedChanges(dirty)

  const clearError = (key: string) => {
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }
  const set = <K extends keyof EditableSettings>(key: K, value: EditableSettings[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    clearError(key)
  }
  const setSocial = (key: SocialKey, value: string) => {
    setValues((current) => ({ ...current, socials: { ...current.socials, [key]: value } }))
    clearError(`socials.${key}`)
  }

  const described = (id: string, hasHint = true) => (errors[id] ? `${id}-error` : hasHint ? `${id}-hint` : undefined)
  const inputProps = (key: string, hasHint = true) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': described(key, hasHint),
  })

  const waDigits = digits(values.whatsappNumber)

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        startTransition(async () => {
          try {
            const result = await saveSiteSettings(null, data)
            if (result?.ok) {
              setErrors({})
              setSaved(result.settings)
              setValues(result.settings)
              toast.success('Settings saved — your website is updated.')
            } else if (result) {
              setErrors(result.fieldErrors ?? {})
              toast.error(result.error)
              const first = Object.keys(result.fieldErrors ?? {})[0]
              if (first) document.getElementById(first)?.focus()
            }
          } catch {
            toast.error(UNEXPECTED_ERROR)
          }
        })
      }}
      className="space-y-6"
    >
      <Card className="scroll-mt-24 p-5 sm:p-7" id="contact" aria-labelledby="contact-title">
        <CardHeader id="contact-title" icon={<AtSign />} title="Contact details" description="Shown on your Contact page and in the footer." />
        <div className="mt-6 space-y-5">
          <Field id="email" label="Email address" hint="Where visitors can write to you." error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => set('email', event.target.value)}
              className={inputStyles}
              {...inputProps('email')}
            />
          </Field>
          <Field
            id="whatsappNumber"
            label="WhatsApp number"
            hint="With the country code, for example +1 586 850 5625. Used for the WhatsApp buttons."
            error={errors.whatsappNumber}
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="whatsappNumber"
                name="whatsappNumber"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={values.whatsappNumber}
                onChange={(event) => set('whatsappNumber', event.target.value)}
                className={cn(inputStyles, 'sm:flex-1')}
                {...inputProps('whatsappNumber')}
              />
              <a
                href={waDigits.length >= 7 ? `https://wa.me/${waDigits}` : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={waDigits.length < 7}
                className={cn(
                  'inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink transition hover:border-ink/25',
                  waDigits.length < 7 && 'pointer-events-none opacity-50',
                )}
              >
                <WhatsAppIcon className="size-4 text-[#1f9e57]" />
                Test link
                <span className="sr-only">(opens WhatsApp in a new tab)</span>
              </a>
            </div>
          </Field>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-ivory/60 p-4">
            <Switch name="showPhone" checked={values.showPhone} onChange={(event) => set('showPhone', event.target.checked)} />
            <span>
              <span className="block text-sm font-semibold text-ink">Show my phone number on the Contact page</span>
              <span className="mt-0.5 block text-[0.8125rem] leading-relaxed text-ink-soft">
                The WhatsApp button is always shown. Turn this off to hide the number itself.
              </span>
            </span>
          </label>
        </div>
      </Card>

      <Card className="scroll-mt-24 p-5 sm:p-7" id="booking" aria-labelledby="booking-title">
        <CardHeader
          id="booking-title"
          icon={<CalendarDays />}
          title="Online booking"
          description="The Calendly page where visitors book their free consultation."
        />
        <div className="mt-6">
          <Field
            id="calendlyUrl"
            label="Calendly booking link"
            optional
            hint={
              <>
                Starts with https://calendly.com/ — find it in Calendly under “Copy link” on your consultation event.{' '}
                {values.calendlyUrl && (
                  <a href={values.calendlyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-clay">
                    Open it
                    <ExternalLink className="size-3" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </>
            }
            error={errors.calendlyUrl}
          >
            <input
              id="calendlyUrl"
              name="calendlyUrl"
              type="url"
              inputMode="url"
              placeholder="https://calendly.com/your-name/free-consultation"
              value={values.calendlyUrl}
              onChange={(event) => set('calendlyUrl', event.target.value)}
              className={inputStyles}
              {...inputProps('calendlyUrl')}
            />
          </Field>
        </div>
      </Card>

      <Card className="scroll-mt-24 p-5 sm:p-7" id="socials" aria-labelledby="socials-title">
        <CardHeader
          id="socials-title"
          icon={<Share2 />}
          title="Social profiles"
          description="Links shown in the footer. Leave a box empty to hide that icon."
        />
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {SOCIALS.map((social) => {
            const key = `socials.${social.key}`
            return (
              <div key={social.key}>
                <label htmlFor={key} className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <span className="text-ink-soft">{social.icon}</span>
                  {social.label}
                  <span className="font-normal text-ink-soft">(optional)</span>
                </label>
                <input
                  id={key}
                  name={social.key}
                  type="url"
                  inputMode="url"
                  placeholder={social.placeholder}
                  value={values.socials[social.key]}
                  onChange={(event) => setSocial(social.key, event.target.value)}
                  className={cn(inputStyles, 'mt-1.5')}
                  aria-invalid={errors[key] ? true : undefined}
                  aria-describedby={errors[key] ? `${key}-error` : undefined}
                />
                <FieldError id={`${key}-error`}>{errors[key]}</FieldError>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="scroll-mt-24 p-5 sm:p-7" id="notifications" aria-labelledby="notifications-title">
        <CardHeader id="notifications-title" icon={<Bell />} title="Email notifications" />
        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-ivory/60 p-4">
          <Switch name="notifyByEmail" checked={values.notifyByEmail} onChange={(event) => set('notifyByEmail', event.target.checked)} />
          <span>
            <span className="block text-sm font-semibold text-ink">Email me when someone sends a message</span>
            <span className="mt-0.5 block text-[0.8125rem] leading-relaxed text-ink-soft">
              Every message is always saved in Dashboard → Messages as well.
            </span>
          </span>
        </label>
        {emailConfigured ? (
          <p className="mt-3 text-[0.8125rem] text-sage-dark">Email sending is set up on the server.</p>
        ) : (
          <Callout tone="info" className="mt-4" title="Email sending isn’t set up yet">
            To receive these emails, your web team needs to add a <code>RESEND_API_KEY</code> (from resend.com) to the
            server settings. Until then, check your messages here.
          </Callout>
        )}
      </Card>

      <div className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-20 lg:bottom-5">
        <div
          className={cn(
            'flex items-center gap-3 rounded-2xl border bg-white/95 px-4 py-3 shadow-lift backdrop-blur-md sm:px-5',
            dirty ? 'border-clay/35' : 'border-line',
          )}
        >
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-soft" aria-live="polite">
            {dirty ? <span className="text-ink">Unsaved changes</span> : 'All settings saved'}
          </p>
          <AdminButton type="submit" size="sm" variant="primary" pending={pending} disabled={!dirty}>
            {!pending && <Save aria-hidden />}
            {pending ? 'Saving…' : 'Save settings'}
          </AdminButton>
        </div>
      </div>
    </form>
  )
}
