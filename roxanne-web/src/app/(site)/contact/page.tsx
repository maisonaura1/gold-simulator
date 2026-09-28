import type { Metadata } from 'next'
import { Mail, Plus } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/brand'
import { ContactForm } from '@/components/site/ContactForm'
import { InlineScheduler } from '@/components/site/InlineScheduler'
import { JsonLd } from '@/components/site/JsonLd'
import { PageHero, SectionHeading } from '@/components/site/sections'
import { Reveal } from '@/components/ui/Reveal'
import { getContent, getSettings } from '@/lib/data'
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from '@/lib/seo'
import { whatsappHref } from '@/lib/site'

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await getContent()
  return pageMetadata(contact.meta, '/contact')
}

export default async function ContactPage() {
  const [content, settings] = await Promise.all([getContent(), getSettings()])
  const { contact } = content
  const wa = whatsappHref(settings.whatsappNumber, content.global.whatsappMessage)

  return (
    <>
      <PageHero eyebrow={contact.hero.eyebrow} title={contact.hero.title} subtitle={contact.hero.body} motif="contact" />

      <section className="relative py-20 sm:py-28">
        <div className="container-site grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div className="space-y-6">
            <Reveal className="rounded-[2rem] bg-navy p-8 text-ivory sm:p-10">
              <h2 className="font-display text-3xl">{contact.details.title}</h2>
              <ul className="mt-8 space-y-5">
                {settings.email && (
                  <li>
                    <a href={`mailto:${settings.email}`} className="group flex items-center gap-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ivory/10 text-clay-soft transition group-hover:bg-clay group-hover:text-white">
                        <Mail className="size-5" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-bold tracking-[0.2em] text-ivory/50 uppercase">{contact.details.emailLabel}</span>
                        <span className="block break-all text-ivory/90 group-hover:text-white">{settings.email}</span>
                      </span>
                    </a>
                  </li>
                )}
                {wa && (
                  <li>
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ivory/10 text-clay-soft transition group-hover:bg-[#1f9e55] group-hover:text-white">
                        <WhatsAppIcon className="size-5" />
                      </span>
                      <span>
                        <span className="block text-xs font-bold tracking-[0.2em] text-ivory/50 uppercase">{contact.details.whatsappLabel}</span>
                        <span className="block text-ivory/90 group-hover:text-white">
                          {settings.showPhone ? settings.whatsappNumber : content.global.whatsappTooltip}
                        </span>
                      </span>
                    </a>
                  </li>
                )}
              </ul>
              <p className="mt-8 text-sm text-ivory/60">{contact.details.note}</p>
            </Reveal>

            {settings.calendlyUrl && (
              <Reveal delay={0.06} className="rounded-[2rem] border border-line bg-cream/60 p-8 sm:p-10">
                <p className="eyebrow">{contact.scheduler.eyebrow}</p>
                <h2 className="mt-4 font-display text-3xl leading-tight">{contact.scheduler.title}</h2>
                <p className="mt-3 text-ink-soft">{contact.scheduler.body}</p>
                <InlineScheduler url={settings.calendlyUrl} buttonLabel={contact.scheduler.buttonLabel} privacyNote={contact.scheduler.privacyNote} />
              </Reveal>
            )}
          </div>

          <Reveal delay={0.04} className="relative rounded-[2rem] border border-line bg-ivory p-7 shadow-card sm:p-10">
            <h2 id="message" className="scroll-mt-32 font-display text-4xl leading-tight">
              {contact.form.title}
            </h2>
            <div className="mt-8">
              <ContactForm copy={contact.form} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      {contact.faq.items.length > 0 && (
        <section className="grain relative bg-cream py-24 sm:py-32">
          <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <SectionHeading eyebrow={contact.faq.eyebrow} title={contact.faq.title} />
            <Reveal className="divide-y divide-line border-y border-line">
              {contact.faq.items.map((item) => (
                <details key={item.question} className="group py-2 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-2xl leading-snug">
                    {item.question}
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-ink/15 transition duration-300 group-open:rotate-45 group-open:border-clay group-open:bg-clay group-open:text-white">
                      <Plus className="size-4" aria-hidden />
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-6 leading-relaxed text-ink-soft">{item.answer}</p>
                </details>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <JsonLd data={faqJsonLd(contact.faq.items)} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: contact.hero.eyebrow, path: '/contact' }])} />
    </>
  )
}
