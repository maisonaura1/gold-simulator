'use client'

import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react'
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ToastTone = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  tone: ToastTone
  message: string
}

interface ToastApi {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

const ICONS: Record<ToastTone, ReactNode> = {
  success: <CircleCheck className="size-5 text-sage-dark" aria-hidden />,
  error: <TriangleAlert className="size-5 text-clay-dark" aria-hidden />,
  info: <Info className="size-5 text-ink-soft" aria-hidden />,
}

/**
 * Short confirmations ("Saved") in two always-present live regions, so
 * screen readers announce them: polite for success/info, assertive for errors.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((toast) => toast.id !== id)), [])

  const show = useCallback(
    (tone: ToastTone, message: string) => {
      counter.current += 1
      const id = counter.current
      setToasts((list) => [...list.filter((toast) => toast.message !== message).slice(-2), { id, tone, message }])
      window.setTimeout(() => dismiss(id), tone === 'error' ? 8000 : 4500)
    },
    [dismiss],
  )

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => show('success', message),
      error: (message) => show('error', message),
      info: (message) => show('info', message),
    }),
    [show],
  )

  const region = (tones: ToastTone[], live: 'polite' | 'assertive') => (
    <div aria-live={live} role={live === 'assertive' ? 'alert' : 'status'} className="flex flex-col items-center gap-2">
      {toasts
        .filter((toast) => tones.includes(toast.tone))
        .map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border bg-white py-3 pr-2 pl-4 text-sm text-ink shadow-lift',
              'animate-[toast-in_0.35s_var(--ease-out-expo)] motion-reduce:animate-none',
              toast.tone === 'error' ? 'border-clay/30' : 'border-line',
            )}
          >
            <span className="mt-0.5 shrink-0">{ICONS[toast.tone]}</span>
            <p className="flex-1 py-0.5 leading-relaxed">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="grid size-8 shrink-0 place-items-center rounded-full text-ink-soft transition hover:bg-ink/[0.05] hover:text-ink"
              aria-label="Dismiss notification"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        ))}
    </div>
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col gap-2 px-4 lg:bottom-6">
        <style>{'@keyframes toast-in{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}'}</style>
        {region(['success', 'info'], 'polite')}
        {region(['error'], 'assertive')}
      </div>
    </ToastContext.Provider>
  )
}
