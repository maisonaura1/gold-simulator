import 'server-only'
import { z } from 'zod'
import { getStore } from '@/lib/store'

/** Dashboard-only preferences (never shown on the public site). Store key: `admin-prefs`. */
const prefsSchema = z.object({
  /** Manual launch-checklist item: "Review copy drafted by the web team". */
  reviewedDraftCopy: z.boolean().catch(false),
})

export type AdminPrefs = z.infer<typeof prefsSchema>

const PREFS_KEY = 'admin-prefs'

export async function getAdminPrefs(): Promise<AdminPrefs> {
  const stored = await getStore().getJSON<unknown>(PREFS_KEY)
  const parsed = prefsSchema.safeParse(stored ?? {})
  return parsed.success ? parsed.data : { reviewedDraftCopy: false }
}

export async function updateAdminPrefs(patch: Partial<AdminPrefs>): Promise<AdminPrefs> {
  const next = prefsSchema.parse({ ...(await getAdminPrefs()), ...patch })
  await getStore().setJSON(PREFS_KEY, next)
  return next
}
