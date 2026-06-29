import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStudyStore } from '../../stores/useStudyStore';
import { speakWord } from '../../lib/phonics';
import { getMemoryStrength, getStateLabel, getDueLabel } from '../../lib/fsrs';
import type { ReviewRating } from '../../lib/fsrs';
import type { WordEntry } from '../../lib/db';

type Phase = 'empty' | 'reviewing' | 'completed';

/**
 * 独立复习模式
 *
 * 进入时对当前到期词做一次快照作为本次复习队列（评价后卡片 due 会前移，
 * 快照可保证队列顺序与进度条总数稳定）。reviewIndex 推进队列；
 * 越过末尾即进入 completed 状态。
 */
export function ReviewMode() {
  const displayWords = useStudyStore(s => s.displayWords);
  const cards = useStudyStore(s => s.cards);
  const reviewIndex = useStudyStore(s => s.reviewIndex);
  const setReviewIndex = useStudyStore(s => s.setReviewIndex);
  const rateWord = useStudyStore(s => s.rateWord);
  const setViewMode = useStudyStore(s => s.setViewMode);

  // 到期词（响应式：既是快照来源，也用于空状态检测）
  const dueWords = useMemo(() => {
    const now = new Date();
    return displayWords.filter(w => {
      const card = cards.get(w.id);
      return card && new Date(card.fsrs.due) <= now && card.fsrs.state !== 0;
    });
  }, [displayWords, cards]);

  // 进入复习模式时锁定到期词快照（App 已在 isInitialized 后才渲染本组件，
  // 故首次 render 的 dueWords 即为有效队列）
  const [queue] = useState<WordEntry[] | null>(() =>
    dueWords.length > 0 ? dueWords : null,
  );

  const [flipped, setFlipped] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);

  // 进入复习：重置索引与翻转状态
  useEffect(() => {
    setReviewIndex(0);
    setFlipped(false);
  }, [setReviewIndex]);

  // 阶段判定
  const phase: Phase = useMemo(() => {
    if (!queue) return 'empty';
    if (reviewIndex >= queue.length) return 'completed';
    return 'reviewing';
  }, [queue, reviewIndex]);

  // 完成时冻结耗时
  useEffect(() => {
    if (phase === 'completed' && endTime === null) {
      setEndTime(Date.now());
    }
  }, [phase, endTime]);

  const currentWord =
    queue && reviewIndex < queue.length ? queue[reviewIndex] : null;
  const currentCard = currentWord ? cards.get(currentWord.id) ?? null : null;
  const memoryStrength = currentCard ? getMemoryStrength(currentCard.fsrs) : 0;

  // 切换卡片时重置翻转
  useEffect(() => {
    setFlipped(false);
  }, [reviewIndex]);

  // 评价：调用 store 评价 + 推进到下一个到期词
  const handleRate = useCallback(
    (rating: ReviewRating) => {
      if (!currentWord) return;
      rateWord(currentWord.id, rating);
      setFlipped(false);
      setReviewIndex(reviewIndex + 1);
    },
    [currentWord, rateWord, reviewIndex, setReviewIndex],
  );

  const handleSpeak = useCallback(() => {
    if (currentWord) speakWord(currentWord.word);
  }, [currentWord]);

  // 快捷键：1/2/3 评价（正面可直接评价）、Space 翻转、Enter 发音
  useEffect(() => {
    if (phase !== 'reviewing' || !currentWord) return;
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.isContentEditable)
      ) {
        return;
      }
      switch (e.key) {
        case '1':
          e.preventDefault();
          handleRate('easy');
          break;
        case '2':
          e.preventDefault();
          handleRate('good');
          break;
        case '3':
          e.preventDefault();
          handleRate('again');
          break;
        case ' ':
          e.preventDefault();
          setFlipped(f => !f);
          break;
        case 'Enter':
          e.preventDefault();
          speakWord(currentWord.word);
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, currentWord, handleRate]);

  // ---- 空状态：今日无到期词 ----
  if (phase === 'empty') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="glass rounded-2xl p-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
            今日复习已完成
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            没有到期的单词，稍后再来吧。
          </p>
          <button
            onClick={() => setViewMode('list')}
            className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors"
          >
            返回速刷
          </button>
        </div>
      </div>
    );
  }

  // ---- 完成统计页 ----
  if (phase === 'completed') {
    const total = queue ? queue.length : 0;
    const elapsedSec =
      endTime !== null ? Math.max(0, Math.round((endTime - startTime) / 1000)) : 0;
    const mins = Math.floor(elapsedSec / 60);
    const secs = elapsedSec % 60;

    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="glass rounded-2xl p-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <svg
              className="h-8 w-8 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">
            复习完成
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            干得漂亮，继续保持！
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700/40 p-4">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {total}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                本次复习词数
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700/40 p-4">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {mins}
                <span className="text-base font-normal text-slate-400">分</span>
                {secs}
                <span className="text-base font-normal text-slate-400">秒</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                复习耗时
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setViewMode('list')}
              className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors"
            >
              返回速刷
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className="px-5 py-2 rounded-lg bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm transition-colors"
            >
              查看统计
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- 复习中 ----
  const total = queue ? queue.length : 0;
  const remaining = Math.max(0, total - reviewIndex);
  const progress = total > 0 ? (reviewIndex / total) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 进度条 */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-1.5">
          <span>
            已复习{' '}
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {reviewIndex}
            </span>{' '}
            / {total}
          </span>
          <span>剩余 {remaining} 词</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 卡片 */}
      {currentWord && (
        <div
          className="glass rounded-2xl p-8 min-h-[440px] flex flex-col cursor-pointer select-none"
          onClick={() => setFlipped(f => !f)}
        >
          {!flipped ? (
            // 正面
            <div
              key="front"
              className="flex-1 flex flex-col items-center justify-center card-slide-in"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
                {currentWord.word}
              </h2>
              {currentWord.phonetic && (
                <p className="text-base text-slate-400 dark:text-slate-500 font-mono mb-5">
                  {currentWord.phonetic}
                </p>
              )}
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleSpeak();
                  e.currentTarget.blur();
                }}
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                title="播放发音 (Enter)"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M11 5L6 9H2v6h4l5 4V5z"
                  />
                </svg>
                发音
              </button>
              <p className="mt-auto pt-8 text-sm text-slate-400 dark:text-slate-500">
                点击或 <span className="kbd">Space</span> 查看释义
              </p>
            </div>
          ) : (
            // 反面
            <div key="back" className="flex-1 flex flex-col card-slide-in">
              {/* 词头 */}
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {currentWord.word}
                </h2>
                {currentWord.phonetic && (
                  <span className="text-sm text-slate-400 dark:text-slate-500 font-mono">
                    {currentWord.phonetic}
                  </span>
                )}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleSpeak();
                    e.currentTarget.blur();
                  }}
                  className="text-slate-300 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  title="播放发音 (Enter)"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M11 5L6 9H2v6h4l5 4V5z"
                    />
                  </svg>
                </button>
              </div>

              {/* 释义 */}
              <div className="space-y-1.5 mb-5">
                {currentWord.definitions.map((d, i) => (
                  <div key={i} className="text-base">
                    <span className="text-blue-600 dark:text-blue-400 font-medium mr-2">
                      {d.pos}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {d.meaning}
                    </span>
                  </div>
                ))}
              </div>

              {/* 例句 */}
              {currentWord.examples.length > 0 && (
                <div className="mb-5 space-y-1">
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">
                    例句
                  </p>
                  {currentWord.examples.slice(0, 3).map((ex, i) => (
                    <p
                      key={i}
                      className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                    >
                      {ex}
                    </p>
                  ))}
                </div>
              )}

              {/* 助记 */}
              {currentWord.mnemonic && (
                <div className="mb-5">
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">
                    助记
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {currentWord.mnemonic}
                  </p>
                </div>
              )}

              {/* 记忆强度条 */}
              <div className="mt-auto">
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
                  <span>记忆强度</span>
                  <span>
                    {memoryStrength}%
                    {currentCard && (
                      <>
                        {' · '}
                        {getStateLabel(currentCard.fsrs.state)}
                        {' · '}
                        到期 {getDueLabel(currentCard.fsrs)}
                      </>
                    )}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${memoryStrength}%`,
                      background:
                        memoryStrength > 70
                          ? '#16A34A'
                          : memoryStrength > 40
                            ? '#F59E0B'
                            : '#EF4444',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 评价按钮（翻转后显示） */}
      {flipped && (
        <div className="flex gap-3 mt-4 card-slide-in">
          <button
            onClick={e => {
              e.stopPropagation();
              handleRate('easy');
              e.currentTarget.blur();
            }}
            className="rating-btn flex-1 px-4 py-2.5 rounded-xl text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 font-medium"
          >
            😊 熟悉
            <span className="block text-[10px] font-normal opacity-60 mt-0.5">
              延长间隔
            </span>
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              handleRate('good');
              e.currentTarget.blur();
            }}
            className="rating-btn flex-1 px-4 py-2.5 rounded-xl text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 font-medium"
          >
            😐 模糊
            <span className="block text-[10px] font-normal opacity-60 mt-0.5">
              适度延长
            </span>
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              handleRate('again');
              e.currentTarget.blur();
            }}
            className="rating-btn flex-1 px-4 py-2.5 rounded-xl text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 font-medium"
          >
            😣 忘记
            <span className="block text-[10px] font-normal opacity-60 mt-0.5">
              重新学习
            </span>
          </button>
        </div>
      )}

      {/* 快捷键提示 */}
      <div className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
        <span className="kbd">1</span> 熟悉　
        <span className="kbd">2</span> 模糊　
        <span className="kbd">3</span> 忘记　
        <span className="kbd">Space</span> 翻转　
        <span className="kbd">Enter</span> 发音
      </div>
    </div>
  );
}
