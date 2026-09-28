'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { CourseSlug } from '@/content/types'
import { WhatsAppIcon } from '@/components/icons/brand'
import { cn } from '@/lib/cn'
import { courseHref, whatsappHref } from '@/lib/site'
import { Logo } from './Logo'
import { useSite } from './site-context'

interface HeaderProps {
  brand: { name: string; descriptor: string }
  nav: { label: string; href: string }[]
  courses: { slug: CourseSlug; name: string; tagline: string }[]
}

export function Header({ brand, nav, courses }: HeaderProps) {
  const pathname = usePathname()
  const { openConsultation, data } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lastPath, setLastPath] = useState(pathname)

  // Close the mobile menu whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('overflow-hidden', menuOpen)
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500',
        scrolled || menuOpen ? 'bg-ivory/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <div className={cn('container-site flex items-center justify-between transition-[height] duration-500', scrolled ? 'h-[4.5rem]' : 'h-24')}>
        <Link href="/" className="relative z-10 rounded-lg" aria-label={`${brand.name} ${brand.descriptor} — home`}>
          <Logo name={brand.name} descriptor={brand.descriptor} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) =>
            item.href === '/courses' ? (
              <CoursesMenu key={item.href} label={item.label} courses={courses} active={isActive(item.href)} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'relative rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors hover:text-ink',
                  isActive(item.href) ? 'text-ink' : 'text-ink-soft',
                )}
              >
                {item.label}
                {isActive(item.href) && <span className="absolute inset-x-4 -bottom-0.5 h-px bg-clay" />}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openConsultation}
            aria-haspopup="dialog"
            className="hidden h-11 items-center rounded-full bg-clay px-6 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgb(165_83_58/0.8)] transition hover:bg-clay-dark sm:inline-flex"
          >
            {data.global.consultationCta}
          </button>
          <button
            type="button"
            className="relative z-10 grid size-11 place-items-center rounded-full border border-ink/10 bg-ivory/70 text-ink lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        nav={nav}
        courses={courses}
        isActive={isActive}
        onBook={() => {
          setMenuOpen(false)
          openConsultation()
        }}
        whatsapp={whatsappHref(data.whatsappNumber, data.global.whatsappMessage)}
        whatsappLabel={data.global.whatsappTooltip}
        ctaLabel={data.global.consultationCta}
      />
    </header>
  )
}

function CoursesMenu({
  label,
  courses,
  active,
}: {
  label: string
  courses: HeaderProps['courses']
  active: boolean
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const wrapper = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div
      ref={wrapper}
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return
        clearTimeout(closeTimer.current)
        setOpen(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse') return
        closeTimer.current = setTimeout(() => setOpen(false), 160)
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors hover:text-ink',
          active ? 'text-ink' : 'text-ink-soft',
        )}
      >
        {label}
        <ChevronDown className={cn('size-4 transition-transform duration-300', open && 'rotate-180')} aria-hidden />
        {active && <span className="absolute inset-x-4 -bottom-0.5 h-px bg-clay" />}
      </button>

      <div
        id={panelId}
        className={cn(
          'absolute top-full left-1/2 w-[34rem] -translate-x-1/2 pt-4 transition-[opacity,transform,visibility] duration-300 ease-out-expo',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0',
        )}
      >
        <div className="overflow-hidden rounded-3xl border border-line bg-ivory p-3 shadow-lift">
          <ul className="grid grid-cols-2 gap-1">
            {courses.map((course) => (
              <li key={course.slug}>
                <Link
                  href={courseHref(course.slug)}
                  onClick={() => setOpen(false)}
                  className="group block h-full rounded-2xl p-4 transition hover:bg-cream"
                >
                  <span className="flex items-center justify-between font-display text-xl text-ink">
                    {course.name}
                    <ArrowRight className="size-4 -translate-x-1 text-clay opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-ink-soft">{course.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/courses"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center justify-between rounded-2xl bg-navy px-5 py-4 text-sm font-semibold text-ivory transition hover:bg-navy-soft"
          >
            View all courses & how it works
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  )
}

function MobileMenu({
  open,
  nav,
  courses,
  isActive,
  onBook,
  whatsapp,
  whatsappLabel,
  ctaLabel,
}: {
  open: boolean
  nav: HeaderProps['nav']
  courses: HeaderProps['courses']
  isActive: (href: string) => boolean
  onBook: () => void
  whatsapp: string | null
  whatsappLabel: string
  ctaLabel: string
}) {
  const reduce = useReducedMotion()
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className="fixed inset-x-0 top-0 -z-10 h-dvh overflow-y-auto bg-ivory px-5 pt-28 pb-10 lg:hidden"
          initial={reduce ? false : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <nav aria-label="Mobile">
            <ul className="space-y-1">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn('block py-2 font-display text-4xl', isActive(item.href) ? 'text-clay' : 'text-ink')}
                  >
                    {item.label}
                  </Link>
                  {item.href === '/courses' && (
                    <ul className="mt-1 mb-3 space-y-1 border-l border-line pl-4">
                      {courses.map((course) => (
                        <li key={course.slug}>
                          <Link href={courseHref(course.slug)} className="block py-1.5 text-base text-ink-soft">
                            {course.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.li>
              ))}
            </ul>
          </nav>
          <motion.div
            className="mt-10 grid gap-3"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={onBook}
              className="inline-flex h-14 items-center justify-center rounded-full bg-clay text-base font-semibold text-white"
            >
              {ctaLabel}
            </button>
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full border border-ink/15 text-base font-semibold"
              >
                <WhatsAppIcon className="size-5 text-[#1f9e55]" />
                {whatsappLabel}
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
