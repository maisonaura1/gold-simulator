import type { Metadata } from 'next'
import { SiteChrome } from '@/components/site/SiteChrome'
import { ButtonLink } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="grain relative flex min-h-[80svh] items-center overflow-hidden bg-cream pt-32 pb-20">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 size-[34rem] rounded-full bg-blush/80 blur-[110px]" />
        <div className="container-site relative text-center">
          <p className="eyebrow justify-center">Error 404</p>
          <h1 className="display-xl mx-auto mt-6 max-w-3xl">
            Lost in <em className="text-clay">translation?</em>
          </h1>
          <p className="lead mx-auto mt-6 max-w-lg">The page you were looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/" arrow>
              Back to home
            </ButtonLink>
            <ButtonLink href="/courses" variant="secondary">
              Explore courses
            </ButtonLink>
          </div>
        </div>
      </section>
    </SiteChrome>
  )
}
