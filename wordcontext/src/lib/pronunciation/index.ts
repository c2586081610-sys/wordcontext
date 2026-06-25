/**
 * 真人发音服务
 *
 * 优先级（自动回退）：
 *   1. 不背单词 audio.beingfine.cn  ← 目标，配置后启用（需要登录态 + zpk 解包）
 *   2. 有道 dictvoice  ← 立刻可用，无需配置，真人录音
 *   3. Kokoro TTS      ← 已有，质量不错
 *   4. Web Speech API  ← 兜底（macOS 上就是 Alex 那种，难听）
 *
 * 切换 provider：调用 setProvider('youdao' | 'beingfine' | 'kokoro')
 *
 * 接入不背单词的步骤见 work/LangEasyLexis-reverse/notes/beingfine-pronunciation.md
 */

import { speakWord as kokoroSpeak, stopSpeaking as kokoroStop } from '../kokoro'

// =================== Provider 配置 ===================

export type Accent = 'us' | 'uk'
export type Provider = 'beingfine' | 'youdao' | 'kokoro'

// 用户在 Settings 里切，存 localStorage
const PROVIDER_KEY = 'wordcontext.pronunciation.provider'
let currentProvider: Provider =
  (typeof localStorage !== 'undefined' && (localStorage.getItem(PROVIDER_KEY) as Provider)) || 'youdao'

export function setProvider(p: Provider): void {
  currentProvider = p
  if (typeof localStorage !== 'undefined') localStorage.setItem(PROVIDER_KEY, p)
}

export function getProvider(): Provider {
  return currentProvider
}

// =================== URL 构造 ===================

// 1. 不背单词 (audio.beingfine.cn) — 需要 loginCookie + zpkMap
//    zpkMap 由用户在 app 里抓包后填入（"hello" -> "https://audio.beingfine.cn/abc.zpk"）
const ZPK_MAP_KEY = 'wordcontext.pronunciation.zpkMap'
function getZpkMap(): Record<string, string> {
  if (typeof localStorage === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(ZPK_MAP_KEY) || '{}') } catch { return {} }
}
export function setZpkMap(map: Record<string, string>): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(ZPK_MAP_KEY, JSON.stringify(map))
}

function buildYoudaoUrl(word: string, accent: Accent): string {
  const type = accent === 'us' ? 1 : 0
  return `https://dict.youdao.com/dictvoice?type=${type}&audio=${encodeURIComponent(word)}`
}

// 不背单词的 zpk URL（用户抓包后填进 zpkMap）
function buildBeingfineUrl(word: string, _accent: Accent): string | null {
  const map = getZpkMap()
  return map[word.toLowerCase()] || null
}

// =================== 音频缓存 ===================

const audioCache = new Map<string, HTMLAudioElement>()
let currentAudio: HTMLAudioElement | null = null

export function stopSpeaking(): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
    return
  }
  kokoroStop()
}

// =================== 核心：播放单词 ===================

/**
 * 播放单词发音
 * @param word 单词（小写）
 * @param accent 'us' (美音) 或 'uk' (英音)
 */
export async function speakWord(word: string, accent: Accent = 'us'): Promise<void> {
  stopSpeaking()
  const w = word.trim()
  if (!w) return
  const cacheKey = `word:${currentProvider}:${accent}:${w.toLowerCase()}`

  // 命中缓存
  if (audioCache.has(cacheKey)) {
    const cached = audioCache.get(cacheKey)!
    currentAudio = cached
    cached.currentTime = 0
    try { await cached.play() } catch { /* ignore */ }
    return
  }

  // 1) 不背单词
  if (currentProvider === 'beingfine') {
    const zpkUrl = buildBeingfineUrl(w, accent)
    if (zpkUrl) {
      return playViaBeingfineZpk(zpkUrl, w, accent, cacheKey)
    }
    console.warn('[Pronunciation] beingfine 未配置 zpkMap，回退到有道')
  }

  // 2) 有道 dictvoice
  if (currentProvider === 'beingfine' || currentProvider === 'youdao') {
    return playViaAudioElement(buildYoudaoUrl(w, accent), cacheKey)
  }

  // 3) Kokoro fallback
  await kokoroSpeak(w)
}

// 不背单词的 zpk 播放（占位实现）
// 完整 zpk 解包需要：用户先在 app 里抓一次包，把 zpk URL + 音频文件结构告诉我们
// 然后这里实现 getAudioDataFromZpkWithWord:andZpkUrl: 的等价物
async function playViaBeingfineZpk(
  _zpkUrl: string,
  word: string,
  accent: Accent,
  _cacheKey: string
): Promise<void> {
  // TODO: 接入 zpk 解包逻辑
  // 当前先回退到有道
  console.warn(`[Pronunciation] zpk 解包尚未实现 (${word}/${accent})，回退有道`)
  return playViaAudioElement(buildYoudaoUrl(word, accent), `word:youdao:${accent}:${word.toLowerCase()}`)
}

// 通过 <audio> 元素直接 src 播放（绕过 CORS 限制）
function playViaAudioElement(url: string, cacheKey: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.src = url
    currentAudio = audio
    audioCache.set(cacheKey, audio)

    const cleanup = () => {
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('error', onError)
    }
    const onEnd = () => { cleanup(); resolve() }
    const onError = async () => {
      cleanup()
      console.warn(`[Pronunciation] 加载失败 ${url}，回退 Kokoro`)
      // 失败时回退到 Kokoro
      const word = new URL(url).searchParams.get('audio') || ''
      await kokoroSpeak(word)
      resolve()
    }

    audio.addEventListener('ended', onEnd, { once: true })
    audio.addEventListener('error', onError, { once: true })

    audio.play().catch(async (e) => {
      console.warn('[Pronunciation] play() 被拒', e)
      cleanup()
      // Autoplay 被拒时回退 Kokoro
      const word = new URL(url).searchParams.get('audio') || ''
      await kokoroSpeak(word)
      resolve()
    })
  })
}

// =================== 预加载 ===================

/**
 * 批量预加载单词发音（进单词详情页时调）
 */
export async function preloadWords(words: string[], accent: Accent = 'us'): Promise<void> {
  // 限并发 4
  const batchSize = 4
  for (let i = 0; i < words.length; i += batchSize) {
    const batch = words.slice(i, i + batchSize)
    await Promise.allSettled(
      batch.map(async (w) => {
        const cacheKey = `word:${currentProvider}:${accent}:${w.toLowerCase()}`
        if (audioCache.has(cacheKey)) return
        const audio = new Audio()
        audio.preload = 'auto'
        if (currentProvider === 'youdao' || currentProvider === 'beingfine') {
          audio.src = buildYoudaoUrl(w, accent)
        } else {
          // Kokoro 走 fetch 路径，让 kokoroSpeak 内部缓存
          return
        }
        audioCache.set(cacheKey, audio)
      })
    )
  }
}

// =================== 清理 ===================

export function clearCache(): void {
  audioCache.forEach((audio) => {
    audio.pause()
    audio.src = ''
  })
  audioCache.clear()
}

// =================== 状态 ===================

export function getServiceStatus() {
  return {
    provider: currentProvider,
    cacheSize: audioCache.size,
  }
}
