/**
 * Kokoro 语音配置
 */

// Kokoro 支持的英文语音类型
type KokoroVoice =
  | 'af_heart'  // 美式女声 Heart
  | 'af_sky'     // 美式女声 Sky
  | 'af_bella'   // 美式女声 Bella
  | 'am_adam'    // 美式男声 Adam
  | 'am_michael' // 美式男声 Michael
  | 'bf_emma'    // 英式女声 Emma
  | 'bf_lisa'    // 英式女声 Lisa
  | 'bm_george'  // 英式男声 George
  | 'bm_finlay'  // 英式男声 Finlay

export type { KokoroVoice }

export interface VoiceOption {
  id: KokoroVoice
  label: string
  description: string
  accent: 'american' | 'british'
  gender: 'female' | 'male'
  recommended?: boolean
}

export const VOICE_OPTIONS: VoiceOption[] = [
  {
    id: 'af_heart',
    label: 'Heart',
    description: '清晰自然，温暖友好',
    accent: 'american',
    gender: 'female',
    recommended: true,
  },
  {
    id: 'af_sky',
    label: 'Sky',
    description: '柔和流畅，语速适中',
    accent: 'american',
    gender: 'female',
  },
  {
    id: 'af_bella',
    label: 'Bella',
    description: '专业播音风格，咬字清晰',
    accent: 'american',
    gender: 'female',
  },
  {
    id: 'am_adam',
    label: 'Adam',
    description: '稳重清晰，语速偏慢',
    accent: 'american',
    gender: 'male',
  },
  {
    id: 'am_michael',
    label: 'Michael',
    description: '温暖低沉，语速适中',
    accent: 'american',
    gender: 'male',
  },
  {
    id: 'bf_emma',
    label: 'Emma',
    description: '英式优雅，发音标准',
    accent: 'british',
    gender: 'female',
  },
  {
    id: 'bf_lisa',
    label: 'Lisa',
    description: '英式清澈，语速偏快',
    accent: 'british',
    gender: 'female',
  },
  {
    id: 'bm_george',
    label: 'George',
    description: '英式绅士，咬字清晰',
    accent: 'british',
    gender: 'male',
  },
  {
    id: 'bm_finlay',
    label: 'Finlay',
    description: '英式温和，语速偏慢',
    accent: 'british',
    gender: 'male',
  },
]

// 默认语音
export const DEFAULT_VOICE: KokoroVoice = 'af_heart'

// 从 localStorage 获取保存的语音设置
export function getSavedVoice(): KokoroVoice {
  const saved = localStorage.getItem('kokoro_voice')
  if (saved && VOICE_OPTIONS.find((v) => v.id === saved)) {
    return saved as KokoroVoice
  }
  return DEFAULT_VOICE
}

// 保存语音设置
export function saveVoice(voice: KokoroVoice): void {
  localStorage.setItem('kokoro_voice', voice)
}

// 获取默认语速
export function getSavedSpeed(): number {
  const saved = localStorage.getItem('kokoro_speed')
  if (saved) {
    const speed = parseFloat(saved)
    if (!isNaN(speed) && speed >= 0.5 && speed <= 2.0) {
      return speed
    }
  }
  return 0.9
}

// 保存语速设置
export function saveSpeed(speed: number): void {
  localStorage.setItem('kokoro_speed', String(speed))
}