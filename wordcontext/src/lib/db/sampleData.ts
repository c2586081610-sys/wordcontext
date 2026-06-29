import type { WordEntry, DeckEntry } from './index';
import { WORDS_AB } from './sampleData1';
import { WORDS_CD } from './sampleData2';
import { WORDS_EH } from './sampleData3';
import { WORDS_IO } from './sampleData4';
import { WORDS_PS } from './sampleData5';
import { WORDS_TZ } from './sampleData6';
import { NCE1_WORDS, NCE1_DECK } from './nce1Data';

// CET4 核心词汇（共 510 词）
const CET4_WORDS: WordEntry[] = [
  ...WORDS_AB,
  ...WORDS_CD,
  ...WORDS_EH,
  ...WORDS_IO,
  ...WORDS_PS,
  ...WORDS_TZ,
];

// 合并所有示例词汇（CET4 + NCE1）
export const SAMPLE_WORDS: WordEntry[] = [
  ...CET4_WORDS,
  ...NCE1_WORDS,
];

// 示例词书
export const SAMPLE_DECKS: DeckEntry[] = [
  {
    id: 'deck-cet4',
    name: 'CET4 核心词汇',
    description: '大学英语四级核心高频词',
    wordCount: CET4_WORDS.length,
    tags: ['CET4'],
    bookMatch: '恋练有词（四级版）',
    wordIds: CET4_WORDS.map(w => w.id),
  },
  NCE1_DECK,
];
