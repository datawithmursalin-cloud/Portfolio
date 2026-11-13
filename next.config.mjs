/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // set NEXT_PUBLIC_BASE_PATH=/Portfolio when building for username.github.io/Portfolio
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: ['geist'],
};
export default nextConfig;
