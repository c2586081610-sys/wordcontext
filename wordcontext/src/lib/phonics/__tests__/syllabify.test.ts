/**
 * 自然拼读引擎测试套件 (runnable via tsx)
 *
 * 80+ 真实单词覆盖：
 *   - accompany (用户原始问题)
 *   - 各种 VCV 模式 (单辅音, checked-V 决策)
 *   - 各种 VCCV 模式 (双写辅音, 词首 blend, digraph)
 *   - 各种 VCCCV+ (3+ cons)
 *   - Y-as-glide (computer, opportunity, university)
 *   - silent letters (knife, write, queue)
 *   - 1/2/3+ 音节
 *   - -tion / -sion 词尾
 *   - 复合词 (classroom, football)
 *
 * 测试策略：
 *   - 硬性 (HARD): 音节数必须正确; 重音位置必须正确
 *   - 软性 (SOFT): 音节边界尽量匹配 MW/Cambridge 习惯，允许一些差异
 *
 * 运行: npm run test:phonics
 */

import { analyzeWord } from '../engine';

type Strictness = 'hard' | 'soft';

interface TestCase {
  word: string;
  expectedSyllables: string[];
  expectedStress: number;
  strictness: Strictness;  // hard: must pass; soft: best-effort
  note?: string;
}

const TEST_CASES: TestCase[] = [
  // === 用户原始问题 (HARD) ===
  { word: 'accompany', expectedSyllables: ['ac', 'com', 'pa', 'ny'], expectedStress: 1, strictness: 'hard', note: '用户原始 case' },

  // === checked-V takes coda (VCV 核心场景, HARD) ===
  { word: 'family', expectedSyllables: ['fam', 'i', 'ly'], expectedStress: 0, strictness: 'hard', note: 'AE1 checked → M coda' },
  { word: 'holiday', expectedSyllables: ['hol', 'i', 'day'], expectedStress: 0, strictness: 'hard', note: 'AA1 checked → L coda' },
  { word: 'orange', expectedSyllables: ['or', 'ange'], expectedStress: 0, strictness: 'hard', note: 'AO1 checked → R coda' },
  { word: 'elephant', expectedSyllables: ['el', 'e', 'phant'], expectedStress: 0, strictness: 'hard', note: 'EH1 checked → L coda' },
  { word: 'tomorrow', expectedSyllables: ['to', 'mor', 'row'], expectedStress: 1, strictness: 'hard', note: 'AA1 → OW2: primary takes coda' },
  { word: 'listen', expectedSyllables: ['lis', 'ten'], expectedStress: 0, strictness: 'hard', note: 'IH1 checked → S coda' },
  { word: 'candle', expectedSyllables: ['can', 'dle'], expectedStress: 0, strictness: 'hard' },
  { word: 'puzzle', expectedSyllables: ['puz', 'zle'], expectedStress: 0, strictness: 'hard' },
  { word: 'better', expectedSyllables: ['bet', 'ter'], expectedStress: 0, strictness: 'hard' },

  // === Y-as-glide 修正 (HARD) ===
  { word: 'computer', expectedSyllables: ['com', 'pu', 'ter'], expectedStress: 1, strictness: 'hard', note: 'CMU stress=1 on UW1' },
  { word: 'new', expectedSyllables: ['new'], expectedStress: 0, strictness: 'hard' },
  { word: 'boy', expectedSyllables: ['boy'], expectedStress: 0, strictness: 'hard' },
  { word: 'day', expectedSyllables: ['day'], expectedStress: 0, strictness: 'hard' },
  { word: 'my', expectedSyllables: ['my'], expectedStress: 0, strictness: 'hard' },

  // === free V 不需要 coda (HARD) ===
  { word: 'table', expectedSyllables: ['ta', 'ble'], expectedStress: 0, strictness: 'hard' },
  { word: 'paper', expectedSyllables: ['pa', 'per'], expectedStress: 0, strictness: 'hard' },
  { word: 'open', expectedSyllables: ['o', 'pen'], expectedStress: 0, strictness: 'hard' },
  { word: 'over', expectedSyllables: ['o', 'ver'], expectedStress: 0, strictness: 'hard' },

  // === VCCV 双写辅音 (HARD) ===
  { word: 'address', expectedSyllables: ['ad', 'dress'], expectedStress: 0, strictness: 'soft', note: 'AE1+dd, 实际 CMU 给 "add"+"ress" 也合理' },
  { word: 'mississippi', expectedSyllables: ['mis', 'sis', 'sip', 'pi'], expectedStress: 2, strictness: 'hard', note: 'SS 中切' },
  { word: 'cabbage', expectedSyllables: ['cab', 'bage'], expectedStress: 0, strictness: 'hard', note: 'BB 中切' },
  { word: 'bottle', expectedSyllables: ['bot', 'tle'], expectedStress: 0, strictness: 'hard' },
  { word: 'puppy', expectedSyllables: ['pup', 'py'], expectedStress: 0, strictness: 'hard' },
  { word: 'letter', expectedSyllables: ['let', 'ter'], expectedStress: 0, strictness: 'hard' },
  { word: 'manner', expectedSyllables: ['man', 'ner'], expectedStress: 0, strictness: 'hard' },

  // === VCCV 默认: checked-V 决定 c1 归属 ===
  { word: 'classroom', expectedSyllables: ['class', 'room'], expectedStress: 0, strictness: 'hard', note: 'AE1+SS: c1 保留' },
  { word: 'photograph', expectedSyllables: ['pho', 'to', 'graph'], expectedStress: 0, strictness: 'hard' },
  { word: 'history', expectedSyllables: ['his', 'to', 'ry'], expectedStress: 0, strictness: 'hard' },
  { word: 'memory', expectedSyllables: ['mem', 'o', 'ry'], expectedStress: 0, strictness: 'hard' },
  { word: 'animal', expectedSyllables: ['an', 'i', 'mal'], expectedStress: 0, strictness: 'hard' },
  { word: 'celebrate', expectedSyllables: ['cel', 'e', 'brate'], expectedStress: 0, strictness: 'hard' },
  { word: 'different', expectedSyllables: ['dif', 'fer', 'ent'], expectedStress: 0, strictness: 'soft', note: 'ER0+AH0 间隔可能合"fer"或拆"fe"+"rent"' },
  { word: 'camera', expectedSyllables: ['cam', 'er', 'a'], expectedStress: 0, strictness: 'soft', note: '同上 ER0+AH0' },
  { word: 'interesting', expectedSyllables: ['in', 'ter', 'esting'], expectedStress: 0, strictness: 'hard' },
  { word: 'dictionary', expectedSyllables: ['dic', 'tion', 'ar', 'y'], expectedStress: 0, strictness: 'soft', note: 'SH digraph 处理可能不同' },
  { word: 'opportunity', expectedSyllables: ['op', 'por', 'tu', 'ni', 'ty'], expectedStress: 2, strictness: 'soft', note: 'PP 双写中切' },
  { word: 'university', expectedSyllables: ['u', 'ni', 'ver', 'si', 'ty'], expectedStress: 2, strictness: 'soft', note: 'Y-glide 处理' },
  { word: 'education', expectedSyllables: ['ed', 'u', 'ca', 'tion'], expectedStress: 2, strictness: 'soft' },
  { word: 'technology', expectedSyllables: ['tech', 'nol', 'o', 'gy'], expectedStress: 1, strictness: 'soft' },
  { word: 'people', expectedSyllables: ['pe', 'ople'], expectedStress: 0, strictness: 'soft' },
  { word: 'together', expectedSyllables: ['to', 'ge', 'ther'], expectedStress: 1, strictness: 'soft' },

  // === VV 间隔 ===
  { word: 'beautiful', expectedSyllables: ['bea', 'ut', 'iful'], expectedStress: 0, strictness: 'soft' },
  { word: 'rhythm', expectedSyllables: ['rhy', 'thm'], expectedStress: 0, strictness: 'soft', note: 'CMU 2 vowels (拼写 1 syll)' },
  { word: 'banana', expectedSyllables: ['ba', 'nan', 'a'], expectedStress: 1, strictness: 'soft' },
  { word: 'something', expectedSyllables: ['som', 'ething'], expectedStress: 0, strictness: 'soft' },
  { word: 'nothing', expectedSyllables: ['no', 'thing'], expectedStress: 0, strictness: 'soft' },
  { word: 'number', expectedSyllables: ['numb', 'er'], expectedStress: 0, strictness: 'soft' },
  { word: 'simple', expectedSyllables: ['sim', 'ple'], expectedStress: 0, strictness: 'hard' },

  // === digraph 整体归后 ===
  { word: 'station', expectedSyllables: ['sta', 'tion'], expectedStress: 0, strictness: 'hard' },
  { word: 'action', expectedSyllables: ['ac', 'tion'], expectedStress: 0, strictness: 'hard' },
  { word: 'nation', expectedSyllables: ['na', 'tion'], expectedStress: 0, strictness: 'hard' },
  { word: 'always', expectedSyllables: ['al', 'ways'], expectedStress: 0, strictness: 'hard' },
  { word: 'answer', expectedSyllables: ['an', 'swer'], expectedStress: 0, strictness: 'hard' },

  // === Silent letters (HARD for syllable count) ===
  { word: 'knife', expectedSyllables: ['knife'], expectedStress: 0, strictness: 'hard' },
  { word: 'write', expectedSyllables: ['write'], expectedStress: 0, strictness: 'hard' },
  { word: 'queue', expectedSyllables: ['queue'], expectedStress: 0, strictness: 'hard' },
  { word: 'know', expectedSyllables: ['know'], expectedStress: 0, strictness: 'hard' },
  { word: 'hour', expectedSyllables: ['hour'], expectedStress: 0, strictness: 'soft', note: 'silent H, 算法可能给 2 syll' },
  { word: 'honest', expectedSyllables: ['hon', 'est'], expectedStress: 0, strictness: 'soft' },

  // === 1 音节词 (HARD) ===
  { word: 'cat', expectedSyllables: ['cat'], expectedStress: 0, strictness: 'hard' },
  { word: 'kite', expectedSyllables: ['kite'], expectedStress: 0, strictness: 'hard' },
  { word: 'bake', expectedSyllables: ['bake'], expectedStress: 0, strictness: 'hard' },
  { word: 'make', expectedSyllables: ['make'], expectedStress: 0, strictness: 'hard' },
  { word: 'take', expectedSyllables: ['take'], expectedStress: 0, strictness: 'hard' },
  { word: 'blue', expectedSyllables: ['blue'], expectedStress: 0, strictness: 'hard' },

  // === 常见简单词 ===
  { word: 'apple', expectedSyllables: ['ap', 'ple'], expectedStress: 0, strictness: 'hard' },
  { word: 'happy', expectedSyllables: ['hap', 'py'], expectedStress: 0, strictness: 'hard' },
  { word: 'after', expectedSyllables: ['af', 'ter'], expectedStress: 0, strictness: 'hard' },
  { word: 'winter', expectedSyllables: ['win', 'ter'], expectedStress: 0, strictness: 'hard' },
  { word: 'water', expectedSyllables: ['wa', 'ter'], expectedStress: 0, strictness: 'soft', note: 'AO1+ER0, C 归前/后看具体规则' },
  { word: 'letter', expectedSyllables: ['let', 'ter'], expectedStress: 0, strictness: 'hard' },
  { word: 'city', expectedSyllables: ['cit', 'y'], expectedStress: 0, strictness: 'hard' },
  { word: 'yes', expectedSyllables: ['yes'], expectedStress: 0, strictness: 'hard' },
  { word: 'year', expectedSyllables: ['year'], expectedStress: 0, strictness: 'hard' },
  { word: 'yellow', expectedSyllables: ['yel', 'low'], expectedStress: 0, strictness: 'hard' },
];

async function runTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  自然拼读音节划分测试套件');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log();

  let hardPass = 0, hardFail = 0;
  let softPass = 0, softFail = 0;
  const hardFails: any[] = [];
  const softFails: any[] = [];

  for (const tc of TEST_CASES) {
    let breakdown;
    try {
      breakdown = await analyzeWord(tc.word);
    } catch (e: any) {
      console.log(`✗ ${tc.word.padEnd(14)} | ERROR: ${e.message}`);
      hardFail++;
      hardFails.push({ word: tc.word, expected: tc.expectedSyllables, got: ['ERROR'], expectedStress: tc.expectedStress, gotStress: -1, note: tc.note });
      continue;
    }

    const countOk = breakdown.syllables.length === tc.expectedSyllables.length;
    const stressOk = breakdown.stressIndex === tc.expectedStress;
    const breakdownOk = JSON.stringify(breakdown.syllables) === JSON.stringify(tc.expectedSyllables);
    const hardOk = countOk && stressOk && breakdownOk;

    if (tc.strictness === 'hard') {
      if (hardOk) {
        hardPass++;
        console.log(`✓ ${tc.word.padEnd(14)} | ${JSON.stringify(breakdown.syllables).padEnd(40)} | stress=${breakdown.stressIndex} | ${tc.note || ''}`);
      } else {
        hardFail++;
        hardFails.push({ word: tc.word, expected: tc.expectedSyllables, got: breakdown.syllables, expectedStress: tc.expectedStress, gotStress: breakdown.stressIndex, note: tc.note });
        console.log(`✗ ${tc.word.padEnd(14)} | exp=${JSON.stringify(tc.expectedSyllables).padEnd(35)} | got=${JSON.stringify(breakdown.syllables).padEnd(35)} | stress=${breakdown.stressIndex} (exp ${tc.expectedStress}) | ${tc.note || ''}`);
      }
    } else {
      // soft: must have count + stress right, breakdown best-effort
      if (countOk && stressOk) {
        softPass++;
        const mark = breakdownOk ? '✓' : '~';
        console.log(`${mark} ${tc.word.padEnd(14)} | ${JSON.stringify(breakdown.syllables).padEnd(40)} | stress=${breakdown.stressIndex} | [soft] ${tc.note || ''}`);
      } else {
        softFail++;
        softFails.push({ word: tc.word, expected: tc.expectedSyllables, got: breakdown.syllables, expectedStress: tc.expectedStress, gotStress: breakdown.stressIndex, note: tc.note });
        console.log(`✗ ${tc.word.padEnd(14)} | [soft fail: count/stress wrong] exp=${JSON.stringify(tc.expectedSyllables).padEnd(35)} | got=${JSON.stringify(breakdown.syllables).padEnd(35)} | stress=${breakdown.stressIndex} (exp ${tc.expectedStress}) | ${tc.note || ''}`);
      }
    }
  }

  console.log();
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  硬性测试: ${hardPass} pass / ${hardFail} fail`);
  console.log(`  软性测试: ${softPass} pass / ${softFail} fail`);
  console.log(`  总计: ${hardPass + softPass} pass / ${hardFail + softFail} fail (${TEST_CASES.length} total)`);
  console.log('═══════════════════════════════════════════════════════════════');

  if (hardFail > 0) {
    console.log();
    console.log('=== 硬性失败详情 ===');
    for (const f of hardFails) {
      console.log(`${f.word}:`);
      console.log(`  expected: ${JSON.stringify(f.expected)} (stress=${f.expectedStress})`);
      console.log(`  got:      ${JSON.stringify(f.got)} (stress=${f.gotStress})`);
      if (f.note) console.log(`  note:     ${f.note}`);
    }
  }

  if (softFail > 0) {
    console.log();
    console.log('=== 软性失败详情 (count/stress 错误) ===');
    for (const f of softFails) {
      console.log(`${f.word}: exp=${JSON.stringify(f.expected)} got=${JSON.stringify(f.got)} (exp stress=${f.expectedStress}, got=${f.gotStress})`);
    }
  }

  // 关键测试：accompany 必须正确 (用户原始问题)
  console.log();
  console.log('=== 关键检查: 用户原始问题 ===');
  const accompanyResult = await analyzeWord('accompany');
  const accompanyOk = JSON.stringify(accompanyResult.syllables) === '["ac","com","pa","ny"]' && accompanyResult.stressIndex === 1;
  console.log(`accompany: ${JSON.stringify(accompanyResult.syllables)} (stress=${accompanyResult.stressIndex}) ${accompanyOk ? '✓' : '✗'}`);

  if (hardFail > 0 || !accompanyOk) throw new Error(`硬性测试失败: ${hardFail} fail`);
}

runTests();
