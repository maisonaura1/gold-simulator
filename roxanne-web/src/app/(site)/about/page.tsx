import type { Metadata } from 'next'
import { Compass, HeartHandshake, Briefcase } from 'lucide-react'
import { resolvePhoto } from '@/content/photos'
import { TiltCard } from '@/components/motion/TiltCard'
import { JsonLd } from '@/components/site/JsonLd'
import { CtaBand, PageHero, SectionHeading } from '@/components/site/sections'
import { TextLink } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { getContent, getSettings } from '@/lib/data'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getContent()
  return pageMetadata(about.meta, '/about')
}

const OFFER_ICONS = [Briefcase, HeartHandshake, Compass]

export default async function AboutPage() {
  const [content, settings] = await Promise.all([getContent(), getSettings()])
  const { about, home } = content
  const portrait = resolvePhoto('portrait', settings.photos)

  return (
    <>
      <PageHero eyebrow={about.hero.eyebrow} title={about.hero.title} subtitle={about.hero.subtitle} motif="about" />

      {/* ───────────── Bio ───────────── */}
      <section id="bio" className="relative py-24 sm:py-32">
        <div className="container-site grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <Reveal className="relative mx-auto w-full max-w-md lg:sticky lg:top-28 lg:max-w-none lg:self-start">
            <div className="relative aspect-[3/4]">
              <Photo photo={portrait} sizes="(min-width: 1024px) 38vw, 90vw" className="arch absolute inset-0 shadow-soft" />
              <div aria-hidden className="arch pointer-events-none absolute -inset-3 border border-gold/40" />
            </div>
          </Reveal>

          <div className="lg:pt-10">
            <SectionHeading eyebrow={about.bio.eyebrow} title={about.bio.title} />
            <Reveal delay={0.08} className="prose-site mt-8 space-y-5 text-lg leading-relaxed text-ink-soft">
              {about.bio.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-10 font-display text-4xl text-clay italic">{content.brand.personName}</p>
              <p className="mt-1 text-xs font-bold tracking-[0.22em] text-ink-soft uppercase">
                {content.brand.descriptor} · {content.brand.tagline}
              </p>
            </Reveal>

            {about.credentials.items.length > 0 && (
              <Reveal delay={0.1} className="mt-14 rounded-[1.75rem] border border-line bg-cream/60 p-8">
                <h3 className="font-display text-2xl">{about.credentials.title}</h3>
                <ul className="mt-5 space-y-3">
                  {about.credentials.items.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-clay" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ───────────── What I offer ───────────── */}
      <section id="approach" className="grain relative bg-cream py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading eyebrow={about.offer.eyebrow} title={about.offer.title} />
          <RevealGroup className="mt-16 grid gap-5 md:grid-cols-3">
            {about.offer.items.map((item, i) => {
              const Icon = OFFER_ICONS[i % OFFER_ICONS.length]
              return (
                <RevealItem key={item.title}>
                  <TiltCard className="h-full">
                    <article className="h-full rounded-[1.75rem] border border-line bg-ivory p-8 sm:p-10">
                      <span className="grid size-14 place-items-center rounded-full bg-blush/70 text-clay">
                        <Icon className="size-6" aria-hidden />
                      </span>
                      <h3 className="mt-8 font-display text-3xl leading-tight">{item.title}</h3>
                      <p className="mt-4 leading-relaxed text-ink-soft">{item.description}</p>
                    </article>
                  </TiltCard>
                </RevealItem>
              )
            })}
          </RevealGroup>
          <Reveal className="mt-14">
            <TextLink href="/courses">{about.offer.linkLabel}</TextLink>
          </Reveal>
        </div>
      </section>

      <CtaBand title={home.finalCta.title} body={home.finalCta.subtitle} buttonLabel={home.finalCta.buttonLabel} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: about.hero.title, path: '/about' }])} />
    </>
  )
}
