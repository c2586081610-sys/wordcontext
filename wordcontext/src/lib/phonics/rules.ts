import type { PhonemeType } from './types';

// 颜色编码
export const PHONEME_COLORS: Record<PhonemeType, string> = {
  consonant: '#2563EB',     // 蓝色
  vowel: '#DC2626',         // 红色
  blend: '#7C3AED',         // 紫色
  digraph: '#7C3AED',       // 紫色
  'r-controlled': '#0D9488', // 青色
  silent: '#94A3B8',        // 灰色
};

// 辅音 digraphs（两个字母发一个音）
const DIGRAPHS = new Set(['sh', 'ch', 'th', 'wh', 'ph', 'gh', 'ck', 'ng', 'nk']);

// 辅音 blends（两个辅音各自发音，快速连读）
const BLENDS = new Set([
  'bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr',
  'pl', 'pr', 'sc', 'sk', 'sl', 'sm', 'sn', 'sp', 'st',
  'str', 'sw', 'tr', 'tw', 'scr', 'shr', 'spl', 'spr',
]);

// 元音组合
const VOWEL_COMBOS = new Set([
  'ai', 'ay', 'ea', 'ee', 'ei', 'ey', 'ie', 'oa', 'oe',
  'oi', 'oy', 'oo', 'ou', 'ow', 'au', 'aw', 'ui', 'ue',
]);

// R 控元音
const R_CONTROLLED = new Set(['ar', 'er', 'ir', 'or', 'ur', 'air', 'ear', 'eir', 'our']);

// 短元音映射
const SHORT_VOWELS: Record<string, string> = {
  'a': '/æ/', 'e': '/ɛ/', 'i': '/ɪ/', 'o': '/ɒ/', 'u': '/ʌ/',
};

// 长元音映射
const LONG_VOWELS: Record<string, string> = {
  'a': '/eɪ/', 'e': '/iː/', 'i': '/aɪ/', 'o': '/oʊ/', 'u': '/juː/',
};

// ARPAbet 到 IPA 映射（CMU 词典用的音素集）
export const ARPABET_TO_IPA: Record<string, string> = {
  // 元音
  'AA': '/ɑ/', 'AE': '/æ/', 'AH': '/ʌ/', 'AO': '/ɔ/',
  'AW': '/aʊ/', 'AX': '/ə/', 'AY': '/aɪ/', 'EH': '/ɛ/',
  'ER': '/ɝ/', 'EY': '/eɪ/', 'IH': '/ɪ/', 'IY': '/iː/',
  'OW': '/oʊ/', 'OY': '/ɔɪ/', 'UH': '/ʊ/', 'UW': '/uː/',
  // 辅音
  'B': '/b/', 'CH': '/tʃ/', 'D': '/d/', 'DH': '/ð/',
  'F': '/f/', 'G': '/ɡ/', 'HH': '/h/', 'JH': '/dʒ/',
  'K': '/k/', 'L': '/l/', 'M': '/m/', 'N': '/n/',
  'NG': '/ŋ/', 'P': '/p/', 'R': '/r/', 'S': '/s/',
  'SH': '/ʃ/', 'T': '/t/', 'TH': '/θ/', 'V': '/v/',
  'W': '/w/', 'Y': '/j/', 'Z': '/z/', 'ZH': '/ʒ/',
};

// 判断音素类型
export function getPhonemeType(arpabet: string): PhonemeType {
  const base = arpabet.replace(/[0-2]/, ''); // 去掉重音标记
  const vowels = new Set(['AA', 'AE', 'AH', 'AO', 'AW', 'AX', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW']);
  if (vowels.has(base)) {
    if (base === 'ER') return 'r-controlled';
    return 'vowel';
  }
  return 'consonant';
}

// 获取颜色
export function getPhonemeColor(type: PhonemeType): string {
  return PHONEME_COLORS[type];
}

export { SHORT_VOWELS, LONG_VOWELS, DIGRAPHS, BLENDS, VOWEL_COMBOS, R_CONTROLLED };
