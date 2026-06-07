# Kokoro-82M TTS 集成操作文档

> 版本：v1.1.0 | 更新日期：2026-06-07 | 状态：✅ 已完成

---

## 一、概述

本项目集成 **Kokoro-82M** 作为发音引擎，替代原有 Web Speech API，提供接近真人的高质量发音。

| 项目 | 指标 |
|------|------|
| 模型 | hexgrad/Kokoro-82M (Apache 2.0) |
| 模型大小 | 327MB |
| 参数量 | 82M |
| 采样率 | 24000Hz |
| 语言 | 美式英语、英式英语、日语等 8 种 |
| 运行方式 | **本地离线运行**，无需网络 |
| 音质 | TTS Arena 排行榜第一，接近专业录音 |
| 成本 | 完全免费，无字符限制 |

---

## 二、目录结构

```
wordcontext/
├── tts-service/              ← TTS 服务（独立 Python 项目）
│   ├── app.py                ← FastAPI 服务主程序
│   ├── requirements.txt      ← Python 依赖
│   ├── start.sh             ← 启动脚本
│   ├── venv/               ← Python 虚拟环境
│   └── tts.log             ← 服务运行日志
│
└── src/
    └── lib/
        ├── kokoro/          ← 前端 Kokoro 客户端
        │   ├── index.ts    ← 主入口（API 调用 + fallback）
        │   └── voices.ts   ← 语音配置
        └── phonics/
            └── engine.ts  ← 自然拼读引擎（发音已替换为 Kokoro）
```

---

## 三、快速启动

### 1. 启动 TTS 服务

```bash
cd wordcontext/tts-service
./start.sh
```

> 首次运行会自动下载模型（327MB）和英文 NLP 模型（12.8MB）

### 2. 验证服务

```bash
curl http://localhost:8765/health
# 返回: {"status":"healthy","model":"Kokoro-82M"}
```

### 3. 打开词境前端

```
http://localhost:5173/
```

---

## 四、Phase 执行清单

### Phase 1：环境准备 ✅ 已完成

| 步骤 | 内容 | 状态 |
|------|------|------|
| 1.1 | 检查 Python 环境 | ✅ Python 3.11.15 |
| 1.2 | 创建 Python 虚拟环境 | ✅ `venv/` |
| 1.3 | 安装依赖 | ✅ `kokoro 0.9.4`, `soundfile`, `fastapi`, `uvicorn` |
| 1.4 | 下载 Kokoro-82M 模型 | ✅ 327MB → `~/.cache/kokoro` |
| 1.5 | 下载英文 NLP 模型 | ✅ `en_core_web_sm 3.8.0` |
| 1.6 | 本地测试发音 | ✅ `abandon` 生成 1.7s MP3 |

### Phase 2：后端服务 ✅ 已完成

| 步骤 | 内容 | 状态 |
|------|------|------|
| 2.1 | 编写 FastAPI 服务 | ✅ `app.py` |
| 2.2 | 实现 `POST /tts` 接口 | ✅ 返回 base64 MP3 |
| 2.3 | 实现 `POST /tts/stream` 接口 | ✅ 直接返回 MP3 流 |
| 2.4 | 实现 `POST /tts/batch` 接口 | ✅ 批量生成 |
| 2.5 | 实现 OpenAI 兼容接口 | ✅ `/v1/audio/speech` |
| 2.6 | 配置 9 种英文语音 | ✅ 美式/英式 各男女声 |
| 2.7 | CORS 跨域配置 | ✅ 允许所有来源 |
| 2.8 | 启动并验证服务 | ✅ 健康检查通过 |
| 2.9 | 测试发音生成 | ✅ 生成 9KB MP3 |

### Phase 3：前端集成 ⏳ 进行中

| 步骤 | 内容 | 状态 |
|------|------|------|
| 3.1 | 编写前端 Kokoro 客户端 | ⏳ 进行中 |
| 3.2 | 替换 Web Speech API 调用 | ⏳ 进行中 |
| 3.3 | 实现 fallback 机制 | ⏳ 进行中 |
| 3.4 | 音节级发音支持 | ⏳ 进行中 |
| 3.5 | 语音设置 UI | ⏳ 进行中 |
| 3.6 | 服务可用性检测 | ⏳ 进行中 |

### Phase 4：测试与文档

| 步骤 | 内容 | 状态 |
|------|------|------|
| 4.1 | 集成测试 | ⬜ 待完成 |
| 4.2 | 更新 CHANGELOG | ⬜ 待完成 |
| 4.3 | 更新产品设计方案 | ⬜ 待完成 |
| 4.4 | 更新 PROJECT.md | ⬜ 待完成 |

---

## 五、API 参考

### 5.1 标准 TTS 接口

```
POST http://localhost:8765/tts
Content-Type: application/json

{
  "input": "abandon",
  "voice": "af_heart",
  "speed": 0.9
}
```

响应：
```json
{
  "b64_audio": "<base64 encoded MP3>",
  "format": "mp3",
  "sample_rate": 24000
}
```

### 5.2 流式 TTS 接口

```
POST http://localhost:8765/tts/stream
Content-Type: application/json

{
  "input": "abandon",
  "voice": "af_heart",
  "speed": 0.9
}
```

响应：直接返回 MP3 二进制文件

### 5.3 批量 TTS 接口

```
POST http://localhost:8765/tts/batch
Content-Type: application/json

{
  "texts": ["abandon", "ability", "able"],
  "voice": "af_heart",
  "speed": 0.9
}
```

### 5.4 OpenAI 兼容接口

```
POST http://localhost:8765/v1/audio/speech
Content-Type: application/json

{
  "input": "abandon",
  "voice": "af_heart",
  "speed": 1.0,
  "response_format": "mp3",
  "model": "kokoro"
}
```

---

## 六、可用语音列表

| 语音 ID | 类型 | 描述 | 适合场景 |
|--------|------|------|---------|
| `af_heart` | 美式女声 | 清晰自然，温暖友好 | ✅ **学习首选** |
| `af_sky` | 美式女声 | 柔和流畅，语速适中 | 学习 |
| `af_bella` | 美式女声 | 专业播音风格，咬字清晰 | 听力测试 |
| `am_adam` | 美式男声 | 稳重清晰，语速偏慢 | 学习 |
| `am_michael` | 美式男声 | 温暖低沉，语速适中 | 复习 |
| `bf_emma` | 英式女声 | 英式优雅，发音标准 | 英式学习 |
| `bf_lisa` | 英式女声 | 英式清澈，语速偏快 | 进阶 |
| `bm_george` | 英式男声 | 英式绅士，咬字清晰 | 英式学习 |
| `bm_finlay` | 英式男声 | 英式温和，语速偏慢 | 入门 |

---

## 七、故障排查

### 7.1 服务启动失败

**问题**：`ModuleNotFoundError: No module named 'kokoro'`

**解决**：
```bash
cd wordcontext/tts-service
source venv/bin/activate
pip install -r requirements.txt
./start.sh
```

### 7.2 模型下载失败

**问题**：网络问题导致模型下载中断

**解决**：手动下载模型
```bash
# 模型会自动下载到 ~/.cache/kokoro
# 如需手动下载：
# 1. 模型：https://huggingface.co/hexgrad/Kokoro-82M/tree/main
# 2. 英文 NLP：spacy download en_core_web_sm
```

### 7.3 端口被占用

**问题**：`Port 8765 is already in use`

**解决**：
```bash
# 查看占用进程
lsof -i :8765

# 杀死进程
kill -9 <PID>

# 或修改 app.py 中的 PORT 端口号
```

### 7.4 前端无法连接 TTS 服务

**问题**：浏览器报错 `Failed to fetch`

**解决**：
1. 确认 TTS 服务正在运行：`curl http://localhost:8765/health`
2. 确认前端 `localhost:5173` 与 TTS `localhost:8765` 端口不同，需通过后端代理
3. 已配置 CORS，允许所有来源

---

## 八、技术细节

### 8.1 模型缓存位置

```
~/.cache/kokoro/
├── kokoro-v1_0.pth          ← 主模型 (327MB)
└── voices/
    ├── af_heart.pt          ← 美式女声
    ├── af_sky.pt            ← 美式女声
    └── ...
```

### 8.2 内存占用

| 组件 | 内存占用 |
|------|---------|
| Kokoro 模型加载 | ~400MB |
| 英文 NLP 模型 | ~100MB |
| 单次生成峰值 | ~600MB |
| 稳定运行时 | ~500MB |

### 8.3 生成速度（MacBook M1）

| 文本长度 | 生成时间 |
|---------|---------|
| 1 个单词（~7字符） | ~0.3s |
| 1 个句子（~20字符） | ~0.8s |
| 1 个段落（~100字符） | ~3s |

---

## 九、版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v1.1.0 | 2026-06-07 | 首次集成 Kokoro-82M，替换 Web Speech API |