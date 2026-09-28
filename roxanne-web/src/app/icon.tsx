import { ImageResponse } from 'next/og'
import { ArchMark } from '@/lib/og'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#a5533a', borderRadius: 14 }}>
        <ArchMark size={34} color="#faf6f0" />
      </div>
    ),
    size,
  )
}
