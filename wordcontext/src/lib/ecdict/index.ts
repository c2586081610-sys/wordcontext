/**
 * ECDICT 词典查询服务
 * 从本地 TTS 服务的 /ecdict/{word} 端点获取详细释义
 */

export type ECDICTDefinition = {
  pos: string;
  meaning: string;
};

export type ECDICTResult = {
  word: string;
  phonetic: string;
  definitions: ECDICTDefinition[];
  definitions_en: ECDICTDefinition[];
  pos: string;
  collins: number;
  oxford: number;
  tags: string[];
  bnc: number | null;
  frq: number | null;
  exchange: Record<string, string>;
};

const TTS_BASE = 'http://localhost:8765';

// 缓存已查询的结果
const cache = new Map<string, ECDICTResult | null>();
// 单词翻译缓存
const translationCache = new Map<string, string>();

/**
 * 从 ECDICT 查询单词的详细释义
 */
export async function lookupECDICT(word: string): Promise<ECDICTResult | null> {
  const key = word.toLowerCase().trim();

  // 检查缓存
  if (cache.has(key)) return cache.get(key) ?? null;

  try {
    const res = await fetch(`${TTS_BASE}/ecdict/${encodeURIComponent(key)}`);
    if (!res.ok) {
      cache.set(key, null);
      return null;
    }
    const data = (await res.json()) as ECDICTResult;
    cache.set(key, data);
    return data;
  } catch {
    // TTS 服务不可用
    cache.set(key, null);
    return null;
  }
}

/**
 * 查询单词的简短中文翻译（用于例句中单词悬停提示）
 */
export async function lookupWordTranslation(word: string): Promise<string> {
  const key = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!key) return '';

  if (translationCache.has(key)) return translationCache.get(key) ?? '';

  try {
    const res = await fetch(`${TTS_BASE}/ecdict/${encodeURIComponent(key)}/translate?sentence=`);
    if (!res.ok) {
      translationCache.set(key, '');
      return '';
    }
    const data = await res.json() as { word: string; translation: string };
    translationCache.set(key, data.translation);
    return data.translation;
  } catch {
    translationCache.set(key, '');
    return '';
  }
}

/**
 * 检查 ECDICT 服务是否可用
 */
export async function isECDICTAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${TTS_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * 批量翻译例句（通过 ECDICT 逐词翻译）
 */
export async function translateSentences(sentences: string[]): Promise<string[]> {
  if (!sentences.length) return [];
  try {
    const res = await fetch(`${TTS_BASE}/ecdict/translate-sentences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentences }),
    });
    if (!res.ok) return sentences.map(() => '');
    const data = await res.json() as { translations: string[] };
    return data.translations;
  } catch {
    return sentences.map(() => '');
  }
}
