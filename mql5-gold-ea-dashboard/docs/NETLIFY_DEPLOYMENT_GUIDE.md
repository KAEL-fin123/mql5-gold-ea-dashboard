# Netlify 自动部署指南

本指南将帮助你通过 Netlify CLI 自动部署 MQL5 Gold EA Dashboard 项目。

## 🚀 快速开始

### 1. 安装 Netlify CLI

```bash
# 全局安装 Netlify CLI
npm install -g netlify-cli

# 验证安装
netlify --version
```

### 2. 登录 Netlify

```bash
# 登录你的 Netlify 账号
netlify login
```

### 3. 一键部署

```bash
# 方法一：使用我们的自动化脚本（推荐）
npm run deploy

# 方法二：分步执行
npm run netlify:setup  # 设置环境变量
npm run netlify:deploy # 部署项目
```

## 📋 详细步骤

### 步骤 1：环境变量设置

运行环境变量设置脚本：

```bash
npm run netlify:setup
```

这个脚本会自动：
- 读取你的 `.env.local` 文件
- 将所有必要的环境变量设置到 Netlify
- 包括 Supabase 配置、管理员密钥等

### 步骤 2：项目部署

运行部署脚本：

```bash
npm run netlify:deploy
```

这个脚本会自动：
- 检查 Netlify CLI 是否已安装
- 验证登录状态
- 构建项目（`npm run build`）
- 部署到 Netlify 生产环境

## 🔧 手动部署（高级用户）

如果你想要更多控制，可以手动执行以下步骤：

### 1. 初始化 Netlify 站点

```bash
# 在项目根目录运行
netlify init
```

### 2. 设置环境变量

```bash
# 手动设置每个环境变量
netlify env:set NEXT_PUBLIC_SUPABASE_URL "your_supabase_url"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your_anon_key"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "your_service_role_key"
netlify env:set ADMIN_SECRET_KEY "your_admin_secret"

# 查看已设置的环境变量
netlify env:list
```

### 3. 构建和部署

```bash
# 本地构建
npm run build

# 预览部署（可选）
netlify deploy --dir=out

# 生产部署
netlify deploy --prod --dir=out
```

## 🌐 本地开发

使用 Netlify Dev 进行本地开发：

```bash
# 启动 Netlify 本地开发服务器
npm run netlify:dev

# 或者直接使用
netlify dev
```

这将启动一个本地服务器，模拟 Netlify 的生产环境。

## 📁 项目配置文件

### netlify.toml

项目已经配置了 `netlify.toml` 文件，包含：

```toml
[build]
  publish = "out"          # 发布目录
  command = "npm run build" # 构建命令

[build.environment]
  NODE_VERSION = "18"       # Node.js 版本
  NPM_VERSION = "9"         # npm 版本

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200              # SPA 路由支持

# 性能优化
[build.processing]
  skip_processing = false
[build.processing.css]
  bundle = true
  minify = true
[build.processing.js]
  bundle = true
  minify = true
```

### next.config.js

已配置为支持静态导出：

```javascript
const nextConfig = {
  output: 'export',        // 静态导出
  trailingSlash: true,     # URL 尾部斜杠
  images: {
    unoptimized: true      # 图片优化关闭（静态导出需要）
  },
  experimental: {
    cssChunking: 'strict'  # CSS V4 支持
  }
};
```

## 🔍 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清理依赖并重新安装
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **环境变量未生效**
   ```bash
   # 检查环境变量
   netlify env:list
   
   # 重新设置
   npm run netlify:setup
   ```

3. **部署超时**
   ```bash
   # 增加构建超时时间
   netlify deploy --prod --dir=out --timeout=600
   ```

4. **路由问题**
   - 确保 `netlify.toml` 中的重定向规则正确
   - 检查 Next.js 路由配置

### 调试命令

```bash
# 查看站点状态
netlify status

# 查看部署日志
netlify logs

# 在浏览器中打开站点
netlify open

# 查看站点信息
netlify sites:list
```

## 🎯 性能优化

### 1. 构建优化

- 启用了 CSS/JS 压缩和合并
- 配置了静态资源优化
- 使用了 esbuild 作为函数打包器

### 2. 缓存策略

Netlify 自动处理静态资源缓存，你也可以在 `netlify.toml` 中自定义：

```toml
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. CDN 加速

Netlify 提供全球 CDN，自动优化资源分发。

## 🔐 安全配置

### 环境变量安全

- 敏感信息（如 API 密钥）存储在 Netlify 环境变量中
- 不要在代码中硬编码敏感信息
- 定期轮换 API 密钥

### HTTPS

Netlify 自动提供 HTTPS 证书，无需额外配置。

## 📊 监控和分析

### 1. 部署监控

```bash
# 查看最近的部署
netlify deploys

# 查看特定部署的详情
netlify deploys:get <deploy-id>
```

### 2. 性能分析

- 使用 Netlify Analytics（付费功能）
- 集成 Google Analytics
- 使用 Lighthouse 进行性能测试

## 🚀 自动化部署

### GitHub Actions 集成

你可以设置 GitHub Actions 来自动部署：

```yaml
# .github/workflows/netlify.yml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './out'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📞 获取帮助

如果遇到问题：

1. 查看 [Netlify 官方文档](https://docs.netlify.com/)
2. 检查项目的 `docs/` 目录中的其他文档
3. 运行 `netlify help` 查看 CLI 帮助
4. 在项目 Issues 中提问

---

🎉 **恭喜！** 你的项目现在已经可以通过 Netlify CLI 自动部署了！

使用 `npm run deploy` 开始你的第一次部署吧！