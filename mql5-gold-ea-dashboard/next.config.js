/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除turbopack配置以避免Vercel构建问题
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // SWC编译器配置
  compiler: {
    // 移除console.log在生产环境
    removeConsole: process.env.NODE_ENV === 'production',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 确保正确的模块解析
  experimental: {
    esmExternals: true,
  },
};

module.exports = nextConfig;