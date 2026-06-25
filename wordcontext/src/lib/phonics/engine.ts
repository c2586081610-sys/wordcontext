import type { PhonicsBreakdown, Phoneme, SyllableInfo } from './types';
import { ARPABET_TO_IPA, getPhonemeType, getPhonemeColor, VOWEL_COMBOS, DIGRAPHS, BLENDS, CONSONANT_GRAPHEMES } from './rules';

// CMU 词典数据（动态导入以减少初始包大小）
let cmuDict: Record<string, string> | null = null;

async function loadCMUDict(): Promise<Record<string, string>> {
  if (cmuDict) return cmuDict;
  // cmu-pronouncing-dictionary 的 ESM/CJS 双导出：
  //   - CJS require() 返回 { dictionary: {...} }
  //   - ESM import 也返回 { dictionary: {...} }
  //   - 没有 default export
  // 之前用 mod.default || mod 会拿到整个 mod 对象，导致 dict["hello"] 永远 undefined
  const mod: any = await import('cmu-pronouncing-dictionary')
  cmuDict = mod.dictionary || mod.default || mod
  return cmuDict!
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
 * ARPABET 元音集合
 */
const ARPABET_VOWELS = new Set(['AA','AE','AH','AO','AW','AX','AY','EH','ER','EY','IH','IY','OW','OY','UH','UW']);

/**
};

/**
 * 将 arpabet 音素序列与单词字母对齐，返回每个音素对应的字母范围
 */
function alignArpabetToWord(arpabetStr: string, word: string): { start: number; end: number }[] {
  const tokens = arpabetStr.split(' ');
  const w = word.toLowerCase();
  const ranges: { start: number; end: number }[] = [];
  let charPos = 0;

  for (const token of tokens) {
    const base = token.replace(/[0-2]/, '');
    if (charPos >= w.length) break;

    if (ARPABET_VOWELS.has(base)) {
      // 元音：匹配1-2个字母
      const start = charPos;
      if (charPos + 1 < w.length && VOWEL_COMBOS.has(w[charPos] + w[charPos + 1])) {
        ranges.push({ start, end: charPos + 2 });
        charPos += 2;
      } else {
        ranges.push({ start, end: charPos + 1 });
        charPos += 1;
      }
    } else {
      // 辅音：尝试匹配对应的字母组合
      const possibleGraphemes = CONSONANT_GRAPHEMES[base] || [base.toLowerCase()];
      let matched = false;
      for (const g of possibleGraphemes) {
        if (w.slice(charPos, charPos + g.length) === g) {
          ranges.push({ start: charPos, end: charPos + g.length });
          charPos += g.length;
          matched = true;
          break;
        }
      }
      if (!matched) {
        // 无法匹配，跳过1个字母
        ranges.push({ start: charPos, end: charPos + 1 });
        charPos += 1;
      }
    }
  }

  return ranges;
}

/**
 * 基于 arpabet 音素序列划分音节
 * 按元音音素确定音节核，辅音按英语规则分配到相邻音节
 */
function syllabifyFromArpabet(arpabetStr: string, word: string): string[] {
  const tokens = arpabetStr.split(' ');
  const w = word.toLowerCase();
  const ranges = alignArpabetToWord(arpabetStr, w);

  // 找所有元音音素 token 索引
  const vowelTokenIdx: number[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const base = tokens[i].replace(/[0-2]/, '');
    if (ARPABET_VOWELS.has(base)) vowelTokenIdx.push(i);
  }
  if (vowelTokenIdx.length <= 1) return [w];

  // 音节边界 = 字符位置
  // 核心规则（基于 Maximal Onset Principle + Liang 1983）:
  //   - VCV (1 cons):         V | CV      → 切在 cons 起点
  //                            特殊: cons 跨多字母 (双写) → 切在中间 (让 cc 拆为 c|c)
  //   - VCCV (2 cons):        VC | CV     → 切在 c1 结尾
  //                            例外: c1+c2 是 digraph (单音素) → 切在 vowel 后
  //                            例外: c1+c2 是 blend 且位于词首 (onset) → 切在 vowel 后
  //   - VCCCV+ (3+ cons):     VC | CCV    → 切在 c1 结尾
  const splitPositions: number[] = []

  for (let v = 0; v < vowelTokenIdx.length - 1; v++) {
    const curV = vowelTokenIdx[v]
    const nextV = vowelTokenIdx[v + 1]
    const consStart = curV + 1
    const consEnd = nextV - 1
    const consCount = consEnd - consStart + 1

    if (consCount === 1) {
      // VCV: 切在 cons 起点 (cons 归后作 onset)
      const r = ranges[consStart]
      if (!r) continue
      const rStart = r.start
      const rEnd = r.end
      if (rEnd - rStart > 1) {
        // cons 跨多字母: 区分双写 (cc/pp/tt) vs digraph (ch/sh/th)
        const grapheme = w.slice(rStart, rEnd)
        const isDouble = grapheme.length === 2 && grapheme[0] === grapheme[1]
        if (isDouble) {
          // 双写辅音: 切在中间 (让 cc 拆分到两侧, 适配 ac·com 这种)
          splitPositions.push(Math.floor((rStart + rEnd) / 2))
        } else {
          // digraph / 静默前辅音: 整体归后, 切在 cons 起点
          splitPositions.push(rStart)
        }
      } else {
        // 单字母辅音: 切在 cons 起点
        splitPositions.push(rStart)
      }
    } else if (consCount === 2) {
      // VCCV
      const c1Base = tokens[consStart].replace(/[0-2]/, '')
      const c2Base = tokens[consStart + 1].replace(/[0-2]/, '')
      const c1Graph = (CONSONANT_GRAPHEMES[c1Base] || [c1Base.toLowerCase()])[0]
      const c2Graph = (CONSONANT_GRAPHEMES[c2Base] || [c2Base.toLowerCase()])[0]
      const pair = c1Graph + c2Graph
      const r1 = ranges[consStart]
      const r2 = ranges[consStart + 1]
      if (!r1 || !r2) continue

      if (DIGRAPHS.has(pair)) {
        // digraph 是单音素不可拆, 整体归后
        splitPositions.push(r1.start)
      } else if (BLENDS.has(pair) && consStart === 1) {
        // blend 仅在词首 (onset 位置) 整体归后
        splitPositions.push(r1.start)
      } else {
        // VC | CV: 切在 c1 结尾 (c1 归前作 coda)
        splitPositions.push(r1.end)
      }
    } else {
      // 3+ cons: VC | CCV, 切在 c1 结尾
      const r1 = ranges[consStart]
      if (r1) splitPositions.push(r1.end)
    }
  }

  // 按 splitPositions 切字符
  const syllables: string[] = []
  let pos = 0
  for (const sp of splitPositions) {
    if (sp > pos) {
      syllables.push(w.slice(pos, sp))
      pos = sp
    }
  }
  if (pos < w.length) syllables.push(w.slice(pos))
  return syllables.length > 0 ? syllables : [w]
}

/**
 * 基于英语音节划分规则拆分单词（无 arpabet 时的回退方案）
 * 规则：
 * - VCV → V·CV（单个辅音归后一音节）
 * - VCCV → VC·CV（两个辅音各归一侧，除非是 digraph/blend）
 * - VCCCV → VC·CCV 或 VCC·CV（视组合而定）
 * - 静音 e 不计为独立音节
 * - 元音组合（ai, ea 等）作为一个音节核
 */
function splitByRules(word: string, syllableCount: number): string[] {
  if (syllableCount <= 1) return [word];
  if (syllableCount >= word.length) return [...word];

  const vowels = new Set('aeiouy');

  // 1. 找出元音组（连续元音如果构成已知组合则视为一组）
  const vowelGroups: { start: number; end: number }[] = [];
  let i = 0;
  while (i < word.length) {
    if (vowels.has(word[i])) {
      const start = i;
      if (i + 1 < word.length && vowels.has(word[i + 1])) {
        const pair = word[i] + word[i + 1];
        if (VOWEL_COMBOS.has(pair)) {
          vowelGroups.push({ start, end: i + 2 });
          i += 2;
          continue;
        }
      }
      vowelGroups.push({ start, end: i + 1 });
    }
    i++;
  }

  // 2. 处理末尾静音 e：如果最后一个元音组是词尾的 e 且还有其他元音组，移除它
  if (vowelGroups.length > syllableCount && vowelGroups.length >= 2) {
    const last = vowelGroups[vowelGroups.length - 1];
    if (last.end === word.length && word[last.start] === 'e') {
      vowelGroups.pop();
    }
  }

  // 3. 如果元音组仍多于音节数，尝试合并相邻的
  while (vowelGroups.length > syllableCount && vowelGroups.length >= 2) {
    const last = vowelGroups.pop()!;
    const prev = vowelGroups.pop()!;
    vowelGroups.push({ start: prev.start, end: last.end });
  }

  // 4. 如果元音组不够，回退到均等切分
  if (vowelGroups.length < syllableCount) {
    return equalSplit(word, syllableCount);
  }

  // 5. 根据元音组之间的辅音确定切分点
  const splitPoints: number[] = [];

  for (let v = 0; v < vowelGroups.length - 1; v++) {
    const currentVowelEnd = vowelGroups[v].end;
    const nextVowelStart = vowelGroups[v + 1].start;
    const consonantsBetween = nextVowelStart - currentVowelEnd;

    if (consonantsBetween === 0) {
      splitPoints.push(currentVowelEnd);
    } else if (consonantsBetween === 1) {
      // VCV → V·CV：辅音归后一音节
      splitPoints.push(currentVowelEnd);
    } else if (consonantsBetween === 2) {
      const pair = word.slice(currentVowelEnd, currentVowelEnd + 2);
      if (DIGRAPHS.has(pair) || BLENDS.has(pair)) {
        // digraph/blend 不可拆，整体归后一音节
        splitPoints.push(currentVowelEnd);
      } else {
        // VCCV → VC·CV：两个辅音各归一侧
        splitPoints.push(currentVowelEnd + 1);
      }
    } else {
      // 3+ 辅音：检查前两个是否构成 digraph/blend
      const firstPair = word.slice(currentVowelEnd, currentVowelEnd + 2);
      if (DIGRAPHS.has(firstPair) || BLENDS.has(firstPair)) {
        // 前两个辅音一起归后一音节
        splitPoints.push(currentVowelEnd);
      } else {
        // 第一个辅音归前一音节，其余归后一音节
        splitPoints.push(currentVowelEnd + 1);
      }
    }
  }

  // 6. 根据切分点构建音节数组
  const syllables: string[] = [];
  let pos = 0;
  for (const sp of splitPoints) {
    syllables.push(word.slice(pos, sp));
    pos = sp;
  }
  syllables.push(word.slice(pos));

  return syllables;
}

/**
 * 均等切分（回退方案）
 */
function equalSplit(word: string, syllableCount: number): string[] {
  const result: string[] = [];
  let pos = 0;
  const base = Math.floor(word.length / syllableCount);
  const remainder = word.length % syllableCount;
  for (let s = 0; s < syllableCount; s++) {
    const charCount = base + (s < remainder ? 1 : 0);
    result.push(word.slice(pos, pos + charCount));
    pos += charCount;
  }
  return result;
}

/**
 * 基于 CMU 词典音素数量推断音节划分
 * 有 arpabet 时优先使用音素对齐划分，否则使用字母规则
 */
async function syllabify(word: string, cmuArpabet?: string): Promise<string[]> {
  const w = word.toLowerCase();
  if (w.length <= 3) return [w];

  // 方法1：有 arpabet 数据时，直接按音素边界划分
  if (cmuArpabet) {
    const result = syllabifyFromArpabet(cmuArpabet, w);
    return result;
  }

  // 方法2：非 CMU 词，用字母元音数推断音节数，再用规则划分
  const vowels = new Set('aeiouy');
  const vowelCount = [...w].filter(c => vowels.has(c)).length;
  if (vowelCount === 0) return [w];

  const result = splitByRules(w, vowelCount);
  return result;
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
 * 播放发音
 *
 * 优先真人录音（不背单词 audio.beingfine.cn 或 有道 dictvoice），
 * 失败时回退到 Kokoro TTS，再回退到 Web Speech API。
 *
 * accent 决定发音口音：'us' = 美音，'uk' = 英音。
 * 默认 'us'，可在 Settings 切换。
 */
export async function speakWord(word: string, _lang?: string, accent?: 'us' | 'uk'): Promise<void> {
  const pron = await import('../pronunciation/index')
  await pron.speakWord(word, accent)
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