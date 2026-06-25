import type { PhonemeType } from './types';

/**
 * ═══════════════════════════════════════════════════════════════
 *  特殊情形存档 (SPECIAL CASES) — 2026-06-25 Codex 复查整理
 * ═══════════════════════════════════════════════════════════════
 *
 *  本模块处理英语自然拼读的"边界情况"，每条规则都标注了权威出处和测试样本。
 *  详见 work/phonics-analysis/analysis.md。
 *
 * 1. 双写辅音 (cc, dd, pp, tt, ll, ss, nn, mm, rr, bb, ff, gg)
 *    - 拼写上两个相同辅音，CMU 通常只标一个音素
 *    - VCV 切分：跨 2 字母的 C 切在中间 (e.g. accompany → ac|com|pa|ny)
 *    - VCCV 切分：c1 保留为 coda 整体，c2 归后 onset (e.g. classroom → class|room)
 *    - VCCV 切分: c1 是双写时不切中间 (避免 add|ress 这种错误)
 *    - 词典: Orton-Gillingham / CMU
 *
 * 2. Silent K (knife, knee, knob, know, knock, knack)
 *    Silent W (write, wrong, who, whole, wrap, wrestle, wring)
 *    Silent G (gnome, gnaw, gnat, sign, design)
 *    Silent B (climb, comb, dumb, thumb, lamb, bomb)
 *    Silent L (talk, half, calm, could, should, would, folk, yolk)
 *    Silent T (listen, castle, whistle, fasten, hasten, often, soften)
 *    Silent H (honest, hour, honor, exhibit)
 *    Silent E (词尾) (bake, make, name, code, hope, five, blue)
 *    - CMU 词典不包含静音字母，自然不消耗字母
 *    - aligner 不会把它们匹配为单独的音素
 *
 * 3. Y 的双重身份
 *    - consonantal Y (独立 /j/ 音): yes, year, young, yellow, beyond
 *    - glide Y (二合元音 /ij/, /aj/, /ej/, /oj/ 的一部分): new, boy, day, my
 *    - 算法识别: Y token 后面紧跟 DIPHTHONG_VOWELS (UW/IY/AY/EY/OY/AW) → glide
 *    - glide 时 Y 不消耗字母, 让下一个 vowel token 拿走该字母
 *
 * 4. -tion / -sion 词尾
 *    - station, action, nation, education, vision, decision
 *    - CMU 用 SH AH0 N (或 ZH AH0 N) 表达 -tion/-sion
 *    - SH/ZH 标在 digraph 集合, 整体归后 onset
 *
 * 5. -le 词尾
 *    - bottle, table, candle, puzzle, simple, purple
 *    - CMU 用 AH0 L 表达, 末音节结构: C + AH0 + L (L 是 onset)
 *    - 例外: -le 在词首 (如 "lemon") 时 L 是普通辅音
 *
 * 6. R-controlled 元音 (ar, or, er, ir, ur, ear, our, air)
 *    - car, her, bird, word, turn, fear, journey, chair
 *    - CMU 标 AA1 R, ER0/ER1, EH1 R, ER0/ER1, IH1 R, IY1 R, AW1 R, EH1 R
 *    - 视为 free vowel (r-colored), 不需要 coda
 *
 * 7. Qu
 *    - queen, quick, quiet, quest, quote
 *    - CMU 用 K W 表达 (K 是 /k/, W 是 /w/)
 *    - aligner 中 W 的 grapheme 选项包含 'wh' (when) 和 'w' (其他)
 *
 * 8. 软 G (g before e/i/y)
 *    - gem, ginger, gym, page, giraffe
 *    - CMU 用 JH 表达 (/dʒ/), aligner 通过 CMU 直接处理
 *
 * 9. 软 C (c before e/i/y)
 *    - city, center, cycle, face, pace
 *    - CMU 用 S 表达 (/s/), aligner 通过 CMU 直接处理
 *
 * 10. Silent GH (high, light, right, thought, though, through)
 *     - CMU 不包含 GH, aligner 不匹配
 *
 * 11. Silent PH (phone, philosophy)
 *     - PH 在 CMU 标 F, aligner 中 F 的 options 包含 'ph'
 *
 * 12. KN/WR 静默首字母
 *     - knife, write, wreath, wrist, knuckle
 *     - CMU 不包含 K/W, aligner 自动从第一个字母开始
 *
 * 13. -ed 词尾的三种发音
 *     - 清辅音后 (kissed, walked) → /t/ (CMU: T)
 *     - 浊辅音/元音后 (loved, played) → /d/ (CMU: D)
 *     - t/d 后 (wanted, needed) → AH0 D (CMU: AH0 D)
 *     - CMU 已直接标注, aligner 无需处理
 *
 * 14. Silent K/G/W 的"重拼" (knight, gnaw, wrist)
 *     - aligner 跳过这些静默字母
 *     - 例: knife N AY1 F → aligner 跳过 k, 从 n 开始
 *
 * 15. 拼写 -eigh / -aigh / -igh
 *     - eight, weigh, sleigh, neighbor
 *     - CMU 用 EY1, EY1, EY1, EY1 R 等
 *
 * 16. -ough 的多种发音
 *     - through (UW1), thought (AO1 T), though (OW1), tough (AH1 F)
 *     - rough (AH1 F), bough (AW1)
 *     - CMU 各自标注, aligner 直接处理
 *
 * 17. diphthong 中的 glide Y 在词首
 *     - use (Y UW1 Z), united (Y UW2 N AY2 T IH0 D), uniform
 *     - 第一个 token Y 是 glide, 不消耗字母, UW1 拿第一个字母
 *     - aligner 走 Y-as-glide 分支, 跳过首字母消耗
 *
 * 18. 复合词
 *     - classroom, football, bedroom, weekend
 *     - CMU 完整标注, aligner 自然处理 (不会"合并"两个音节)
 *     - 例外: 一些在 CMU 中是单 token 的合写 (anything → EH2 N IY0 TH IH0 NG, 实际是 any+thing 复合)
 *
 * 19. 缩略词 (I'm, don't, it's, we're)
 *     - CMU 标注完整, aligner 正常处理
 *     - 但要注意 IY1 M (I'm) 的 IY 在词首, 是 consonantal Y (因为 M 不是 diphthong vowel)
 *
 * 20. 外来词 (pizza, tortilla, jalapeno)
 *     - CMU 不一定收录, fallback 到 splitByRules
 *
 * ═══════════════════════════════════════════════════════════════
 */

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
