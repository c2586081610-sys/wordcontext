import { db, type WordEntry, type CardEntry, type DeckEntry, type StudyLog } from '../db';
import { newCard } from '../fsrs';

// 导出数据的顶层格式
export type ExportData = {
  version: string;
  exportDate: string;
  words: WordEntry[];
  cards: CardEntry[];
  decks: DeckEntry[];
  studyLogs: StudyLog[];
};

// CSV 行格式（单词表扁平化）
type CSVRow = {
  word: string;
  phonetic: string;
  pos: string;
  meaning: string;
  tags: string;
  state: number;
  stability: number;
  due: string;
};

/**
 * 导出全部数据
 */
export async function exportAll(format: 'json' | 'csv'): Promise<void> {
  const [words, cards, decks, studyLogs] = await Promise.all([
    db.words.toArray(),
    db.cards.toArray(),
    db.decks.toArray(),
    db.studyLogs.toArray(),
  ]);

  if (format === 'json') {
    const data: ExportData = {
      version: '1.1',
      exportDate: new Date().toISOString(),
      words,
      cards,
      decks,
      studyLogs,
    };
    downloadJSON(data, `词境_全部数据_${formatDate()}.json`);
  } else {
    const rows = wordsToCSVRows(words, cards);
    downloadCSV(rows, `词境_单词表_${formatDate()}.csv`);
  }
}

/**
 * 按词库导出数据
 */
export async function exportByDeck(deckId: string, format: 'json' | 'csv'): Promise<void> {
  const deck = await db.decks.get(deckId);
  if (!deck) throw new Error(`词库 ${deckId} 不存在`);

  const [words, cards, studyLogs] = await Promise.all([
    db.words.where('id').anyOf(deck.wordIds).toArray(),
    db.cards.where('deckId').equals(deckId).toArray(),
    db.studyLogs.where('wordId').anyOf(deck.wordIds).toArray(),
  ]);

  if (format === 'json') {
    const data: ExportData = {
      version: '1.1',
      exportDate: new Date().toISOString(),
      words,
      cards,
      decks: [deck],
      studyLogs,
    };
    downloadJSON(data, `词境_${deck.name}_${formatDate()}.json`);
  } else {
    const rows = wordsToCSVRows(words, cards);
    downloadCSV(rows, `词境_${deck.name}_单词表_${formatDate()}.csv`);
  }
}

/**
 * 导入数据（自动识别 JSON/CSV 格式）
 */
export async function importData(file: File): Promise<ImportResult> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'json') {
    return importJSON(file);
  } else if (ext === 'csv') {
    return importCSV(file);
  } else {
    // 尝试按内容判断
    const text = await readFileAsText(file);
    const trimmed = text.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return importJSONFromString(text);
    } else {
      return importCSVFromString(text);
    }
  }
}

export type ImportResult = {
  success: boolean;
  message: string;
  details: {
    wordsImported: number;
    wordsSkipped: number;
    cardsImported: number;
    decksImported: number;
    studyLogsImported: number;
  };
};

/**
 * 清空所有数据
 */
export async function clearAllData(): Promise<void> {
  await Promise.all([
    db.words.clear(),
    db.cards.clear(),
    db.decks.clear(),
    db.studyLogs.clear(),
  ]);
}

// ---- 内部工具函数 ----

function formatDate(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function downloadJSON(data: ExportData, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  triggerDownload(blob, filename);
}

function downloadCSV(rows: CSVRow[], filename: string): void {
  const BOM = '\uFEFF';
  const header = 'word,phonetic,pos,meaning,tags,state,stability,due';
  const lines = rows.map(r =>
    [
      csvEscape(r.word),
      csvEscape(r.phonetic),
      csvEscape(r.pos),
      csvEscape(r.meaning),
      csvEscape(r.tags),
      r.state,
      r.stability,
      csvEscape(r.due),
    ].join(',')
  );
  const csv = BOM + header + '\n' + lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  triggerDownload(blob, filename);
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function wordsToCSVRows(words: WordEntry[], cards: CardEntry[]): CSVRow[] {
  const cardMap = new Map(cards.map(c => [c.id, c]));
  return words.map(w => {
    const card = cardMap.get(w.id);
    const primaryDef = w.definitions[0];
    return {
      word: w.word,
      phonetic: w.phonetic,
      pos: primaryDef?.pos ?? '',
      meaning: primaryDef?.meaning ?? '',
      tags: w.tags.join(';'),
      state: card?.fsrs.state ?? 0,
      stability: card?.fsrs.stability ?? 0,
      due: card?.fsrs.due ? new Date(card.fsrs.due).toISOString() : '',
    };
  });
}

async function importJSON(file: File): Promise<ImportResult> {
  const text = await readFileAsText(file);
  return importJSONFromString(text);
}

async function importJSONFromString(text: string): Promise<ImportResult> {
  let data: ExportData;
  try {
    data = JSON.parse(text);
  } catch {
    return { success: false, message: 'JSON 格式无效，无法解析', details: emptyDetails() };
  }

  // 版本校验
  if (!data.version) {
    return { success: false, message: '缺少版本号，不是有效的词境导出文件', details: emptyDetails() };
  }

  if (!data.words || !Array.isArray(data.words)) {
    return { success: false, message: '数据结构无效：缺少 words 字段', details: emptyDetails() };
  }

  return doImportJSON(data);
}

async function doImportJSON(data: ExportData): Promise<ImportResult> {
  const details = emptyDetails();

  // 导入词库（decks）
  if (data.decks && Array.isArray(data.decks)) {
    const existingDeckIds = new Set(await db.decks.toCollection().keys());
    const newDecks = data.decks.filter(d => !existingDeckIds.has(d.id));
    if (newDecks.length > 0) {
      await db.decks.bulkPut(newDecks);
    }
    details.decksImported = newDecks.length;
  }

  // 导入单词（words）—— 去重：已有则跳过
  const existingWordIds = new Set(await db.words.toCollection().keys());
  const newWords = data.words.filter(w => !existingWordIds.has(w.id));
  if (newWords.length > 0) {
    await db.words.bulkAdd(newWords);
  }
  details.wordsImported = newWords.length;
  details.wordsSkipped = data.words.length - newWords.length;

  // 导入卡片（cards）—— 去重
  const existingCardIds = new Set(await db.cards.toCollection().keys());
  const newCards = data.cards?.filter(c => !existingCardIds.has(c.id)) ?? [];
  if (newCards.length > 0) {
    // 修复 Date 对象（JSON 反序列化后是字符串）
    for (const card of newCards) {
      if (typeof card.fsrs?.due === 'string') card.fsrs.due = new Date(card.fsrs.due);
      if (typeof card.fsrs?.last_review === 'string') card.fsrs.last_review = new Date(card.fsrs.last_review);
      if (card.lastReview && typeof card.lastReview === 'string') card.lastReview = new Date(card.lastReview);
    }
    await db.cards.bulkAdd(newCards);
  }
  details.cardsImported = newCards.length;

  // 导入学习记录（studyLogs）
  if (data.studyLogs && Array.isArray(data.studyLogs)) {
    await db.studyLogs.bulkAdd(data.studyLogs);
    details.studyLogsImported = data.studyLogs.length;
  }

  return {
    success: true,
    message: `导入完成：${details.wordsImported} 个新词，${details.wordsSkipped} 个已存在跳过`,
    details,
  };
}

async function importCSV(file: File): Promise<ImportResult> {
  const text = await readFileAsText(file);
  return importCSVFromString(text);
}

async function importCSVFromString(text: string): Promise<ImportResult> {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) {
    return { success: false, message: 'CSV 文件为空或只有表头', details: emptyDetails() };
  }

  // 跳过 BOM
  let headerLine = lines[0];
  if (headerLine.charCodeAt(0) === 0xfeff) {
    headerLine = headerLine.slice(1);
  }

  const headers = parseCSVLine(headerLine);
  const requiredHeaders = ['word'];
  const hasRequired = requiredHeaders.every(h => headers.includes(h));
  if (!hasRequired) {
    return { success: false, message: 'CSV 缺少必要列：word', details: emptyDetails() };
  }

  const colIndex: Record<string, number> = {};
  headers.forEach((h, i) => { colIndex[h.trim()] = i; });

  const details = emptyDetails();
  const existingWordIds = new Set(await db.words.toCollection().keys());
  const newWords: WordEntry[] = [];
  const newCards: CardEntry[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const word = (values[colIndex['word']] ?? '').trim();
    if (!word) continue;

    const wordId = `word-${word}`;
    if (existingWordIds.has(wordId)) continue;

    const phonetic = (values[colIndex['phonetic']] ?? '').trim();
    const pos = (values[colIndex['pos']] ?? '').trim();
    const meaning = (values[colIndex['meaning']] ?? '').trim();
    const tagsStr = (values[colIndex['tags']] ?? '').trim();
    const stateVal = Number(values[colIndex['state']] ?? 0);
    const stabilityVal = Number(values[colIndex['stability']] ?? 0);
    const dueStr = (values[colIndex['due']] ?? '').trim();

    const tags = tagsStr ? tagsStr.split(';').map(t => t.trim()).filter(Boolean) : [];

    const wordEntry: WordEntry = {
      id: wordId,
      word,
      phonetic,
      definitions: pos || meaning ? [{ pos, meaning }] : [],
      examples: [],
      etymology: '',
      wordFamily: [],
      mnemonic: '',
      tags,
    };
    newWords.push(wordEntry);

    // 创建对应的卡片
    const fsrsCard = newCard();
    if (stateVal > 0) fsrsCard.state = stateVal;
    if (stabilityVal > 0) fsrsCard.stability = stabilityVal;
    if (dueStr) fsrsCard.due = new Date(dueStr);

    const cardEntry: CardEntry = {
      id: wordId,
      deckId: 'deck-imported',
      fsrs: fsrsCard,
      rating: 0,
    };
    newCards.push(cardEntry);
  }

  // 确保有 "导入" 词库
  const importDeck = await db.decks.get('deck-imported');
  if (!importDeck) {
    await db.decks.add({
      id: 'deck-imported',
      name: '导入词库',
      description: '通过 CSV 导入的单词',
      wordCount: newWords.length,
      tags: ['导入'],
      wordIds: newWords.map(w => w.id),
    });
  } else {
    // 合并 wordIds
    const existingIds = new Set(importDeck.wordIds);
    const mergedIds = [...importDeck.wordIds, ...newWords.map(w => w.id).filter(id => !existingIds.has(id))];
    await db.decks.update('deck-imported', {
      wordIds: mergedIds,
      wordCount: mergedIds.length,
    });
  }

  if (newWords.length > 0) {
    await db.words.bulkAdd(newWords);
  }
  if (newCards.length > 0) {
    await db.cards.bulkAdd(newCards);
  }

  details.wordsImported = newWords.length;
  details.cardsImported = newCards.length;

  return {
    success: true,
    message: `CSV 导入完成：${newWords.length} 个新词`,
    details,
  };
}

/**
 * 解析 CSV 单行（支持引号内逗号）
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file, 'utf-8');
  });
}

function emptyDetails() {
  return {
    wordsImported: 0,
    wordsSkipped: 0,
    cardsImported: 0,
    decksImported: 0,
    studyLogsImported: 0,
  };
}
