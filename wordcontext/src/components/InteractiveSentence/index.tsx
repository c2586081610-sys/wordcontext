import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { lookupWordTranslation } from '../../lib/ecdict';
import { useStudyStore } from '../../stores/useStudyStore';

interface InteractiveSentenceProps {
  sentence: string;
  highlightWord?: string;
}

type WordTooltip = {
  word: string;
  translation: string;
  loading: boolean;
};

/**
 * 交互式例句组件
 * - 鼠标悬停单词显示中文翻译
 * - 点击单词跳转到该单词的详情页
 */
export function InteractiveSentence({ sentence, highlightWord }: InteractiveSentenceProps) {
  const [tooltip, setTooltip] = useState<WordTooltip | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const { words, setCurrentIndex, setViewMode } = useStudyStore();

  // 将句子拆分为 token（单词 + 标点 + 空格）
  const tokens = tokenize(sentence);

  const handleMouseEnter = useCallback(async (word: string, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 4 });

    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanWord) return;

    setTooltip({ word: cleanWord, translation: '', loading: true });
    const translation = await lookupWordTranslation(cleanWord);
    setTooltip({ word: cleanWord, translation, loading: false });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleClick = useCallback((word: string) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanWord) return;

    // 在当前词库中查找该单词
    const idx = words.findIndex(w => w.word.toLowerCase() === cleanWord);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setViewMode('detail');
    }
  }, [words, setCurrentIndex, setViewMode]);

  return (
    <>
      {tokens.map((token, i) => {
        const isWord = /^[a-zA-Z]+$/.test(token);
        const isHighlight = highlightWord && token.toLowerCase() === highlightWord.toLowerCase();

        if (!isWord) {
          return <span key={i}>{token}</span>;
        }

        return (
          <span
            key={i}
            className={`cursor-pointer transition-colors rounded px-0.5
              ${isHighlight
                ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30'
                : 'hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            onMouseEnter={(e) => handleMouseEnter(token, e)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(token)}
          >
            {token}
          </span>
        );
      })}

      {/* 悬停提示 - 通过 Portal 渲染到 body，避免 <p> 内嵌套 <div> 的问题 */}
      {tooltip && createPortal(
        <div
          className="fixed z-50 px-2.5 py-1.5 text-xs rounded-lg shadow-lg pointer-events-none
            bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800
            max-w-[200px] break-words"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {tooltip.loading ? (
            <span className="animate-pulse">查询中...</span>
          ) : (
            <span>
              <span className="font-medium text-blue-300 dark:text-blue-600">{tooltip.word}</span>
              {tooltip.translation && (
                <span className="ml-1.5">{tooltip.translation}</span>
              )}
            </span>
          )}
        </div>,
        document.body
      )}
    </>
  );
}

/**
 * 将句子拆分为 token 数组（单词、标点、空格）
 */
function tokenize(sentence: string): string[] {
  const tokens: string[] = [];
  let current = '';

  for (const ch of sentence) {
    if (/[a-zA-Z']/.test(ch)) {
      current += ch;
    } else {
      if (current) {
        tokens.push(current);
        current = '';
      }
      tokens.push(ch);
    }
  }
  if (current) tokens.push(current);

  return tokens;
}
