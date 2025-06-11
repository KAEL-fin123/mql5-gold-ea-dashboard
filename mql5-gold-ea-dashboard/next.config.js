/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // 强制禁用Babel，确保使用SWC
  experimental: {
    forceSwcTransforms: true,
    esmExternals: true,
    // 完全禁用Babel
    swcPlugins: [],
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

  // Webpack配置 - 强制路径别名解析
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 强制设置路径别名
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/app': path.resolve(__dirname, 'src/app'),
    };

    // 确保模块解析顺序
    config.resolve.modules = [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ];

    // 强制禁用任何Babel相关的loader
    config.module.rules = config.module.rules.filter(rule => {
      if (rule.use && Array.isArray(rule.use)) {
        return !rule.use.some(use =>
          use.loader && use.loader.includes('babel')
        );
      }
      return true;
    });

    return config;
  },
};

module.exports = nextConfig;