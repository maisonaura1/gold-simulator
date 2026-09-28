import Link from 'next/link'
import { Mail } from 'lucide-react'
import type { SiteContent, SiteSettings } from '@/content/types'
import { FacebookIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon, YouTubeIcon } from '@/components/icons/brand'
import { courseHref, whatsappHref } from '@/lib/site'
import { ConsultationButton } from './actions'
import { Logo } from './Logo'

export function Footer({ content, settings }: { content: SiteContent; settings: SiteSettings }) {
  const { brand, footer, courseList, global } = content
  const wa = whatsappHref(settings.whatsappNumber, global.whatsappMessage)
  const socials = [
    { href: settings.socials.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
    { href: settings.socials.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: settings.socials.facebook, label: 'Facebook', Icon: FacebookIcon },
    { href: settings.socials.youtube, label: 'YouTube', Icon: YouTubeIcon },
  ].filter((s) => s.href)
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-navy text-ivory">
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[-10%] size-[36rem] rounded-full bg-clay/20 blur-[120px]" />
      <div className="container-site relative pt-20 pb-10 sm:pt-24">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <div className="max-w-sm">
            <Logo name={brand.name} descriptor={brand.descriptor} tone="light" />
            <p className="mt-6 font-display text-2xl text-ivory/90 italic">{brand.tagline}</p>
            <p className="mt-3 text-sm leading-relaxed text-ivory/65">{footer.blurb}</p>
            {socials.length > 0 && (
              <ul className="mt-6 flex gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label={label}
                      className="grid size-10 place-items-center rounded-full border border-ivory/15 text-ivory/80 transition hover:border-clay-soft hover:bg-clay hover:text-white"
                    >
                      <Icon className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <FooterColumn title="Explore">
            {footer.links.map((link) => (
              <li key={link.href + link.label}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
            <li>
              <FooterLink href="/freelance">{content.nav.items.find((i) => i.href === '/freelance')?.label ?? 'Freelance'}</FooterLink>
            </li>
          </FooterColumn>

          <FooterColumn title="Courses">
            {courseList.map((course) => (
              <li key={course.slug}>
                <FooterLink href={courseHref(course.slug)}>{course.name}</FooterLink>
              </li>
            ))}
          </FooterColumn>

          <div>
            <h2 className="text-xs font-bold tracking-[0.22em] text-ivory/50 uppercase">Get in touch</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2.5 break-all text-ivory/80 transition hover:text-white">
                    <Mail className="size-4 shrink-0 text-clay-soft" aria-hidden />
                    {settings.email}
                  </a>
                </li>
              )}
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-ivory/80 transition hover:text-white">
                    <WhatsAppIcon className="size-4 shrink-0 text-clay-soft" />
                    {settings.showPhone ? settings.whatsappNumber : 'WhatsApp'}
                  </a>
                </li>
              )}
            </ul>
            <ConsultationButton variant="light" size="sm" className="mt-7" arrow />
          </div>
        </div>

        <p aria-hidden className="pointer-events-none mt-20 font-display text-[clamp(3.5rem,13vw,11.5rem)] leading-[0.8] tracking-[-0.03em] whitespace-nowrap text-ivory/[0.06] select-none">
          {brand.name}
        </p>

        <div className="mt-6 flex flex-col gap-3 border-t border-ivory/10 pt-6 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.name} {brand.descriptor} · {brand.personName}. {footer.legal}
          </p>
          <p className="flex gap-5">
            <Link href="/privacy" className="transition hover:text-ivory">
              Privacy Policy
            </Link>
            <Link href="/contact" className="transition hover:text-ivory">
              Contact
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-bold tracking-[0.22em] text-ivory/50 uppercase">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-ivory/80 transition hover:text-white">
      {children}
    </Link>
  )
}
