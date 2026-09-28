'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function SiteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="grain relative flex min-h-[70svh] items-center bg-cream pt-32 pb-20">
      <div className="container-site text-center">
        <p className="eyebrow justify-center">Something went wrong</p>
        <h1 className="display-lg mx-auto mt-6 max-w-2xl">This page didn&apos;t load as expected.</h1>
        <p className="lead mx-auto mt-5 max-w-lg">Please try again — or get in touch directly, I&apos;ll be happy to help.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex h-12 items-center justify-center rounded-full bg-clay px-7 font-semibold text-white transition hover:bg-clay-dark"
          >
            Try again
          </button>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full border border-ink/15 px-7 font-semibold transition hover:border-ink/40"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  )
}
