'use client'

import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  labelledBy: string
  children: ReactNode
  className?: string
  size?: 'md' | 'lg'
}

/**
 * Native <dialog>: focus is trapped, the page behind is inert, Esc closes it
 * and the browser restores focus to the trigger. Animations live in globals.css.
 */
export function Modal({ open, onClose, labelledBy, children, className, size = 'md' }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      className={cn(
        'rx-modal m-auto max-h-[calc(100dvh-2rem)] w-[calc(100vw-1.5rem)] overflow-visible bg-transparent p-0 text-ink',
        size === 'md' ? 'max-w-xl' : 'max-w-3xl',
      )}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={onClose}
      onClick={(event) => {
        // Clicks on the backdrop target the <dialog> element itself.
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className={cn(
          'relative max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-[1.75rem] bg-ivory shadow-lift ring-1 ring-ink/5',
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-ivory/80 text-ink-soft backdrop-blur transition hover:bg-cream hover:text-ink"
          aria-label="Close"
        >
          <X className="size-5" aria-hidden />
        </button>
        {children}
      </div>
    </dialog>
  )
}
