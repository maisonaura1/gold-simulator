'use client'

import Link from 'next/link'
import { createContext, useContext, useEffect, useMemo, useState, type ComponentProps, type ReactNode } from 'react'

/**
 * Warns before leaving a page with unsaved edits: `beforeunload` for reloads
 * and closing the tab, and `onNavigate` on dashboard links for in-app moves.
 */
interface UnsavedChangesApi {
  dirty: boolean
  setDirty: (dirty: boolean) => void
}

const UnsavedChangesContext = createContext<UnsavedChangesApi>({ dirty: false, setDirty: () => {} })

export const LEAVE_MESSAGE = 'You have unsaved changes. Leave this page without saving them?'

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const value = useMemo(() => ({ dirty, setDirty }), [dirty])
  return <UnsavedChangesContext.Provider value={value}>{children}</UnsavedChangesContext.Provider>
}

/** True while the current page has unsaved edits. */
export function useUnsavedDirty(): boolean {
  return useContext(UnsavedChangesContext).dirty
}

/** Registers the current page's unsaved state (cleared when the page unmounts). */
export function useUnsavedChanges(dirty: boolean) {
  const { setDirty } = useContext(UnsavedChangesContext)
  useEffect(() => {
    setDirty(dirty)
  }, [dirty, setDirty])
  useEffect(() => () => setDirty(false), [setDirty])
}

/** next/link that asks before leaving unsaved changes. */
export function GuardedLink({ onNavigate, ...props }: ComponentProps<typeof Link>) {
  const { dirty, setDirty } = useContext(UnsavedChangesContext)
  return (
    <Link
      {...props}
      onNavigate={(event) => {
        if (dirty) {
          if (!window.confirm(LEAVE_MESSAGE)) {
            event.preventDefault()
            return
          }
          setDirty(false)
        }
        onNavigate?.(event)
      }}
    />
  )
}
