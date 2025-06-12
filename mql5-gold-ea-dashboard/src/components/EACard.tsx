import { TrendingUp, TrendingDown, Target, BarChart3, Calendar } from 'lucide-react';
import Image from 'next/image';

// EA数据类型定义
export interface EAData {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  stats: {
    win_rate: number;
    drawdown: number;
    avg_risk_reward: number;
    max_risk_reward: number;
    annual_return: number;
    monthly_return: number;
  };
  rank: number;
}

interface EACardProps {
  ea: EAData;
  rankingType: string;
  onClick?: () => void;
}

export default function EACard({ ea, rankingType, onClick }: EACardProps) {
  // 获取主要指标值
  const getPrimaryMetric = () => {
    switch (rankingType) {
      case 'win_rate':
        return { value: ea.stats.win_rate, unit: '%', label: '胜率' };
      case 'drawdown':
        return { value: ea.stats.drawdown, unit: '%', label: '最大回撤' };
      case 'max_risk_reward':
        return { value: ea.stats.max_risk_reward, unit: '', label: '最大盈亏比' };
      case 'avg_risk_reward':
        return { value: ea.stats.avg_risk_reward, unit: '', label: '平均盈亏比' };
      case 'annual_return':
        return { value: ea.stats.annual_return, unit: '%', label: '年化收益' };
      case 'monthly_return':
        return { value: ea.stats.monthly_return, unit: '%', label: '月度收益' };
      default:
        return { value: ea.stats.win_rate, unit: '%', label: '胜率' };
    }
  };

  // 获取指标颜色类
  const getMetricColor = (type: string, value: number) => {
    switch (type) {
      case 'win_rate':
      case 'annual_return':
      case 'monthly_return':
      case 'max_risk_reward':
      case 'avg_risk_reward':
        return value > 0 ? 'metric-positive' : 'metric-negative';
      case 'drawdown':
        return value < 15 ? 'metric-positive' : value < 25 ? 'metric-neutral' : 'metric-negative';
      default:
        return 'metric-neutral';
    }
  };

  // 获取排名徽章颜色
  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-primary text-background';
    if (rank <= 3) return 'bg-accent text-background';
    if (rank <= 5) return 'bg-secondary text-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const primaryMetric = getPrimaryMetric();

  return (
    <div
      className="ea-card group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        {/* EA基本信息 */}
        <div className="flex items-center gap-3 flex-1">
          {/* EA Logo */}
          <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
            {ea.logo_url ? (
              <Image
                src={ea.logo_url}
                alt={ea.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded object-cover"
                onError={(e) => {
                  // 如果图片加载失败，显示默认图标
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <BarChart3 className="w-6 h-6 text-green-500" />
            )}
            {/* 备用图标，当图片加载失败时显示 */}
            {ea.logo_url && (
              <BarChart3 className="w-6 h-6 text-green-500 hidden" />
            )}
          </div>
          
          {/* EA名称和描述 */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-lg truncate">
              {ea.name}
            </h3>
            {ea.description && (
              <p className="text-muted-foreground text-sm line-clamp-2">
                {ea.description}
              </p>
            )}
          </div>
        </div>

        {/* 排名徽章 */}
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getRankBadgeColor(ea.rank)}`}>
          #{ea.rank}
        </div>
      </div>

      {/* 主要指标展示 */}
      <div className="mb-4">
        <div className="text-center p-4 rounded-lg bg-secondary/30">
          <div className="text-sm text-muted-foreground mb-1">
            {primaryMetric.label}
          </div>
          <div className={`text-3xl font-bold ${getMetricColor(rankingType, primaryMetric.value)}`}>
            {primaryMetric.value.toFixed(2)}{primaryMetric.unit}
          </div>
        </div>
      </div>

      {/* 详细指标网格 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 胜率 */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">胜率</span>
          </div>
          <div className={`font-semibold ${getMetricColor('win_rate', ea.stats.win_rate)}`}>
            {ea.stats.win_rate.toFixed(1)}%
          </div>
        </div>

        {/* 最大回撤 */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingDown className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">回撤</span>
          </div>
          <div className={`font-semibold ${getMetricColor('drawdown', ea.stats.drawdown)}`}>
            {ea.stats.drawdown.toFixed(1)}%
          </div>
        </div>

        {/* 平均盈亏比 */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">盈亏比</span>
          </div>
          <div className={`font-semibold ${getMetricColor('avg_risk_reward', ea.stats.avg_risk_reward)}`}>
            {ea.stats.avg_risk_reward.toFixed(2)}
          </div>
        </div>

        {/* 年化收益 */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">年化</span>
          </div>
          <div className={`font-semibold ${getMetricColor('annual_return', ea.stats.annual_return)}`}>
            {ea.stats.annual_return.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* 悬停效果指示器 */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="text-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
          点击查看详细信息
        </div>
      </div>
    </div>
  );
}
