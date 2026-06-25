import { create } from 'zustand';
import { db, type WordEntry, type CardEntry, type DeckEntry } from '../lib/db';
import { SAMPLE_WORDS, SAMPLE_DECKS } from '../lib/db/sampleData';
import { newCard, scheduleReview, scheduleReviewWithLog, checkAndTrainIfNeeded, loadFSRSParameters, type ReviewRating } from '../lib/fsrs';
import { createEmptyCard, State } from 'ts-fsrs';

type ViewMode = 'list' | 'detail' | 'stats' | 'settings';
type DetailSubMode = 'quiz' | 'rate';
type ThemeMode = 'light' | 'dark' | 'system';
type ShuffleMode = 'order' | 'shuffle';

interface StudyState {
  // 数据
  words: WordEntry[];           // 原始顺序（数据源）
  displayWords: WordEntry[];    // 当前显示顺序（顺序=words，乱序=words 的随机排列）
  cards: Map<string, CardEntry>;
  decks: DeckEntry[];
  currentDeckId: string;        // '__all' 表示全部词书
  shuffleMode: ShuffleMode;

  // UI 状态
  viewMode: ViewMode;
  detailSubMode: DetailSubMode;
  currentIndex: number;
  showPhonetic: boolean;
  isInitialized: boolean;
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';

  // 操作
  init: () => Promise<void>;
  setViewMode: (mode: ViewMode) => void;
  setDetailSubMode: (mode: DetailSubMode) => void;
  setCurrentIndex: (index: number) => void;
  setCurrentDeckId: (deckId: string) => void;
  toggleShuffle: () => void;
  togglePhonetic: () => void;
  nextWord: () => void;
  prevWord: () => void;
  rateWord: (wordId: string, rating: ReviewRating) => void;
  getCurrentWord: () => WordEntry | null;
  getCurrentCard: () => CardEntry | null;
  getDueWords: () => WordEntry[];
  getNewWords: () => WordEntry[];
  getStats: () => { total: number; newCount: number; learning: number; review: number };
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  words: [],
  displayWords: [],
  cards: new Map(),
  decks: [],
  currentDeckId: 'deck-cet4',
  shuffleMode: 'order',
  viewMode: 'list',
  detailSubMode: 'rate',
  currentIndex: 0,
  showPhonetic: true,
  isInitialized: false,
  theme: 'system' as ThemeMode,
  resolvedTheme: (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' as const : 'light' as const,

  init: async () => {
    if (get().isInitialized) return;

    // 加载已保存的 FSRS 参数（如有）
    await loadFSRSParameters();

    // 检查是否已有数据
    const existingWords = await db.words.count();
    if (existingWords === 0) {
      // 写入示例数据（bulkPut 避免重复插入报错）
      await db.words.bulkPut(SAMPLE_WORDS);
      await db.decks.bulkPut(SAMPLE_DECKS);
    }

    const [allWords, cards, allDecks] = await Promise.all([
      db.words.toArray(),
      db.cards.toArray(),
      db.decks.toArray(),
    ]);
    const cardMap = new Map(cards.map(c => [c.id, c]));

    // 为没有卡片的词创建空白 FSRS 卡片
    for (const word of allWords) {
      if (!cardMap.has(word.id)) {
        const fsrsCard = newCard();
        const cardEntry: CardEntry = {
          id: word.id,
          deckId: 'deck-cet4',
          fsrs: fsrsCard,
          rating: 0,
        };
        await db.cards.add(cardEntry);
        cardMap.set(word.id, cardEntry);
      }
    }

    // 按当前 deck 过滤词(默认 deck-cet4)
    const deckId = get().currentDeckId;
    const words = deckId === '__all'
      ? allWords
      : filterByDeck(allWords, allDecks, deckId);

    // 根据当前 shuffleMode 派生 displayWords
    const displayWords = get().shuffleMode === 'shuffle' ? shuffleArray(words) : words;

    set({ words, displayWords, cards: cardMap, decks: allDecks, isInitialized: true });
  },

  setCurrentDeckId: (deckId) => {
    const { decks, shuffleMode } = get();
    // 切换词书时需要从原始 db 重新拉
    db.words.toArray().then(allDbWords => {
      const words = deckId === '__all'
        ? allDbWords
        : filterByDeck(allDbWords, decks, deckId);
      const displayWords = shuffleMode === 'shuffle' ? shuffleArray(words) : words;
      set({ currentDeckId: deckId, words, displayWords, currentIndex: 0 });
    });
  },

  toggleShuffle: () => {
    const { shuffleMode, words } = get();
    const nextMode: ShuffleMode = shuffleMode === 'order' ? 'shuffle' : 'order';
    const displayWords = nextMode === 'shuffle' ? shuffleArray(words) : words;
    set({ shuffleMode: nextMode, displayWords, currentIndex: 0 });
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setDetailSubMode: (mode) => set({ detailSubMode: mode }),

  setCurrentIndex: (index) => {
    const { displayWords } = get();
    set({ currentIndex: Math.max(0, Math.min(index, displayWords.length - 1)) });
  },

  togglePhonetic: () => set((s) => ({ showPhonetic: !s.showPhonetic })),

  nextWord: () => {
    const { currentIndex, displayWords } = get();
    if (currentIndex < displayWords.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  prevWord: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  rateWord: (wordId, rating) => {
    const { cards } = get();
    const card = cards.get(wordId);
    if (!card) return;

    // 记录评价前的卡片状态，用于增强日志
    const prevCard = card.fsrs;
    const prevState = prevCard.state;
    const prevScheduledDays = prevCard.scheduled_days;
    const prevLastReview = prevCard.last_review;

    // 计算距上次复习的天数
    let elapsedDays = 0;
    if (prevLastReview) {
      const now = new Date();
      const last = new Date(prevLastReview);
      elapsedDays = Math.max(0, Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)));
    }

    // 使用带 log 的调度获取完整信息
    const recordLogItem = scheduleReviewWithLog(prevCard, rating);
    const newFsrsCard = recordLogItem.card;

    const ratingValue = rating === 'again' ? 1 : rating === 'hard' ? 2 : rating === 'good' ? 3 : 4;

    const updatedCard: CardEntry = {
      ...card,
      fsrs: newFsrsCard,
      rating: ratingValue,
      lastReview: new Date(),
    };

    const newCards = new Map(cards);
    newCards.set(wordId, updatedCard);

    // 持久化到 IndexedDB
    db.cards.update(wordId, { fsrs: newFsrsCard, rating: updatedCard.rating, lastReview: updatedCard.lastReview });

    // 记录增强的学习日志
    db.studyLogs.add({
      date: new Date().toISOString().split('T')[0],
      wordId,
      rating: ratingValue,
      timeSpent: 0,
      state: prevState,
      elapsed_days: elapsedDays,
      scheduled_days: prevScheduledDays,
      review_duration: 0,
    });

    // 检查是否需要触发参数训练（异步，不阻塞）
    checkAndTrainIfNeeded().catch(err => console.warn('[StudyStore] 训练检查失败:', err));

    set({ cards: newCards });
  },

  getCurrentWord: () => {
    const { displayWords, currentIndex } = get();
    return displayWords[currentIndex] || null;
  },

  getCurrentCard: () => {
    const { cards, displayWords, currentIndex } = get();
    const word = displayWords[currentIndex];
    return word ? cards.get(word.id) || null : null;
  },

  getDueWords: () => {
    const { displayWords, cards } = get();
    const now = new Date();
    return displayWords.filter(w => {
      const card = cards.get(w.id);
      return card && new Date(card.fsrs.due) <= now;
    });
  },

  getNewWords: () => {
    const { displayWords, cards } = get();
    return displayWords.filter(w => {
      const card = cards.get(w.id);
      return card && card.fsrs.state === 0; // State.New
    });
  },

  getStats: () => {
    const { displayWords, cards } = get();
    let newCount = 0, learning = 0, review = 0;
    for (const w of displayWords) {
      const card = cards.get(w.id);
      if (!card) continue;
      if (card.fsrs.state === 0) newCount++;
      else if (card.fsrs.state === 1 || card.fsrs.state === 3) learning++;
      else review++;
    }
    return { total: displayWords.length, newCount, learning, review };
  },

  setTheme: (theme: ThemeMode) => {
    let resolved: 'light' | 'dark';
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = theme;
    }
    set({ theme, resolvedTheme: resolved });
  },

  toggleTheme: () => {
    const { theme } = get();
    const order: ThemeMode[] = ['light', 'dark', 'system'];
    const nextIndex = (order.indexOf(theme) + 1) % order.length;
    get().setTheme(order[nextIndex]);
  },
}));

// 辅助:按 deck 过滤 words
function filterByDeck(words: WordEntry[], decks: DeckEntry[], deckId: string): WordEntry[] {
  const deck = decks.find(d => d.id === deckId);
  if (!deck) return words;
  const idSet = new Set(deck.wordIds);
  return words.filter(w => idSet.has(w.id));
}

// 辅助:Fisher-Yates 洗牌算法，返回新数组，原数组不变
function shuffleArray<T>(arr: T[]): T[] {
  const result = arr.slice();
  for (let i = result.length - 1; i > 0; i--) {
    // crypto.getRandomValues 在所有现代浏览器可用，比 Math.random 更随机
    let j: number;
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      j = buf[0] % (i + 1);
    } else {
      j = Math.floor(Math.random() * (i + 1));
    }
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
