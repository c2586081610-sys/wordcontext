import Dexie, { type Table } from 'dexie';
import type { FSRSCard } from '../fsrs';
import type { FSRSParameters } from 'ts-fsrs';

// 数据库表类型
export type WordEntry = {
  id: string;
  word: string;
  phonetic: string;           // 音标 "/əˈbændən/"
  definitions: Definition[];
  examples: string[];
  etymology: string;          // 词源
  wordFamily: string[];       // 词族
  mnemonic: string;           // 助记
  tags: string[];             // 标签（四六级/考研等）
};

export type Definition = {
  pos: string;                // 词性 "v."
  meaning: string;            // 释义 "放弃；抛弃"
};

export type CardEntry = {
  id: string;                 // wordId
  deckId: string;
  fsrs: FSRSCard;             // ts-fsrs 卡片状态
  rating: number;             // 最近评分
  lastReview?: Date;
};

export type DeckEntry = {
  id: string;
  name: string;
  description: string;
  wordCount: number;
  tags: string[];
  bookMatch?: string;         // 搭配的实体书
  wordIds: string[];
};

export type StudyLog = {
  id?: number;
  date: string;               // "2026-06-07"
  wordId: string;
  rating: number;
  timeSpent: number;          // 秒
  state: number;              // 评价时的卡片状态 (State.New=0, Learning=1, Review=2, Relearning=3)
  elapsed_days: number;       // 距上次复习天数
  scheduled_days: number;     // 原计划间隔天数
  review_duration: number;    // 本次复习耗时毫秒
};

export type SettingsEntry = {
  id: string;                              // 固定为 'fsrs'，用于存储 FSRS 参数
  fsrsParameters: FSRSParameters;          // 训练后的 FSRS 参数
  lastTrainedAt: string;                   // 上次训练时间 ISO 字符串
  reviewCountSinceTraining: number;        // 自上次训练以来的复习次数
};

// Dexie 数据库
class WordContextDB extends Dexie {
  words!: Table<WordEntry>;
  cards!: Table<CardEntry>;
  decks!: Table<DeckEntry>;
  studyLogs!: Table<StudyLog>;
  settings!: Table<SettingsEntry>;

  constructor() {
    super('wordcontext');
    this.version(1).stores({
      words: 'id, word, *tags',
      cards: 'id, deckId, fsrs.due, fsrs.state',
      decks: 'id, name, *tags',
      studyLogs: '++id, date, wordId',
    });

    // v2: 增强 studyLogs 字段 + 新增 settings 表
    this.version(2).stores({
      words: 'id, word, *tags',
      cards: 'id, deckId, fsrs.due, fsrs.state',
      decks: 'id, name, *tags',
      studyLogs: '++id, date, wordId, state, rating',
      settings: 'id',
    }).upgrade((tx) => {
      // 为旧记录填充默认值
      return tx.table('studyLogs').toCollection().modify((log: any) => {
        if (log.state === undefined) log.state = 0;
        if (log.elapsed_days === undefined) log.elapsed_days = 0;
        if (log.scheduled_days === undefined) log.scheduled_days = 0;
        if (log.review_duration === undefined) log.review_duration = 0;
      });
    });
  }
}

export const db = new WordContextDB();
