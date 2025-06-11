/** @type {import('next').NextConfig} */
const nextConfig = {
  // 强制禁用Babel，确保使用SWC
  experimental: {
    forceSwcTransforms: true,
    esmExternals: true,
  },

  // 图片配置
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // SWC编译器配置 - 强制启用
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 构建配置
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Webpack配置 - 确保路径别名正确解析
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 确保路径别名在Webpack中正确配置
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };

    return config;
  },
};

module.exports = nextConfig;