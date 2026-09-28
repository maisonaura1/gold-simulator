import { ImageResponse } from 'next/og'
import { ArchMark } from '@/lib/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #b8664a, #a5533a 60%, #8e4630)' }}>
        <ArchMark size={86} color="#faf6f0" />
      </div>
    ),
    size,
  )
}
