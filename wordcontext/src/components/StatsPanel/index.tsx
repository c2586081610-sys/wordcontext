import { useEffect, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useStatStore } from '../../stores/useStatStore';
import { useStudyStore } from '../../stores/useStudyStore';

/* ─── 颜色常量 ─── */
const COLORS = {
  blue: '#2563EB',
  violet: '#7C3AED',
  amber: '#F59E0B',
  green: '#16A34A',
  rose: '#F43F5E',
  slate: '#94A3B8',
};

const MEMORY_COLORS = [COLORS.slate, COLORS.blue, COLORS.green, COLORS.rose];
const MEMORY_LABELS = ['新词', '学习中', '复习中', '重新学习'];

/* ─── 环形进度组件 ─── */
function RingProgress({
  value,
  max,
  color,
  size = 100,
  strokeWidth = 8,
}: {
  value: number;
  max: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference * (1 - percent);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(0,0,0,0.06)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

/* ─── 日历热力图 ─── */
function CalendarHeatmap({ dailyStats }: { dailyStats: { date: string; totalReviews: number }[] }) {
  const weeks = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 89); // 最近 90 天

    // 对齐到周日开始
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const cells: { date: string; count: number; isCurrentMonth: boolean }[] = [];
    const current = new Date(startDate);

    while (current <= today || current.getDay() !== 0) {
      const dateStr = current.toISOString().split('T')[0];
      const stat = dailyStats.find((s) => s.date === dateStr);
      const isFuture = current > today;
      cells.push({
        date: dateStr,
        count: isFuture ? -1 : (stat?.totalReviews || 0),
        isCurrentMonth: current.getMonth() === today.getMonth(),
      });
      current.setDate(current.getDate() + 1);
      if (current > today && current.getDay() === 0) break;
    }

    // 分周
    const result: typeof cells[] = [];
    for (let i = 0; i < cells.length; i += 7) {
      result.push(cells.slice(i, i + 7));
    }
    return result;
  }, [dailyStats]);

  const getColor = (count: number) => {
    if (count < 0) return 'rgba(0,0,0,0.03)';
    if (count === 0) return 'rgba(0,0,0,0.04)';
    if (count <= 5) return 'rgba(37,99,235,0.15)';
    if (count <= 15) return 'rgba(37,99,235,0.3)';
    if (count <= 30) return 'rgba(37,99,235,0.5)';
    return 'rgba(37,99,235,0.75)';
  };

  const dayLabels = ['日', '一', '二', '三', '四', '五', '六'];

  // 月份标签
  const monthLabels = useMemo(() => {
    const labels: { label: string; colSpan: number }[] = [];
    let lastMonth = -1;
    for (const week of weeks) {
      const firstDay = new Date(week[0]?.date);
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        labels.push({ label: `${month + 1}月`, colSpan: 1 });
        lastMonth = month;
      } else {
        labels[labels.length - 1].colSpan++;
      }
    }
    return labels;
  }, [weeks]);

  return (
    <div className="overflow-x-auto">
      {/* 月份标签 */}
      <div className="flex ml-6 mb-1">
        {monthLabels.map((m, i) => (
          <div
            key={i}
            className="text-[10px] text-slate-400 text-center"
            style={{ width: `${m.colSpan * 16}px` }}
          >
            {m.label}
          </div>
        ))}
      </div>
      <div className="flex gap-0">
        {/* 星期标签 */}
        <div className="flex flex-col gap-[2px] mr-1">
          {dayLabels.map((label, i) => (
            <div
              key={i}
              className="text-[10px] text-slate-400 flex items-center justify-end"
              style={{ height: 14, width: 20 }}
            >
              {i % 2 === 1 ? label : ''}
            </div>
          ))}
        </div>
        {/* 热力格子 */}
        <div className="flex gap-[2px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  className="rounded-[2px]"
                  style={{
                    width: 14,
                    height: 14,
                    backgroundColor: getColor(day.count),
                  }}
                  title={`${day.date}: ${day.count >= 0 ? day.count + ' 次复习' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* 图例 */}
      <div className="flex items-center gap-1 mt-2 ml-6 text-[10px] text-slate-400">
        <span>少</span>
        {[0, 5, 15, 30].map((v) => (
          <div
            key={v}
            className="rounded-[2px]"
            style={{ width: 14, height: 14, backgroundColor: getColor(v) }}
          />
        ))}
        <span>多</span>
      </div>
    </div>
  );
}

/* ─── 主面板 ─── */
export function StatsPanel() {
  const {
    dailyGoal,
    dailyStats,
    streak,
    todayProgress,
    memoryDistribution,
    isLoading,
    loadAll,
  } = useStatStore();

  const { getStats } = useStudyStore();
  const overallStats = getStats();

  const [trendRange, setTrendRange] = useState<7 | 30>(7);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // 趋势图数据
  const trendData = useMemo(() => {
    const days = trendRange;
    return dailyStats.slice(-days).map((s) => ({
      date: s.date.slice(5), // "06-07"
      新词: s.newWordsLearned,
      复习: s.wordsReviewed,
      总量: s.totalReviews,
    }));
  }, [dailyStats, trendRange]);

  // 记忆分布数据
  const memoryData = useMemo(() => {
    const dist = memoryDistribution;
    return [
      { name: MEMORY_LABELS[0], value: dist.newState },
      { name: MEMORY_LABELS[1], value: dist.learning },
      { name: MEMORY_LABELS[2], value: dist.review },
      { name: MEMORY_LABELS[3], value: dist.relearning },
    ].filter((d) => d.value > 0);
  }, [memoryDistribution]);

  // 累计数据
  const cumulative = useMemo(() => {
    const totalReviews = dailyStats.reduce((s, d) => s + d.totalReviews, 0);
    const totalMinutes = dailyStats.reduce((s, d) => s + d.studyMinutes, 0);
    return {
      totalWords: overallStats.total,
      totalReviews,
      totalMinutes,
    };
  }, [dailyStats, overallStats.total]);

  // 记忆强度条形图数据
  const memoryBarData = useMemo(() => {
    const dist = memoryDistribution;
    const total = dist.newState + dist.learning + dist.review + dist.relearning;
    if (total === 0) return [];
    return [
      { name: '新词', count: dist.newState, fill: MEMORY_COLORS[0] },
      { name: '学习中', count: dist.learning, fill: MEMORY_COLORS[1] },
      { name: '复习中', count: dist.review, fill: MEMORY_COLORS[2] },
      { name: '重新学习', count: dist.relearning, fill: MEMORY_COLORS[3] },
    ];
  }, [memoryDistribution]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-400">加载统计数据...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* ── 今日进度 + 连续打卡 ── */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">今日进度</h2>
        <div className="flex items-center gap-8">
          {/* 新词环形 */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <RingProgress
                value={todayProgress.newWordsLearned}
                max={dailyGoal.newWords}
                color={COLORS.blue}
                size={100}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-slate-800">
                  {todayProgress.newWordsLearned}
                </span>
                <span className="text-[10px] text-slate-400">/{dailyGoal.newWords}</span>
              </div>
            </div>
            <span className="text-xs text-slate-500">新词</span>
          </div>

          {/* 复习环形 */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <RingProgress
                value={todayProgress.wordsReviewed}
                max={dailyGoal.reviews}
                color={COLORS.green}
                size={100}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-slate-800">
                  {todayProgress.wordsReviewed}
                </span>
                <span className="text-[10px] text-slate-400">/{dailyGoal.reviews}</span>
              </div>
            </div>
            <span className="text-xs text-slate-500">复习</span>
          </div>

          {/* 连续打卡 + 今日详情 */}
          <div className="flex-1 flex flex-col gap-3 pl-4 border-l border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-amber-200/50">
                {streak}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700">连续打卡</div>
                <div className="text-xs text-slate-400">
                  {streak > 0 ? '继续保持!' : '今天开始学习吧'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 rounded-lg px-3 py-2">
                <div className="text-slate-400">正确率</div>
                <div className="text-sm font-semibold text-slate-700">
                  {todayProgress.correctRate > 0
                    ? `${Math.round(todayProgress.correctRate * 100)}%`
                    : '--'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg px-3 py-2">
                <div className="text-slate-400">学习时长</div>
                <div className="text-sm font-semibold text-slate-700">
                  {todayProgress.studyMinutes > 0
                    ? `${todayProgress.studyMinutes}min`
                    : '--'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 学习日历热力图 ── */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">学习日历</h2>
        <CalendarHeatmap dailyStats={dailyStats} />
      </div>

      {/* ── 学习量趋势 ── */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">学习趋势</h2>
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setTrendRange(7)}
              className={`px-3 py-1 text-xs rounded-md transition-all ${
                trendRange === 7
                  ? 'bg-white shadow-sm text-slate-800 font-medium'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              7天
            </button>
            <button
              onClick={() => setTrendRange(30)}
              className={`px-3 py-1 text-xs rounded-md transition-all ${
                trendRange === 30
                  ? 'bg-white shadow-sm text-slate-800 font-medium'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              30天
            </button>
          </div>
        </div>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 8,
                  fontSize: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              <Line
                type="monotone"
                dataKey="新词"
                stroke={COLORS.blue}
                strokeWidth={2}
                dot={{ r: 3, fill: COLORS.blue }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="复习"
                stroke={COLORS.green}
                strokeWidth={2}
                dot={{ r: 3, fill: COLORS.green }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 记忆强度分布 ── */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">记忆强度分布</h2>
        <div className="flex items-center gap-6">
          {/* 饼图 */}
          <div style={{ width: 180, height: 180 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={memoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {memoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={MEMORY_COLORS[index % MEMORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 条形图 */}
          <div className="flex-1" style={{ height: 180 }}>
            <ResponsiveContainer>
              <BarChart data={memoryBarData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                  {memoryBarData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── 累计数据 ── */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">累计数据</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{cumulative.totalWords}</div>
            <div className="text-xs text-blue-400 mt-1">总词数</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{cumulative.totalReviews}</div>
            <div className="text-xs text-green-400 mt-1">总复习次数</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {cumulative.totalMinutes > 60
                ? `${(cumulative.totalMinutes / 60).toFixed(1)}h`
                : `${cumulative.totalMinutes}m`}
            </div>
            <div className="text-xs text-amber-400 mt-1">总学习时长</div>
          </div>
        </div>
      </div>
    </div>
  );
}
