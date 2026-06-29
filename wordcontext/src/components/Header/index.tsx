import { useStudyStore } from '../../stores/useStudyStore';
import { useState, useEffect } from 'react';

function SunIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

function MoonIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  );
}

function SystemIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
    </svg>
  );
}

function BookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function OrderIcon({ className = 'w-5 h-5' }: { className?: string }) {
  // 顺序：三条横线
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function ShuffleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  // 乱序：交叉箭头
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
  );
}

export function Header() {
  const { viewMode, setViewMode, getStats, theme, toggleTheme, decks, currentDeckId, setCurrentDeckId, shuffleMode, toggleShuffle } = useStudyStore();
  const stats = getStats();
  const [toast, setToast] = useState<string | null>(null);

  // toast 自动消失
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleToggleShuffle = () => {
    toggleShuffle();
    setToast(shuffleMode === 'order' ? '已切换为乱序模式：单词已随机打乱' : '已切换为顺序模式：按原始顺序学习');
  };

  const themeIcon = theme === 'light' ? <SunIcon /> : theme === 'dark' ? <MoonIcon /> : <SystemIcon />;
  const themeLabel = theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '跟随系统';

  const currentDeck = currentDeckId === '__all' ? null : decks.find(d => d.id === currentDeckId);
  const deckLabel = currentDeckId === '__all' ? '全部词书' : currentDeck?.name ?? '当前词书';
  const shuffleLabel = shuffleMode === 'order' ? '顺序学习' : '乱序学习';

  return (
    <header className="glass sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">词境</span>
        </span>
        <span className="text-sm text-slate-400 dark:text-slate-500">WordContext</span>
      </div>

      <div className="flex items-center gap-4">
        {/* 学习统计 */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>{stats.total} 词</span>
          <span className="text-blue-500">新词 {stats.newCount}</span>
          <span className="text-amber-500">学习 {stats.learning}</span>
          <span className="text-green-500">复习 {stats.review}</span>
        </div>

        {/* 词书切换 */}
        {decks.length > 0 && (
          <div className="relative">
            <select
              value={currentDeckId}
              onChange={e => setCurrentDeckId(e.target.value)}
              title="切换词书"
              className="appearance-none pl-7 pr-7 py-1 text-sm rounded-lg bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 max-w-[180px] truncate"
            >
              <option value="__all">全部词书 ({decks.reduce((s, d) => s + d.wordCount, 0)})</option>
              {decks.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.wordCount})</option>
              ))}
            </select>
            <BookIcon className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <svg className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        )}

        {/* 顺序/乱序切换 */}
        <button
          onClick={handleToggleShuffle}
          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
            shuffleMode === 'shuffle'
              ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
          title={`当前：${shuffleLabel}（点击切换）`}
          aria-label={shuffleLabel}
        >
          {shuffleMode === 'shuffle' ? <ShuffleIcon /> : <OrderIcon />}
        </button>

        {/* 模式切换 */}
        <div className="flex bg-slate-100 dark:bg-slate-700/50 rounded-lg p-0.5">
          {/* 首页 Tab */}
          <button
            onClick={() => setViewMode('home')}
            className={`px-3 py-1 text-sm rounded-md transition-all flex items-center gap-1 ${
              viewMode === 'home'
                ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-slate-200 font-medium'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            首页
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-sm rounded-md transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-slate-200 font-medium'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            速刷
          </button>
          <button
            onClick={() => setViewMode('detail')}
            className={`px-3 py-1 text-sm rounded-md transition-all ${
              viewMode === 'detail'
                ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-slate-200 font-medium'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            沉浸
          </button>
          <button
            onClick={() => setViewMode('review')}
            className={`px-3 py-1 text-sm rounded-md transition-all ${
              viewMode === 'review'
                ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-slate-200 font-medium'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            复习{stats.review > 0 ? ` ${stats.review}` : ''}
          </button>
          <button
            onClick={() => setViewMode('stats')}
            className={`px-3 py-1 text-sm rounded-md transition-all flex items-center gap-1 ${
              viewMode === 'stats'
                ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-slate-200 font-medium'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            统计
          </button>
        </div>

        {/* 暗色模式切换 */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
          title={`当前：${themeLabel}（点击切换）`}
        >
          {themeIcon}
        </button>

        {/* 数据管理入口 */}
        <button
          onClick={() => setViewMode(viewMode === 'settings' ? 'list' : 'settings')}
          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
            viewMode === 'settings'
              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
          title="数据管理"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* 切换模式 toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] glass rounded-xl px-4 py-2 text-sm text-slate-700 dark:text-slate-200 shadow-lg border border-violet-200/50 dark:border-violet-700/40 card-slide-in">
          {toast}
        </div>
      )}
    </header>
  );
}
