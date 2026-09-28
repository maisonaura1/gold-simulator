'use client'

import { RotateCcw, TriangleAlert } from 'lucide-react'
import { AdminButton, AdminButtonLink, Card } from '@/components/admin/ui/primitives'

export default function DashboardError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <Card className="mx-auto mt-6 max-w-xl p-8 text-center sm:p-10">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-blush text-clay-dark" aria-hidden>
        <TriangleAlert className="size-6" />
      </span>
      <h1 className="mt-5 font-display text-3xl text-ink">Something went wrong</h1>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
        This part of the dashboard couldn’t be loaded. Your website is not affected. Please try again — if it keeps
        happening, send this reference to your web team:{' '}
        <span className="font-mono text-sm text-ink">{error.digest ?? 'no reference'}</span>
      </p>
      <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
        <AdminButton variant="primary" onClick={() => retry()}>
          <RotateCcw aria-hidden />
          Try again
        </AdminButton>
        <AdminButtonLink href="/admin" variant="secondary">
          Back to overview
        </AdminButtonLink>
      </div>
    </Card>
  )
}
