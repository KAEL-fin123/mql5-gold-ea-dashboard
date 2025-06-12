'use client';

import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BarChart3, 
  Calendar, 
  DollarSign,
  Award,
  Activity,
  Info
} from 'lucide-react';
import Image from 'next/image';
import Modal from './ui/Modal';
import { EAData } from './EACard';

interface EADetailModalProps {
  ea: EAData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EADetailModal({ ea, isOpen, onClose }: EADetailModalProps) {
  if (!ea) return null;

  // 获取指标颜色类
  const getMetricColor = (value: number, type: 'positive' | 'negative' | 'drawdown') => {
    switch (type) {
      case 'positive':
        return value > 0 ? 'text-accent' : 'text-destructive';
      case 'negative':
        return value < 0 ? 'text-destructive' : 'text-accent';
      case 'drawdown':
        return value < 15 ? 'text-accent' : value < 25 ? 'text-primary' : 'text-destructive';
      default:
        return 'text-foreground';
    }
  };

  // 获取排名徽章颜色
  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-primary text-background';
    if (rank <= 3) return 'bg-accent text-background';
    if (rank <= 5) return 'bg-secondary text-foreground';
    return 'bg-muted text-muted-foreground';
  };

  // 指标数据
  const metrics = [
    {
      icon: TrendingUp,
      label: '胜率',
      value: ea.stats.win_rate,
      unit: '%',
      color: getMetricColor(ea.stats.win_rate, 'positive'),
      description: '交易成功的比例'
    },
    {
      icon: TrendingDown,
      label: '最大回撤',
      value: ea.stats.drawdown,
      unit: '%',
      color: getMetricColor(ea.stats.drawdown, 'drawdown'),
      description: '账户资金的最大损失幅度'
    },
    {
      icon: Target,
      label: '平均盈亏比',
      value: ea.stats.avg_risk_reward,
      unit: '',
      color: getMetricColor(ea.stats.avg_risk_reward, 'positive'),
      description: '平均盈利与平均亏损的比值'
    },
    {
      icon: BarChart3,
      label: '最大盈亏比',
      value: ea.stats.max_risk_reward,
      unit: '',
      color: getMetricColor(ea.stats.max_risk_reward, 'positive'),
      description: '单笔交易的最大盈亏比'
    },
    {
      icon: Calendar,
      label: '年化收益',
      value: ea.stats.annual_return,
      unit: '%',
      color: getMetricColor(ea.stats.annual_return, 'positive'),
      description: '年度投资回报率'
    },
    {
      icon: DollarSign,
      label: '月度收益',
      value: ea.stats.monthly_return,
      unit: '%',
      color: getMetricColor(ea.stats.monthly_return, 'positive'),
      description: '当月投资回报率'
    }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${ea.name} - 详细信息`}
      size="xl"
    >
      <div className="p-6">
        {/* EA基本信息 */}
        <div className="flex items-start gap-6 mb-8">
          {/* EA Logo */}
          <div className="w-20 h-20 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
            {ea.logo_url ? (
              <Image
                src="/logos/placeholder.svg"
                alt={ea.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <BarChart3 className="w-10 h-10 text-accent" />
            )}
          </div>

          {/* EA信息 */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-foreground">
                {ea.name}
              </h3>
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${getRankBadgeColor(ea.rank)}`}>
                <Award className="w-4 h-4 inline mr-1" />
                #{ea.rank}
              </div>
            </div>
            
            {ea.description && (
              <p className="text-muted-foreground text-lg mb-4">
                {ea.description}
              </p>
            )}

            {/* 快速指标 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-secondary/30">
                <div className="text-sm text-muted-foreground mb-1">胜率</div>
                <div className={`text-xl font-bold ${getMetricColor(ea.stats.win_rate, 'positive')}`}>
                  {ea.stats.win_rate.toFixed(1)}%
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/30">
                <div className="text-sm text-muted-foreground mb-1">年化收益</div>
                <div className={`text-xl font-bold ${getMetricColor(ea.stats.annual_return, 'positive')}`}>
                  {ea.stats.annual_return.toFixed(1)}%
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/30">
                <div className="text-sm text-muted-foreground mb-1">最大回撤</div>
                <div className={`text-xl font-bold ${getMetricColor(ea.stats.drawdown, 'drawdown')}`}>
                  {ea.stats.drawdown.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 详细指标网格 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            详细指标
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="financial-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {metric.label}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {metric.description}
                      </div>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value.toFixed(metric.unit === '' ? 2 : 1)}{metric.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 风险提示 */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-medium text-destructive mb-1">风险提示</h5>
              <p className="text-sm text-muted-foreground">
                以上数据仅供参考，过往表现不代表未来收益。外汇交易存在高风险，请谨慎投资，
                确保您完全理解相关风险后再进行交易。建议在模拟环境中充分测试后再使用真实资金。
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
