import { FileQuestion } from 'lucide-react'
import { AdminButtonLink, Card } from '@/components/admin/ui/primitives'

export default function DashboardNotFound() {
  return (
    <Card className="mx-auto mt-6 max-w-xl p-8 text-center sm:p-10">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-cream text-clay" aria-hidden>
        <FileQuestion className="size-6" />
      </span>
      <h1 className="mt-5 font-display text-3xl text-ink">This page doesn’t exist</h1>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
        The link may be old or mistyped. Everything you need is in the menu.
      </p>
      <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
        <AdminButtonLink href="/admin" variant="primary">
          Go to the overview
        </AdminButtonLink>
        <AdminButtonLink href="/admin/pages" variant="secondary">
          Edit your pages
        </AdminButtonLink>
      </div>
    </Card>
  )
}
