'use client';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { EAData } from './EACard';

interface EAChartProps {
  ea: EAData;
  chartType: 'performance' | 'metrics' | 'comparison';
}

export default function EAChart({ ea, chartType }: EAChartProps) {
  // 基于EA实际数据生成模拟历史数据（实际项目中应该从API获取）
  const generatePerformanceData = () => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const baseReturn = ea.stats.annual_return / 12; // 月均收益
    const baseWinRate = ea.stats.win_rate;
    const baseDrawdown = ea.stats.drawdown;

    return months.map((month, index) => ({
      month,
      return: baseReturn + (Math.random() - 0.5) * 10, // 基于年化收益的月度波动
      drawdown: -(Math.random() * baseDrawdown * 0.8), // 基于最大回撤的月度回撤
      winRate: baseWinRate + (Math.random() - 0.5) * 20, // 基于平均胜率的月度波动
      cumulative: baseReturn * (index + 1) + (Math.random() - 0.5) * 5, // 累计收益
    }));
  };

  const performanceData = generatePerformanceData();

  // 指标对比数据
  const metricsData = [
    { name: '胜率', value: ea.stats.win_rate, color: '#22c55e' },
    { name: '年化收益', value: ea.stats.annual_return, color: '#3b82f6' },
    { name: '盈亏比', value: ea.stats.avg_risk_reward * 10, color: '#f59e0b' }, // 放大10倍便于显示
  ];

  // 基于EA实际数据计算风险分布
  const calculateRiskDistribution = () => {
    const drawdown = ea.stats.drawdown;
    const winRate = ea.stats.win_rate;

    // 基于回撤和胜率计算风险分布
    let lowRisk, mediumRisk, highRisk;

    if (drawdown < 10 && winRate > 70) {
      // 低回撤高胜率 = 低风险为主
      lowRisk = 60;
      mediumRisk = 30;
      highRisk = 10;
    } else if (drawdown < 20 && winRate > 60) {
      // 中等回撤中等胜率 = 中风险为主
      lowRisk = 25;
      mediumRisk = 55;
      highRisk = 20;
    } else {
      // 高回撤或低胜率 = 高风险为主
      lowRisk = 15;
      mediumRisk = 35;
      highRisk = 50;
    }

    return [
      { name: '低风险', value: lowRisk, color: '#22c55e' },
      { name: '中风险', value: mediumRisk, color: '#f59e0b' },
      { name: '高风险', value: highRisk, color: '#ef4444' },
    ];
  };

  const riskReturnData = calculateRiskDistribution();

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toFixed(2)}
              {entry.name.includes('率') ? '%' : entry.name.includes('收益') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderPerformanceChart = () => (
    <div className="space-y-6">
      {/* 累计收益曲线 */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-foreground">累计收益曲线</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 285 / 30%)" />
            <XAxis
              dataKey="month"
              stroke="oklch(0.65 0.02 286.067)"
              fontSize={12}
            />
            <YAxis
              stroke="oklch(0.65 0.02 286.067)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="oklch(0.75 0.15 45)"
              strokeWidth={3}
              dot={{ fill: 'oklch(0.75 0.15 45)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'oklch(0.75 0.15 45)', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="return"
              stroke="oklch(0.65 0.18 162)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'oklch(0.65 0.18 162)', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-primary"></div>
            <span className="text-sm text-muted-foreground">累计收益</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-accent border-dashed border-t-2"></div>
            <span className="text-sm text-muted-foreground">月度收益</span>
          </div>
        </div>
      </div>

      {/* 回撤分析 */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-foreground">回撤分析</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 285 / 30%)" />
            <XAxis 
              dataKey="month" 
              stroke="oklch(0.65 0.02 286.067)"
              fontSize={12}
            />
            <YAxis 
              stroke="oklch(0.65 0.02 286.067)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="drawdown" 
              fill="oklch(0.65 0.25 22)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderMetricsChart = () => (
    <div className="space-y-6">
      {/* 关键指标对比 */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-foreground">关键指标对比</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metricsData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 285 / 30%)" />
            <XAxis 
              type="number"
              stroke="oklch(0.65 0.02 286.067)"
              fontSize={12}
            />
            <YAxis 
              type="category"
              dataKey="name"
              stroke="oklch(0.65 0.02 286.067)"
              fontSize={12}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="oklch(0.75 0.15 45)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 风险分布 */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-foreground">风险分布</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={riskReturnData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {riskReturnData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* 图例 */}
        <div className="flex justify-center gap-4 mt-4">
          {riskReturnData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name} ({entry.value}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderComparisonChart = () => (
    <div>
      <h4 className="text-lg font-semibold mb-4 text-foreground">胜率趋势</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 285 / 30%)" />
          <XAxis 
            dataKey="month" 
            stroke="oklch(0.65 0.02 286.067)"
            fontSize={12}
          />
          <YAxis 
            stroke="oklch(0.65 0.02 286.067)"
            fontSize={12}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="winRate" 
            stroke="oklch(0.75 0.15 45)" 
            strokeWidth={3}
            dot={{ fill: 'oklch(0.75 0.15 45)', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: 'oklch(0.75 0.15 45)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="w-full">
      {chartType === 'performance' && renderPerformanceChart()}
      {chartType === 'metrics' && renderMetricsChart()}
      {chartType === 'comparison' && renderComparisonChart()}
    </div>
  );
}
