# 🚀 现代化MQL5 EA榜单项目 - 配置指南

## 📋 项目概述
基于技术评估，我们将使用2025年最新的技术栈来构建这个项目。

## 🔧 现代化技术栈（2025版）

### 核心技术栈
```json
{
  "前端框架": "Next.js 15.1 + React 19",
  "开发语言": "TypeScript 5.7+",
  "样式系统": "Tailwind CSS 3.4 + shadcn/ui",
  "表单管理": "React Hook Form + Zod",
  "数据获取": "TanStack Query v5",
  "状态管理": "Zustand (轻量级)",
  "后端服务": "Supabase (PostgreSQL + Auth)",
  "部署平台": "Vercel",
  "包管理器": "pnpm (更快更高效)"
}
```

## 📝 配置信息收集清单（优化版）

### 🚨 第一优先级 - 核心账户配置

#### 1. GitHub配置（必需）
```yaml
需要信息:
  - GitHub用户名: ________________
  - GitHub邮箱: ________________
  - 仓库名称: mql5-gold-ea-dashboard
  - 仓库类型: Private
  - 默认分支: main

获取步骤:
  1. 访问 github.com
  2. 创建新仓库
  3. 记录仓库URL
```

#### 2. Supabase配置（必需）
```yaml
需要信息:
  - 项目名称: mql5-gold-ea-dashboard
  - 数据库密码: ________________ (请设置强密码)
  - 项目URL: ________________
  - anon key: ________________
  - service_role key: ________________

获取步骤:
  1. 访问 supabase.com
  2. 使用GitHub登录
  3. 创建新项目
  4. 在Settings > API中获取密钥
```

#### 3. Vercel配置（必需）
```yaml
需要信息:
  - Vercel账户: 使用GitHub登录
  - 项目名称: mql5-gold-ea-dashboard
  - 部署分支: main

获取步骤:
  1. 访问 vercel.com
  2. 使用GitHub登录
  3. 授权访问仓库
```

### ⚡ 第二优先级 - 开发环境配置

#### 4. 本地开发环境
```yaml
需要安装:
  - Node.js: 20.x LTS (最新稳定版)
  - pnpm: 最新版本
  - Git: 已安装在 D:\Program Files\Git
  - VS Code: 推荐编辑器

环境变量配置:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - ADMIN_SECRET_KEY (自定义强密码)
```

## 🛠️ 渐进式实施方案（新手友好）

### 阶段1: 基础环境搭建（Day 1-3）

#### Day 1: 账户创建和配置
- [ ] 创建GitHub仓库
- [ ] 创建Supabase项目
- [ ] 创建Vercel账户
- [ ] 记录所有密钥和URL

#### Day 2: 本地环境准备
- [ ] 安装Node.js 20.x LTS
- [ ] 安装pnpm: `npm install -g pnpm`
- [ ] 配置Git用户信息
- [ ] 克隆仓库到本地

#### Day 3: 项目初始化
- [ ] 使用现代化脚手架创建项目
- [ ] 配置TypeScript和ESLint
- [ ] 安装shadcn/ui组件库
- [ ] 配置环境变量

### 阶段2: 数据库设计（Day 4-5）

#### 优化后的数据库结构
```sql
-- 1. EA基础信息表（增强版）
CREATE TABLE eas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2. EA统计数据表（增强版）
CREATE TABLE ea_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ea_id UUID REFERENCES eas(id) ON DELETE CASCADE,
    year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2030),
    month INTEGER CHECK (month >= 1 AND month <= 12),
    win_rate DECIMAL(5,2) CHECK (win_rate >= 0 AND win_rate <= 100),
    drawdown DECIMAL(8,4) CHECK (drawdown >= 0),
    avg_risk_reward DECIMAL(8,4),
    max_risk_reward DECIMAL(8,4),
    annual_return DECIMAL(8,4),
    monthly_return DECIMAL(8,4),
    total_trades INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 复合唯一约束
    UNIQUE(ea_id, year, month)
);

-- 3. 用户建议表（增强版）
CREATE TABLE user_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ea_name TEXT NOT NULL,
    ea_link TEXT,
    user_ip INET NOT NULL,
    user_agent TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'implemented')),
    admin_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 广告配置表（增强版）
CREATE TABLE ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    position TEXT NOT NULL CHECK (position IN ('left', 'right', 'footer', 'header')),
    image_url TEXT NOT NULL,
    link_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 系统配置表（新增）
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key TEXT NOT NULL UNIQUE,
    config_value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引优化查询性能
CREATE INDEX idx_ea_stats_ea_id ON ea_stats(ea_id);
CREATE INDEX idx_ea_stats_year_month ON ea_stats(year, month);
CREATE INDEX idx_ea_stats_win_rate ON ea_stats(win_rate DESC);
CREATE INDEX idx_ea_stats_drawdown ON ea_stats(drawdown ASC);
CREATE INDEX idx_ea_stats_annual_return ON ea_stats(annual_return DESC);
CREATE INDEX idx_user_requests_ip_date ON user_requests(user_ip, DATE(submitted_at));
CREATE INDEX idx_ads_position_active ON ads(position, is_active);
CREATE INDEX idx_eas_active_featured ON eas(is_active, is_featured);

-- 创建视图简化查询
CREATE VIEW ea_rankings AS
SELECT 
    e.id,
    e.name,
    e.logo_url,
    e.description,
    e.is_featured,
    s.win_rate,
    s.drawdown,
    s.avg_risk_reward,
    s.max_risk_reward,
    s.annual_return,
    s.monthly_return,
    s.year,
    s.month
FROM eas e
LEFT JOIN ea_stats s ON e.id = s.ea_id
WHERE e.is_active = true AND e.deleted_at IS NULL;
```

### 阶段3: 核心功能开发（Day 6-15）

#### 现代化组件架构
```typescript
// 1. 类型定义 (types/index.ts)
export interface EA {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  is_featured: boolean;
}

export interface EAStats {
  id: string;
  ea_id: string;
  year: number;
  month?: number;
  win_rate: number;
  drawdown: number;
  avg_risk_reward: number;
  max_risk_reward: number;
  annual_return: number;
  monthly_return: number;
}

// 2. API客户端 (lib/supabase.ts)
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 3. 数据获取钩子 (hooks/useEARankings.ts)
import { useQuery } from '@tanstack/react-query';

export function useEARankings(rankingType: string) {
  return useQuery({
    queryKey: ['ea-rankings', rankingType],
    queryFn: () => fetchEARankings(rankingType),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });
}
```

### 阶段4: 安全性和性能优化（Day 16-18）

#### 安全性配置
```typescript
// 1. 输入验证 (lib/validation.ts)
import { z } from 'zod';

export const userRequestSchema = z.object({
  ea_name: z.string().min(1).max(100),
  ea_link: z.string().url().optional(),
});

// 2. 速率限制 (middleware.ts)
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: /* Redis配置 */,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
});

// 3. CORS配置 (next.config.js)
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE' },
        ],
      },
    ];
  },
};
```

## 📊 性能优化策略

### 1. 图片优化
```typescript
// 使用Next.js Image组件
import Image from 'next/image';

<Image
  src={ea.logo_url}
  alt={ea.name}
  width={64}
  height={64}
  className="rounded-lg"
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 2. 数据缓存策略
```typescript
// 1. 服务端缓存
export const revalidate = 300; // 5分钟重新验证

// 2. 客户端缓存
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});
```

### 3. 代码分割
```typescript
// 动态导入大型组件
const EADetailModal = dynamic(() => import('./EADetailModal'), {
  loading: () => <Skeleton className="h-96 w-full" />,
});
```

## 🔍 监控和分析配置

### 1. 错误监控
```typescript
// 错误边界组件
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundaryProvider
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
        // 发送到错误监控服务
      }}
    >
      {children}
    </ErrorBoundaryProvider>
  );
}
```

### 2. 性能监控
```typescript
// Web Vitals监控
export function reportWebVitals(metric: any) {
  console.log(metric);
  // 发送到分析服务
}
```

## 📋 部署检查清单

### 部署前检查
- [ ] 所有环境变量已配置
- [ ] 数据库表已创建
- [ ] 测试数据已导入
- [ ] 本地测试通过
- [ ] TypeScript编译无错误
- [ ] ESLint检查通过

### 部署后验证
- [ ] 网站可正常访问
- [ ] 数据库连接正常
- [ ] API端点响应正确
- [ ] 图片加载正常
- [ ] 表单提交功能正常
- [ ] 移动端显示正常

## 🎯 成功指标

### 技术指标
- 页面加载时间 < 2秒
- Lighthouse性能分数 > 90
- 零TypeScript错误
- 测试覆盖率 > 80%

### 业务指标
- 用户停留时间 > 2分钟
- 跳出率 < 50%
- 表单提交成功率 > 95%
- 移动端访问占比 > 40%

---

**下一步**: 请确认您已准备好上述配置信息，我将帮您开始项目的实际搭建工作！
