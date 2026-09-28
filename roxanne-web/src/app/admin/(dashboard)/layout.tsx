import { AdminShell } from '@/components/admin/shell/AdminShell'
import { countNewMessages } from '@/lib/admin/overview'
import { requireAdmin } from '@/lib/auth'
import { getContent } from '@/lib/data'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  const [content, newMessages] = await Promise.all([getContent(), countNewMessages()])

  return (
    <AdminShell brandName={content.brand.name} brandDescriptor={content.brand.descriptor} newMessages={newMessages}>
      {children}
    </AdminShell>
  )
}
