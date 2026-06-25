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

// 辅音 digraphs（两个字母发一个音 / CMU 里 1 个音素）
const DIGRAPHS = new Set(['sh', 'ch', 'th', 'wh', 'ph', 'gh', 'ck', 'ng', 'nk']);

// 辅音 blends（两个辅音各自发音，快速连读；CMU 仍是 1 个音素）
const BLENDS = new Set([
  'bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr',
  'pl', 'pr', 'sc', 'sk', 'sl', 'sm', 'sn', 'sp', 'st',
  'str', 'sw', 'tr', 'tw', 'scr', 'shr', 'spl', 'spr',
  'mp', 'nt', 'nd', 'nk', 'mb', 'lk', 'lf', 'pt', 'kt', 'gd',
]);

// 辅音字母 → 可能的拼写（按长度倒序匹配，长的优先以处理双写）
// 来源: CMU 词典实际分布 + Orton-Gillingham 自然拼读规则
// 双写辅音: cc, pp, tt, ll, ss, nn, mm, rr, bb, dd, ff, gg
// 静默辅音: kn, wr, gn, mb (b 静默)
const CONSONANT_GRAPHEMES: Record<string, string[]> = {
  'B':  ['bb', 'b'],                      // 双写 bb
  'CH': ['ch', 'tch'],                    // tch = ch
  'D':  ['dd', 'd'],                      // 双写 dd
  'DH': ['th'],                           // voiced th (this, that)
  'F':  ['ff', 'ph', 'f'],                // ph 读 /f/ (phone)
  'G':  ['gg', 'gh', 'gu', 'g'],          // gh=/g/ (ghost), gu=/g/ (guest)
  'HH': ['wh', 'h'],                      // wh=/h/ (who)
  'JH': ['j', 'g', 'dg', 'dge'],          // dg/dge = /dʒ/ (edge, badge)
  'K':  ['cc', 'ck', 'qu', 'ch', 'c', 'k'],// cc (accompany), ck (back), qu (queen), ch (chord)
  'L':  ['ll', 'l'],                      // 双写 ll
  'M':  ['mm', 'mb', 'm'],                // mb (climb 中 b 静默)
  'N':  ['nn', 'kn', 'gn', 'n'],          // kn (knife), gn (gnome) 中 g/k 静默
  'NG': ['ng', 'n'],                      // 极少: n + g 组合
  'P':  ['pp', 'p'],                      // 双写 pp
  'R':  ['rr', 'wr', 'r'],                // wr (write) 中 w 静默
  'S':  ['ss', 'sc', 'c', 's'],           // sc=/s/ (scene), c=/s/ (city)
  'SH': ['sh', 'ch', 'ti', 'ci', 'si'],   // ti/ci/si 在 -tion/-cious 中读 /ʃ/
  'T':  ['tt', 't'],                      // 双写 tt
  'TH': ['th'],                           // voiceless th (think, three)
  'V':  ['v'],
  'W':  ['wh', 'w'],                      // wh=/w/ (when, what)
  'Y':  ['y'],                            // consonantal y (yes)
  'Z':  ['zz', 's', 'z'],                 // s 在词尾或浊化时读 /z/ (dogs)
  'ZH': ['si', 'ge', 's', 'z'],           // 极少: vision, beige
}

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

export { SHORT_VOWELS, LONG_VOWELS, DIGRAPHS, BLENDS, VOWEL_COMBOS, R_CONTROLLED, CONSONANT_GRAPHEMES };
