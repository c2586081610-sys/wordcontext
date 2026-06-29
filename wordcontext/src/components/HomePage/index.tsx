import { useStudyStore } from '../../stores/useStudyStore';
import { useMemo } from 'react';

export function HomePage() {
  const { displayWords, cards, setViewMode, setReviewFilter, setCurrentIndex } = useStudyStore();

  // 统计
  const stats = useMemo(() => {
    const now = new Date();
    let newCount = 0;
    let dueCount = 0;
    let learnedToday = 0;
    const today = new Date().toISOString().split('T')[0];

    for (const w of displayWords) {
      const card = cards.get(w.id);
      if (!card) {
        newCount++;
        continue;
      }
      if (card.fsrs.state === 0) newCount++;
      if (new Date(card.fsrs.due) <= now && card.fsrs.state !== 0) dueCount++;
      if (card.lastReview && new Date(card.lastReview).toISOString().split('T')[0] === today) learnedToday++;
    }

    return { newCount, dueCount, learnedToday, total: displayWords.length };
  }, [displayWords, cards]);

  const handleLearnNew = () => {
    setReviewFilter('newOnly');
    setViewMode('list');
    setCurrentIndex(0);
  };

  const handleReview = () => {
    setViewMode('review');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* 欢迎区域 */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          今天想学什么？
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {stats.total} 词在库 · {stats.newCount} 词待学 · {stats.dueCount} 词待复习
        </p>
      </div>

      {/* 核心功能卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {/* 新学单词 */}
        <button
          onClick={handleLearnNew}
          disabled={stats.newCount === 0}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-left text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="relative z-10">
            <div className="text-5xl mb-4">📖</div>
            <h2 className="text-xl font-bold mb-1">新学单词</h2>
            <p className="text-blue-100 text-sm">
              {stats.newCount > 0 ? `${stats.newCount} 个新词等你来学` : '已全部学习完成'}
            </p>
          </div>
          {/* 装饰圆 */}
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -right-2 -bottom-8 w-24 h-24 bg-white/5 rounded-full" />
        </button>

        {/* 复习单词 */}
        <button
          onClick={handleReview}
          disabled={stats.dueCount === 0}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-left text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="relative z-10">
            <div className="text-5xl mb-4">🔄</div>
            <h2 className="text-xl font-bold mb-1">复习单词</h2>
            <p className="text-emerald-100 text-sm">
              {stats.dueCount > 0 ? `${stats.dueCount} 个词需要复习` : '暂无待复习单词'}
            </p>
          </div>
          {/* 装饰圆 */}
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -right-2 -bottom-8 w-24 h-24 bg-white/5 rounded-full" />
        </button>
      </div>

      {/* 今日进度 */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">今日进度</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.learnedToday}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">已学习</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.dueCount}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">待复习</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.total - stats.newCount}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">已掌握</div>
          </div>
        </div>
      </div>
    </div>
  );
}
