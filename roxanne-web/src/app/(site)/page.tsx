import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Globe2, Mic2, PenLine, Presentation } from 'lucide-react'
import { resolvePhoto } from '@/content/photos'
import { Hero3D } from '@/components/three'
import { TiltCard } from '@/components/motion/TiltCard'
import { ConsultationBadge, ConsultationButton, PackagesButton } from '@/components/site/actions'
import { CtaBand, SectionHeading } from '@/components/site/sections'
import { Testimonials } from '@/components/site/Testimonials'
import { ButtonLink, TextLink } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { getContent, getPublishedTestimonials, getSettings } from '@/lib/data'
import { pageMetadata } from '@/lib/seo'
import { courseHref } from '@/lib/site'

export async function generateMetadata(): Promise<Metadata> {
  const { home } = await getContent()
  return pageMetadata(home.meta, '/')
}

const BENEFIT_ICONS = [Mic2, PenLine, Presentation, Globe2]

/** "Communicate with precision. Advance with confidence." → second sentence in italic. */
function HeroTitle({ text }: { text: string }) {
  const parts = text.match(/^(.+?[.!?])\s+(.+)$/)
  if (!parts) return <>{text}</>
  return (
    <>
      {parts[1]} <em className="font-normal text-clay">{parts[2]}</em>
    </>
  )
}

export default async function HomePage() {
  const [content, settings, testimonials] = await Promise.all([getContent(), getSettings(), getPublishedTestimonials()])
  const { home, courseList } = content
  const heroPhoto = resolvePhoto('hero', settings.photos)
  const portrait = resolvePhoto('portrait', settings.photos)
  const freelancePhoto = resolvePhoto('freelance', settings.photos)

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="grain relative overflow-hidden pt-32 pb-16 sm:pt-40 lg:min-h-[100svh] lg:pb-24">
        <div aria-hidden className="pointer-events-none absolute top-[-10%] right-[-12%] size-[44rem] rounded-full bg-blush/80 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute bottom-[-20%] left-[-10%] size-[30rem] rounded-full bg-sand/70 blur-[100px]" />

        <div className="container-site relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div className="relative z-10">
            <Reveal>
              <p className="eyebrow">{home.hero.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="display-xl mt-7 max-w-[13ch]">
                <HeroTitle text={home.hero.title} />
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="lead mt-8 max-w-xl">{home.hero.subtitle}</p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ConsultationButton size="lg" arrow>
                {home.hero.ctaLabel}
              </ConsultationButton>
              <ButtonLink href="/courses" variant="secondary" size="lg">
                {home.hero.secondaryCtaLabel}
              </ButtonLink>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={40} className="relative mx-auto w-full max-w-[34rem]">
            <div className="relative aspect-[4/5]">
              <Photo photo={heroPhoto} preload sizes="(min-width: 1024px) 34rem, 90vw" className="arch absolute inset-0 shadow-soft" imgClassName="object-[60%_center]" />
              <div aria-hidden className="arch pointer-events-none absolute inset-0 ring-1 ring-ink/10 ring-inset" />
              <div aria-hidden className="arch pointer-events-none absolute -inset-4 border border-gold/40" />
            </div>
            <Hero3D className="pointer-events-none absolute -inset-[14%] z-10" />
            <ConsultationBadge text="Free consultation" className="absolute -bottom-6 -left-4 z-20 sm:-left-10" />
          </Reveal>
        </div>
      </section>

      {/* ───────────── Marquee ───────────── */}
      <div className="relative overflow-hidden bg-navy py-6 text-ivory" aria-hidden>
        <div className="mask-fade-x flex w-max animate-marquee gap-10 whitespace-nowrap motion-reduce:animate-none">
          {[...home.marquee, ...home.marquee].map((word, i) => (
            <span key={`${word}-${i}`} className="flex items-center gap-10 font-display text-2xl italic sm:text-3xl">
              {word}
              <span className="text-base not-italic text-clay-soft">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ───────────── About intro ───────────── */}
      <section className="relative py-24 sm:py-32">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] w-[88%]">
              <Photo photo={portrait} sizes="(min-width: 1024px) 40vw, 80vw" className="arch-sm absolute inset-0 shadow-soft" />
            </div>
            <div className="absolute right-0 bottom-[-6%] w-[46%] rounded-[1.5rem] bg-navy p-6 text-ivory shadow-lift sm:p-7">
              <p className="font-display text-4xl leading-none text-clay-soft italic">“</p>
              <p className="mt-2 font-display text-xl leading-snug">{home.intro.quote}</p>
              <p className="mt-4 text-xs font-bold tracking-[0.22em] text-ivory/60 uppercase">{content.brand.personName}</p>
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow={home.intro.eyebrow} title={home.intro.title} />
            <Reveal delay={0.1}>
              <p className="lead mt-7">{home.intro.body}</p>
            </Reveal>
            <Reveal delay={0.16} className="mt-10">
              <TextLink href="/about#approach">{home.intro.linkLabel}</TextLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── Benefits ───────────── */}
      <section className="grain relative bg-cream py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading eyebrow={home.benefits.eyebrow} title={home.benefits.title} />
          <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2">
            {home.benefits.items.map((item, i) => {
              const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length]
              return (
                <RevealItem key={item.title}>
                  <TiltCard className="h-full">
                    <article className="group relative h-full overflow-hidden rounded-[1.75rem] border border-line bg-ivory p-8 transition-shadow duration-500 hover:shadow-lift sm:p-10">
                      <span className="absolute top-8 right-8 font-display text-5xl text-sand transition-colors duration-500 group-hover:text-blush sm:top-10 sm:right-10">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="grid size-14 place-items-center rounded-full bg-blush/70 text-clay transition-colors duration-500 group-hover:bg-clay group-hover:text-white">
                        <Icon className="size-6" aria-hidden />
                      </span>
                      <h3 className="mt-8 font-display text-3xl leading-tight">{item.title}</h3>
                      <p className="mt-4 max-w-md leading-relaxed text-ink-soft">{item.description}</p>
                    </article>
                  </TiltCard>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>
      </section>

      {/* ───────────── Services preview ───────────── */}
      <section className="relative py-24 sm:py-32">
        <div className="container-site">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading eyebrow={home.services.eyebrow} title={home.services.title} subtitle={home.services.subtitle} />
            <Reveal>
              <TextLink href="/courses">{home.hero.secondaryCtaLabel}</TextLink>
            </Reveal>
          </div>

          <RevealGroup className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {courseList.map((course) => (
              <RevealItem key={course.slug} as="article" className="group flex flex-col">
                <Link href={courseHref(course.slug)} className="block" tabIndex={-1} aria-hidden>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-[10rem] rounded-b-[1.5rem]">
                    <Photo
                      photo={resolvePhoto(course.photo, settings.photos)}
                      sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 90vw"
                      className="absolute inset-0"
                      imgClassName="transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105"
                    />
                    <span className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-ivory/90 text-ink opacity-0 backdrop-blur transition duration-500 group-hover:opacity-100">
                      <ArrowUpRight className="size-5" />
                    </span>
                  </div>
                </Link>
                <div className="flex flex-1 flex-col pt-6">
                  <h3 className="font-display text-[1.9rem] leading-tight">
                    <Link href={courseHref(course.slug)} className="transition-colors hover:text-clay">
                      {course.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-[0.8125rem] leading-snug font-medium text-sage-dark">{course.formats}</p>
                  <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">{course.cardDescription}</p>
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-5">
                    <PackagesButton slug={course.slug}>{home.services.cardCtaLabel}</PackagesButton>
                    <Link href={courseHref(course.slug)} className="text-sm font-semibold text-clay hover:text-clay-dark">
                      Learn more
                    </Link>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ───────────── Freelance banner ───────────── */}
      <section className="relative overflow-hidden bg-navy py-24 text-ivory sm:py-32">
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-40 size-[32rem] rounded-full bg-clay/25 blur-[120px]" />
        <div className="container-site relative grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem]">
              <Photo photo={freelancePhoto} sizes="(min-width: 1024px) 45vw, 90vw" className="absolute inset-0" />
            </div>
            <div aria-hidden className="absolute -top-5 -right-5 hidden size-24 rounded-full border border-gold/50 sm:block" />
          </Reveal>
          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="eyebrow text-clay-soft">{home.freelance.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="display-md mt-6 text-ivory">{home.freelance.title}</h2>
            </Reveal>
            <Reveal delay={0.12} className="mt-10">
              <TextLink href="/freelance" tone="light">
                {home.freelance.linkLabel}
              </TextLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── Testimonials (hidden until Roxanne publishes real ones) ───────────── */}
      {testimonials.length > 0 && (
        <Testimonials eyebrow={home.testimonials.eyebrow} title={home.testimonials.title} testimonials={testimonials} />
      )}

      <CtaBand title={home.finalCta.title} body={home.finalCta.subtitle} buttonLabel={home.finalCta.buttonLabel} />
    </>
  )
}
