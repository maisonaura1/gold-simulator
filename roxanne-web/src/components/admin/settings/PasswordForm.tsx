'use client'

import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { useState, useTransition } from 'react'
import { changePassword } from '@/lib/admin/actions/settings'
import { UNEXPECTED_ERROR, type FieldErrors } from '@/lib/admin/types'
import { cn } from '@/lib/cn'
import { AdminButton, Card, CardHeader, FieldError, FieldHint, FieldLabel, inputStyles } from '../ui/primitives'
import { useToast } from '../ui/Toast'

const EMPTY = { current: '', next: '', confirm: '' }

export function PasswordForm({ usesServerPassword }: { usesServerPassword: boolean }) {
  const toast = useToast()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string>()
  const [visible, setVisible] = useState(false)
  const [pending, startTransition] = useTransition()

  const fields: { key: keyof typeof EMPTY; label: string; autoComplete: string; hint?: string }[] = [
    { key: 'current', label: 'Current password', autoComplete: 'current-password' },
    {
      key: 'next',
      label: 'New password',
      autoComplete: 'new-password',
      hint: `At least 12 characters — a short sentence you’ll remember works well. ${values.next.length ? `(${values.next.length} so far)` : ''}`,
    },
    { key: 'confirm', label: 'Repeat the new password', autoComplete: 'new-password' },
  ]

  return (
    <Card className="scroll-mt-24 p-5 sm:p-7" id="password" aria-labelledby="password-title">
      <CardHeader
        id="password-title"
        icon={<KeyRound />}
        title="Dashboard password"
        description={
          usesServerPassword
            ? 'You are using the temporary password set up by your web team. Choose your own below.'
            : 'You chose your own password. You can change it again at any time.'
        }
      />
      <form
        noValidate
        className="mt-6 space-y-5"
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          startTransition(async () => {
            try {
              const result = await changePassword(null, data)
              if (result?.ok) {
                setValues(EMPTY)
                setErrors({})
                setFormError(undefined)
                toast.success('Password changed. Any other devices have been signed out.')
              } else if (result) {
                setErrors(result.fieldErrors ?? {})
                setFormError(result.fieldErrors ? undefined : result.error)
                const first = Object.keys(result.fieldErrors ?? {})[0]
                if (first) document.getElementById(`pw-${first}`)?.focus()
              }
            } catch {
              setFormError(UNEXPECTED_ERROR)
            }
          })
        }}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {fields.map((field) => (
            <div key={field.key}>
              <FieldLabel htmlFor={`pw-${field.key}`}>{field.label}</FieldLabel>
              <input
                id={`pw-${field.key}`}
                name={field.key}
                type={visible ? 'text' : 'password'}
                autoComplete={field.autoComplete}
                value={values[field.key]}
                onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                className={cn(inputStyles, 'mt-1.5')}
                aria-invalid={errors[field.key] ? true : undefined}
                aria-describedby={errors[field.key] ? `pw-${field.key}-error` : field.hint ? `pw-${field.key}-hint` : undefined}
                autoCapitalize="none"
                spellCheck={false}
              />
              {errors[field.key] ? (
                <FieldError id={`pw-${field.key}-error`}>{errors[field.key]}</FieldError>
              ) : (
                field.hint && <FieldHint id={`pw-${field.key}-hint`}>{field.hint}</FieldHint>
              )}
            </div>
          ))}
        </div>

        {formError && (
          <p role="alert" className="rounded-xl border border-clay/25 bg-blush/45 px-4 py-3 text-sm font-medium text-clay-dark">
            {formError}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            className="inline-flex items-center gap-2 self-start rounded-full px-1 py-1 text-sm font-semibold text-ink-soft hover:text-ink"
            aria-pressed={visible}
          >
            {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            Show passwords
          </button>
          <AdminButton
            type="submit"
            variant="primary"
            pending={pending}
            disabled={!values.current || !values.next || !values.confirm}
          >
            Change password
          </AdminButton>
        </div>
        <p className="text-[0.8125rem] leading-relaxed text-ink-soft">
          You stay signed in on this device; other devices are signed out.
          {usesServerPassword && ' After the change, the temporary password no longer works.'}
        </p>
      </form>
    </Card>
  )
}
