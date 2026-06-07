import { useEffect } from 'react';
import { Header } from './components/Header';
import { WordList } from './components/WordList';
import { WordDetail } from './components/WordDetail';
import { DataManager } from './components/DataManager';
import { StatsPanel } from './components/StatsPanel';
import { useStudyStore } from './stores/useStudyStore';

export default function App() {
  const { viewMode, init, isInitialized, theme, resolvedTheme, setTheme } = useStudyStore();

  useEffect(() => {
    init();
  }, [init]);

  // 同步 dark class 到 html 元素
  useEffect(() => {
    const html = document.documentElement;
    if (resolvedTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [resolvedTheme]);

  // 监听系统主题变化（当 theme 为 system 时自动跟随）
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // 重新触发 setTheme 以更新 resolvedTheme
      setTheme('system');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, setTheme]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce text-blue-500">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400">正在加载词库...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] transition-colors duration-300">
      <Header />
      <main className="pb-12">
        {viewMode === 'list' && <WordList />}
        {viewMode === 'detail' && <WordDetail />}
        {viewMode === 'stats' && <StatsPanel />}
        {viewMode === 'settings' && <DataManager />}
      </main>

      {/* 底部快捷键提示栏 */}
      <div className="fixed bottom-0 left-0 right-0 glass-dark px-6 py-2 flex items-center justify-center gap-6 text-xs text-slate-400 dark:text-slate-400">
        <span><span className="kbd">J</span>/<span className="kbd">K</span> 导航</span>
        <span><span className="kbd">1</span><span className="kbd">2</span><span className="kbd">3</span> 评价</span>
        <span><span className="kbd">Space</span> 释义</span>
        <span><span className="kbd">Enter</span> 发音</span>
        <span><span className="kbd">Tab</span> 切换模式</span>
      </div>
    </div>
  );
}
