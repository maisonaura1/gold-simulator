import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { LoginForm } from '@/components/admin/login/LoginForm'
import { SetupInstructions } from '@/components/admin/login/SetupInstructions'
import { Logo } from '@/components/site/Logo'
import { safeAdminPath } from '@/lib/admin/paths'
import { envAdminPassword, getSecrets, isAdmin } from '@/lib/auth'
import { getContent } from '@/lib/data'
import { sessionSecretConfigured } from '@/lib/session'

export const metadata: Metadata = { title: 'Sign in' }

async function passwordConfigured(): Promise<boolean> {
  if (!sessionSecretConfigured()) return false
  if (envAdminPassword()) return true
  return Boolean((await getSecrets()).passwordHash)
}

export default async function LoginPage({ searchParams }: PageProps<'/admin/login'>) {
  if (await isAdmin()) redirect('/admin')

  const { next } = await searchParams
  const [content, configured] = await Promise.all([getContent(), passwordConfigured()])

  return (
    <main className="grain relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12 sm:py-16">
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 size-[34rem] rounded-full bg-blush/70 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-40 size-[30rem] rounded-full bg-sand/60 blur-[100px]" />

      <div className="relative w-full max-w-[27rem]">
        <Link href="/" className="mx-auto block w-fit rounded-xl" aria-label={`${content.brand.name} — back to the website`}>
          <Logo name={content.brand.name} descriptor={content.brand.descriptor} />
        </Link>

        <div className="mt-9 rounded-[1.75rem] border border-line bg-white/90 p-7 shadow-card backdrop-blur-sm sm:p-9">
          {configured ? <LoginForm next={safeAdminPath(Array.isArray(next) ? next[0] : next)} /> : <SetupInstructions />}
        </div>

        <p className="mt-7 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-ink-soft transition hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to the website
          </Link>
        </p>
      </div>
    </main>
  )
}
