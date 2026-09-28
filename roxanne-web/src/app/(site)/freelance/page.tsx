import type { Metadata } from 'next'
import { BookA, FileCheck, FilePen, FolderKanban, Handshake, SpellCheck } from 'lucide-react'
import { resolvePhoto } from '@/content/photos'
import { TiltCard } from '@/components/motion/TiltCard'
import { JsonLd } from '@/components/site/JsonLd'
import { CtaBand, PageHero, SectionHeading } from '@/components/site/sections'
import { ButtonLink } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { getContent, getSettings } from '@/lib/data'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const { freelance } = await getContent()
  return pageMetadata(freelance.meta, '/freelance')
}

const SERVICE_ICONS = [SpellCheck, FilePen, FileCheck, BookA, Handshake, FolderKanban]

export default async function FreelancePage() {
  const [content, settings] = await Promise.all([getContent(), getSettings()])
  const { freelance } = content

  return (
    <>
      <PageHero eyebrow={freelance.hero.eyebrow} title={freelance.hero.title} subtitle={freelance.hero.subtitle} motif="freelance">
        <Reveal delay={0.18} className="mt-10">
          <ButtonLink href="/contact?topic=freelance#message" size="lg" arrow>
            {freelance.hero.ctaLabel}
          </ButtonLink>
        </Reveal>
      </PageHero>

      {/* ───────────── Intro ───────────── */}
      <section className="relative py-24 sm:py-32">
        <div className="container-site grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <div>
            <Reveal>
              <p className="font-display text-[clamp(1.6rem,2.5vw,2.3rem)] leading-snug">{freelance.intro}</p>
            </Reveal>
            <Reveal delay={0.08} className="mt-12 rounded-[1.75rem] border border-line bg-cream/60 p-8">
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase">{freelance.idealFor.title}</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {freelance.idealFor.items.map((item) => (
                  <li key={item} className="flex gap-3 leading-snug">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-clay" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[14rem] rounded-b-[1.75rem] shadow-soft">
              <Photo photo={resolvePhoto('freelance', settings.photos)} sizes="(min-width: 1024px) 40vw, 92vw" className="absolute inset-0" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── Services ───────────── */}
      <section className="grain relative bg-cream py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading eyebrow={freelance.services.eyebrow} title={freelance.services.title} />
          <RevealGroup className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {freelance.services.items.map((item, i) => {
              const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length]
              return (
                <RevealItem key={item.title}>
                  <TiltCard className="h-full">
                    <article className="group h-full rounded-[1.75rem] border border-line bg-ivory p-8 transition-shadow duration-500 hover:shadow-lift sm:p-9">
                      <span className="grid size-12 place-items-center rounded-full bg-blush/70 text-clay transition-colors duration-500 group-hover:bg-clay group-hover:text-white">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <h3 className="mt-7 font-display text-2xl leading-tight">{item.title}</h3>
                      <p className="mt-3 leading-relaxed text-ink-soft">{item.description}</p>
                    </article>
                  </TiltCard>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>
      </section>

      {/* ───────────── Process ───────────── */}
      <section className="relative py-24 sm:py-32">
        <div className="container-site grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <SectionHeading eyebrow={freelance.process.eyebrow} title={freelance.process.title} />
          <RevealGroup as="ol" className="relative space-y-4">
            {freelance.process.steps.map((step, i) => (
              <RevealItem as="li" key={step.title} className="flex gap-6 rounded-[1.5rem] border border-line p-6 sm:p-8">
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/60 font-display text-xl text-clay">{i + 1}</span>
                <div>
                  <h3 className="font-display text-2xl leading-tight">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{step.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBand title={freelance.bottomCta.title} body={freelance.bottomCta.body} buttonLabel={freelance.bottomCta.buttonLabel} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: freelance.hero.eyebrow, path: '/freelance' }])} />
    </>
  )
}
