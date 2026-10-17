/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: { unoptimized: true },
  // Direcciones de la versión anterior de la app
  async redirects() {
    return [
      { source: '/learn', destination: '/academy', permanent: true },
      { source: '/guide', destination: '/academy', permanent: true },
      { source: '/stats', destination: '/journal', permanent: true },
      { source: '/history', destination: '/journal', permanent: true },
    ];
  },
};

export default nextConfig;
