'use client'

import { Eye, EyeOff, Link2, Unplug } from 'lucide-react'
import { useState, useTransition } from 'react'
import { applyCalendlySchedulingLink, connectCalendly, disconnectCalendly } from '@/lib/admin/actions/meetings'
import { UNEXPECTED_ERROR } from '@/lib/admin/types'
import { cn } from '@/lib/cn'
import { useConfirm } from '../ui/Confirm'
import { AdminButton, FieldError, FieldHint, FieldLabel, inputStyles } from '../ui/primitives'
import { useToast } from '../ui/Toast'

/** Paste a Personal Access Token → checked with Calendly → stored on the server (never sent back). */
export function ConnectForm({ reconnect = false }: { reconnect?: boolean }) {
  const toast = useToast()
  const [pending, start] = useTransition()
  const [token, setToken] = useState('')
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState<string>()

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        start(async () => {
          try {
            const result = await connectCalendly(null, data)
            if (result?.ok) {
              setError(undefined)
              setToken('')
              toast.success(`Connected to Calendly as ${result.name}.`)
            } else {
              setError(result?.fieldErrors?.token ?? result?.error ?? UNEXPECTED_ERROR)
            }
          } catch {
            setError(UNEXPECTED_ERROR)
          }
        })
      }}
      className="space-y-3"
    >
      <div>
        <FieldLabel htmlFor="calendly-token">{reconnect ? 'New personal access token' : 'Personal access token'}</FieldLabel>
        <div className="relative mt-2">
          <input
            id="calendly-token"
            name="token"
            type={visible ? 'text' : 'password'}
            value={token}
            onChange={(event) => setToken(event.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Paste your token here"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'calendly-token-error' : 'calendly-token-hint'}
            className={cn(inputStyles, 'pr-12 font-mono text-sm')}
          />
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? 'Hide token' : 'Show token'}
            aria-controls="calendly-token"
            className="absolute inset-y-0 right-1 my-auto grid size-10 place-items-center rounded-lg text-ink-soft hover:text-ink"
          >
            {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        </div>
        {error ? (
          <FieldError id="calendly-token-error">{error}</FieldError>
        ) : (
          <FieldHint id="calendly-token-hint">It stays private on your website’s server and is never shown again.</FieldHint>
        )}
      </div>
      <AdminButton type="submit" variant="primary" pending={pending} disabled={!token.trim()}>
        <Link2 aria-hidden />
        {pending ? 'Checking with Calendly…' : reconnect ? 'Reconnect' : 'Connect Calendly'}
      </AdminButton>
    </form>
  )
}

export function DisconnectButton() {
  const toast = useToast()
  const confirm = useConfirm()
  const [pending, start] = useTransition()

  return (
    <AdminButton
      size="sm"
      variant="danger"
      pending={pending}
      onClick={async () => {
        const ok = await confirm({
          title: 'Disconnect Calendly?',
          body: 'Your meetings will no longer be shown in the dashboard. Your Calendly account and the booking link on your website are not affected.',
          confirmLabel: 'Disconnect',
          tone: 'danger',
        })
        if (!ok) return
        start(async () => {
          try {
            const result = await disconnectCalendly()
            if (result.ok) toast.success('Calendly disconnected.')
            else toast.error(result.error)
          } catch {
            toast.error(UNEXPECTED_ERROR)
          }
        })
      }}
    >
      <Unplug aria-hidden />
      Disconnect
    </AdminButton>
  )
}

export function UseSchedulingLinkButton({ url }: { url: string }) {
  const toast = useToast()
  const [pending, start] = useTransition()
  return (
    <AdminButton
      size="sm"
      variant="primary"
      pending={pending}
      onClick={() =>
        start(async () => {
          try {
            const result = await applyCalendlySchedulingLink()
            if (result.ok) toast.success('Your booking link is now on your website.')
            else toast.error(result.error)
          } catch {
            toast.error(UNEXPECTED_ERROR)
          }
        })
      }
    >
      Use {url.replace(/^https:\/\//, '')}
    </AdminButton>
  )
}
