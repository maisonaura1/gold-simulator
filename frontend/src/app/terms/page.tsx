'use client';
import Link from 'next/link';

export default function TermsPage() {
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
        <h1 style={{ color: '#e8ecf4', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ color: '#6b7385', fontSize: 12, marginBottom: 40 }}>Last updated: July 2026</p>

        {[
          {
            title: '1. Acceptance of terms',
            body: 'By creating an account or using GoldTrader ("the Service"), you agree to these Terms of Service. If you do not agree, do not use the Service. These terms constitute a legally binding agreement between you and GoldTrader.',
          },
          {
            title: '2. Nature of the service',
            body: 'GoldTrader is a SIMULATION platform only. It is not a brokerage, investment adviser, or financial services provider. All trades executed within GoldTrader use virtual capital and historical market data. No real money is at risk. No real trades are placed in any market. Past simulation performance does not guarantee future real trading results.',
          },
          {
            title: '3. Not financial advice',
            body: 'Nothing on GoldTrader constitutes financial advice, investment advice, trading advice, or any other advice. The Trader Score, performance analytics, and educational content are provided for informational and educational purposes only. Always consult a qualified financial adviser before trading with real capital.',
          },
          {
            title: '4. Account registration',
            body: 'You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your credentials. You agree to provide accurate information and to update it if it changes. One account per person. We reserve the right to terminate accounts that violate these terms.',
          },
          {
            title: '5. Free tier and paid plans',
            body: 'The Free tier includes 10 trade simulations at no cost. The Pro plan unlocks unlimited simulations and additional features for a one-time payment. Prices are displayed in EUR inclusive of applicable taxes. The one-time payment grants lifetime access to Pro features as they exist at the time of purchase, plus future updates at our discretion.',
          },
          {
            title: '6. Refund policy',
            body: 'We offer a 30-day money-back guarantee for Pro plan purchases. To request a refund, email support@goldtrader.app within 30 days of purchase. Refunds are processed to the original payment method within 5-10 business days. After 30 days, all purchases are final.',
          },
          {
            title: '7. Market data',
            body: 'XAUUSD historical price data is sourced from third-party providers. While we make reasonable efforts to ensure accuracy, we do not guarantee that data is complete, accurate, or up-to-date. Data is provided for simulation purposes only and may differ from real market conditions.',
          },
          {
            title: '8. Prohibited use',
            body: 'You may not: attempt to reverse-engineer or extract our market data; use automated scripts to generate simulations; share your account credentials; use the service for any unlawful purpose; impersonate other users or GoldTrader staff.',
          },
          {
            title: '9. Intellectual property',
            body: 'All content, code, design, and trademarks on GoldTrader are owned by or licensed to GoldTrader. You may not copy, reproduce, or distribute any part of the Service without express written permission.',
          },
          {
            title: '10. Limitation of liability',
            body: 'To the maximum extent permitted by law, GoldTrader shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to losses incurred in real trading markets after using this simulator.',
          },
          {
            title: '11. Changes to terms',
            body: 'We may update these terms from time to time. We will notify registered users by email of material changes at least 14 days in advance. Continued use of the Service after changes take effect constitutes acceptance of the new terms.',
          },
          {
            title: '12. Governing law',
            body: 'These terms are governed by the laws of the European Union and, where applicable, Dutch law. Any disputes shall be resolved in the courts of the Netherlands.',
          },
          {
            title: '13. Contact',
            body: 'For questions about these terms, contact us at: legal@goldtrader.app',
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
          <Link href="/privacy" style={{ color: '#3a3f4d', fontSize: 11, textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms"   style={{ color: '#6b7385', fontSize: 11, textDecoration: 'none' }}>Terms</Link>
          <Link href="/"        style={{ color: '#3a3f4d', fontSize: 11, textDecoration: 'none' }}>Home</Link>
        </div>
      </footer>
    </div>
  );
}
