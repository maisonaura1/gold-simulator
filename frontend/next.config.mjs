/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  experimental: { typedRoutes: false },
  images: { unoptimized: true },
};

export default nextConfig;
