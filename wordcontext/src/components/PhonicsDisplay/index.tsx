import { useEffect, useState } from 'react';
import { analyzeWord, speakWord, speakPhoneme, type PhonicsBreakdown } from '../../lib/phonics';

interface PhonicsDisplayProps {
  word: string;
  compact?: boolean;
}

function SpeakerIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M11 5L6 9H2v6h4l5 4V5z" />
    </svg>
  );
}

export function PhonicsDisplay({ word, compact = false }: PhonicsDisplayProps) {
  const [breakdown, setBreakdown] = useState<PhonicsBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    analyzeWord(word).then(b => {
      setBreakdown(b);
      setLoading(false);
    });
  }, [word]);

  if (loading) {
    return <div className="text-sm text-slate-400 dark:text-slate-500 animate-pulse">加载发音...</div>;
  }

  if (!breakdown) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <span className="font-mono text-sm text-slate-600 dark:text-slate-300">
          {breakdown.syllables.map((syl, i) => (
            <span key={i}>
              {i > 0 && <span className="text-slate-300 dark:text-slate-600">·</span>}
              <span className={i === breakdown.stressIndex ? 'font-bold text-slate-800 dark:text-slate-100' : ''}>
                {syl}
              </span>
            </span>
          ))}
        </span>
        <button
          onClick={() => speakWord(word)}
          className="ml-1 text-blue-500 hover:text-blue-600 transition-colors"
          title="播放发音"
        >
          <SpeakerIcon />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
      {/* 音节拆解 */}
      <div className="text-center mb-4">
        <div className="text-2xl font-bold tracking-wider mb-1">
          {breakdown.syllables.map((syl, i) => (
            <span key={i} className="inline-block">
              {i > 0 && <span className="text-slate-300 dark:text-slate-600 mx-0.5">·</span>}
              <span
                className={`cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 px-1 py-0.5 rounded transition-colors ${
                  i === breakdown.stressIndex ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-800 dark:text-slate-200'
                }`}
                onClick={() => speakWord(syl)}
                title={`点击播放 "${syl}"`}
              >
                {syl}
              </span>
            </span>
          ))}
        </div>

        {/* 发音按钮 */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <button
            onClick={() => speakWord(word)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <SpeakerIcon className="w-4 h-4 text-white" /> 播放发音
          </button>
        </div>
      </div>

      {/* 音素详情 */}
      <div className="flex flex-wrap justify-center gap-1 mt-3">
        {breakdown.phonemes.map((p, i) => (
          <button
            key={i}
            onClick={() => speakPhoneme(p.ipa)}
            className="group flex flex-col items-center px-2 py-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={`${p.grapheme} → ${p.ipa} (${p.type})`}
          >
            <span
              className="text-lg font-bold transition-transform group-hover:scale-110"
              style={{ color: p.color }}
            >
              {p.grapheme || '?'}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{p.ipa}</span>
          </button>
        ))}
      </div>

      {/* 重读标记 */}
      <div className="text-center mt-2 text-xs text-slate-400 dark:text-slate-500">
        重读音节：<span className="text-blue-600 dark:text-blue-400 font-medium">
          {breakdown.syllables[breakdown.stressIndex]}
        </span>
        （第 {breakdown.stressIndex + 1} 音节）
      </div>

      {/* 颜色图例 */}
      <div className="flex justify-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
        <span><span className="inline-block w-2 h-2 rounded-full bg-blue-600 mr-1"></span>辅音</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-red-600 mr-1"></span>元音</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-violet-600 mr-1"></span>组合</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-teal-600 mr-1"></span>R控</span>
      </div>
    </div>
  );
}
