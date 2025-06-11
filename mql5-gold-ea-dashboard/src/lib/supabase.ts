import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 服务端使用的客户端（具有更高权限）
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// 导出createClient函数供API路由使用
export { createClient }

// 数据库类型定义
export interface EA {
  id: string
  name: string
  logo_url?: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface EAStats {
  id: string
  ea_id: string
  year: number
  month?: number
  win_rate: number
  drawdown: number
  avg_risk_reward: number
  max_risk_reward: number
  annual_return: number
  monthly_return: number
  created_at?: string
  updated_at?: string
}

export interface UserRequest {
  id: string
  ea_name: string
  user_ip: string
  submitted_at: string
}

export interface Ad {
  id: string
  position: string
  image_url: string
  link_url: string
  is_active: boolean
  updated_at: string
}

// 榜单类型定义
export type RankingType = 
  | 'win_rate'
  | 'drawdown' 
  | 'max_risk_reward'
  | 'avg_risk_reward'
  | 'annual_return'
  | 'monthly_return'

// 扩展的EA数据（包含统计信息）
export interface EAWithStats extends EA {
  latest_stats?: EAStats
  annual_stats?: EAStats[]
  monthly_stats?: EAStats[]
}
