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
      grapheme: '', // 后续由音节划分填充
      ipa,
      arpabet: token,
      type,
      color,
    });
  }

  return phonemes;
}

/**
 * 基于最大首音原则（Maximal Onset Principle）的音节划分
 */
function syllabify(word: string): string[] {
  const w = word.toLowerCase();
  if (w.length <= 3) return [w];

  const vowels = new Set('aeiouy');
  const syllables: string[] = [];
  let current = '';

  for (let i = 0; i < w.length; i++) {
    current += w[i];
    const isVowel = vowels.has(w[i]);

    if (isVowel) {
      // 找到元音后，看后面的辅音群如何分配
      let consonantCluster = '';
      let j = i + 1;
      while (j < w.length && !vowels.has(w[j])) {
        consonantCluster += w[j];
        j++;
      }

      if (j >= w.length) {
        // 词尾辅音全部归当前音节
        current += consonantCluster;
        syllables.push(current);
        current = '';
        i = j - 1;
      } else if (consonantCluster.length === 0) {
        // 下一个也是元音，在此处切分
        syllables.push(current);
        current = '';
      } else if (consonantCluster.length === 1) {
        // 单辅音归下一个音节
        syllables.push(current);
        current = '';
        i = j - 1; // 跳到辅音，让下一个循环处理
      } else {
        // 辅音群：最后一个归下一个，其余归当前
        current += consonantCluster.slice(0, -1);
        syllables.push(current);
        current = '';
        i = j - 2; // 回退到倒数第二个辅音
      }
    }
  }

  if (current) syllables.push(current);
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

  const syllables = syllabify(lowerWord);
  let phonemes: Phoneme[] = [];
  let stressIndex = 0;

  if (arpabet) {
    phonemes = parseArpabet(arpabet);
    stressIndex = findStressIndex(arpabet);
  } else {
    // CMU 词典中没有的词，用简单规则生成
    phonemes = fallbackPhonemes(lowerWord);
  }

  // 为每个音素分配对应的字母（grapheme）
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
      ipa: isVowel ? `/${char}/` : `/${char}/`,
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
  // 简单的线性分配（精确匹配需要更复杂的算法）
  const vowels = new Set('aeiouy');
  let charIdx = 0;

  for (const phoneme of phonemes) {
    if (charIdx >= word.length) break;

    // 跳过静音字母
    while (charIdx < word.length && word[charIdx] === 'e' &&
           charIdx === word.length - 1 && phonemes.length > 1) {
      charIdx++;
    }

    if (charIdx < word.length) {
      // 对于元音组合，可能需要多个字母
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
    phonemes: [], // 简化版，完整版需要音素到音节的映射
    isStressed: i === breakdown.stressIndex,
  }));
}

/**
 * 使用 Web Speech API 播放发音
 */
export function speakWord(word: string, lang = 'en-US'): void {
  if (!('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = lang;
  utterance.rate = 0.8;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

/**
 * 播放单个音素（通过拼读近似音）
 */
export function speakPhoneme(ipa: string, lang = 'en-US'): void {
  if (!('speechSynthesis' in window)) return;
  // Web Speech API 不能直接发 IPA，用近似单词代替
  const utterance = new SpeechSynthesisUtterance(ipa.replace(/\//g, ''));
  utterance.lang = lang;
  utterance.rate = 0.5;
  speechSynthesis.speak(utterance);
}
