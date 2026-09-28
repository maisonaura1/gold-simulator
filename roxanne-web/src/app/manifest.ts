import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RoxanneAlexia Language Coach',
    short_name: 'RoxanneAlexia',
    description: 'Online English courses for professionals in law, business, and finance.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf6f0',
    theme_color: '#faf6f0',
    icons: [
      { src: '/icon', sizes: '64x64', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
