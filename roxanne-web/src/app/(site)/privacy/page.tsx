import type { Metadata } from 'next'
import { Reveal } from '@/components/ui/Reveal'
import { getContent, getSettings } from '@/lib/data'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const { privacy } = await getContent()
  return pageMetadata(privacy.meta, '/privacy')
}

export default async function PrivacyPage() {
  const [{ privacy, brand }, settings] = await Promise.all([getContent(), getSettings()])

  return (
    <article className="relative pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="container-site max-w-3xl">
        <Reveal>
          <p className="eyebrow">{brand.name} {brand.descriptor}</p>
          <h1 className="display-lg mt-6">{privacy.title}</h1>
          <p className="mt-4 text-sm text-ink-soft">Last updated: {privacy.updated}</p>
        </Reveal>
        <div className="hairline my-12" />
        <div className="space-y-10">
          {privacy.sections.map((section) => (
            <Reveal key={section.title}>
              <h2 className="font-display text-3xl">{section.title}</h2>
              <p className="mt-3 text-lg leading-relaxed text-ink-soft">{section.body}</p>
            </Reveal>
          ))}
          {settings.email && (
            <Reveal>
              <p className="rounded-2xl bg-cream px-6 py-5 text-ink-soft">
                Contact:{' '}
                <a href={`mailto:${settings.email}`} className="font-semibold break-all text-ink underline decoration-line underline-offset-4 hover:decoration-clay">
                  {settings.email}
                </a>
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </article>
  )
}
