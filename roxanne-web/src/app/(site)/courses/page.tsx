import type { Metadata } from 'next'
import { ArrowDown, BadgeCheck } from 'lucide-react'
import { resolvePhoto } from '@/content/photos'
import { PackagesButton } from '@/components/site/actions'
import { JsonLd } from '@/components/site/JsonLd'
import { CtaBand, PageHero, SectionHeading } from '@/components/site/sections'
import { Testimonials } from '@/components/site/Testimonials'
import { ButtonLink } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { getContent, getPublishedTestimonials, getSettings } from '@/lib/data'
import { cn } from '@/lib/cn'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'
import { courseHref } from '@/lib/site'

export async function generateMetadata(): Promise<Metadata> {
  const { courses } = await getContent()
  return pageMetadata(courses.meta, '/courses')
}

export default async function CoursesPage() {
  const [content, settings, testimonials] = await Promise.all([getContent(), getSettings(), getPublishedTestimonials()])
  const { courses, courseList, home } = content

  return (
    <>
      <PageHero eyebrow={courses.hero.eyebrow} title={courses.hero.title} motif="courses" />

      {/* ───────────── Intro + core programs ───────────── */}
      <section className="relative py-24 sm:py-28">
        <div className="container-site">
          <Reveal>
            <p className="max-w-4xl font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-snug text-ink">{courses.intro.body}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="eyebrow mt-16">{courses.intro.programsTitle}</h2>
          </Reveal>
          <RevealGroup as="ul" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {courseList.map((course, i) => (
              <RevealItem as="li" key={course.slug}>
                <a
                  href={`#${course.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-cream/60 p-7 transition duration-500 hover:-translate-y-1 hover:border-clay/30 hover:bg-ivory hover:shadow-lift"
                >
                  <span className="font-display text-sm tracking-[0.2em] text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <span className="mt-5 font-display text-[1.75rem] leading-tight">{course.name}</span>
                  <span className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">{course.tagline}</span>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-clay">
                    Discover
                    <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
                  </span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ───────────── Program details ───────────── */}
      <div className="pb-8">
        {courseList.map((course, i) => {
          const reversed = i % 2 === 1
          return (
            <section key={course.slug} id={course.slug} className={cn('relative py-20 sm:py-24', i % 2 === 1 && 'grain bg-cream')}>
              <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <Reveal className={cn('relative', reversed && 'lg:order-2')}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-[14rem] rounded-b-[1.75rem] shadow-soft sm:aspect-[5/5]">
                    <Photo photo={resolvePhoto(course.photo, settings.photos)} sizes="(min-width: 1024px) 45vw, 92vw" className="absolute inset-0" />
                  </div>
                  <span aria-hidden className={cn('absolute -bottom-6 font-display text-[7rem] leading-none text-clay/15 select-none', reversed ? '-left-2' : '-right-2')}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </Reveal>

                <div>
                  <Reveal>
                    <p className="eyebrow">Program {String(i + 1).padStart(2, '0')}</p>
                  </Reveal>
                  <Reveal delay={0.05}>
                    <h2 className="display-lg mt-5">{course.name}</h2>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="mt-6 text-lg leading-relaxed text-ink-soft">{course.description}</p>
                    <p className="mt-5 flex items-start gap-2.5 text-sm font-medium text-sage-dark">
                      <BadgeCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
                      {course.formats}
                    </p>
                  </Reveal>
                  <Reveal delay={0.14}>
                    <h3 className="mt-10 text-xs font-bold tracking-[0.2em] text-ink uppercase">{course.focusTitle}</h3>
                    <ul className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                      {course.focusAreas.map((area) => (
                        <li key={area.title} className="border-t border-line pt-4">
                          <p className="font-display text-xl leading-snug">{area.title}</p>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{area.description}</p>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                  <Reveal delay={0.18} className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
                    <ButtonLink href={courseHref(course.slug)} arrow>
                      {course.ctaLabel}
                    </ButtonLink>
                    <PackagesButton slug={course.slug}>{courses.packagesLabel}</PackagesButton>
                  </Reveal>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* ───────────── How it works ───────────── */}
      <section className="relative overflow-hidden bg-navy py-24 text-ivory sm:py-32">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 size-[34rem] rounded-full bg-clay/25 blur-[120px]" />
        <div className="container-site relative">
          <SectionHeading eyebrow={courses.howItWorks.eyebrow} title={courses.howItWorks.title} subtitle={courses.howItWorks.subtitle} tone="light" />
          <div className="relative mt-16">
            <div aria-hidden className="absolute top-16 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent lg:block" />
            <RevealGroup as="ol" className="relative grid gap-6 lg:grid-cols-3">
              {courses.howItWorks.steps.map((step, i) => (
                <RevealItem as="li" key={step.title} className="relative">
                  <div className="h-full rounded-[1.75rem] border border-ivory/10 bg-navy-soft/60 p-8 backdrop-blur sm:p-10">
                    <span className="relative grid size-16 place-items-center rounded-full border border-gold/50 bg-navy font-display text-2xl text-gold-soft">
                      {i + 1}
                    </span>
                    <h3 className="mt-8 font-display text-3xl leading-tight text-ivory">{step.title}</h3>
                    <p className="mt-4 leading-relaxed text-ivory/70">{step.body}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <Testimonials eyebrow={home.testimonials.eyebrow} title={home.testimonials.title} testimonials={testimonials} />
      )}

      <CtaBand title={courses.bottomCta.title} buttonLabel={courses.bottomCta.linkLabel} />

      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: courses.hero.eyebrow, path: '/courses' }])} />
    </>
  )
}
