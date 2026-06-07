import type { PhonicsBreakdown, Phoneme, SyllableInfo } from './types';
import { ARPABET_TO_IPA, getPhonemeType, getPhonemeColor } from './rules';

// CMU 词典数据（动态导入以减少初始包大小）
let cmuDict: Record<string, string> | null = null;

async function loadCMUDict(): Promise<Record<string, string>> {
  if (cmuDict) return cmuDict;
  const mod = await import('cmu-pronouncing-dictionary');
  cmuDict = mod.default || mod;
  return cmuDict;
}

/**
 * 从 CMU arpabet 音素序列解析为 Phoneme 数组
 */
function parseArpabet(arpabetStr: string): Phoneme[] {
  const tokens = arpabetStr.split(' ');
  const phonemes: Phoneme[] = [];

  for (const token of tokens) {
    const base = token.replace(/[0-2]/, '');
    const ipa = ARPABET_TO_IPA[base] || token;
    const type = getPhonemeType(token);
    const color = getPhonemeColor(type);

    phonemes.push({
      grapheme: '',
      ipa,
      arpabet: token,
      type,
      color,
    });
  }

  return phonemes;
}

/**
 * 基于 CMU 词典音素数量推断音节划分
 * 优先从 TTS 服务获取权威音节数，非 CMU 词使用均衡分配启发式
 */
async function syllabify(word: string, cmuArpabet?: string): Promise<string[]> {
  const w = word.toLowerCase();
  if (w.length <= 3) return [w];

  const vowels = new Set('aeiouy');

  // 方法1：CMU 词典有数据时，从 TTS 服务获取权威音节数
  if (cmuArpabet) {
    try {
      const res = await fetch(`http://localhost:8765/syllable-count/${encodeURIComponent(w)}`);
      if (res.ok) {
        const data: { syllable_count: number } = await res.json();
        const syllableCount = data.syllable_count;
        if (syllableCount >= 1) {
          const result: string[] = [];
          let pos = 0;
          const base = Math.floor(w.length / syllableCount);
          const remainder = w.length % syllableCount;
          for (let s = 0; s < syllableCount; s++) {
            const charCount = base + (s < remainder ? 1 : 0);
            result.push(w.slice(pos, pos + charCount));
            pos += charCount;
          }
          return result;
        }
      }
    } catch {
      // TTS 服务不可用，降级到方法2
    }
  }

  // 方法2：均衡分配（CMU 没有的词使用）
  // 音节数 = 元音数
  const vowelCount = [...w].filter(c => vowels.has(c)).length;
  if (vowelCount === 0) return [w];

  // 辅音均匀分配到各音节
  const consonants = [...w].map((c, i) => ({ c, i })).filter(({ c }) => !vowels.has(c));
  const perSyllable = Math.floor(consonants.length / vowelCount);
  const extra = consonants.length % vowelCount;

  const syllables: string[] = [];
  let pos = 0;
  let consIdx = 0;

  for (let s = 0; s < vowelCount; s++) {
    const hasExtra = s < extra;
    const numCons = perSyllable + (hasExtra ? 1 : 0);

    // 取前面的辅音
    const leading = w.slice(pos, pos + numCons);
    pos += numCons;

    // 找下一个元音位置
    let nextVowelPos = -1;
    for (let p = pos; p < w.length; p++) {
      if (vowels.has(w[p])) { nextVowelPos = p; break; }
    }

    if (nextVowelPos === -1) {
      syllables.push(leading + w.slice(pos));
    } else {
      syllables.push(leading + w.slice(pos, nextVowelPos + 1));
      pos = nextVowelPos + 1;
    }
  }

  return syllables.length > 0 ? syllables : [w];
}

/**
 * 判断重读音节（基于 CMU 音素中的重音标记）
 */
function findStressIndex(arpabetStr: string): number {
  const tokens = arpabetStr.split(' ');
  let vowelCount = 0;
  for (const token of tokens) {
    if (token.endsWith('1')) return vowelCount; // 主重音
    const base = token.replace(/[0-2]/, '');
    const vowels = new Set(['AA', 'AE', 'AH', 'AO', 'AW', 'AX', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW']);
    if (vowels.has(base)) vowelCount++;
  }
  return 0; // 默认第一个音节
}

/**
 * 完整的自然拼读分析
 */
export async function analyzeWord(word: string): Promise<PhonicsBreakdown> {
  const dict = await loadCMUDict();
  const lowerWord = word.toLowerCase().trim();
  const arpabet = dict[lowerWord];

  const syllables = await syllabify(lowerWord, arpabet);
  let phonemes: Phoneme[] = [];
  let stressIndex = 0;

  if (arpabet) {
    phonemes = parseArpabet(arpabet);
    stressIndex = findStressIndex(arpabet);
  } else {
    phonemes = fallbackPhonemes(lowerWord);
  }

  assignGraphemes(phonemes, lowerWord, syllables);

  return {
    word: lowerWord,
    syllables,
    phonemes,
    stressIndex,
    silentLetters: [],
  };
}

/**
 * CMU 词典中没有的词的 fallback 处理
 */
function fallbackPhonemes(word: string): Phoneme[] {
  const phonemes: Phoneme[] = [];
  const vowels = new Set('aeiouy');

  for (const char of word) {
    const isVowel = vowels.has(char);
    phonemes.push({
      grapheme: char,
      ipa: `/${char}/`,
      arpabet: char.toUpperCase(),
      type: isVowel ? 'vowel' : 'consonant',
      color: getPhonemeColor(isVowel ? 'vowel' : 'consonant'),
    });
  }

  return phonemes;
}

/**
 * 将音素与字母对应
 */
function assignGraphemes(phonemes: Phoneme[], word: string, _syllables: string[]): void {
  const vowels = new Set('aeiouy');
  let charIdx = 0;

  for (const phoneme of phonemes) {
    if (charIdx >= word.length) break;

    while (charIdx < word.length && word[charIdx] === 'e' &&
           charIdx === word.length - 1 && phonemes.length > 1) {
      charIdx++;
    }

    if (charIdx < word.length) {
      if (phoneme.type === 'vowel' && charIdx + 1 < word.length &&
          vowels.has(word[charIdx + 1])) {
        phoneme.grapheme = word[charIdx] + word[charIdx + 1];
        charIdx += 2;
      } else {
        phoneme.grapheme = word[charIdx];
        charIdx++;
      }
    }
  }
}

/**
 * 获取音节详细信息
 */
export async function getSyllableDetails(word: string): Promise<SyllableInfo[]> {
  const breakdown = await analyzeWord(word);
  return breakdown.syllables.map((syl, i) => ({
    text: syl,
    phonemes: [],
    isStressed: i === breakdown.stressIndex,
  }));
}

/**
 * 播放发音（优先 Kokoro，回退 Web Speech API）
 */
export async function speakWord(word: string, _lang?: string): Promise<void> {
  const { speakWord: kokoroSpeak } = await import('../kokoro/index')
  const { getSavedVoice, getSavedSpeed } = await import('../kokoro/voices')
  try {
    await kokoroSpeak(word, getSavedVoice(), getSavedSpeed())
  } catch {
    window.speechSynthesis?.cancel()
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'en-US'
    utterance.rate = 0.8
    window.speechSynthesis?.speak(utterance)
  }
}

/**
 * 播放单个音素（通过拼读近似音）
 */
export async function speakPhoneme(ipa: string, _lang?: string): Promise<void> {
  const { speakPhoneme: kokoroPhoneme } = await import('../kokoro/index')
  const { getSavedVoice } = await import('../kokoro/voices')
  const text = ipa.replace(/\//g, '').replace(/[ˈˌ]/g, '')
  if (!text) return

  try {
    await kokoroPhoneme(text, getSavedVoice())
  } catch {
    window.speechSynthesis?.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.5
    window.speechSynthesis?.speak(utterance)
  }
}