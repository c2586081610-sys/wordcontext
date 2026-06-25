"""
Kokoro TTS 服务
支持 OpenAI 兼容 API + 自定义音素输入 + 权威音节数查询
"""
import os
import io
import base64
import uuid
import warnings
from typing import Optional, List, Union
from contextlib import asynccontextmanager

import torch
import soundfile as sf
import numpy as np
import sqlite3
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from kokoro import KPipeline
import pronouncing

warnings.filterwarnings("ignore", category=FutureWarning)

# ========== 配置 ==========
PORT = 8765
SAMPLE_RATE = 24000
ECDICT_DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "stardict.db")

# 可用语音列表
AMERICAN_VOICES = {
    "af_heart": "American Female (Heart) - 清晰自然，适合学习",
    "af_sky": "American Female (Sky) - 柔和流畅",
    "af_bella": "American Female (Bella) - 专业播音风格",
    "am_adam": "American Male (Adam) - 稳重清晰",
    "am_michael": "American Male (Michael) - 温暖低沉",
}
BRITISH_VOICES = {
    "bf_emma": "British Female (Emma) - 英式优雅",
    "bf_lisa": "British Female (Lisa) - 英式清澈",
    "bm_george": "British Male (George) - 英式绅士",
    "bm_finlay": "British Male (Finlay) - 英式温和",
}
ALL_VOICES = {**AMERICAN_VOICES, **BRITISH_VOICES}

# 全局 pipeline 实例（延迟初始化）
_pipeline_am = None
_pipeline_bm = None
_pipeline_bf = None

# ECDICT 数据库连接
_ecdict_conn = None

def get_ecdict_conn() -> sqlite3.Connection:
    """获取 ECDICT 数据库连接（每次请求新建连接，避免线程安全问题）"""
    if not os.path.exists(ECDICT_DB_PATH):
        raise FileNotFoundError(f"ECDICT database not found: {ECDICT_DB_PATH}")
    conn = sqlite3.connect(ECDICT_DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def get_pipeline(lang_code: str = 'a') -> KPipeline:
    """获取 Kokoro pipeline，按语言代码缓存"""
    global _pipeline_am, _pipeline_bm, _pipeline_bf
    if lang_code == 'a':  # American
        if _pipeline_am is None:
            _pipeline_am = KPipeline(lang_code='a')
        return _pipeline_am
    elif lang_code == 'b':  # British
        if _pipeline_bf is None:
            _pipeline_bf = KPipeline(lang_code='b')
        return _pipeline_bf
    else:
        raise ValueError(f"Unsupported lang_code: {lang_code}")

def synthesize(text: str, voice: str, speed: float = 1.0) -> tuple:
    """生成语音，返回 (numpy_array, sample_rate)"""
    pipeline = get_pipeline()
    all_tensors = []
    for result in pipeline(text, voice=voice, speed=speed):
        all_tensors.append(result.audio)
    audio_np = torch.cat(all_tensors).cpu().numpy()
    return audio_np, SAMPLE_RATE

def synthesize_to_base64(text: str, voice: str, speed: float = 1.0) -> str:
    """生成语音并返回 base64 MP3"""
    audio_np, sr = synthesize(text, voice, speed)
    # 转为 float32 并归一化到 [-1, 1]
    audio_float = audio_np.astype(np.float32)
    max_val = np.abs(audio_float).max()
    if max_val > 0:
        audio_float = audio_float / max_val
    # 保存到内存 buffer
    buffer = io.BytesIO()
    sf.write(buffer, audio_float, sr, format='MP3')
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode('utf-8')

# ========== FastAPI 应用 ==========
@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"🚀 Kokoro TTS 服务启动中...")
    print(f"📦 模型位置: ~/.cache/kokoro")
    print(f"🎯 服务地址: http://localhost:{PORT}")
    print(f"🔊 可用语音: {len(ALL_VOICES)} 种")
    yield
    print("👋 Kokoro TTS 服务已关闭")

app = FastAPI(
    title="Kokoro TTS API",
    description="词境项目专用 - 本地离线高质量发音服务",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== 请求模型 ==========
class TTSRequest(BaseModel):
    input: str
    voice: Optional[str] = "af_heart"
    speed: Optional[float] = 0.9
    response_format: Optional[str] = "mp3"
    model: Optional[str] = "kokoro"

class BatchTTSRequest(BaseModel):
    texts: List[str]
    voice: Optional[str] = "af_heart"
    speed: Optional[float] = 0.9

# ========== API 路由 ==========

@app.get("/")
def root():
    return {
        "service": "Kokoro TTS API",
        "version": "1.0.0",
        "status": "running",
        "voices": ALL_VOICES,
        "usage": {
            "单次发音": "POST /tts",
            "批量发音": "POST /tts/batch",
            "语音列表": "GET /voices",
            "健康检查": "GET /health",
        }
    }

@app.get("/health")
def health():
    return {"status": "healthy", "model": "Kokoro-82M"}

@app.get("/syllable-count/{word}")
def syllable_count(word: str):
    """基于 CMU 词典返回权威音节数（通过 stresses 字符串长度计算）"""
    stresses = pronouncing.stresses_for_word(word.lower())
    if not stresses:
        raise HTTPException(status_code=404, detail=f"Word '{word}' not found in CMU dictionary")
    # stresses 字符串每个字符是一个音节的重音标记，长度 = 音节数
    return {
        "word": word,
        "syllable_count": len(stresses[0]),
        "stresses": stresses[0],
    }

@app.get("/ecdict/{word}")
def ecdict_lookup(word: str):
    """从 ECDICT 数据库查询单词的详细释义"""
    try:
        conn = get_ecdict_conn()
    except FileNotFoundError:
        raise HTTPException(status_code=503, detail="ECDICT database not available")

    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM stardict WHERE word = ? COLLATE NOCASE", (word,))
        row = cur.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail=f"Word '{word}' not found in ECDICT")

        # 解析 translation 字段：将 "vt. 放弃, 抛弃\nn. 放任" 拆分为 definitions 数组
        definitions = []
        translation = row["translation"] or ""
        definition_en = row["definition"] or ""

        # 解析中文释义
        if translation:
            import re
            parts = re.split(r'(?=\b(?:n|v|vt|vi|v\.|adj|adv|prep|conj|pron|interj|art|num|aux|mod)\.)', translation)
            for part in parts:
                part = part.strip()
                if not part:
                    continue
                match = re.match(r'^(\w+\.)\s*(.+)', part)
                if match:
                    definitions.append({
                        "pos": match.group(1),
                        "meaning": match.group(2).strip(),
                    })
                else:
                    if definitions:
                        definitions[-1]["meaning"] += "；" + part
                    else:
                        definitions.append({"pos": "", "meaning": part})

        # 解析英文释义
        definitions_en = []
        if definition_en:
            for line in definition_en.split('\n'):
                line = line.strip()
                if not line:
                    continue
                match = re.match(r'^([a-z]+\.)\s*(.+)', line)
                if match:
                    definitions_en.append({
                        "pos": match.group(1),
                        "meaning": match.group(2).strip(),
                    })
                else:
                    if definitions_en:
                        definitions_en[-1]["meaning"] += " " + line
                    else:
                        definitions_en.append({"pos": "", "meaning": line})

        # 解析 tag 字段
        tags = []
        tag_str = row["tag"] or ""
        if tag_str:
            tags = tag_str.split()

        # 解析 exchange 字段（词形变化）
        exchange = {}
        exchange_str = row["exchange"] or ""
        if exchange_str:
            for item in exchange_str.split("/"):
                if ":" in item:
                    key, val = item.split(":", 1)
                    exchange[key] = val

        return {
            "word": row["word"],
            "phonetic": row["phonetic"] or "",
            "definitions": definitions,
            "definitions_en": definitions_en,
            "pos": row["pos"] or "",
            "collins": row["collins"] or 0,
            "oxford": row["oxford"] or 0,
            "tags": tags,
            "bnc": row["bnc"],
            "frq": row["frq"],
            "exchange": exchange,
        }
    finally:
        conn.close()

@app.get("/ecdict/{word}/translate")
def ecdict_translate_sentence(word: str, sentence: str):
    """查询单词翻译（用于例句中单词的悬停提示）"""
    try:
        conn = get_ecdict_conn()
    except FileNotFoundError:
        raise HTTPException(status_code=503, detail="ECDICT database not available")

    try:
        # 清理单词：去除标点、转小写
        import re
        clean_word = re.sub(r'[^a-zA-Z]', '', word).lower()
        if not clean_word:
            return {"word": word, "translation": ""}

        cur = conn.cursor()
        cur.execute("SELECT translation, pos FROM stardict WHERE word = ? COLLATE NOCASE", (clean_word,))
        row = cur.fetchone()

        if not row:
            return {"word": clean_word, "translation": ""}

        translation = row["translation"] or ""
        # 只取第一个词性的释义作为简短提示
        first_meaning = translation.split('\n')[0] if translation else ""
        # 去掉词性前缀，只保留中文
        first_meaning = re.sub(r'^[a-z]+\.\s*', '', first_meaning)

        return {"word": clean_word, "translation": first_meaning}
    finally:
        conn.close()

@app.post("/ecdict/translate-sentences")
def ecdict_translate_sentences(request: dict):
    """批量翻译例句：使用 argostranslate 离线神经机器翻译"""
    sentences = request.get("sentences", [])
    if not sentences:
        return {"translations": []}

    try:
        from argostranslate import translate
        translations = []
        for sentence in sentences:
            if not sentence or not sentence.strip():
                translations.append("")
                continue
            try:
                result = translate.translate(sentence.strip(), 'en', 'zh')
                translations.append(result)
            except Exception:
                translations.append("")
        return {"translations": translations}
    except ImportError:
        # argostranslate 未安装，回退到逐词翻译
        try:
            conn = get_ecdict_conn()
        except FileNotFoundError:
            raise HTTPException(status_code=503, detail="ECDICT database not available")

        try:
            import re
            cur = conn.cursor()
            translations = []
            for sentence in sentences:
                if not sentence or not sentence.strip():
                    translations.append("")
                    continue
                words = re.findall(r'[a-zA-Z]+', sentence)
                word_translations = []
                for w in words:
                    clean = w.lower()
                    cur.execute("SELECT translation FROM stardict WHERE word = ? COLLATE NOCASE", (clean,))
                    row = cur.fetchone()
                    if row and row["translation"]:
                        trans = row["translation"]
                        first = trans.split('\n')[0]
                        first = re.sub(r'^[a-z]+\.\s*', '', first)
                        first = re.split(r'[;；,，]', first)[0].strip()
                        if first:
                            word_translations.append(first)
                translations.append('；'.join(word_translations) if word_translations else "")
            return {"translations": translations}
        finally:
            conn.close()

@app.get("/voices")
def list_voices():
    return {
        "american_female": AMERICAN_VOICES,
        "american_male": {k: v for k, v in AMERICAN_VOICES.items() if k.startswith("am")},
        "british_female": {k: v for k, v in BRITISH_VOICES.items() if k.startswith("bf")},
        "british_male": {k: v for k, v in BRITISH_VOICES.items() if k.startswith("bm")},
        "all": ALL_VOICES,
    }

@app.post("/tts")
def tts_endpoint(req: TTSRequest):
    """标准 TTS 接口，返回 base64 MP3"""
    if not req.input.strip():
        raise HTTPException(status_code=400, detail="input cannot be empty")
    if req.voice not in ALL_VOICES:
        raise HTTPException(status_code=400, detail=f"Unknown voice: {req.voice}. Available: {list(ALL_VOICES.keys())}")

    try:
        b64_audio = synthesize_to_base64(req.input, req.voice, req.speed or 0.9)
        return {"b64_audio": b64_audio, "format": "mp3", "sample_rate": SAMPLE_RATE}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tts/stream")
def tts_stream(req: TTSRequest):
    """流式 TTS 接口，直接返回 MP3 文件"""
    if not req.input.strip():
        raise HTTPException(status_code=400, detail="input cannot be empty")
    if req.voice not in ALL_VOICES:
        raise HTTPException(status_code=400, detail=f"Unknown voice: {req.voice}")

    try:
        audio_np, sr = synthesize(req.input, req.voice, req.speed or 0.9)
        audio_float = audio_np.astype(np.float32)
        max_val = np.abs(audio_float).max()
        if max_val > 0:
            audio_float = audio_float / max_val
        buffer = io.BytesIO()
        sf.write(buffer, audio_float, sr, format='MP3')
        buffer.seek(0)
        return StreamingResponse(
            iter([buffer.read()]),
            media_type="audio/mpeg",
            headers={"Content-Disposition": f'attachment; filename=tts_{uuid.uuid4().hex[:8]}.mp3'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tts/batch")
def tts_batch(req: BatchTTSRequest):
    """批量 TTS 接口"""
    if req.voice not in ALL_VOICES:
        raise HTTPException(status_code=400, detail=f"Unknown voice: {req.voice}")
    if len(req.texts) > 50:
        raise HTTPException(status_code=400, detail="Max 50 texts per batch")

    results = []
    for i, text in enumerate(req.texts):
        try:
            b64_audio = synthesize_to_base64(text, req.voice, req.speed or 0.9)
            results.append({"index": i, "text": text, "b64_audio": b64_audio, "success": True})
        except Exception as e:
            results.append({"index": i, "text": text, "success": False, "error": str(e)})
    return {"results": results, "total": len(req.texts)}

# ========== OpenAI 兼容接口 ==========

@app.post("/v1/audio/speech")
def openai_speech(req: TTSRequest):
    """OpenAI TTS 兼容接口"""
    if not req.input.strip():
        raise HTTPException(status_code=400, detail="input cannot be empty")
    if req.voice not in ALL_VOICES:
        raise HTTPException(status_code=400, detail=f"Unknown voice: {req.voice}")

    try:
        audio_np, sr = synthesize(req.input, req.voice, req.speed or 1.0)
        audio_float = audio_np.astype(np.float32)
        max_val = np.abs(audio_float).max()
        if max_val > 0:
            audio_float = audio_float / max_val
        buffer = io.BytesIO()
        sf.write(buffer, audio_float, sr, format='MP3')
        buffer.seek(0)
        return StreamingResponse(
            iter([buffer.read()]),
            media_type="audio/mpeg",
            headers={"Content-Disposition": f'attachment; filename=speech.mp3'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/v1/models")
def openai_models():
    """OpenAI 模型列表（伪装）"""
    return {
        "object": "list",
        "data": [
            {"id": "kokoro-82M", "object": "model", "created": 1700000000, "owned_by": "hexgrad"},
        ]
    }

# ========== 主入口 ==========
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT, log_level="info")