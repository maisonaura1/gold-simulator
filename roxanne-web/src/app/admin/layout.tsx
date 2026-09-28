import type { Metadata } from 'next'

/*
 * Wraps the whole dashboard, including the public login page — so no auth
 * check here. The signed-in area lives in the (dashboard) route group, whose
 * layout and pages each call requireAdmin().
 */
export const metadata: Metadata = {
  title: { default: 'Dashboard', template: '%s · Dashboard' },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children
}
