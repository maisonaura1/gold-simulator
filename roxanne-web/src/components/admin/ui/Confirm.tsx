'use client'

import { TriangleAlert } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Modal } from '@/components/ui/Modal'
import { AdminButton } from './primitives'

export interface ConfirmOptions {
  title: string
  body?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** Destructive actions get a warning icon and a red-clay button. */
  tone?: 'danger' | 'default'
}

type Confirm = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<Confirm | null>(null)

/** `if (await confirm({ title: 'Delete?' })) …` */
export function useConfirm(): Confirm {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used inside <ConfirmProvider>')
  return ctx
}

interface Pending {
  options: ConfirmOptions
  resolve: (confirmed: boolean) => void
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null)
  const titleId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const confirm = useCallback<Confirm>(
    (options) => new Promise<boolean>((resolve) => setPending({ options, resolve })),
    [],
  )

  const settle = (confirmed: boolean) => {
    pending?.resolve(confirmed)
    setPending(null)
  }

  // The dialog opens in the Modal's effect; move focus to the safe choice afterwards.
  useEffect(() => {
    if (!pending) return
    const frame = requestAnimationFrame(() => cancelRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [pending])

  const options = pending?.options
  const danger = options?.tone === 'danger'

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal open={Boolean(pending)} onClose={() => settle(false)} labelledBy={titleId}>
        <div className="p-7 sm:p-9">
          <div className="flex items-start gap-4 pr-10">
            {danger && (
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-blush text-clay-dark" aria-hidden>
                <TriangleAlert className="size-5" />
              </span>
            )}
            <div>
              <h2 id={titleId} className="font-display text-[1.75rem] leading-tight text-ink">
                {options?.title}
              </h2>
              {options?.body && <div className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{options.body}</div>}
            </div>
          </div>
          <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AdminButton ref={cancelRef} variant="secondary" onClick={() => settle(false)}>
              {options?.cancelLabel ?? 'Cancel'}
            </AdminButton>
            <AdminButton variant={danger ? 'danger-solid' : 'primary'} onClick={() => settle(true)}>
              {options?.confirmLabel ?? 'Confirm'}
            </AdminButton>
          </div>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  )
}
