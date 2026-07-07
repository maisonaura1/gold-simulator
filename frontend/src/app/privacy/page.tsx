'use client';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="landing-scroll min-h-screen" style={{ background: '#07080b', color: '#c8cdd8' }}>
      <nav className="flex items-center justify-between px-6 py-3 border-b sticky top-0 z-40"
        style={{ borderColor: '#1d2029', background: 'rgba(7,8,11,0.95)', backdropFilter: 'blur(12px)' }}>
        <Link href="/" style={{ color: '#c9a84c', fontWeight: 800, fontSize: 14, letterSpacing: 2, fontFamily: 'monospace', textDecoration: 'none' }}>
          ◆ GOLDTRADER
        </Link>
        <Link href="/" style={{ color: '#6b7385', fontSize: 12, textDecoration: 'none' }}>← Back to home</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16" style={{ fontFamily: 'system-ui, sans-serif' }}>
        <div className="inline-block text-xs font-mono uppercase tracking-widest px-3 py-1 mb-6 rounded-sm"
          style={{ background: '#0f1117', border: '1px solid #2c2410', color: '#c9a84c' }}>
          Legal
        </div>
        <h1 style={{ color: '#e8ecf4', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: '#6b7385', fontSize: 12, marginBottom: 40 }}>Last updated: July 2026</p>

        {[
          {
            title: '1. Who we are',
            body: 'GoldTrader ("we", "us", "our") operates the XAUUSD trading simulator at this website. We are committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR) and applicable EU law.',
          },
          {
            title: '2. Data we collect',
            body: 'We collect: (a) Account data — email address and hashed password when you register. (b) Usage data — trade simulations, Trader Score, mission progress, and session analytics. (c) Payment data — processed by Stripe. We never store card numbers; Stripe handles all payment data under their own PCI-compliant infrastructure. (d) Technical data — IP address, browser type, and session cookies for authentication.',
          },
          {
            title: '3. How we use your data',
            body: 'We use your data to: provide and maintain the simulator service; calculate your Trader Score and performance analytics; send essential account communications (password reset, payment confirmation); improve the product based on aggregate usage patterns. We do not sell your data to third parties. We do not use your data for advertising purposes.',
          },
          {
            title: '4. Legal basis for processing',
            body: 'Under GDPR Article 6, we process your data on the following bases: (a) Contract performance — to provide the service you signed up for. (b) Legitimate interest — to maintain platform security and improve the product. (c) Legal obligation — to comply with financial and tax regulations where applicable.',
          },
          {
            title: '5. Data retention',
            body: 'We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where retention is required by law (e.g. payment records, which are kept for 7 years under EU accounting law).',
          },
          {
            title: '6. Your rights (GDPR)',
            body: 'You have the right to: access the personal data we hold about you; correct inaccurate data; delete your account and associated data ("right to be forgotten"); restrict or object to processing; receive your data in a portable format; withdraw consent at any time where consent is the legal basis. To exercise any of these rights, email us at: privacy@goldtrader.app',
          },
          {
            title: '7. Cookies',
            body: 'We use strictly necessary cookies for authentication (JWT session token). We do not use tracking, advertising, or analytics cookies. No third-party trackers are embedded on this site.',
          },
          {
            title: '8. Third-party services',
            body: 'We use: Stripe (payment processing — their privacy policy applies to payment data); Railway (backend hosting — EU data processing); Vercel (frontend hosting — EU data processing). All processors are covered by appropriate Data Processing Agreements (DPAs).',
          },
          {
            title: '9. Data transfers',
            body: 'Your data is stored on servers within the European Economic Area (EEA). If any data is transferred outside the EEA, we ensure appropriate safeguards are in place (Standard Contractual Clauses).',
          },
          {
            title: '10. Contact',
            body: 'For any privacy-related questions or to exercise your rights, contact us at: privacy@goldtrader.app. You also have the right to lodge a complaint with your national data protection authority.',
          },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#e8ecf4', fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{title}</h2>
            <p style={{ color: '#8893a8', fontSize: 13, lineHeight: 1.8 }}>{body}</p>
          </div>
        ))}
      </div>

      <footer className="border-t px-6 py-6 flex items-center justify-between flex-wrap gap-4"
        style={{ borderColor: '#1d2029', background: '#07080b' }}>
        <div style={{ color: '#3a3f4d', fontSize: 11, fontFamily: 'monospace' }}>◆ GOLDTRADER · XAUUSD Simulator</div>
        <div className="flex gap-5">
          <Link href="/privacy" style={{ color: '#6b7385', fontSize: 11, textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms"   style={{ color: '#3a3f4d', fontSize: 11, textDecoration: 'none' }}>Terms</Link>
          <Link href="/"        style={{ color: '#3a3f4d', fontSize: 11, textDecoration: 'none' }}>Home</Link>
        </div>
      </footer>
    </div>
  );
}
