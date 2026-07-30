import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@lifeos/types', '@lifeos/config'],
};

export default nextConfig;
