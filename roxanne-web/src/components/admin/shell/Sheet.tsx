'use client'

import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Bottom sheet for phones, built on the native <dialog> (focus trap, Esc,
 * inert page behind). Slides up from the bottom edge.
 */
export function Sheet({
  open,
  onClose,
  labelledBy,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  labelledBy: string
  title: string
  children: ReactNode
}) {
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
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-0 mt-auto max-h-[85dvh] w-full max-w-none translate-y-full overflow-y-auto rounded-t-[1.75rem] bg-ivory p-0 pb-[env(safe-area-inset-bottom)] text-ink shadow-lift transition-[translate,overlay,display] transition-discrete duration-300 ease-out-expo backdrop:bg-navy/45 backdrop:backdrop-blur-[3px] open:translate-y-0 starting:open:translate-y-full motion-reduce:transition-none lg:hidden"
    >
      <div className="sticky top-0 flex items-center justify-between bg-ivory px-5 pt-3 pb-2">
        <span aria-hidden className="absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-ink/15" />
        <h2 id={labelledBy} className="pt-3 font-display text-2xl">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 grid size-10 place-items-center rounded-full text-ink-soft transition hover:bg-ink/[0.05] hover:text-ink"
          aria-label="Close menu"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <div className="px-3 pt-1 pb-5">{children}</div>
    </dialog>
  )
}
