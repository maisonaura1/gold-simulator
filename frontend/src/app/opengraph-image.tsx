import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GoldTrader MT — Academia de trading de oro con simulador';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#08090c',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 96px',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #f0d88c, #a8842d)' }} />
        <div style={{ display: 'flex', color: '#ddb54a', fontSize: 28, fontWeight: 700, letterSpacing: 2 }}>GOLDTRADER MT</div>
        <div style={{ display: 'flex', color: '#eceef3', fontSize: 68, fontWeight: 700, lineHeight: 1.1, marginTop: 24, maxWidth: 960 }}>
          Aprende a operar oro paso a paso
        </div>
        <div style={{ display: 'flex', color: '#a3a9b8', fontSize: 32, marginTop: 24 }}>Academia en 6 etapas · Simulador con datos reales · Sin riesgo</div>
      </div>
    ),
    { ...size },
  );
}
