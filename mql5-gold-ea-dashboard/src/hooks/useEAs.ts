import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-client';
import { EAData } from '../components/EACard';

// EA数据获取参数类型
export interface EAQueryParams {
  sortBy: 'win_rate' | 'drawdown' | 'max_risk_reward' | 'avg_risk_reward' | 'annual_return' | 'monthly_return';
  year: number;
  month?: number | null;
  limit?: number;
}

// API响应类型
interface EAApiResponse {
  data: EAData[];
  sortBy: string;
  year: number;
  month?: number | null;
  total: number;
  message?: string;
}

// 获取EA数据的API函数
async function fetchEAs(params: EAQueryParams): Promise<EAApiResponse> {
  const searchParams = new URLSearchParams({
    sortBy: params.sortBy,
    year: params.year.toString(),
    limit: (params.limit || 10).toString()
  });

  if (params.month) {
    searchParams.append('month', params.month.toString());
  }

  const response = await fetch(`/api/eas?${searchParams}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// 使用EA数据的Hook
export function useEAs(params: EAQueryParams) {
  return useQuery({
    queryKey: queryKeys.eas.list(params),
    queryFn: () => fetchEAs(params),
    // 启用后台重新获取
    refetchOnWindowFocus: true,
    // 启用网络重连时重新获取
    refetchOnReconnect: true,
    // 数据被认为是新鲜的时间（5分钟）
    staleTime: 5 * 60 * 1000,
    // 错误重试配置
    retry: (failureCount, error) => {
      // 对于客户端错误（4xx）不重试
      if (error.message.includes('HTTP 4')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// 获取可用时间范围的API函数
async function fetchAvailableTimeRanges() {
  const response = await fetch('/api/eas', {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// 使用可用时间范围的Hook
export function useAvailableTimeRanges() {
  return useQuery({
    queryKey: queryKeys.timeRanges.available(),
    queryFn: fetchAvailableTimeRanges,
    // 时间范围数据变化较少，可以缓存更长时间
    staleTime: 30 * 60 * 1000, // 30分钟
    gcTime: 60 * 60 * 1000, // 1小时
  });
}

// 预加载EA数据的函数
export function prefetchEAs(params: EAQueryParams) {
  return queryKeys.eas.list(params);
}
