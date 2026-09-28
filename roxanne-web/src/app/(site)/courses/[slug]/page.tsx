import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight, BadgeCheck, ChevronRight } from 'lucide-react'
import { resolvePhoto } from '@/content/photos'
import { COURSE_SLUGS, type CourseSlug } from '@/content/types'
import type { Motif } from '@/components/three'
import { TiltCard } from '@/components/motion/TiltCard'
import { ConsultationButton, PackagesButton } from '@/components/site/actions'
import { JsonLd } from '@/components/site/JsonLd'
import { CheckList, CtaBand, PageHero, SectionHeading } from '@/components/site/sections'
import { Photo } from '@/components/ui/Photo'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { getContent, getSettings } from '@/lib/data'
import { cn } from '@/lib/cn'
import { breadcrumbJsonLd, courseJsonLd, pageMetadata } from '@/lib/seo'
import { courseHref, findCourse } from '@/lib/site'

export const dynamicParams = false

export function generateStaticParams() {
  return COURSE_SLUGS.map((slug) => ({ slug }))
}

const MOTIFS: Record<CourseSlug, Motif> = {
  'business-english': 'business',
  'legal-english': 'legal',
  'beginner-english': 'beginner',
  'speech-presentation-coaching': 'speech',
}

export async function generateMetadata(props: PageProps<'/courses/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const course = findCourse(await getContent(), slug)
  if (!course) return {}
  return pageMetadata(course.page.meta, courseHref(course.slug))
}

export default async function CoursePage(props: PageProps<'/courses/[slug]'>) {
  const { slug } = await props.params
  const [content, settings] = await Promise.all([getContent(), getSettings()])
  const course = findCourse(content, slug)
  if (!course) notFound()

  const { page } = course
  const others = content.courseList.filter((c) => c.slug !== course.slug)
  const lists = [page.whoFor, page.learn].filter((list) => list.items.length > 0)

  return (
    <>
      <PageHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        subtitle={page.hero.subtitle}
        cta={page.hero.ctaLabel}
        motif={MOTIFS[course.slug]}
        breadcrumb={
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-ink-soft">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/courses" className="hover:text-ink">
                {content.courses.hero.eyebrow}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="text-ink">
              {course.name}
            </li>
          </ol>
          </nav>
        }
      />

      {/* ───────────── Intro ───────────── */}
      <section className="relative py-24 sm:py-32">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[16rem] rounded-b-[1.75rem] shadow-soft">
              <Photo photo={resolvePhoto(course.photo, settings.photos)} preload sizes="(min-width: 1024px) 45vw, 92vw" className="absolute inset-0" />
            </div>
            <div aria-hidden className="absolute -right-4 -bottom-4 -z-10 size-40 rounded-full bg-blush" />
          </Reveal>
          <div>
            <Reveal>
              <p className="eyebrow">{course.name}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-7 font-display text-[clamp(1.4rem,2vw,1.85rem)] leading-snug text-ink">{page.intro}</p>
              <p className="mt-6 flex items-start gap-2.5 text-sm font-medium text-sage-dark">
                <BadgeCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
                {course.formats}
              </p>
            </Reveal>
            <Reveal delay={0.12} className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <ConsultationButton arrow />
              <PackagesButton slug={course.slug}>{content.courses.packagesLabel}</PackagesButton>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── Focus areas ───────────── */}
      <section className="grain relative bg-cream py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading eyebrow={course.name} title={course.focusTitle} />
          <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {course.focusAreas.map((area, i) => (
              <RevealItem key={area.title}>
                <TiltCard className="h-full">
                  <article className="group h-full rounded-[1.75rem] border border-line bg-ivory p-8 transition-shadow duration-500 hover:shadow-lift">
                    <span className="font-display text-sm tracking-[0.2em] text-gold">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mt-6 font-display text-2xl leading-tight">{area.title}</h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{area.description}</p>
                  </article>
                </TiltCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ───────────── Who it's for / What you'll work on ───────────── */}
      {lists.length > 0 && (
        <section className="relative py-24 sm:py-32">
          {lists.length > 1 ? (
            <div className="container-site grid gap-16 lg:grid-cols-2 lg:gap-24">
              {lists.map((list) => (
                <Reveal key={list.title}>
                  <h2 className="display-md">{list.title}</h2>
                  <div className="hairline my-8" />
                  <CheckList items={list.items} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
              <Reveal>
                <p className="eyebrow">{course.name}</p>
                <h2 className="display-md mt-5">{lists[0].title}</h2>
              </Reveal>
              <Reveal delay={0.06} className="lg:pt-4">
                <CheckList items={lists[0].items} />
              </Reveal>
            </div>
          )}
        </section>
      )}

      {/* ───────────── Extra sections (corporate training, approach…) ───────────── */}
      {page.sections.length > 0 && (
        <section className={cn('relative pb-24 sm:pb-32', lists.length === 0 && 'pt-24 sm:pt-32')}>
          <div className="container-site grid gap-6 lg:grid-cols-2">
            {page.sections.map((block, i) => (
              <Reveal key={block.title} delay={i * 0.06}>
                <article className={cn('h-full rounded-[2rem] p-8 sm:p-12', i % 2 === 0 ? 'bg-navy text-ivory' : 'border border-line bg-blush/40')}>
                  <h2 className={cn('display-sm', i % 2 === 0 ? 'text-ivory' : 'text-ink')}>{block.title}</h2>
                  <p className={cn('mt-5 text-lg leading-relaxed', i % 2 === 0 ? 'text-ivory/75' : 'text-ink-soft')}>{block.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ───────────── Specialist track (e.g. Litigation English) ───────────── */}
      {page.specialism && (
        <section className="relative overflow-hidden bg-navy py-24 text-ivory sm:py-32">
          <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 size-[34rem] rounded-full bg-clay/25 blur-[120px]" />
          <div className="container-site relative">
            <SectionHeading eyebrow={page.specialism.eyebrow} title={page.specialism.title} subtitle={page.specialism.subtitle} tone="light" />
            <Reveal delay={0.08}>
              <p className="mt-10 max-w-4xl text-lg leading-relaxed text-ivory/80">{page.specialism.intro}</p>
            </Reveal>
            <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-24">
              {[page.specialism.whoFor, page.specialism.learn].map((list) => (
                <Reveal key={list.title}>
                  <h3 className="font-display text-3xl text-ivory">{list.title}</h3>
                  <div className="hairline my-7" />
                  <CheckList items={list.items} tone="light" />
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-16 rounded-[2rem] border border-ivory/10 bg-navy-soft/60 p-8 sm:p-12">
              <h3 className="font-display text-3xl text-gold-soft">{page.specialism.approach.title}</h3>
              <p className="mt-4 max-w-4xl text-lg leading-relaxed text-ivory/80">{page.specialism.approach.body}</p>
            </Reveal>
          </div>
        </section>
      )}

      {/* ───────────── Package formats ───────────── */}
      <section className="relative py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading
            eyebrow={content.global.packagesModal.eyebrow}
            title={content.global.packagesModal.sectionTitle}
            subtitle={content.global.packagesModal.body}
            size="md"
          />
          <RevealGroup as="ol" className="mt-12 grid gap-5 md:grid-cols-3">
            {course.packages.map((pkg, i) => (
              <RevealItem as="li" key={pkg.name} className="rounded-[1.75rem] border border-line bg-ivory p-8">
                <span className="font-display text-sm tracking-[0.2em] text-gold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-5 font-display text-2xl leading-tight">{pkg.name}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{pkg.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ConsultationButton arrow />
            <p className="text-sm text-ink-soft italic">{content.global.packagesModal.note}</p>
          </Reveal>
        </div>
      </section>

      <CtaBand title={page.bottomCta.title} body={page.bottomCta.body} buttonLabel={page.bottomCta.buttonLabel} />

      {/* ───────────── Other programs ───────────── */}
      <section className="relative pb-24 sm:pb-32">
        <div className="container-site">
          <Reveal>
            <h2 className="eyebrow">Explore other programs</h2>
          </Reveal>
          <RevealGroup as="ul" className="mt-8 grid gap-4 md:grid-cols-3">
            {others.map((other) => (
              <RevealItem as="li" key={other.slug}>
                <Link
                  href={courseHref(other.slug)}
                  className="group flex h-full items-start justify-between gap-6 rounded-[1.5rem] border border-line p-6 transition duration-500 hover:border-clay/30 hover:bg-cream"
                >
                  <span>
                    <span className="block font-display text-2xl leading-tight">{other.name}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-ink-soft">{other.tagline}</span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 text-clay transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <JsonLd data={courseJsonLd(course)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: content.courses.hero.eyebrow, path: '/courses' },
          { name: course.name, path: courseHref(course.slug) },
        ])}
      />
    </>
  )
}
