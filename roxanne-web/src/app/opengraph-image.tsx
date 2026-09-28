import { ImageResponse } from 'next/og'
import { defaultContent } from '@/content/defaults'
import { ArchMark, loadOgFonts } from '@/lib/og'

export const alt = 'RoxanneAlexia Language Coach — Law & Business English'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  const { brand, home } = defaultContent
  const [first, second] = home.hero.title.split(/(?<=\.)\s+/)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #faf6f0 0%, #f4ece2 55%, #ebd8cc 100%)',
          fontFamily: 'Cormorant',
          color: '#1f2533',
          padding: '64px 72px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 720 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <ArchMark size={40} color="#a5533a" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 40, fontWeight: 600, letterSpacing: -0.5 }}>
                Roxanne<span style={{ fontStyle: 'italic', color: '#a5533a', fontWeight: 500 }}>Alexia</span>
              </div>
              <div style={{ fontSize: 18, letterSpacing: 6, textTransform: 'uppercase', color: '#4a5162' }}>{brand.descriptor}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 22, letterSpacing: 5, textTransform: 'uppercase', color: '#a5533a', marginBottom: 20 }}>{brand.tagline}</div>
            <div style={{ fontSize: 82, lineHeight: 1, letterSpacing: -1.5 }}>{first}</div>
            {second && <div style={{ fontSize: 82, lineHeight: 1.05, fontStyle: 'italic', color: '#a5533a', letterSpacing: -1.5 }}>{second}</div>}
          </div>

          <div style={{ fontSize: 26, color: '#4a5162' }}>Online English courses for professionals in law, business & finance</div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 72,
            top: 70,
            width: 300,
            height: 490,
            borderRadius: '150px 150px 28px 28px',
            background: 'linear-gradient(160deg, #c98a70 0%, #a5533a 55%, #1b2436 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -16,
              top: -16,
              width: 332,
              height: 522,
              borderRadius: '166px 166px 36px 36px',
              border: '2px solid rgba(176,141,87,0.6)',
            }}
          />
          <ArchMark size={120} color="#faf6f0" />
        </div>
      </div>
    ),
    { ...size, fonts: await loadOgFonts() },
  )
}
