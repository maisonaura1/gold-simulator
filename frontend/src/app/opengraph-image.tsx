import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GoldTrader — XAUUSD Trading Simulator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          background: '#09090d',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'flex-start',
          padding: '80px 96px',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gold accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 4,
          background: 'linear-gradient(90deg, #c9a84c, #4a3810)',
        }} />

        {/* Background candle decoration */}
        <div style={{
          position: 'absolute', right: 80, top: 0, bottom: 0,
          display: 'flex', alignItems: 'center', opacity: 0.08,
        }}>
          <svg width="340" height="560" viewBox="0 0 340 560">
            <line x1="170" y1="0" x2="170" y2="560" stroke="#e8b84b" strokeWidth="8" strokeLinecap="round"/>
            <rect x="100" y="130" width="140" height="300" rx="12" fill="#f5d76e"/>
          </svg>
        </div>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
          <svg width="40" height="40" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5d76e"/>
                <stop offset="100%" stopColor="#a0711c"/>
              </linearGradient>
            </defs>
            <line x1="10" y1="1" x2="10" y2="19" stroke="#e8b84b" strokeWidth="1.5" strokeLinecap="round"/>
            <rect x="5" y="5" width="10" height="11" rx="1.5" fill="url(#g)"/>
          </svg>
          <span style={{ color: '#e8b84b', fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>GoldTrader</span>
        </div>

        {/* Headline */}
        <div style={{ color: '#ffffff', fontSize: 64, fontWeight: 800, lineHeight: 1.1, marginBottom: 24, maxWidth: 760 }}>
          Practice gold trading.
          <br />
          <span style={{ color: '#e8b84b' }}>Build real discipline.</span>
        </div>

        {/* Subline */}
        <div style={{ color: '#6b7385', fontSize: 24, marginBottom: 56, maxWidth: 640 }}>
          XAU/USD simulator with Trader Score, equity curve, and risk coaching.
          No real money. No broker.
        </div>

        {/* Stats pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            ['8 timeframes', 'M1 → Monthly'],
            ['2yr history', 'Real XAUUSD'],
            ['€9.95', 'Lifetime access'],
            ['20 free', 'No card needed'],
          ].map(([label, sub]) => (
            <div key={label} style={{
              background: '#141414', border: '1px solid #1d2029',
              borderRadius: 8, padding: '12px 20px',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <span style={{ color: '#e8b84b', fontSize: 18, fontWeight: 700 }}>{label}</span>
              <span style={{ color: '#3a3f4d', fontSize: 12 }}>{sub}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
