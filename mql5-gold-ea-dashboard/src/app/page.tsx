'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Target, BarChart3, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import EACard, { EAData } from '../components/EACard';
import EADetailModal from '../components/EADetailModal';
import { useEAs } from '../hooks/useEAs';
import { queryClient } from '../lib/query-client';

// 排行榜类型定义
type RankingType = 'win_rate' | 'drawdown' | 'max_risk_reward' | 'avg_risk_reward' | 'annual_return' | 'monthly_return';

// 排行榜配置
const rankingTabs = [
  {
    id: 'win_rate' as RankingType,
    name: '胜率榜',
    icon: TrendingUp,
    description: '按胜率降序排列',
    color: 'text-accent'
  },
  {
    id: 'drawdown' as RankingType,
    name: '回撤榜',
    icon: TrendingDown,
    description: '按最大回撤升序排列',
    color: 'text-destructive'
  },
  {
    id: 'max_risk_reward' as RankingType,
    name: '最大盈亏比榜',
    icon: Target,
    description: '按最大盈亏比降序排列',
    color: 'text-primary'
  },
  {
    id: 'avg_risk_reward' as RankingType,
    name: '平均盈亏比榜',
    icon: BarChart3,
    description: '按平均盈亏比降序排列',
    color: 'text-primary'
  },
  {
    id: 'annual_return' as RankingType,
    name: '年化榜',
    icon: Calendar,
    description: '按年化收益降序排列',
    color: 'text-accent'
  },
  {
    id: 'monthly_return' as RankingType,
    name: '本月收益榜',
    icon: DollarSign,
    description: '按月度收益降序排列',
    color: 'text-accent'
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<RankingType>('win_rate');
  const [year] = useState(2024);
  const [month] = useState<number | null>(null);
  const [selectedEA, setSelectedEA] = useState<EAData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // 使用TanStack Query获取EA数据
  const {
    data: eaResponse,
    isLoading: loading,
    error,
    refetch
  } = useEAs({
    sortBy: activeTab,
    year,
    month,
    limit: 10
  });

  // 获取EA数据
  const eaData = eaResponse?.data || [];

  // 处理标签切换
  const handleTabChange = (tabId: RankingType) => {
    setActiveTab(tabId);
  };

  // 刷新数据
  const handleRefresh = () => {
    refetch();
  };

  // 处理EA卡片点击
  const handleEAClick = (ea: EAData) => {
    setSelectedEA(ea);
    setIsDetailModalOpen(true);
  };

  // 关闭详情弹窗
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedEA(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 头部区域 */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              MQL5 GOLD EA 榜单
            </h1>
            <p className="text-muted-foreground text-lg">
              专业黄金EA交易系统排行榜 - 实时数据，精准分析
            </p>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="container mx-auto px-4 py-8">
        {/* 排行榜标签切换 */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {rankingTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`ranking-tab ${isActive ? 'active' : ''} group`}
                  title={tab.description}
                >
                  <div className="flex items-center justify-center gap-2">
                    <IconComponent
                      className={`w-5 h-5 ${isActive ? 'text-background' : tab.color}`}
                    />
                    <span className={`font-medium text-sm ${isActive ? 'text-background' : 'text-foreground'}`}>
                      {tab.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 当前选中榜单信息和控制栏 */}
        <div className="mb-6">
          <div className="financial-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const currentTab = rankingTabs.find(tab => tab.id === activeTab);
                  const IconComponent = currentTab?.icon || TrendingUp;
                  return (
                    <>
                      <IconComponent className={`w-6 h-6 ${currentTab?.color}`} />
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">
                          {currentTab?.name}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          {currentTab?.description} • {month ? `${year}年${month}月` : `${year}年度`}数据
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* 控制按钮 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50"
                  title="刷新数据"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* EA排行榜列表 */}
        <div className="space-y-4">
          {loading ? (
            /* 加载状态 */
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>正在加载EA数据...</span>
              </div>
            </div>
          ) : error ? (
            /* 错误状态 */
            <div className="text-center py-12">
              <div className="financial-card max-w-md mx-auto">
                <div className="text-destructive mb-2">⚠️ 加载失败</div>
                <p className="text-muted-foreground mb-4">
                  {error instanceof Error ? error.message : '获取数据失败'}
                </p>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  重试
                </button>
              </div>
            </div>
          ) : eaData.length === 0 ? (
            /* 无数据状态 */
            <div className="text-center py-12">
              <div className="financial-card max-w-md mx-auto">
                <div className="text-muted-foreground mb-2">📊 暂无数据</div>
                <p className="text-muted-foreground">
                  {month ? `${year}年${month}月` : `${year}年度`}暂无EA数据
                </p>
              </div>
            </div>
          ) : (
            /* EA卡片列表 */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {eaData.map((ea) => (
                <EACard
                  key={ea.id}
                  ea={ea}
                  rankingType={activeTab}
                  onClick={() => handleEAClick(ea)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* EA详情弹窗 */}
      <EADetailModal
        ea={selectedEA}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />

      {/* 页脚 */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-muted-foreground text-sm">
            <p>© 2025 MQL5 GOLD EA Dashboard. 专业的黄金EA交易分析平台</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
