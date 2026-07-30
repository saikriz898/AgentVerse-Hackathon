import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  transpilePackages: ['lucide-react', 'framer-motion', '@tanstack/react-query'],
};

export default nextConfig;
