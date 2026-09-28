import type { Metadata } from 'next'
import { Database, Download, HardDrive } from 'lucide-react'
import { PasswordForm } from '@/components/admin/settings/PasswordForm'
import { SettingsForm } from '@/components/admin/settings/SettingsForm'
import { buttonStyles, Callout, Card, CardHeader, PageHeader } from '@/components/admin/ui/primitives'
import type { EditableSettings } from '@/lib/admin/actions/settings'
import { getSecrets, requireAdmin } from '@/lib/auth'
import { getSettings } from '@/lib/data'
import { getStore, storeLooksEphemeral } from '@/lib/store'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  await requireAdmin()
  const [settings, secrets] = await Promise.all([getSettings(), getSecrets()])
  const editable: EditableSettings = {
    email: settings.email,
    whatsappNumber: settings.whatsappNumber,
    showPhone: settings.showPhone,
    calendlyUrl: settings.calendlyUrl,
    socials: settings.socials,
    notifyByEmail: settings.notifyByEmail,
  }
  const storeKind = getStore().kind
  const ephemeral = storeLooksEphemeral()

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="Your contact details, links and dashboard password." />

      <SettingsForm initial={editable} emailConfigured={Boolean(process.env.RESEND_API_KEY)} />

      <PasswordForm usesServerPassword={!secrets.passwordHash} />

      <Card className="scroll-mt-24 p-5 sm:p-7" id="backup" aria-labelledby="backup-title">
        <CardHeader
          id="backup-title"
          icon={storeKind === 'redis' ? <Database /> : <HardDrive />}
          title="Backup & storage"
          description="A copy of everything you changed in this dashboard, for safekeeping."
        />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-ivory p-5">
            <p className="text-sm font-semibold text-ink">Download a backup</p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-soft">
              Your text changes, settings, testimonials, messages and the list of uploaded photos, in one file. Passwords
              and the photo files themselves are not included.
            </p>
            <a href="/api/admin/backup" download className={buttonStyles({ variant: 'secondary', size: 'sm', className: 'mt-4' })}>
              <Download aria-hidden />
              Download backup (JSON)
            </a>
          </div>
          <div className="rounded-2xl bg-ivory p-5">
            <p className="text-sm font-semibold text-ink">Where your changes are stored</p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-soft">
              {storeKind === 'redis'
                ? 'In an Upstash Redis database — safe across updates of your website.'
                : 'In files on the website’s server (the “data” folder).'}
            </p>
            {ephemeral && (
              <Callout tone="warning" className="mt-4" title="Not permanent on this host">
                Changes may be lost. Ask your web team to connect Upstash Redis (<code>UPSTASH_REDIS_REST_URL</code> and{' '}
                <code>UPSTASH_REDIS_REST_TOKEN</code>).
              </Callout>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
