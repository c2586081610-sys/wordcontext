/**
 * Kokoro TTS 前端客户端
 * 集成本地 Kokoro-82M TTS 服务，支持 fallback 到 Web Speech API
 */

// Kokoro 语音类型（内联，避免 ESBuild 导出问题）
type KokoroVoice =
  | 'af_heart' | 'af_sky' | 'af_bella'
  | 'am_adam' | 'am_michael'
  | 'bf_emma' | 'bf_lisa'
  | 'bm_george' | 'bm_finlay'

const TTS_BASE_URL = 'http://localhost:8765'

// 内存缓存：已生成的音频不重复请求
const audioCache = new Map<string, HTMLAudioElement>()

// 当前正在播放的音频实例
let currentAudio: HTMLAudioElement | null = null

// 检测服务是否可用（每次都检测）
export async function checkServiceHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${TTS_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    })
    return res.ok
  } catch {
    return false
  }
}

// 生成单词发音
export async function speakWord(
  word: string,
  voice: KokoroVoice = 'af_heart',
  speed: number = 0.9
): Promise<void> {
  // 停止上一个音频
  stopSpeaking()

  const cacheKey = `${word}:${voice}:${speed}`

  // 命中缓存直接播放
  if (audioCache.has(cacheKey)) {
    const cachedAudio = audioCache.get(cacheKey)!
    currentAudio = cachedAudio
    cachedAudio.currentTime = 0
    cachedAudio.play()
    return
  }

  // 优先 Kokoro 服务
  const isKokoroAvailable = await checkServiceHealth()

  if (isKokoroAvailable) {
    try {
      const res = await fetch(`${TTS_BASE_URL}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: word,
          voice,
          speed,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const b64 = data.b64_audio as string
        const binaryString = atob(b64)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: 'audio/mpeg' })
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        currentAudio = audio
        audio.play()

        // 缓存
        audioCache.set(cacheKey, audio)
        return
      }
    } catch (e) {
      console.warn('[Kokoro] 请求失败，fallback 到本地 TTS:', e)
    }
  }

  // Fallback: Web Speech API
  fallbackSpeak(word)
}

// 生成音节发音（用于自然拼读逐音节播放）
export async function speakSyllable(
  syllable: string,
  voice: KokoroVoice = 'af_heart',
  speed: number = 0.85
): Promise<void> {
  stopSpeaking()

  const cacheKey = `syl:${syllable}:${voice}:${speed}`
  if (audioCache.has(cacheKey)) {
    const cached = audioCache.get(cacheKey)!
    currentAudio = cached
    cached.currentTime = 0
    cached.play()
    return
  }

  const isAvailable = await checkServiceHealth()
  if (isAvailable) {
    try {
      const res = await fetch(`${TTS_BASE_URL}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: syllable,
          voice,
          speed,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const b64 = data.b64_audio as string
        const binaryString = atob(b64)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: 'audio/mpeg' })
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        currentAudio = audio
        audio.play()
        audioCache.set(cacheKey, audio)
        return
      }
    } catch (e) {
      console.warn('[Kokoro] 音节请求失败:', e)
    }
  }

  fallbackSpeak(syllable)
}

// 生成音素发音（用于自然拼读逐音素播放）
export async function speakPhoneme(
  phoneme: string,
  voice: KokoroVoice = 'af_heart'
): Promise<void> {
  // 音素用更慢的速度
  await speakSyllable(phoneme, voice, 0.7)
}

// 生成句子/例句发音
export async function speakSentence(
  sentence: string,
  voice: KokoroVoice = 'af_heart',
  speed: number = 0.85
): Promise<void> {
  stopSpeaking()

  const cacheKey = `sent:${sentence}:${voice}:${speed}`
  if (audioCache.has(cacheKey)) {
    const cached = audioCache.get(cacheKey)!
    currentAudio = cached
    cached.currentTime = 0
    cached.play()
    return
  }

  const isAvailable = await checkServiceHealth()
  if (isAvailable) {
    try {
      const res = await fetch(`${TTS_BASE_URL}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: sentence, voice, speed }),
      })
      if (res.ok) {
        const data = await res.json()
        const b64 = data.b64_audio as string
        const binaryString = atob(b64)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: 'audio/mpeg' })
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        currentAudio = audio
        audio.play()
        audioCache.set(cacheKey, audio)
        return
      }
    } catch (e) {
      console.warn('[Kokoro] 句子请求失败:', e)
    }
  }

  fallbackSpeak(sentence)
}

// 停止播放
export function stopSpeaking(): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
}

// Fallback: Web Speech API（本地 TTS）
function fallbackSpeak(text: string, lang: string = 'en-US'): void {
  if (!window.speechSynthesis) {
    console.warn('[Kokoro] Web Speech API 不可用')
    return
  }
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.8
  window.speechSynthesis.speak(utterance)
}

// 预加载音频（进入单词详情页时批量预加载）
export async function preloadWords(
  words: string[],
  voice: KokoroVoice = 'af_heart',
  speed: number = 0.9
): Promise<void> {
  const isAvailable = await checkServiceHealth()
  if (!isAvailable) return

  // 并发限制 3 个
  const batchSize = 3
  for (let i = 0; i < words.length; i += batchSize) {
    const batch = words.slice(i, i + batchSize)
    await Promise.all(
      batch.map(async (word) => {
        const cacheKey = `${word}:${voice}:${speed}`
        if (audioCache.has(cacheKey)) return
        try {
          const res = await fetch(`${TTS_BASE_URL}/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: word, voice, speed }),
          })
          if (res.ok) {
            const data = await res.json()
            const b64 = data.b64_audio as string
            const binaryString = atob(b64)
            const bytes = new Uint8Array(binaryString.length)
            for (let j = 0; j < binaryString.length; j++) {
              bytes[j] = binaryString.charCodeAt(j)
            }
            const blob = new Blob([bytes], { type: 'audio/mpeg' })
            const url = URL.createObjectURL(blob)
            const audio = new Audio(url)
            audio.preload = 'auto'
            audioCache.set(cacheKey, audio)
          }
        } catch {
          // 静默失败，预加载不阻塞主流程
        }
      })
    )
  }
}

// 清理缓存
export function clearCache(): void {
  audioCache.forEach((audio) => {
    audio.pause()
    URL.revokeObjectURL(audio.src)
  })
  audioCache.clear()
}

// 获取服务状态
export function getServiceStatus(): {
  cacheSize: number
} {
  return {
    cacheSize: audioCache.size,
  }
}