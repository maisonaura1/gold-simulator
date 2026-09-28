import type { Testimonial } from '@/content/types'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { SectionHeading } from './sections'

/** Real client testimonials, managed in Dashboard → Testimonials (hidden while none are published). */
export function Testimonials({ eyebrow, title, testimonials }: { eyebrow: string; title: string; testimonials: Testimonial[] }) {
  const [featured, ...rest] = testimonials
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading eyebrow={eyebrow} title={title} />

        <Reveal className="mt-14">
          <figure className="relative overflow-hidden rounded-[2rem] bg-blush/60 p-8 sm:p-14">
            <span aria-hidden className="absolute -top-10 right-6 font-display text-[16rem] leading-none text-clay/15 select-none">
              ”
            </span>
            <blockquote className="relative max-w-4xl font-display text-3xl leading-snug sm:text-[2.6rem]">“{featured.quote}”</blockquote>
            <figcaption className="relative mt-8 text-sm">
              <span className="font-bold text-ink">{featured.name}</span>
              <span className="text-ink-soft">{[featured.role, featured.location].filter(Boolean).map((v) => ` · ${v}`)}</span>
            </figcaption>
          </figure>
        </Reveal>

        {rest.length > 0 && (
          <RevealGroup className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((t) => (
              <RevealItem key={t.id} as="article" className="flex flex-col rounded-[1.5rem] border border-line bg-ivory p-8">
                <p className="font-display text-4xl leading-none text-clay">“</p>
                <blockquote className="mt-3 flex-1 leading-relaxed text-ink">{t.quote}</blockquote>
                <p className="mt-6 text-sm">
                  <span className="font-bold">{t.name}</span>
                  <span className="text-ink-soft">{[t.role, t.location].filter(Boolean).map((v) => ` · ${v}`)}</span>
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  )
}
