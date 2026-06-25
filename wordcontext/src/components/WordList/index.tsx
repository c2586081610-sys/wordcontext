import { useStudyStore } from '../../stores/useStudyStore';
import { PhonicsDisplay } from '../PhonicsDisplay';
import { getMemoryStrength, getStateLabel } from '../../lib/fsrs';
import { speakWord } from '../../lib/phonics';
import { useEffect, useCallback, useState } from 'react';

export function WordList() {
  const {
    displayWords, cards, currentIndex, setCurrentIndex,
    setViewMode, rateWord, showPhonetic, togglePhonetic,
    decks, currentDeckId, shuffleMode,
  } = useStudyStore();

  const [hoveredRating, setHoveredRating] = useState<string | null>(null);
  const [flyOutIndex, setFlyOutIndex] = useState<number | null>(null);

  // 快捷键
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'j':
      case 'ArrowDown':
        e.preventDefault();
        setCurrentIndex(Math.min(currentIndex + 1, displayWords.length - 1));
        break;
      case 'k':
      case 'ArrowUp':
        e.preventDefault();
        setCurrentIndex(Math.max(currentIndex - 1, 0));
        break;
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
        togglePhonetic();
        break;
      case 'Enter':
        e.preventDefault();
        const word = displayWords[currentIndex];
        if (word) speakWord(word.word);
        break;
    }
  }, [currentIndex, displayWords]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleRate = (rating: 'easy' | 'good' | 'again') => {
    const word = displayWords[currentIndex];
    if (!word) return;

    setFlyOutIndex(currentIndex);
    rateWord(word.id, rating);

    setTimeout(() => {
      setFlyOutIndex(null);
      if (currentIndex < displayWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 250);
  };

  // 显示当前词附近的词（前后各 5 个）
  const startIdx = Math.max(0, currentIndex - 5);
  const endIdx = Math.min(displayWords.length, currentIndex + 15);
  const visibleWords = displayWords.slice(startIdx, endIdx);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* 顶部信息 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            {currentDeckId === '__all' ? '全部词书' : decks.find(d => d.id === currentDeckId)?.name ?? '当前词书'}
            <span className={`text-xs px-1.5 py-0.5 rounded-md font-normal ${
              shuffleMode === 'shuffle'
                ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400'
                : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400'
            }`}>
              {shuffleMode === 'shuffle' ? '乱序' : '顺序'}
            </span>
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
            Unit 1 · {displayWords.length} 词
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="kbd">J</span><span className="kbd">K</span> 导航
          <span className="kbd ml-2">1</span><span className="kbd">2</span><span className="kbd">3</span> 评价
          <span className="kbd ml-2">Space</span> 释义
          <span className="kbd ml-2">Enter</span> 发音
        </div>
      </div>

      {/* 单词列表 */}
      <div className="glass rounded-2xl overflow-hidden">
        {visibleWords.map((word, i) => {
          const actualIndex = startIdx + i;
          const card = cards.get(word.id);
          const isActive = actualIndex === currentIndex;
          const isFlyOut = flyOutIndex === actualIndex;
          const memoryStrength = card ? getMemoryStrength(card.fsrs) : 0;

          return (
            <div
              key={word.id}
              className={`word-row flex items-center px-5 py-3 border-b border-slate-100/60 dark:border-slate-700/40 cursor-pointer
                ${isActive ? 'bg-blue-50/80 dark:bg-blue-900/20 border-l-2 border-l-blue-500' : ''}
                ${isFlyOut ? 'card-fly-out' : ''}
              `}
              onClick={() => setCurrentIndex(actualIndex)}
            >
              {/* 单词 + 音标 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {word.word}
                  </span>
                  {showPhonetic && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                      {word.phonetic}
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); speakWord(word.word); }}
                    className="text-slate-300 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    title="播放发音"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M11 5L6 9H2v6h4l5 4V5z" />
                    </svg>
                  </button>
                </div>

                {/* 释义提示（悬停显示） */}
                {isActive && (
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400 card-slide-in">
                    {word.definitions.map((d, j) => (
                      <span key={j}>
                        {j > 0 && ' · '}
                        <span className="text-slate-400 dark:text-slate-500">{d.pos}</span> {d.meaning}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 记忆强度条 */}
              <div className="w-24 flex items-center gap-1.5 mr-4">
                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${memoryStrength}%`,
                      background: memoryStrength > 70 ? '#16A34A' :
                                  memoryStrength > 40 ? '#F59E0B' : '#EF4444',
                    }}
                  />
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 w-8 text-right">
                  {card ? getStateLabel(card.fsrs.state) : '新词'}
                </span>
              </div>

              {/* 评价按钮（仅当前词显示） */}
              {isActive && (
                <div className="flex items-center gap-1.5 card-slide-in">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRate('easy'); }}
                    onMouseEnter={() => setHoveredRating('easy')}
                    onMouseLeave={() => setHoveredRating(null)}
                    className="rating-btn px-2.5 py-1.5 rounded-lg text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                  >
                    😊 熟悉
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRate('good'); }}
                    onMouseEnter={() => setHoveredRating('good')}
                    onMouseLeave={() => setHoveredRating(null)}
                    className="rating-btn px-2.5 py-1.5 rounded-lg text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                  >
                    😐 模糊
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRate('again'); }}
                    onMouseEnter={() => setHoveredRating('again')}
                    onMouseLeave={() => setHoveredRating(null)}
                    className="rating-btn px-2.5 py-1.5 rounded-lg text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                  >
                    😣 忘记
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 底部统计 */}
      <div className="flex items-center justify-between mt-4 text-sm text-slate-500 dark:text-slate-400">
        <span>
          当前第 <span className="text-blue-600 dark:text-blue-400 font-medium">{currentIndex + 1}</span> / {displayWords.length} 词
        </span>
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 10))}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            ← 上一组
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(displayWords.length - 1, currentIndex + 10))}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            下一组 →
          </button>
        </div>
      </div>

      {/* 快捷键提示悬浮框 */}
      {hoveredRating && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass rounded-xl px-4 py-2 text-sm text-slate-600 dark:text-slate-300 shadow-lg">
          {hoveredRating === 'easy' && <>按 <span className="kbd">1</span> 标记为熟悉 — 大幅延长复习间隔</>}
          {hoveredRating === 'good' && <>按 <span className="kbd">2</span> 标记为模糊 — 适度延长复习间隔</>}
          {hoveredRating === 'again' && <>按 <span className="kbd">3</span> 标记为忘记 — 短期重新复习</>}
        </div>
      )}
    </div>
  );
}
