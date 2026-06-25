/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  experimental: { typedRoutes: false },
  images: { unoptimized: true },
};

export default nextConfig;
