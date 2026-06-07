import { create } from 'zustand';
import { db, type WordEntry, type CardEntry } from '../lib/db';
import { SAMPLE_WORDS, SAMPLE_DECKS } from '../lib/db/sampleData';
import { newCard, scheduleReview, scheduleReviewWithLog, checkAndTrainIfNeeded, loadFSRSParameters, type ReviewRating } from '../lib/fsrs';
import { createEmptyCard, State } from 'ts-fsrs';

type ViewMode = 'list' | 'detail' | 'stats' | 'settings';
type DetailSubMode = 'quiz' | 'rate';
type ThemeMode = 'light' | 'dark' | 'system';

interface StudyState {
  // 数据
  words: WordEntry[];
  cards: Map<string, CardEntry>;
  currentDeckId: string;

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
  cards: new Map(),
  currentDeckId: 'deck-cet4',
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

    const words = await db.words.toArray();
    const cards = await db.cards.toArray();
    const cardMap = new Map(cards.map(c => [c.id, c]));

    // 为没有卡片的词创建空白 FSRS 卡片
    for (const word of words) {
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

    set({ words, cards: cardMap, isInitialized: true });
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setDetailSubMode: (mode) => set({ detailSubMode: mode }),

  setCurrentIndex: (index) => {
    const { words } = get();
    set({ currentIndex: Math.max(0, Math.min(index, words.length - 1)) });
  },

  togglePhonetic: () => set((s) => ({ showPhonetic: !s.showPhonetic })),

  nextWord: () => {
    const { currentIndex, words } = get();
    if (currentIndex < words.length - 1) {
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
    const { words, currentIndex } = get();
    return words[currentIndex] || null;
  },

  getCurrentCard: () => {
    const { cards, words, currentIndex } = get();
    const word = words[currentIndex];
    return word ? cards.get(word.id) || null : null;
  },

  getDueWords: () => {
    const { words, cards } = get();
    const now = new Date();
    return words.filter(w => {
      const card = cards.get(w.id);
      return card && new Date(card.fsrs.due) <= now;
    });
  },

  getNewWords: () => {
    const { words, cards } = get();
    return words.filter(w => {
      const card = cards.get(w.id);
      return card && card.fsrs.state === 0; // State.New
    });
  },

  getStats: () => {
    const { words, cards } = get();
    let newCount = 0, learning = 0, review = 0;
    for (const w of words) {
      const card = cards.get(w.id);
      if (!card) continue;
      if (card.fsrs.state === 0) newCount++;
      else if (card.fsrs.state === 1 || card.fsrs.state === 3) learning++;
      else review++;
    }
    return { total: words.length, newCount, learning, review };
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
