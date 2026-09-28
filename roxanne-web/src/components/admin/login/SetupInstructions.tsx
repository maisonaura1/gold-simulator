import { KeyRound } from 'lucide-react'

const GENERATE_SECRET = `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

/** Shown on the login page until the password and session secret are configured on the server. */
export function SetupInstructions() {
  return (
    <div>
      <span className="grid size-12 place-items-center rounded-2xl bg-cream text-clay" aria-hidden>
        <KeyRound className="size-5" />
      </span>
      <h1 className="mt-5 font-display text-[2.25rem] leading-tight text-ink">Almost ready</h1>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
        The dashboard password hasn’t been set up on the server yet. Please ask your web team to add these two settings
        (environment variables) to the website’s hosting, then redeploy:
      </p>
      <dl className="mt-6 space-y-4 text-sm">
        <div className="rounded-2xl border border-line bg-ivory p-4">
          <dt>
            <code className="rounded-md bg-cream px-1.5 py-0.5 font-mono text-[0.8125rem] font-semibold text-ink">
              ADMIN_PASSWORD
            </code>
          </dt>
          <dd className="mt-2 leading-relaxed text-ink-soft">
            A long password (12 characters or more) used to sign in. You can change it later in Settings.
          </dd>
        </div>
        <div className="rounded-2xl border border-line bg-ivory p-4">
          <dt>
            <code className="rounded-md bg-cream px-1.5 py-0.5 font-mono text-[0.8125rem] font-semibold text-ink">
              SESSION_SECRET
            </code>
          </dt>
          <dd className="mt-2 leading-relaxed text-ink-soft">
            A random secret of at least 32 characters that keeps you signed in securely. It can be generated with:
            <code className="mt-2 block overflow-x-auto rounded-lg bg-navy px-3 py-2 font-mono text-xs whitespace-nowrap text-ivory">
              {GENERATE_SECRET}
            </code>
          </dd>
        </div>
      </dl>
      <p className="mt-5 text-[0.8125rem] leading-relaxed text-ink-soft">
        Both are described in the <code className="font-mono">.env.example</code> file of the project.
      </p>
    </div>
  )
}
