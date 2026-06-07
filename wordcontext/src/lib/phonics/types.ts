export type PhonemeType = 'consonant' | 'vowel' | 'blend' | 'digraph' | 'r-controlled' | 'silent';

export type Phoneme = {
  grapheme: string;      // 字母/字母组合 "ban"
  ipa: string;           // 音标 "/bæn/"
  arpabet: string;       // CMU arpabet "B AE N"
  type: PhonemeType;
  color: string;         // 显示颜色
};

export type PhonicsBreakdown = {
  word: string;
  syllables: string[];
  phonemes: Phoneme[];
  stressIndex: number;     // 重读音节索引
  silentLetters: number[]; // 静音字母位置
};

export type SyllableInfo = {
  text: string;
  phonemes: Phoneme[];
  isStressed: boolean;
};
