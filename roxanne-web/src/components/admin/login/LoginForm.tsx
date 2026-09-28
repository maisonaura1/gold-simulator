'use client'

import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useActionState, useEffect, useRef, useState } from 'react'
import { login, type LoginState } from '@/lib/admin/actions/auth'
import { cn } from '@/lib/cn'
import { AdminButton, FieldLabel, inputStyles } from '../ui/primitives'
import { SetupInstructions } from './SetupInstructions'

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, null)
  const [visible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // After a failed attempt the form is cleared: put the cursor back in the field.
  useEffect(() => {
    if (state) inputRef.current?.focus()
  }, [state])

  if (state?.reason === 'not-configured') return <SetupInstructions />

  return (
    <form action={formAction} noValidate>
      <span className="grid size-12 place-items-center rounded-2xl bg-cream text-clay" aria-hidden>
        <LockKeyhole className="size-5" />
      </span>
      <h1 className="mt-5 font-display text-[2.25rem] leading-tight text-ink">Welcome back</h1>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
        Sign in to update your website, read your messages and see your upcoming meetings.
      </p>

      <input type="hidden" name="next" value={next} />

      <div className="mt-8">
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <div className="relative mt-2">
          <input
            ref={inputRef}
            id="password"
            name="password"
            type={visible ? 'text' : 'password'}
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
            autoFocus
            aria-invalid={state ? true : undefined}
            aria-describedby={state ? 'login-error' : undefined}
            className={cn(inputStyles, 'h-12 pr-14')}
          />
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-controls="password"
            className="absolute inset-y-0 right-1.5 my-auto grid size-10 place-items-center rounded-lg text-ink-soft transition hover:bg-ink/[0.05] hover:text-ink"
          >
            {visible ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <div aria-live="polite">
        {state && (
          <p
            id="login-error"
            role="alert"
            className="mt-4 rounded-xl border border-clay/25 bg-blush/45 px-4 py-3 text-sm leading-relaxed font-medium text-clay-dark"
          >
            {state.error}
          </p>
        )}
      </div>

      <AdminButton type="submit" variant="primary" pending={pending} className="mt-6 h-12 w-full text-base">
        {pending ? 'Signing in…' : 'Sign in'}
      </AdminButton>

      <p className="mt-6 text-center text-[0.8125rem] leading-relaxed text-ink-soft">
        Forgot your password? Your web team can reset it for you.
      </p>
    </form>
  )
}
