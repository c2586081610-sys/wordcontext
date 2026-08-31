import { create } from 'zustand';
import { db, type StudyLog } from '../lib/db';

export type DailyStatEntry = {
  id: string;                 // 日期 "2026-06-07"
  date: string;
  newWordsLearned: number;
  wordsReviewed: number;
  totalReviews: number;
  correctRate: number;
  studyMinutes: number;
};

interface DailyGoal {
  newWords: number;   // 每日新词目标
  reviews: number;    // 每日复习目标
}

interface TodayProgress {
  newWordsLearned: number;
  wordsReviewed: number;
  totalReviews: number;
  correctRate: number;
  studyMinutes: number;
}

interface MemoryDistribution {
  newState: number;     // 新词数量
  learning: number;     // 学习中
  review: number;       // 复习中
  relearning: number;   // 重新学习
}

interface StatState {
  dailyGoal: DailyGoal;
  dailyStats: DailyStatEntry[];
  streak: number;
  todayProgress: TodayProgress;
  memoryDistribution: MemoryDistribution;
  isLoading: boolean;

  setDailyGoal: (goal: Partial<DailyGoal>) => void;
  loadDailyStats: (days: number) => Promise<void>;
  loadStreak: () => Promise<void>;
  loadTodayProgress: () => Promise<void>;
  loadMemoryDistribution: () => Promise<void>;
  loadAll: () => Promise<void>;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function aggregateLogs(logs: StudyLog[]): DailyStatEntry {
  const uniqueWordIds = new Set<string>();
  const newWordIds = new Set<string>();
  let correctCount = 0;
  let totalTimeSpent = 0;

  for (const log of logs) {
    uniqueWordIds.add(log.wordId);
    if (log.rating === 1) {
      newWordIds.add(log.wordId);
    }
    if (log.rating >= 3) {
      correctCount++;
    }
    totalTimeSpent += log.timeSpent;
  }

  // rating=1 表示 again，即第一次学或重新学习
  // 新学词：rating=1 且是当日首次出现的词
  const date = logs.length > 0 ? logs[0].date : formatDate(new Date());

  return {
    id: date,
    date,
    newWordsLearned: newWordIds.size,
    wordsReviewed: uniqueWordIds.size,
    totalReviews: logs.length,
    correctRate: logs.length > 0 ? correctCount / logs.length : 0,
    studyMinutes: Math.round(totalTimeSpent / 60),
  };
}

export const useStatStore = create<StatState>((set, get) => ({
  dailyGoal: { newWords: 20, reviews: 50 },
  dailyStats: [],
  streak: 0,
  todayProgress: {
    newWordsLearned: 0,
    wordsReviewed: 0,
    totalReviews: 0,
    correctRate: 0,
    studyMinutes: 0,
  },
  memoryDistribution: {
    newState: 0,
    learning: 0,
    review: 0,
    relearning: 0,
  },
  isLoading: false,

  setDailyGoal: (goal) => {
    set((s) => ({
      dailyGoal: { ...s.dailyGoal, ...goal },
    }));
  },

  loadDailyStats: async (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    const logs = await db.studyLogs
      .where('date')
      .between(startDateStr, endDateStr, true, true)
      .toArray();

    // 按日期分组
    const logsByDate = new Map<string, StudyLog[]>();
    for (const log of logs) {
      if (!logsByDate.has(log.date)) {
        logsByDate.set(log.date, []);
      }
      logsByDate.get(log.date)!.push(log);
    }

    // 生成完整的日期范围（包含没有记录的日期）
    const stats: DailyStatEntry[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = formatDate(current);
      const dayLogs = logsByDate.get(dateStr) || [];
      if (dayLogs.length > 0) {
        stats.push(aggregateLogs(dayLogs));
      } else {
        stats.push({
          id: dateStr,
          date: dateStr,
          newWordsLearned: 0,
          wordsReviewed: 0,
          totalReviews: 0,
          correctRate: 0,
          studyMinutes: 0,
        });
      }
      current.setDate(current.getDate() + 1);
    }

    set({ dailyStats: stats });
  },

  loadStreak: async () => {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = formatDate(checkDate);

      const logs = await db.studyLogs
        .where('date')
        .equals(dateStr)
        .count();

      if (logs > 0) {
        streak++;
      } else {
        // 如果今天还没学习，不断 streak；否则断开
        if (i === 0) continue;
        break;
      }
    }

    set({ streak });
  },

  loadTodayProgress: async () => {
    const todayStr = formatDate(new Date());
    const logs = await db.studyLogs
      .where('date')
      .equals(todayStr)
      .toArray();

    const progress = aggregateLogs(logs);
    set({ todayProgress: progress });
  },

  loadMemoryDistribution: async () => {
    const cards = await db.cards.toArray();
    let newState = 0;
    let learning = 0;
    let review = 0;
    let relearning = 0;

    for (const card of cards) {
      const state = card.fsrs.state;
      if (state === 0) newState++;
      else if (state === 1) learning++;
      else if (state === 2) review++;
      else if (state === 3) relearning++;
    }

    set({ memoryDistribution: { newState, learning, review, relearning } });
  },

  loadAll: async () => {
    set({ isLoading: true });
    try {
      await Promise.all([
        get().loadDailyStats(90),
        get().loadStreak(),
        get().loadTodayProgress(),
        get().loadMemoryDistribution(),
      ]);
    } finally {
      set({ isLoading: false });
    }
  },
}));
