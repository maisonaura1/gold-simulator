import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV !== 'production'

if (!isDev && !process.env.NEXT_PUBLIC_SITE_URL && !process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  console.warn('\n⚠ NEXT_PUBLIC_SITE_URL is not set — canonical URLs, sitemap and social cards will point to localhost.\n')
}

// Generated photos live on the Higgsfield CDN until `npm run photos:localize`
// copies them into /public/images.
const PHOTO_CDN = 'd8j0ntlcm91z4.cloudfront.net'

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
  'frame-src https://calendly.com https://*.calendly.com',
  "worker-src 'self' blob:",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Fonts read from disk by the generated social image.
  outputFileTracingIncludes: { '/*': ['./src/assets/fonts/*.woff'] },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
    remotePatterns: [{ protocol: 'https', hostname: PHOTO_CDN, pathname: '/**' }],
  },
  experimental: {
    serverActions: {
      // Photos are resized in the browser before upload; this leaves headroom.
      bodySizeLimit: '6mb',
    },
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ]
  },
}

export default nextConfig
