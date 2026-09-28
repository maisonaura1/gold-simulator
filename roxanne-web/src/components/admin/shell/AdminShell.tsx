'use client'

import {
  ArrowUpRight,
  CalendarDays,
  Ellipsis,
  FileText,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useId, useState, type ReactNode } from 'react'
import { Logo, LogoMark } from '@/components/site/Logo'
import { signOut } from '@/lib/admin/actions/auth'
import { cn } from '@/lib/cn'
import { ConfirmProvider } from '../ui/Confirm'
import { ToastProvider } from '../ui/Toast'
import { GuardedLink, LEAVE_MESSAGE, UnsavedChangesProvider, useUnsavedDirty } from '../ui/UnsavedChanges'
import { Sheet } from './Sheet'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

const NAV: NavItem[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/messages', label: 'Messages', icon: Inbox },
  { href: '/admin/meetings', label: 'Meetings', icon: CalendarDays },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/photos', label: 'Photos', icon: Images },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

/** Phones: the first four in the bottom bar, the rest under "More". */
const BOTTOM_BAR = NAV.slice(0, 4)
const MORE = NAV.slice(4)

function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)
}

function NewBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null
  return (
    <span
      className={cn(
        'grid h-5 min-w-5 place-items-center rounded-full bg-clay px-1.5 text-[0.6875rem] leading-none font-bold text-white',
        className,
      )}
      aria-hidden
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}

function SignOutForm({ className, children }: { className?: string; children: ReactNode }) {
  const dirty = useUnsavedDirty()
  return (
    <form
      action={signOut}
      onSubmit={(event) => {
        if (dirty && !window.confirm(LEAVE_MESSAGE)) event.preventDefault()
      }}
    >
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  )
}

interface ShellProps {
  brandName: string
  brandDescriptor: string
  newMessages: number
  children: ReactNode
}

export function AdminShell(props: ShellProps) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <UnsavedChangesProvider>
          <ShellLayout {...props} />
        </UnsavedChangesProvider>
      </ConfirmProvider>
    </ToastProvider>
  )
}

function ShellLayout({ brandName, brandDescriptor, newMessages, children }: ShellProps) {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const sheetTitleId = useId()
  const moreActive = MORE.some((item) => isActive(pathname, item))

  const messagesLabel = (label: string) => (newMessages > 0 ? `${label}, ${newMessages} new` : label)

  return (
    <>
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-ivory"
      >
        Skip to content
      </a>

      <div className="min-h-dvh bg-ivory lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)]">
        {/* ── Desktop sidebar (the column keeps its colour down long pages; the menu stays in view) ── */}
        <div className="hidden border-r border-line bg-cream/55 lg:block">
          <aside className="sticky top-0 flex h-dvh flex-col px-4 pt-7 pb-5">
            <GuardedLink href="/admin" className="rounded-xl px-2" aria-label="Dashboard overview">
              <Logo name={brandName} descriptor={brandDescriptor} />
            </GuardedLink>
            <p className="mt-6 px-3 text-[0.6875rem] font-bold tracking-[0.2em] text-ink-soft uppercase">Your dashboard</p>
            <nav aria-label="Dashboard" className="mt-3">
              <ul className="flex flex-col gap-1">
                {NAV.map((item) => {
                  const active = isActive(pathname, item)
                  const Icon = item.icon
                  return (
                    <li key={item.href}>
                      <GuardedLink
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        aria-label={item.href === '/admin/messages' ? messagesLabel(item.label) : undefined}
                        className={cn(
                          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] font-medium transition-colors',
                          active
                            ? 'bg-white text-ink shadow-[0_1px_2px_rgb(31_37_51/0.06)] ring-1 ring-line'
                            : 'text-ink-soft hover:bg-white/60 hover:text-ink',
                        )}
                      >
                        <Icon
                          className={cn('size-[1.15rem] transition-colors', active ? 'text-clay' : 'text-ink-soft/80 group-hover:text-ink')}
                          aria-hidden
                        />
                        <span className="flex-1">{item.label}</span>
                        {item.href === '/admin/messages' && <NewBadge count={newMessages} />}
                      </GuardedLink>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="mt-auto rounded-2xl border border-line bg-white/70 p-4 text-[0.8125rem] leading-relaxed text-ink-soft">
              <p className="font-semibold text-ink">Good to know</p>
              <p className="mt-1">Everything you save here appears on your website within a few seconds.</p>
            </div>
          </aside>
        </div>

        <div className="flex min-w-0 flex-col">
          {/* ── Desktop top bar ── */}
          <header className="sticky top-0 z-30 hidden h-16 items-center justify-end gap-1 border-b border-line bg-ivory/85 px-8 backdrop-blur-md lg:flex">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink-soft transition hover:bg-ink/[0.05] hover:text-ink"
            >
              View site
              <ArrowUpRight className="size-4" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <SignOutForm className="inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-soft transition hover:bg-ink/[0.05] hover:text-ink">
              <LogOut className="size-4" aria-hidden />
              Sign out
            </SignOutForm>
          </header>

          {/* ── Phone header ── */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-ivory/90 px-4 backdrop-blur-md lg:hidden">
            <GuardedLink href="/admin" className="flex items-center gap-2.5 rounded-lg" aria-label="Dashboard overview">
              <LogoMark className="h-7 text-clay" />
              <span className="font-display text-[1.35rem] leading-none text-ink">Dashboard</span>
            </GuardedLink>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1 rounded-full border border-line bg-white px-3.5 text-sm font-semibold text-ink"
            >
              View site
              <ArrowUpRight className="size-4" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </header>

          <main id="admin-main" tabIndex={-1} className="flex-1 px-4 pt-6 pb-32 outline-none sm:px-6 lg:px-10 lg:pt-10 lg:pb-16">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>

      {/* ── Phone bottom navigation ── */}
      <nav
        aria-label="Dashboard"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {BOTTOM_BAR.map((item) => {
            const active = isActive(pathname, item)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <GuardedLink
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  aria-label={item.href === '/admin/messages' ? messagesLabel(item.label) : undefined}
                  className={cn(
                    'relative flex h-16 flex-col items-center justify-center gap-1 text-[0.6875rem] font-semibold transition-colors',
                    active ? 'text-clay' : 'text-ink-soft',
                  )}
                >
                  {active && <span aria-hidden className="absolute top-0 h-0.5 w-8 rounded-full bg-clay" />}
                  <span className="relative">
                    <Icon className="size-[1.35rem]" aria-hidden />
                    {item.href === '/admin/messages' && (
                      <NewBadge count={newMessages} className="absolute -top-1.5 -right-3 ring-2 ring-white" />
                    )}
                  </span>
                  {item.label}
                </GuardedLink>
              </li>
            )
          })}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              className={cn(
                'relative flex h-16 w-full flex-col items-center justify-center gap-1 text-[0.6875rem] font-semibold transition-colors',
                moreActive ? 'text-clay' : 'text-ink-soft',
              )}
            >
              {moreActive && <span aria-hidden className="absolute top-0 h-0.5 w-8 rounded-full bg-clay" />}
              <Ellipsis className="size-[1.35rem]" aria-hidden />
              More
            </button>
          </li>
        </ul>
      </nav>

      <Sheet open={moreOpen} onClose={() => setMoreOpen(false)} labelledBy={sheetTitleId} title="More">
        <ul className="flex flex-col gap-1">
          {MORE.map((item) => {
            const active = isActive(pathname, item)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <GuardedLink
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-base font-semibold',
                    active ? 'bg-white text-ink ring-1 ring-line' : 'text-ink',
                  )}
                >
                  <span className={cn('grid size-10 place-items-center rounded-xl bg-cream', active ? 'text-clay' : 'text-ink-soft')}>
                    <Icon className="size-5" aria-hidden />
                  </span>
                  {item.label}
                </GuardedLink>
              </li>
            )
          })}
        </ul>
        <div className="mt-3 border-t border-line pt-3">
          <SignOutForm className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left text-base font-semibold text-ink-soft">
            <span className="grid size-10 place-items-center rounded-xl bg-cream">
              <LogOut className="size-5" aria-hidden />
            </span>
            Sign out
          </SignOutForm>
        </div>
      </Sheet>
    </>
  )
}
