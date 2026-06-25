import { useStudyStore } from '../../stores/useStudyStore';
import { PhonicsDisplay } from '../PhonicsDisplay';
import { speakWord } from '../../lib/phonics';
import { getMemoryStrength, getDueLabel, getStateLabel } from '../../lib/fsrs';
import { lookupECDICT, translateSentences, type ECDICTResult } from '../../lib/ecdict';
import { InteractiveSentence } from '../InteractiveSentence';
import { useEffect, useCallback, useState } from 'react';
import type { ReviewRating } from '../../lib/fsrs';

function SpeakerIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M11 5L6 9H2v6h4l5 4V5z" />
    </svg>
  );
}

export function WordDetail() {
  const {
    displayWords, cards, currentIndex, setCurrentIndex,
    detailSubMode, setDetailSubMode, rateWord, nextWord, prevWord, shuffleMode,
  } = useStudyStore();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [flyOut, setFlyOut] = useState(false);
  const [ecdictData, setEcdictData] = useState<ECDICTResult | null>(null);
  const [exampleTranslations, setExampleTranslations] = useState<string[]>([]);

  const word = displayWords[currentIndex];
  const card = word ? cards.get(word.id) : null;

  // 查询 ECDICT 补充释义
  useEffect(() => {
    if (!word) return;
    setEcdictData(null);
    lookupECDICT(word.word).then(data => setEcdictData(data));
  }, [word?.id]);

  // 查询例句翻译
  useEffect(() => {
    if (!word || !word.examples.length) {
      setExampleTranslations([]);
      return;
    }
    translateSentences(word.examples).then(setExampleTranslations);
  }, [word?.id]);

  // 合并释义：优先使用 ECDICT 数据（更丰富），回退到本地数据
  const definitions = ecdictData?.definitions?.length
    ? ecdictData.definitions
    : word?.definitions ?? [];

  // 生成选择题选项
  const [options, setOptions] = useState<{ pos: string; meaning: string }[]>([]);
  useEffect(() => {
    if (!word) return;
    const correct = definitions[0];
    if (!correct) return;
    const others = displayWords
      .filter(w => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.definitions[0]);
    const allOptions = [correct, ...others].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [word?.id, definitions]);

  // 快捷键
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (detailSubMode === 'quiz' && !showResult) {
      if (e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const idx = parseInt(e.key) - 1;
        if (idx < options.length) {
          setSelectedAnswer(idx);
          setShowResult(true);
        }
      }
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
        e.preventDefault();
        prevWord();
        break;
      case 'ArrowRight':
      case 'd':
        e.preventDefault();
        nextWord();
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
      case 'Enter':
        e.preventDefault();
        if (word) speakWord(word.word);
        break;
      case 'Tab':
        e.preventDefault();
        setDetailSubMode(detailSubMode === 'quiz' ? 'rate' : 'quiz');
        break;
    }
  }, [detailSubMode, showResult, word, options]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleRate = (rating: ReviewRating) => {
    if (!word) return;
    setFlyOut(true);
    rateWord(word.id, rating);
    setTimeout(() => {
      setFlyOut(false);
      nextWord();
    }, 250);
  };

  const handleQuizAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    setShowResult(true);
  };

  if (!word || !card) {
    return <div className="text-center py-20 text-slate-400 dark:text-slate-500">没有单词数据</div>;
  }

  const memoryStrength = getMemoryStrength(card.fsrs);
  const dueLabel = getDueLabel(card.fsrs);

  return (
    <div className={`max-w-2xl mx-auto px-4 py-6 ${flyOut ? 'card-fly-out' : 'card-slide-in'}`}>
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevWord}
          className="px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-all"
        >
          ← 上一个
        </button>

        <span className="text-sm text-slate-400 dark:text-slate-500 flex items-center gap-2">
          {currentIndex + 1} / {displayWords.length}
          <span className={`text-xs px-1.5 py-0.5 rounded-md ${
            shuffleMode === 'shuffle'
              ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400'
              : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400'
          }`}>
            {shuffleMode === 'shuffle' ? '乱序' : '顺序'}
          </span>
        </span>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-700/50 rounded-lg p-0.5">
            <button
              onClick={() => setDetailSubMode('quiz')}
              className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                detailSubMode === 'quiz'
                  ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-slate-200 font-medium'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              选择
            </button>
            <button
              onClick={() => setDetailSubMode('rate')}
              className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                detailSubMode === 'rate'
                  ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-slate-200 font-medium'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              评价
            </button>
          </div>
          <button
            onClick={nextWord}
            className="px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-all"
          >
            下一个 →
          </button>
        </div>
      </div>

      {/* 单词卡片主体 */}
      <div className="glass rounded-2xl p-8 mb-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">{word.word}</h1>
          <div className="text-lg text-slate-400 dark:text-slate-500 font-mono mb-3">{word.phonetic}</div>
          <button
            onClick={() => speakWord(word.word)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            <SpeakerIcon className="w-5 h-5 text-white" /> 播放发音
          </button>
        </div>

        <PhonicsDisplay word={word.word} />

        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500 dark:text-slate-400">
          <span>状态：<span className="text-blue-600 dark:text-blue-400">{getStateLabel(card.fsrs.state)}</span></span>
          <span>下次复习：<span className="text-amber-600 dark:text-amber-400">{dueLabel}</span></span>
          <span>
            记忆强度：
            <span className={memoryStrength > 70 ? 'text-green-600 dark:text-green-400' : memoryStrength > 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}>
              {memoryStrength}%
            </span>
          </span>
        </div>
      </div>

      {/* 子模式 A：选择释义 */}
      {detailSubMode === 'quiz' && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-center text-sm text-slate-500 dark:text-slate-400 mb-4">── 选择正确的中文意思 ──</h3>
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt, i) => {
              const isCorrect = opt.meaning === definitions[0]?.meaning;
              const isSelected = selectedAnswer === i;

              let bgClass = 'bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 border-slate-200 dark:border-slate-600';
              if (showResult && isSelected) {
                bgClass = isCorrect
                  ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'
                  : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700';
              } else if (showResult && isCorrect) {
                bgClass = 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700';
              }

              return (
                <button
                  key={i}
                  onClick={() => !showResult && handleQuizAnswer(i)}
                  disabled={showResult}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${bgClass}`}
                >
                  <span className="text-xs text-slate-400 dark:text-slate-500 mr-2">{String.fromCharCode(65 + i)}.</span>
                  <span className="text-slate-400 dark:text-slate-500 mr-1">{opt.pos}</span>
                  <span className="text-slate-800 dark:text-slate-200">{opt.meaning}</span>
                  {showResult && isCorrect && <span className="ml-2 text-green-600 dark:text-green-400">✓</span>}
                  {showResult && isSelected && !isCorrect && <span className="ml-2 text-red-600 dark:text-red-400">✗</span>}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-6 text-center card-slide-in">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                {selectedAnswer !== null && options[selectedAnswer]?.meaning === definitions[0]?.meaning
                  ? '答对了！'
                  : '再想想这个词的意思'}
              </p>
              <button
                onClick={() => nextWord()}
                className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                下一个 →
              </button>
            </div>
          )}

          {!showResult && (
            <div className="text-center mt-4 text-xs text-slate-400 dark:text-slate-500">
              按 <span className="kbd">1</span>~<span className="kbd">4</span> 选择答案 · <span className="kbd">Tab</span> 切换模式
            </div>
          )}
        </div>
      )}

      {/* 子模式 B：三段评价 */}
      {detailSubMode === 'rate' && (
        <div className="glass rounded-2xl p-6">
          <div className="text-center mb-6">
            {definitions.map((d, i) => (
              <div key={i} className="text-lg text-slate-700 dark:text-slate-300">
                <span className="text-slate-400 dark:text-slate-500 mr-2">{d.pos}</span>
                {d.meaning}
              </div>
            ))}
            {/* ECDICT 英文释义 */}
            {ecdictData?.definitions_en?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                {ecdictData.definitions_en.map((d, i) => (
                  <div key={i} className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="text-slate-400 dark:text-slate-500 mr-2">{d.pos}</span>
                    {d.meaning}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => handleRate('easy')}
              className="rating-btn flex flex-col items-center gap-1 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 hover:border-green-300 dark:hover:border-green-700 transition-all"
            >
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">熟悉</span>
              <span className="text-xs text-green-500 dark:text-green-500">不用再复习</span>
            </button>
            <button
              onClick={() => handleRate('good')}
              className="rating-btn flex flex-col items-center gap-1 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700 transition-all"
            >
              <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">模糊</span>
              <span className="text-xs text-amber-500 dark:text-amber-500">需要巩固</span>
            </button>
            <button
              onClick={() => handleRate('again')}
              className="rating-btn flex flex-col items-center gap-1 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 hover:border-red-300 dark:hover:border-red-700 transition-all"
            >
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
              <span className="text-sm font-medium text-red-700 dark:text-red-400">忘记</span>
              <span className="text-xs text-red-500 dark:text-red-500">重新学习</span>
            </button>
          </div>

          {/* 词根/助记 */}
          <div className="space-y-2 text-sm">
            {word.mnemonic && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <span className="text-amber-600 dark:text-amber-400 font-medium">助记</span>
                <span className="text-slate-600 dark:text-slate-300">{word.mnemonic}</span>
              </div>
            )}
            {word.etymology && (
              <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-green-600 dark:text-green-400 font-medium">词根</span>
                <span className="text-slate-600 dark:text-slate-300">{word.etymology}</span>
              </div>
            )}
            {/* ECDICT 词形变化 */}
            {ecdictData?.exchange && Object.keys(ecdictData.exchange).length > 0 && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-medium">词形</span>
                <span className="text-slate-600 dark:text-slate-300">
                  {Object.entries(ecdictData.exchange)
                    .map(([key, val]) => {
                      const labels: Record<string, string> = {
                        p: '过去式', d: '过去分词', i: '现在分词',
                        '3': '第三人称', s: '名词复数', r: '比较级',
                        t: '最高级', f: '词根',
                      };
                      return `${labels[key] || key}: ${val}`;
                    })
                    .join(' · ')}
                </span>
              </div>
            )}
            {(word.wordFamily.length > 1 || (ecdictData?.exchange && Object.keys(ecdictData.exchange).length > 0)) && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-medium">词族</span>
                <span className="text-slate-600 dark:text-slate-300">
                  {[
                    ...word.wordFamily,
                    ...Object.values(ecdictData?.exchange ?? {}),
                  ].filter((v, i, arr) => arr.indexOf(v) === i && v !== word.word).join(' · ')}
                </span>
              </div>
            )}
            {/* ECDICT 考试标签 & 词频 */}
            {ecdictData && (ecdictData.tags.length > 0 || ecdictData.collins > 0 || ecdictData.oxford > 0) && (
              <div className="flex items-start gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-purple-600 dark:text-purple-400 font-medium">标签</span>
                <span className="text-slate-600 dark:text-slate-300">
                  {ecdictData.tags.map(t => {
                    const labels: Record<string, string> = {
                      zk: '中考', gk: '高考', cet4: '四级', cet6: '六级',
                      ky: '考研', toefl: '托福', ielts: '雅思', gre: 'GRE',
                      gmat: 'GMAT', sat: 'SAT', bec: 'BEC',
                    };
                    return labels[t] || t.toUpperCase();
                  }).join(' · ')}
                  {ecdictData.collins > 0 && ` · 柯林斯${ecdictData.collins}星`}
                  {ecdictData.oxford > 0 && ' · 牛津3000'}
                  {ecdictData.bnc != null && ` · BNC #${ecdictData.bnc}`}
                </span>
              </div>
            )}
          </div>

          <div className="text-center mt-4 text-xs text-slate-400 dark:text-slate-500">
            <span className="kbd">1</span> 熟悉 · <span className="kbd">2</span> 模糊 · <span className="kbd">3</span> 忘记 · <span className="kbd">Tab</span> 切换模式
          </div>
        </div>
      )}

      {/* 例句 */}
      <div className="glass rounded-2xl p-5 mt-4">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">例句</h3>
        {word.examples.map((ex, i) => (
          <div key={i} className="mb-3 last:mb-0">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="text-slate-400 dark:text-slate-500 mr-1">{i + 1}.</span>
              <InteractiveSentence sentence={ex} highlightWord={word.word} />
            </p>
            {exampleTranslations[i] && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 ml-5">
                {exampleTranslations[i]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
