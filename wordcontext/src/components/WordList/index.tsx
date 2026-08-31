import { useStudyStore } from '../../stores/useStudyStore';
import { getMemoryStrength, getStateLabel } from '../../lib/fsrs';
import { speakWord } from '../../lib/phonics';
import { useEffect, useCallback, useState, useRef } from 'react';

export function WordList() {
  const {
    displayWords, cards, currentIndex, setCurrentIndex,
    rateWord, showPhonetic, togglePhonetic,
    decks, currentDeckId, shuffleMode,
    hoverShowOptions, hoverAutoSpeak,
    reviewFilter, setReviewFilter,
    getStats,
  } = useStudyStore();

  const stats = getStats();

  const [hoveredRating, setHoveredRating] = useState<string | null>(null);
  const [flyOutIndex, setFlyOutIndex] = useState<number | null>(null);
  // 悬停状态：当前悬停的行索引
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // 自动发音计时器 & 防重复标记
  const speakTimerRef = useRef<number | null>(null);
  const lastSpokenIdRef = useRef<string | null>(null);

  // 根据 reviewFilter 筛选（newOnly: 仅新词；all: 全部）
  const filteredWords = reviewFilter === 'newOnly'
    ? displayWords.filter(w => {
        const card = cards.get(w.id);
        return card && card.fsrs.state === 0;
      })
    : displayWords;

  // 快捷键
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'j':
      case 'ArrowDown':
        e.preventDefault();
        setCurrentIndex(Math.min(currentIndex + 1, filteredWords.length - 1));
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
        const word = filteredWords[currentIndex];
        if (word) speakWord(word.word);
        break;
    }
  }, [currentIndex, filteredWords]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 评价：可指定 wordIndex（用于悬停评价），默认当前词
  const handleRate = (rating: 'easy' | 'good' | 'again', wordIndex: number = currentIndex) => {
    const word = filteredWords[wordIndex];
    if (!word) return;

    // 先选中该词，再执行评价（点击优先于悬停）
    setCurrentIndex(wordIndex);
    setFlyOutIndex(wordIndex);
    rateWord(word.id, rating);

    setTimeout(() => {
      setFlyOutIndex(null);
      if (wordIndex < filteredWords.length - 1) {
        setCurrentIndex(wordIndex + 1);
      }
    }, 250);
  };

  // 鼠标悬停进入单词行：显示选项 + 触发自动发音（500ms 后，每次进入仅一次）
  const handleRowEnter = (wordIndex: number) => {
    const word = filteredWords[wordIndex];
    if (!word) return;

    // 立即标记悬停，UI 即时显示选项（<300ms）
    setHoveredIndex(wordIndex);

    // 自动发音：500ms 延迟，避免误触；同一悬停会话仅触发一次
    if (hoverAutoSpeak && lastSpokenIdRef.current !== word.id) {
      if (speakTimerRef.current) clearTimeout(speakTimerRef.current);
      speakTimerRef.current = window.setTimeout(() => {
        speakWord(word.word);
        lastSpokenIdRef.current = word.id;
        speakTimerRef.current = null;
      }, 500);
    }
  };

  // 鼠标离开单词行：清除悬停状态并取消待发音
  const handleRowLeave = () => {
    if (speakTimerRef.current) {
      clearTimeout(speakTimerRef.current);
      speakTimerRef.current = null;
    }
    lastSpokenIdRef.current = null; // 离开后重置，下次悬停可再次发音
    setHoveredIndex(null);
  };

  // 组件卸载时清理计时器
  useEffect(() => {
    return () => {
      if (speakTimerRef.current) clearTimeout(speakTimerRef.current);
    };
  }, []);

  // 显示当前词附近的词（前后各 5 个）
  const startIdx = Math.max(0, currentIndex - 5);
  const endIdx = Math.min(filteredWords.length, currentIndex + 15);
  const visibleWords = filteredWords.slice(startIdx, endIdx);

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
            Unit 1 · {filteredWords.length} 词
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="kbd">J</span><span className="kbd">K</span> 导航
          <span className="kbd ml-2">1</span><span className="kbd">2</span><span className="kbd">3</span> 评价
          <span className="kbd ml-2">Space</span> 释义
          <span className="kbd ml-2">Enter</span> 发音
        </div>
      </div>

      {/* 今日新词入口 */}
      <div
        onClick={() => setReviewFilter(reviewFilter === 'newOnly' ? 'all' : 'newOnly')}
        className={`mb-4 p-4 rounded-2xl cursor-pointer transition-all ${
          reviewFilter === 'newOnly'
            ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700'
            : 'glass border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              reviewFilter === 'newOnly' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
            }`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {reviewFilter === 'newOnly' ? '正在学习新词' : '今日新词'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {stats.newCount > 0 ? `${stats.newCount} 个新词待学习` : '全部已学完'}
              </p>
            </div>
          </div>
          {reviewFilter === 'newOnly' ? (
            <span className="text-xs text-blue-500 font-medium">点击查看全部</span>
          ) : stats.newCount > 0 ? (
            <span className="text-xs text-blue-500 font-medium">点击筛选 →</span>
          ) : null}
        </div>
      </div>

      {/* 单词列表 */}
      <div className="glass rounded-2xl overflow-hidden">
        {visibleWords.map((word, i) => {
          const actualIndex = startIdx + i;
          const card = cards.get(word.id);
          const isActive = actualIndex === currentIndex;
          const isHovered = hoveredIndex === actualIndex;
          // 悬停显示选项：开启时按钮只跟鼠标走（悬停哪个显示哪个，点击不再常驻）；
          // 关闭时回退为点击选中（active）才显示
          const showRating = hoverShowOptions ? isHovered : isActive;
          const isFlyOut = flyOutIndex === actualIndex;
          const memoryStrength = card ? getMemoryStrength(card.fsrs) : 0;

          return (
            <div
              key={word.id}
              className={`word-row flex items-center px-5 py-3 border-b border-slate-100/60 dark:border-slate-700/40 cursor-pointer transition-colors duration-150
                ${isActive ? 'bg-blue-50/80 dark:bg-blue-900/20 border-l-2 border-l-blue-500' : isHovered ? 'bg-slate-50/80 dark:bg-slate-700/20' : ''}
                ${isFlyOut ? 'card-fly-out' : ''}
              `}
              onClick={() => setCurrentIndex(actualIndex)}
              onMouseEnter={() => handleRowEnter(actualIndex)}
              onMouseLeave={handleRowLeave}
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

              {/* 评价按钮（当前词或悬停时显示） */}
              {showRating && (
                <div className="flex items-center gap-1.5 card-slide-in">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRate('easy', actualIndex); }}
                    onMouseEnter={() => setHoveredRating('easy')}
                    onMouseLeave={() => setHoveredRating(null)}
                    className="rating-btn px-2.5 py-1.5 rounded-lg text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                  >
                    😊 熟悉
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRate('good', actualIndex); }}
                    onMouseEnter={() => setHoveredRating('good')}
                    onMouseLeave={() => setHoveredRating(null)}
                    className="rating-btn px-2.5 py-1.5 rounded-lg text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                  >
                    😐 模糊
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRate('again', actualIndex); }}
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
          当前第 <span className="text-blue-600 dark:text-blue-400 font-medium">{currentIndex + 1}</span> / {filteredWords.length} 词
        </span>
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 10))}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            ← 上一组
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(filteredWords.length - 1, currentIndex + 10))}
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
