import { Skeleton } from '@/components/admin/ui/primitives'

export default function DashboardLoading() {
  return (
    <div role="status" aria-label="Loading" className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-2xl" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
