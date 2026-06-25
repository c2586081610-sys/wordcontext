# 词境 (WordContext) — Code Wiki

> 代码百科文档 · 基于 React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + ts-fsrs + Dexie.js + Kokoro TTS + ECDICT
> 最后更新：2026-06-25

本文档是对「词境」仓库代码的结构化梳理，涵盖项目整体架构、主要模块职责、关键类与函数说明、依赖关系以及项目运行方式。文档反映代码的**实际当前状态**（包含文档版本 v1.1.0 之后新增的 ECDICT 词典、Kokoro TTS、多 Provider 发音、交互式例句、Python TTS 服务等模块）。

---

## 目录

- [一、项目概览](#一项目概览)
- [二、整体架构](#二整体架构)
- [三、目录结构](#三目录结构)
- [四、主要模块职责](#四主要模块职责)
- [五、核心算法层 (`src/lib/`)](#五核心算法层-srclib)
  - [5.1 phonics 自然拼读引擎](#51-phonics-自然拼读引擎)
  - [5.2 fsrs 间隔重复算法](#52-fsrs-间隔重复算法)
  - [5.3 db 数据持久层](#53-db-数据持久层)
  - [5.4 io 数据导入导出](#54-io-数据导入导出)
  - [5.5 ecdict 词典查询客户端](#55-ecdict-词典查询客户端)
  - [5.6 kokoro TTS 语音合成客户端](#56-kokoro-tts-语音合成客户端)
  - [5.7 pronunciation 多 Provider 发音服务](#57-pronunciation-多-provider-发音服务)
- [六、状态管理层 (`src/stores/`)](#六状态管理层-srcstores)
- [七、UI 组件层 (`src/components/`)](#七ui-组件层-srccomponents)
- [八、入口与配置](#八入口与配置)
- [九、TTS 后端服务 (`tts-service/`)](#九tts-后端服务-tts-service)
- [十、数据模型](#十数据模型)
- [十一、依赖关系](#十一依赖关系)
- [十二、项目运行方式](#十二项目运行方式)
- [十三、构建与部署](#十三构建与部署)

---

## 一、项目概览

**词境 (WordContext)** 是一个 Web-first 的英语单词学习应用，核心理念：**炭炭的简洁高效 + DejaVocab 的语境思维 + FSRS 的科学算法 + 浏览器即用的跨平台**。

**核心能力：**

| 能力 | 实现方式 |
|------|---------|
| 科学记忆调度 | FSRS 间隔重复算法（ts-fsrs），50 次复习后自动训练个性化参数 |
| 自然拼读可视化 | CMU 词典（13.4 万词）懒加载 + 音节划分 + 音素着色 |
| 高质量发音 | 多 Provider 回退：有道真人录音 → Kokoro-82M 本地 TTS → Web Speech API |
| 词典释义增强 | ECDICT 本地 SQLite 词典（释义/词形/考试标签/Collins/Oxford/BNC） |
| 交互式例句 | 例句分词、悬停查词翻译、点击跳转词条 |
| 本地持久化 | IndexedDB（Dexie.js 封装），零服务器依赖 |
| 数据自由迁移 | JSON/CSV 双向导入导出 |
| 学习统计 | 日历热力图、趋势折线图、记忆强度分布、连续打卡 |
| 暗色模式 | 浅色/深色/跟随系统三模式切换 |

**技术栈：** React 19 · TypeScript · Vite 8 · Tailwind CSS v4 · Zustand · Dexie.js · ts-fsrs · Recharts · cmu-pronouncing-dictionary · Kokoro (Python/FastAPI)

---

## 二、整体架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                          UI 层 (src/components/)                     │
│  ┌────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │ Header │ │ WordList │ │WordDetail│ │StatsPanel│ │DataManager │  │
│  └───┬────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘  │
│      │     ┌────┴──────┐      │             │            │          │
│      │     │PhonicsDisp│      │ ┌──────────┴────┐       │          │
│      │     └───────────┘      │ │InteractiveSent│       │          │
│      │                        │ └───────────────┘       │          │
├──────┼────────────────────────┼─────────────────────────┼──────────┤
│      │        状态管理层 (src/stores/)                    │          │
│      └──→ useStudyStore ←─────┘    useStatStore ←────────┘          │
│           (学习/FSRS/暗色/视图)        (统计/目标/打卡)               │
├──────────────────────────────────────────────────────────────────────┤
│                     算法层 (src/lib/)                                 │
│  ┌─────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌────────┐ ┌────────────┐  │
│  │ phonics │ │ fsrs │ │  db  │ │  io  │ │ ecdict │ │ kokoro     │  │
│  └────┬────┘ └───┬──┘ └──┬───┘ └──┬───┘ └────────┘ └─────┬──────┘  │
│       │          │       │       │                       │          │
│       └─动态─→ pronunciation ←──静态──┘                       │          │
│                    └──────────── 静态 ─────────────────────┘          │
├──────────────────────────────────────────────────────────────────────┤
│              浏览器 API + 本地服务                                    │
│  IndexedDB · Web Speech API · fetch · Audio · localStorage           │
│  本地 TTS 服务 (http://localhost:8765) · 有道 dictvoice              │
└──────────────────────────────────────────────────────────────────────┘
```

**分层职责：**

- **UI 层**：纯展示与交互，通过 Zustand Store 读写状态，调用 lib 层服务。
- **状态管理层**：Zustand Store 桥接 UI 与数据层，持有应用状态（词库、卡片、视图、主题、统计）。
- **算法层**：无 UI 依赖的纯逻辑模块，封装算法、持久化、外部服务客户端。
- **本地服务层**：Python FastAPI 提供 Kokoro TTS 与 ECDICT 词典查询，前端可选依赖（不可用时回退）。

---

## 三、目录结构

```
词境/
├── CODE_WIKI.md                       # 本文档
├── PROJECT.md                         # 项目全景文档（v1.0 视角）
├── docs/                              # 版本化文档目录
│   ├── INDEX.md
│   ├── product/v{1.0.0,1.1.0}/产品设计方案.md
│   ├── research/v{1.0.0,1.1.0}/市场调研报告.md
│   ├── project/v{1.0.0,1.1.0}/PROJECT.md
│   ├── releases/v1.1.0/{VERSION,CHANGELOG}-v1.1.md
│   ├── changelog/CHANGELOG.md
│   ├── standards/FOLDER_NAMING_CONVENTIONS.md
│   ├── templates/{CODE_FIX,VERSION_UPDATE}_TEMPLATE.md
│   └── vision/VISION.md
├── .github/workflows/deploy.yml       # GitHub Pages 部署 CI
│
└── wordcontext/                       # ★ 前端项目根目录（monorepo 子包）
    ├── index.html                     # SPA 入口 HTML
    ├── package.json                   # 依赖与脚本
    ├── vite.config.ts                 # Vite 构建配置（@ → /src 别名）
    ├── tsconfig.json                  # TS 根配置
    ├── tsconfig.app.json              # 应用 TS 配置（ES2023 + react-jsx）
    ├── tsconfig.node.json             # Node 环境 TS 配置
    ├── eslint.config.js               # ESLint flat config
    ├── public/                        # 静态资源（favicon.svg, icons.svg）
    │
    ├── src/                           # ★ 前端源码
    │   ├── main.tsx                   # 应用入口（React StrictMode）
    │   ├── App.tsx                    # 根组件（视图路由 + 暗色同步）
    │   ├── App.css                    # 应用样式
    │   ├── index.css                  # 全局样式 + Tailwind v4 + 暗色变量
    │   │
    │   ├── lib/                       # ★ 核心算法层
    │   │   ├── phonics/               # 自然拼读引擎
    │   │   │   ├── engine.ts          # ★ 核心引擎（CMU 集成 + 音节划分）
    │   │   │   ├── rules.ts           # 拼读规则 + ARPAbet→IPA + 颜色映射
    │   │   │   ├── types.ts           # 类型定义
    │   │   │   └── index.ts           # 统一导出
    │   │   ├── fsrs/                  # FSRS 间隔重复 + 参数训练
    │   │   │   └── index.ts
    │   │   ├── db/                    # 数据持久层（Dexie/IndexedDB v2）
    │   │   │   ├── index.ts           # 数据库定义（5 张表）
    │   │   │   ├── sampleData.ts      # 词库合并导出（510 词）
    │   │   │   └── sampleData{1..6}.ts# 分批词库（A-B/C-D/E-H/I-O/P-S/T-Z）
    │   │   ├── io/                    # 数据导入导出（JSON/CSV）
    │   │   │   └── index.ts
    │   │   ├── ecdict/                # ECDICT 词典查询客户端
    │   │   │   └── index.ts
    │   │   ├── kokoro/                # Kokoro TTS 客户端
    │   │   │   ├── index.ts           # TTS 调用 + 缓存 + 回退
    │   │   │   └── voices.ts          # 9 种语音配置 + 偏好持久化
    │   │   └── pronunciation/         # 多 Provider 发音统一入口
    │   │       └── index.ts
    │   │
    │   ├── stores/                    # 状态管理
    │   │   ├── useStudyStore.ts       # ★ 学习/FSRS/暗色/视图 核心状态
    │   │   └── useStatStore.ts        # 学习统计/目标/打卡
    │   │
    │   ├── components/                # UI 组件
    │   │   ├── Header/                # 顶部导航（视图/主题/统计入口）
    │   │   ├── WordList/              # 列表速刷模式
    │   │   ├── WordDetail/            # 沉浸详情模式（quiz + rate）
    │   │   ├── PhonicsDisplay/        # 自然拼读可视化
    │   │   ├── InteractiveSentence/   # 交互式例句（悬停翻译/点击跳转）
    │   │   ├── StatsPanel/            # 学习统计面板（图表）
    │   │   └── DataManager/           # 数据管理（导入/导出/清空）
    │   │
    │   └── assets/                    # 图片资源
    │
    └── tts-service/                   # ★ Python TTS 后端服务
        ├── app.py                     # FastAPI 主程序（Kokoro + ECDICT）
        ├── requirements.txt           # Python 依赖
        ├── stardict.db                # ECDICT SQLite 词典数据库
        ├── start.sh                   # 仅启动 TTS 服务
        └── start-tts.sh               # 一键启动 TTS + 前端
```

> **说明**：`work/LangEasyLexis-reverse/` 为外部竞品逆向工程素材（音频/字体/nib/css 等），非本项目源码，本文档不展开。

---

## 四、主要模块职责

| 模块 | 路径 | 职责 |
|------|------|------|
| **phonics** | `src/lib/phonics/` | 自然拼读分析：CMU 词典查询、ARPAbet→IPA 转换、音节划分（最大首音原则）、字母-音素对齐、重音识别、音素着色 |
| **fsrs** | `src/lib/fsrs/` | FSRS 间隔重复调度：卡片创建、复习时间计算、状态查询、记忆强度估算、参数自动训练（50 次复习触发） |
| **db** | `src/lib/db/` | IndexedDB 持久化：5 张表（words/cards/decks/studyLogs/settings）、索引策略、Schema v1→v2 升级 |
| **io** | `src/lib/io/` | 数据导入导出：JSON/CSV 双向、按词库导出、去重合并、Date 反序列化修复 |
| **ecdict** | `src/lib/ecdict/` | ECDICT 词典客户端：查询单词详细释义、简短翻译、批量例句翻译、服务健康检查（带内存缓存） |
| **kokoro** | `src/lib/kokoro/` | Kokoro TTS 客户端：单词/音节/音素/句子语音合成、音频缓存、并发预加载、Web Speech 回退 |
| **pronunciation** | `src/lib/pronunciation/` | 发音统一入口：多 Provider 回退链（不背单词 → 有道 → Kokoro → Web Speech）、Provider 持久化 |
| **useStudyStore** | `src/stores/useStudyStore.ts` | 核心 Store：词库/卡片数据、视图模式、暗色主题、单词评分调度、FSRS 训练触发 |
| **useStatStore** | `src/stores/useStatStore.ts` | 统计 Store：每日目标、连续打卡、今日进度、记忆分布、日历聚合 |
| **Header** | `src/components/Header/` | 顶部导航：品牌、统计、视图切换、主题切换、数据管理入口 |
| **WordList** | `src/components/WordList/` | 速刷模式：滚动列表、键盘导航、即时评价、飞出动画 |
| **WordDetail** | `src/components/WordDetail/` | 沉浸模式：选择题 + 三段评价、ECDICT 释义增强、例句翻译、词形/标签展示 |
| **PhonicsDisplay** | `src/components/PhonicsDisplay/` | 拼读可视化：音节/音素展示、点击发音、颜色图例、紧凑模式 |
| **InteractiveSentence** | `src/components/InteractiveSentence/` | 交互例句：分词、悬停查词翻译（Portal Tooltip）、点击跳转词条 |
| **StatsPanel** | `src/components/StatsPanel/` | 统计面板：环形进度、日历热力图、趋势折线、记忆分布饼图/条形图 |
| **DataManager** | `src/components/DataManager/` | 数据管理：导出格式/范围选择、拖拽导入、清空二次确认 |
| **tts-service** | `wordcontext/tts-service/` | Python 后端：Kokoro TTS（标准/流式/批量/OpenAI 兼容）、ECDICT 词典查询、批量翻译 |

---

## 五、核心算法层 (`src/lib/`)

### 5.1 phonics 自然拼读引擎

**位置**：`src/lib/phonics/`（`engine.ts` + `rules.ts` + `types.ts` + `index.ts`）

**职责**：将英文单词拆解为音节与音素，生成可视化数据，并触发发音播放。

#### 关键类型 (`types.ts`)

```typescript
type PhonemeType = 'consonant' | 'vowel' | 'blend' | 'digraph' | 'r-controlled' | 'silent';

type Phoneme = {
  grapheme: string;   // 对应字母组合，如 "th"
  ipa: string;        // IPA 音标，如 "/θ/"
  arpabet: string;    // CMU ARPAbet，如 "TH"
  type: PhonemeType;
  color: string;      // 显示颜色
};

type PhonicsBreakdown = {
  word: string;
  syllables: string[];       // ["a", "ban", "don"]
  phonemes: Phoneme[];
  stressIndex: number;       // 重读音节索引
  silentLetters: number[];   // 静音字母位置
};

type SyllableInfo = { text: string; phonemes: Phoneme[]; isStressed: boolean };
```

#### 核心函数 (`engine.ts`，由 `index.ts` 统一导出)

| 函数 | 签名 | 说明 |
|------|------|------|
| `analyzeWord` | `(word: string) => Promise<PhonicsBreakdown>` | 主入口：CMU 查询 → ARPAbet 解析 → IPA 转换 → 音节划分 → 重音识别 → 组装返回 |
| `getSyllableDetails` | `(word: string) => Promise<SyllableInfo[]>` | 获取音节详情（含每音节音素与重读标记） |
| `speakWord` | `(word: string, _lang?: string, accent?: 'us'\|'uk') => Promise<void>` | 播放整词发音（动态 import `pronunciation.speakWord`） |
| `speakPhoneme` | `(ipa: string, _lang?: string) => Promise<void>` | 播放单个音素（动态 import `kokoro.speakPhoneme`，失败回退 Web Speech） |

#### 关键内部实现

- **CMU 词典懒加载**：模块级 `cmuDict` 缓存，`loadCMUDict()` 通过动态 `import('cmu-pronouncing-dictionary')` 加载（3.9MB），Vite 自动 code-split 为独立 chunk。
- **ARPAbet 解析** `parseArpabet`：拆分音素 token，去除重音数字 `[0-2]`，通过 `ARPABET_TO_IPA` 转 IPA。
- **字母对齐** `alignArpabetToWord`：元音按 `VOWEL_COMBOS` 匹配 1-2 字母；辅音通过 `CONSONANT_GRAPHEMES` 表匹配（如 `TH → ['th']`、`K → ['c','k']`）。
- **音节划分**：有 CMU 数据走 `syllabifyFromArpabet`（VCV→V·CV、VCCV→VC·CV，digraph/blend 不可拆）；无 CMU 走 `splitByRules`（按元音组推断），失败回退 `equalSplit`。v1.1 修复了 `i--` 导致的死循环（改为 `i = j - 1`）。
- **重音识别** `findStressIndex`：扫描 ARPAbet token，主重音标记 `1` 结尾时返回当前元音计数。
- **回退音素** `fallbackPhonemes`：CMU 未命中时逐字母生成音素。
- **动态 import 解环**：`speakWord`/`speakPhoneme` 通过动态 import 调用 `pronunciation`/`kokoro`，切断静态依赖环。

#### 规则常量 (`rules.ts`)

- `DIGRAPHS`：sh, ch, th, wh, ph, gh, ck, ng, nk（两字母一音）
- `BLENDS`：bl, br, cr, dr, fl, str, spr 等 26 个辅音连缀
- `VOWEL_COMBOS`：ai, ea, ee, oa, oo, ou 等 18 个元音组合
- `R_CONTROLLED`：ar, er, ir, or, ur, air, ear 等
- `PHONEME_COLORS`：辅音蓝 `#2563EB` / 元音红 `#DC2626` / 组合紫 `#7C3AED` / R控青 `#0D9488` / 静音灰 `#94A3B8`
- `ARPABET_TO_IPA`：39 个音素的完整映射表
- `getPhonemeType(arpabet)` / `getPhonemeColor(type)` 辅助函数

---

### 5.2 fsrs 间隔重复算法

**位置**：`src/lib/fsrs/index.ts`

**职责**：封装 `ts-fsrs` 库，提供卡片调度、状态查询、记忆强度估算，以及基于历史复习日志的参数自动训练。

#### 导出类型与常量

```typescript
type ReviewRating = 'again' | 'hard' | 'good' | 'easy';
type FSRSCard = ReturnType<typeof createEmptyCard>;  // ts-fsrs Card 类型
const TRAINING_THRESHOLD = 50;  // 训练触发阈值
// 重新导出 ts-fsrs 的 Rating、State 枚举、FSRSParameters 类型
```

#### 核心函数

| 分类 | 函数 | 说明 |
|------|------|------|
| 实例管理 | `getFSRS(): FSRS` | 获取当前 FSRS 实例（可能含训练后参数） |
| 实例管理 | `updateFSRSInstance(params: FSRSParameters): void` | 用训练参数重建实例 |
| 创建 | `newCard(): FSRSCard` | 创建空白卡片（`createEmptyCard(new Date())`，state=New） |
| 调度 | `scheduleReview(card, rating: ReviewRating): FSRSCard` | 评价后返回更新卡片 |
| 调度增强 | `scheduleReviewWithLog(card, rating): { card, log }` | 调度同时返回增强日志（含 prevState/elapsed/scheduled） |
| 状态查询 | `getStateLabel(state: number): string` | 中文标签：新词/学习中/复习/重新学习 |
| 状态查询 | `getDueLabel(card): string` | 下次复习可读描述（现在/N分钟后/N天后/N月后） |
| 记忆强度 | `getMemoryStrength(card): number` | 0-100 百分比，公式 `min(100, round(s/(s+10)*100))` |
| 参数训练 | `loadFSRSParameters(): Promise<boolean>` | 从 `db.settings` 加载已训练参数并更新实例 |
| 参数训练 | `trainParameters(): Promise<FSRSParameters \| null>` | 基于 studyLogs 训练参数（5 步简化算法） |
| 参数训练 | `checkAndTrainIfNeeded(): Promise<void>` | 评价后调用，计数达阈值异步触发训练 |

#### 评分映射

```
用户操作          FSRS Rating        效果
───────────────────────────────────────────────
again (忘记)  → Rating.Again  → stability 重置，短期重学
hard  (困难)  → Rating.Hard   → stability 小幅增加
good  (模糊)  → Rating.Good   → stability 适度增加
easy  (熟悉)  → Rating.Easy   → stability 大幅增加，间隔显著延长
```

#### 参数训练算法（5 步简化版）

因 `ts-fsrs` v5 的 `generatorParameters()` 不接受 ReviewLog，故自实现简化训练：

1. **目标保持率微调**：计算 Review 状态下 rating≥Good 比例，调整 `request_retention`（限幅 0.7-0.97）。
2. **初始稳定性**：统计首次评价分布算 `highRatingBias`，按 `1 + bias*0.15` 调整 `w[0]-w[3]`。
3. **初始难度**：根据 Again/Easy 比例调整 `w[4]`（限幅 1-10）。
4. **稳定性增长因子**：分析成功 vs 遗忘的平均间隔比 `failRatio`，调整 `w[8]`。
5. **短期记忆参数**：根据学习/重学状态平均 `review_duration` 调整 `w[17]`。

训练结果写入 `db.settings`（`{id:'fsrs', fsrsParameters, lastTrainedAt, reviewCountSinceTraining:0}`）并即时更新实例。

---

### 5.3 db 数据持久层

**位置**：`src/lib/db/index.ts`（+ `sampleData{1..6}.ts` + `sampleData.ts` 合并导出）

**职责**：基于 Dexie（IndexedDB 封装）定义数据库 `wordcontext`，声明 5 张表与索引，管理 Schema 升级。

#### 数据库表结构

| 表名 | 主键 | 索引 | 说明 |
|------|------|------|------|
| `words` | `id` | `word`, `*tags` | 单词条目（词义/音标/词根/助记/例句） |
| `cards` | `id` | `deckId`, `fsrs.due`, `fsrs.state` | FSRS 学习卡片状态 |
| `decks` | `id` | `name`, `*tags` | 词书/词库 |
| `studyLogs` | `++id` (自增) | `date`, `wordId`, `state`, `rating` | 学习日志（每次评价记录） |
| `settings` | `id` | — | 用户设置（FSRS 参数/训练时间） |

#### 导出类型

```typescript
type Definition = { pos: string; meaning: string };

type WordEntry = {
  id: string; word: string; phonetic: string;
  definitions: Definition[]; examples: string[];
  etymology: string; wordFamily: string[];
  mnemonic: string; tags: string[];
};

type CardEntry = {
  id: string; deckId: string;
  fsrs: FSRSCard;        // ts-fsrs 卡片（due/stability/difficulty/state/reps/lapses...）
  rating: number; lastReview?: Date;
};

type DeckEntry = {
  id: string; name: string; description: string;
  wordCount: number; tags: string[];
  bookMatch?: string; wordIds: string[];
};

type StudyLog = {
  id?: number; date: string; wordId: string;
  rating: number; timeSpent: number;
  state: number; elapsed_days: number;
  scheduled_days: number; review_duration: number;
};

type SettingsEntry = {
  id: string; fsrsParameters: number[] | null;
  lastTrainedAt: Date | null; reviewCountSinceTraining: number;
};

type DailyStatEntry = {
  id: string; date: string;
  newWordsLearned: number; wordsReviewed: number;
  totalReviews: number; correctRate: number; studyMinutes: number;
};
```

#### Schema 升级（v1 → v2）

- **v1**：建立 words/cards/decks/studyLogs 四表。
- **v2**：增强 studyLogs 索引（加 `state, rating`）；新增 `settings` 表；`upgrade()` 回调为旧 studyLogs 记录填充默认值。

#### 索引策略

- `cards.fsrs.due` — 查询"今天需复习的词" O(log n)
- `cards.fsrs.state` — 按状态筛选（新词/学习中/复习）
- `words.*tags` — 多值索引，按 CET4/考研等标签筛选
- `studyLogs.date` — 按日聚合统计

#### 种子数据

`sampleData.ts` 合并 `WORDS_AB`/`WORDS_CD`/`WORDS_EH`/`WORDS_IO`/`WORDS_PS`/`WORDS_TZ` 共 **510 个 CET4 核心词汇**，配套一个 `deck-cet4` 词书。

---

### 5.4 io 数据导入导出

**位置**：`src/lib/io/index.ts`

**职责**：单词库数据的导出（全部/按词库，JSON/CSV）与导入（自动识别格式，去重合并），以及全量清空。

#### 导出

```typescript
type ExportData = {
  version: string; exportDate: string;
  words: WordEntry[]; cards: CardEntry[];
  decks: DeckEntry[]; studyLogs: StudyLog[];
};

function exportAll(format: 'json' | 'csv'): Promise<void>;
function exportByDeck(deckId: string, format: 'json' | 'csv'): Promise<void>;
```

- **JSON**：`Promise.all` 并行读四表 → `JSON.stringify` → Blob → `<a download>` 触发下载。
- **CSV**：扁平化为 `CSVRow`（word/phonetic/pos/meaning/tags/state/stability/due），加 UTF-8 BOM `\uFEFF` 保证 Excel 中文正确，`csvEscape` 处理逗号/引号/换行。

#### 导入

```typescript
type ImportResult = {
  success: boolean; message: string;
  details: { wordsImported, wordsSkipped, cardsImported, decksImported, studyLogsImported };
};

function importData(file: File): Promise<ImportResult>;
```

- **格式识别**：按扩展名或内容判断 JSON/CSV。
- **JSON 导入** `doImportJSON`：decks/words/cards 按 id 去重（`existingIds.has` 过滤）；**关键修复**：JSON 反序列化后 Date 是字符串，需手动把 `card.fsrs.due`/`fsrs.last_review`/`lastReview` 转回 Date；studyLogs 直接 bulkAdd（追加日志）。
- **CSV 导入** `importCSVFromString`：跳过 BOM，手写 `parseCSVLine` 支持引号内逗号和 `""` 转义；必须有 `word` 列；为每词生成 `word-${word}` id，用 `newCard()` 创建卡片；自动创建/合并 `deck-imported` 词库。

#### 清空

```typescript
function clearAllData(): Promise<void>;  // 清空 words/cards/decks/studyLogs 四表
```

#### 依赖

- `../db`（读写四表）
- `../fsrs`（`newCard` 创建导入卡片）
- 浏览器 API：`Blob`、`URL.createObjectURL`、`FileReader`

---

### 5.5 ecdict 词典查询客户端

**位置**：`src/lib/ecdict/index.ts`

**职责**：作为本地 TTS 服务（`http://localhost:8765`）上 ECDICT 词典端点的客户端，查询单词详细释义、简短翻译、批量例句翻译，并检测服务可用性。带内存缓存。

#### 导出

```typescript
type ECDICTDefinition = { pos: string; meaning: string };

type ECDICTResult = {
  word: string; phonetic: string;
  definitions: ECDICTDefinition[];       // 中文释义（按词性拆分）
  definitions_en: ECDICTDefinition[];    // 英文释义
  pos: string; collins: number; oxford: number;
  tags: string[];                        // 考试标签（zk/gk/cet4/...）
  bnc: number | null; frq: number | null;
  exchange: Record<string, string>;      // 词形变化（p/d/i/3/s/r/t/f）
};

function lookupECDICT(word: string): Promise<ECDICTResult | null>;
function lookupWordTranslation(word: string): Promise<string>;
function isECDICTAvailable(): Promise<boolean>;     // 2 秒超时健康检查
function translateSentences(sentences: string[]): Promise<string[]>;
```

#### 关键实现

- **常量** `TTS_BASE = 'http://localhost:8765'`。
- **双缓存**：`cache: Map<string, ECDICTResult | null>`（含 null 表示查过无结果，避免重复请求）；`translationCache: Map<string, string>`。
- 所有 fetch 失败静默降级（catch 后写空值进缓存返回），保证 UI 不崩。
- `lookupWordTranslation` 先 `word.toLowerCase().replace(/[^a-z]/g, '')` 清洗。

#### 集成

- 独立模块，不被 lib 内其他模块导入。
- 与 `kokoro` 共享同一后端服务端口（8765），代码上无依赖。
- 被 `WordDetail`（补充释义/词形/标签）、`InteractiveSentence`（悬停翻译）调用。

---

### 5.6 kokoro TTS 语音合成客户端

**位置**：`src/lib/kokoro/`（`index.ts` + `voices.ts`）

**职责**：对接本地 Kokoro-82M TTS 服务，为单词/音节/音素/句子生成语音并播放，带内存音频缓存与并发预加载。失败回退 Web Speech API。

#### `index.ts` 导出

```typescript
function checkServiceHealth(): Promise<boolean>;     // 30 秒 TTL 缓存
function speakWord(word, voice='af_heart', speed=0.9): Promise<void>;
function speakSyllable(syllable, voice='af_heart', speed=0.85): Promise<void>;
function speakPhoneme(phoneme, voice='af_heart'): Promise<void>;   // 内部调 speakSyllable 速度 0.7
function speakSentence(sentence, voice='af_heart', speed=0.85): Promise<void>;
function stopSpeaking(): void;
function preloadWords(words: string[], voice='af_heart', speed=0.9): Promise<void>;  // 并发限 3
function clearCache(): void;
function getServiceStatus(): { cacheSize: number };
```

#### `voices.ts` 导出

```typescript
type KokoroVoice = 'af_heart' | 'af_sky' | 'af_bella' | 'am_adam' | 'am_michael'
                 | 'bf_emma' | 'bf_lisa' | 'bm_george' | 'bm_finlay';

interface VoiceOption {
  id: KokoroVoice; label: string; description: string;
  accent: 'american' | 'british'; gender: 'female' | 'male'; recommended?: boolean;
}

const VOICE_OPTIONS: VoiceOption[];          // 9 种语音
const DEFAULT_VOICE: KokoroVoice = 'af_heart';
function getSavedVoice(): KokoroVoice;       // localStorage 'kokoro_voice'
function saveVoice(voice: KokoroVoice): void;
function getSavedSpeed(): number;            // localStorage 'kokoro_speed'，0.5-2.0，默认 0.9
function saveSpeed(speed: number): void;
```

#### 关键实现

- **音频缓存** `audioCache: Map<string, HTMLAudioElement>`，key 格式 `${word}:${voice}:${speed}` 或加前缀 `syl:`/`sent:`。
- **单例当前音频** `currentAudio`，每次播放前 `stopSpeaking()` 停止上一个。
- **健康检查缓存** 30 秒 TTL，避免每次播放都发 health 请求导致 `ERR_ABORTED`。
- **TTS 请求流程**：POST `/tts` body `{input, voice, speed}` → 响应 `{b64_audio}` → `atob` 解码 → `Uint8Array` → `Blob({type:'audio/mpeg'})` → `URL.createObjectURL` → `new Audio(url).play()`。
- **回退** `fallbackSpeak`：`speechSynthesis.cancel()` 后用 `SpeechSynthesisUtterance`（rate 0.8）播放。
- `clearCache` 会 `URL.revokeObjectURL` 释放内存。

#### 集成

- 被 `pronunciation` 静态导入作为兜底 TTS。
- 被 `phonics.speakPhoneme` 动态导入用于音素发音。

---

### 5.7 pronunciation 多 Provider 发音服务

**位置**：`src/lib/pronunciation/index.ts`

**职责**：统一的单词发音入口，按优先级回退策略整合多个发音 provider。

#### 导出

```typescript
type Accent = 'us' | 'uk';
type Provider = 'beingfine' | 'youdao' | 'kokoro';

function setProvider(p: Provider): void;           // 切换并存 localStorage
function getProvider(): Provider;                  // 默认 'youdao'
function setZpkMap(map: Record<string, string>): void;  // 不背单词 zpk URL 映射
function speakWord(word: string, accent: Accent = 'us'): Promise<void>;
function stopSpeaking(): void;
function preloadWords(words: string[], accent: Accent = 'us'): Promise<void>;  // 并发限 4
function clearCache(): void;
function getServiceStatus(): { provider: Provider; cacheSize: number };
```

#### Provider 回退链

`speakWord` 内部按当前 provider 与可用性回退：

1. **beingfine（不背单词）**：从 `zpkMap` 查 `map[word.toLowerCase()]`，调 `playViaBeingfineZpk`。**当前 TODO**：zpk 解包未实现，warn 后回退有道。
2. **youdao（有道 dictvoice）**：`https://dict.youdao.com/dictvoice?type=${type}&audio=${word}`（type=1 美音、0 英音），用 `<audio src=url>` 直接播放（绕过 CORS）。
3. **kokoro**：调 `kokoroSpeak(w)`。
4. **Web Speech API**：最终兜底。

- `playViaAudioElement`：返回 Promise，监听 `ended`/`error`；error 或 `play()` 被拒时回退到 kokoro。
- **缓存 key** 格式 `word:${provider}:${accent}:${wordLower}`。
- `stopSpeaking` 优先停 currentAudio，无则调 `kokoroStop()`。

#### 集成

- 静态导入 `../kokoro`（`speakWord as kokoroSpeak`、`stopSpeaking as kokoroStop`）。
- 被 `phonics.speakWord` 通过动态 `import('../pronunciation/index')` 调用，是单词发音的统一入口。
- **UI 应优先调用此模块而非直接调 kokoro**；自然拼读音素才直接调 `kokoro.speakPhoneme`。

---

## 六、状态管理层 (`src/stores/`)

### 6.1 `useStudyStore.ts` — 核心 Store

**职责**：应用核心学习状态管理，连接数据层（Dexie）和 UI 层，管理学习流程、视图、主题、FSRS 调度。

#### 状态字段

```typescript
{
  words: WordEntry[];
  cards: Map<string, CardEntry>;       // wordId → CardEntry
  currentDeckId: string;               // 默认 'deck-cet4'
  viewMode: 'list' | 'detail' | 'stats' | 'settings';
  detailSubMode: 'quiz' | 'rate';
  currentIndex: number;
  showPhonetic: boolean;
  isInitialized: boolean;
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
}
```

#### 核心方法

| 模块 | 方法 | 说明 |
|------|------|------|
| 初始化 | `init()` | 加载 FSRS 参数；若 IDB 无数据则 `bulkPut` 种子词库；为缺卡片词创建 `newCard()` |
| 视图 | `setViewMode(mode)` / `setDetailSubMode(mode)` | 切换视图/子模式 |
| 导航 | `nextWord()` / `prevWord()` / `setCurrentIndex(i)` | 切换单词（clamp 边界） |
| 音标 | `togglePhonetic()` | 切换音标显隐 |
| 评价 | `rateWord(wordId, rating)` | **核心**：`scheduleReviewWithLog` 计算新卡片 → 更新内存 Map → 持久化 `db.cards` → 写增强日志（prevState/elapsed/scheduled/duration） → 异步 `checkAndTrainIfNeeded()` |
| 查询 | `getCurrentWord()` / `getCurrentCard()` | 当前词/卡片 |
| 筛选 | `getDueWords()` / `getNewWords()` | 到期词/新词 |
| 统计 | `getStats()` | `{total, newCount, learning, review}` |
| 主题 | `setTheme(t)` / `toggleTheme()` | 主题循环切换 light → dark → system |

#### 依赖

- `zustand` 的 `create`
- `../lib/db`（`db`、`WordEntry`、`CardEntry`）
- `../lib/db/sampleData`（`SAMPLE_WORDS`、`SAMPLE_DECKS`）
- `../lib/fsrs`（`newCard`、`scheduleReview`、`scheduleReviewWithLog`、`checkAndTrainIfNeeded`、`loadFSRSParameters`、`ReviewRating`）
- `ts-fsrs`（`createEmptyCard`、`State`）

---

### 6.2 `useStatStore.ts` — 统计 Store

**职责**：管理学习统计数据、每日目标、连续打卡、今日进度、记忆分布。

#### 状态字段

```typescript
{
  dailyGoal: { newWords: 20; reviews: 50 };
  dailyStats: DailyStatEntry[];
  streak: number;
  todayProgress: TodayProgress;          // 今日新词/复习/总复习/正确率/学习分钟
  memoryDistribution: MemoryDistribution; // 新词/学习/复习/重学数量
  isLoading: boolean;
}
```

#### 核心方法

| 方法 | 说明 |
|------|------|
| `setDailyGoal(goal)` | 合并设置目标 |
| `loadDailyStats(days)` | 查询 studyLogs 按日期范围，分组聚合，生成完整日期范围（含空日期） |
| `loadStreak()` | 从今天向前回溯 365 天统计连续学习天数 |
| `loadTodayProgress()` | 聚合今日 logs |
| `loadMemoryDistribution()` | 遍历所有 cards 按 FSRS state（0/1/2/3）分类计数 |
| `loadAll()` | `Promise.all` 并行加载上述四项 |

#### 模块内辅助函数

- `formatDate(date)` → `YYYY-MM-DD`
- `aggregateLogs(logs)`：`rating=1` 视为新词；`rating>=3` 视为答对；计算 `correctRate` 与 `studyMinutes`。

#### 集成

- 不直接调用 `useStudyStore`，但通过共享 `db.studyLogs`（`useStudyStore.rateWord` 写入）间接联动。
- `StatsPanel` 同时消费两者。

---

## 七、UI 组件层 (`src/components/`)

### 7.1 `Header/index.tsx`

**职责**：顶部粘性导航栏。

- 从 `useStudyStore` 取 `viewMode, setViewMode, getStats, theme, toggleTheme`。
- 视图切换按钮组：速刷(list) / 沉浸(detail) / 统计(stats)。
- 数据管理按钮：点击切换 `viewMode` 在 `settings` 与 `list` 之间。
- 主题切换按钮（根据 `theme` 显示太阳/月亮/系统图标 + 中文标签）。
- 内部辅助组件：`SunIcon`、`MoonIcon`、`SystemIcon`（均接收 `{ className?: string }`）。

### 7.2 `WordList/index.tsx` — 速刷模式

**职责**：炭炭式速刷界面，滚动列表 + 键盘导航 + 即时评价。

- **虚拟窗口**：显示 `currentIndex-5` 到 `currentIndex+15` 的词。
- **每行**：单词 + 音标（受 `showPhonetic` 控制）+ 发音按钮 + 记忆强度条（`getMemoryStrength`）+ 状态标签（`getStateLabel`）+ 当前词显示评价按钮与释义。
- **键盘快捷键**（全局监听）：
  - `j`/`ArrowDown` 下一个，`k`/`ArrowUp` 上一个
  - `1/2/3` → easy/good/again
  - `Space` 切换音标显隐
  - `Enter` 调 `speakWord` 播放发音
- **评价动画**：`handleRate` 触发 `flyOutIndex`，250ms 后自动跳下一个。
- **底部**：当前位置 + 上一组/下一组（±10）。

### 7.3 `WordDetail/index.tsx` — 沉浸模式

**职责**：扇贝式详情界面，含选择释义 + 三段评价两种子模式。

- **双 useEffect**（依赖 `word?.id`）：
  - 调 `lookupECDICT(word.word)` 拉取补充释义/词形/标签
  - 调 `translateSentences(word.examples)` 翻译例句
- **quiz 模式**：`useEffect` 生成选项（正确释义 + 随机 3 个其他词释义，乱序）。优先用 ECDICT 释义，回退本地。
- **键盘快捷键**：
  - quiz 未出结果时：`1-4` 选择答案
  - 通用：`←/a` 上一个，`→/d` 下一个，`1/2/3` 评价，`Enter` 发音，`Tab` 切换 quiz/rate
- **展示**：词形变化（exchange 标签映射 p/d/i/3/s/r/t/f）、考试标签（zk/gk/cet4/.../bec）、Collins 星级、牛津 3000、BNC 排名。
- **例句**：通过 `<InteractiveSentence>` 渲染（高亮当前词）。
- `handleRate`：评分后 250ms 自动 `nextWord()`。
- 内部组件：`SpeakerIcon`。

### 7.4 `PhonicsDisplay/index.tsx` — 拼读可视化

**职责**：将 `PhonicsBreakdown` 渲染为可交互组件。

```typescript
interface PhonicsDisplayProps {
  word: string;
  compact?: boolean;  // 默认 false
}
```

- `useEffect([word])` 调 `analyzeWord(word)` 异步获取 breakdown。
- **compact 模式**：单行显示音节（重读音节加粗）+ 发音按钮。
- **完整模式**：
  - 大号音节展示，点击单音节 `speakWord(syl)`
  - "播放发音"按钮 `speakWord(word)`
  - 音素网格：点击 `speakPhoneme(p.ipa)`，显示 grapheme + IPA，颜色按 `p.color`
  - 重读音节标记
  - 颜色图例：辅音蓝/元音红/组合紫/R控青
- 纯展示组件，无 Store 交互。

### 7.5 `InteractiveSentence/index.tsx` — 交互例句

**职责**：将英文句子拆分为 token，单词可悬停查翻译、可点击跳转词条。

```typescript
interface InteractiveSentenceProps {
  sentence: string;
  highlightWord?: string;
}
```

- `tokenize(sentence)`：按字母/撇号分词，保留标点和空格为独立 token。
- `handleMouseEnter(word, e)`：计算位置，调 `lookupWordTranslation(cleanWord)` 异步取翻译。
- `handleClick(word)`：在 `words` 中查找匹配词，命中则 `setCurrentIndex(idx)` + `setViewMode('detail')`。
- 高亮：`highlightWord` 匹配的 token 显示蓝色加粗背景。
- Tooltip 通过 `createPortal` 渲染到 `document.body`（避免 `<p>` 内嵌 `<div>` 的 HTML 嵌套违规）。

### 7.6 `StatsPanel/index.tsx` — 统计面板

**职责**：五个区块的学习统计可视化。

- 从 `useStatStore` 取 `dailyGoal, dailyStats, streak, todayProgress, memoryDistribution, isLoading, loadAll`。
- 从 `useStudyStore` 取 `getStats()`（总词数）。
- `useEffect` 挂载调 `loadAll()`。
- `trendRange: 7 | 30` 趋势图范围切换。
- **区块**：
  1. 今日进度 — 双环形进度图（新词 N/M · 复习 N/M）+ 连续打卡 + 正确率/学习时长
  2. 学习日历 — 90 天 CSS grid 热力图（5 级蓝色渐变）
  3. 学习趋势 — Recharts 折线图（7天/30天切换）
  4. 记忆强度分布 — Recharts 环形饼图 + 水平条形图
  5. 累计数据 — 总词数/总复习次数/总学习时长
- 内部组件：`RingProgress`（SVG 环形进度）、`CalendarHeatmap`。

### 7.7 `DataManager/index.tsx` — 数据管理

**职责**：导出/导入/清空数据 UI。

- **导出**：格式选择（JSON/CSV）+ 范围选择（全部/按词库）+ 导出按钮。调 `exportAll(format)` 或 `exportByDeck(deckId, format)`。
- **导入**：拖拽上传 + 文件选择 + 预览 + 确认。调 `importData(file)`，成功后调 `init()` 刷新。
- **危险区域**：清空数据（红色警示 + 二次确认），调 `clearAllData()` 再 `init()`。
- 内部组件：`FormatButton`、`ScopeButton`。

---

## 八、入口与配置

### 8.1 `src/main.tsx` — 应用入口

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);
```

### 8.2 `src/App.tsx` — 根组件

- `useEffect` 调 `init()` 初始化数据。
- `useEffect` 同步 `dark` class 到 `document.documentElement`（基于 `resolvedTheme`）。
- `useEffect` 监听系统主题变化（当 `theme === 'system'` 时跟随）。
- 未初始化时显示加载占位（跳动书本图标 + "正在加载词库..."）。
- 根据 `viewMode` 渲染：`list` → `<WordList />`、`detail` → `<WordDetail />`、`stats` → `<StatsPanel />`、`settings` → `<DataManager />`。
- 底部固定快捷键提示栏（J/K 导航 · 1/2/3 评价 · Space 释义 · Enter 发音 · Tab 切换模式）。

### 8.3 `src/index.css` — 全局样式

- **Tailwind v4 CSS-first 配置**：`@import "tailwindcss";` + `@theme {}` 块（无需 `tailwind.config.js`）。
- **暗色模式策略**：`@custom-variant dark (&:where(.dark, .dark *));`（基于 class）。
- **自定义主题色板**：`--color-primary: #2563EB`、`--color-vowel: #DC2626`、双套背景/表面/文字/边框色。
- **字体**：`-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue'`（macOS 风格）+ `-webkit-font-smoothing`。
- **组件层**：
  - `.glass` / `.glass-dark`：macOS 毛玻璃效果（`backdrop-filter: blur(20px) saturate(180%)`）
  - `.phonics-consonant/vowel/blend/digraph/r-controlled/silent`：音素颜色编码
  - `.word-row` 悬停高亮、`.rating-btn` 弹性动画、`.kbd` 键盘提示样式
- **关键帧动画**：`flyOut`（卡片飞出）、`slideIn`（从左滑入）。

### 8.4 `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': '/src' } },
});
```

### 8.5 `tsconfig.app.json` 关键配置

- `target: "ES2023"`、`module: "esnext"`、`moduleResolution: "bundler"`
- `jsx: "react-jsx"`（React 17+ 自动 runtime）
- `verbatimModuleSyntax: true`（强制显式 `import type`）
- `erasableSyntaxOnly: true`（TS 5.8+ 新选项）
- `noUnusedLocals/noUnusedParameters/noFallthroughCasesInSwitch: true`
- `noEmit: true`（Vite 负责打包）

### 8.6 `eslint.config.js`

ESLint flat config：`js.configs.recommended` + `tseslint.configs.recommended` + React Hooks + react-refresh/vite，`globals.browser`。

---

## 九、TTS 后端服务 (`tts-service/`)

**位置**：`wordcontext/tts-service/`（Python，与前端同仓）

### 9.1 服务概览

- **框架**：FastAPI + Uvicorn（ASGI）
- **TTS 引擎**：[Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M)（Apache 2.0，82M 参数，327MB，TTS Arena 排行榜第一）
- **端口**：`8765`，监听 `0.0.0.0`
- **采样率**：24000 Hz
- **CORS**：`allow_origins=["*"]`（支持凭据，允许所有方法和请求头）
- **运行方式**：本地离线，无需网络，无字符限制

### 9.2 API 端点

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | `/` | 服务信息与使用指南 |
| GET | `/health` | 健康检查 `{"status":"healthy","model":"Kokoro-82M"}` |
| GET | `/syllable-count/{word}` | CMU 词典音节数查询（依赖 `pronouncing` 库） |
| GET | `/ecdict/{word}` | ECDICT 单词详细释义（phonetic/definitions/pos/collins/oxford/tags/bnc/frq/exchange） |
| GET | `/ecdict/{word}/translate?sentence=...` | 单词简短中文翻译（例句悬停用） |
| POST | `/ecdict/translate-sentences` | 批量翻译例句（优先 `argostranslate`，未安装回退 ECDICT 逐词） |
| GET | `/voices` | 列出 9 种可用语音（按性别/口音分组） |
| POST | `/tts` | **标准 TTS**：返回 `{b64_audio, format, sample_rate}` |
| POST | `/tts/stream` | **流式 TTS**：直接返回 MP3 二进制流 |
| POST | `/tts/batch` | **批量 TTS**（最多 50 条） |
| POST | `/v1/audio/speech` | **OpenAI 兼容接口** |
| GET | `/v1/models` | OpenAI 模型列表（返回 `kokoro-82M`） |

### 9.3 请求模型

```python
class TTSRequest(BaseModel):
    input: str
    voice: Optional[str] = "af_heart"   # 默认美式女声
    speed: Optional[float] = 0.9
    response_format: Optional[str] = "mp3"
    model: Optional[str] = "kokoro"

class BatchTTSRequest(BaseModel):
    texts: List[str]
    voice: Optional[str] = "af_heart"
    speed: Optional[float] = 0.9
```

### 9.4 可用语音（9 种）

- **美式女声**：`af_heart`（学习首选）、`af_sky`、`af_bella`
- **美式男声**：`am_adam`、`am_michael`
- **英式女声**：`bf_emma`、`bf_lisa`
- **英式男声**：`bm_george`、`bm_finlay`

### 9.5 核心实现

- **KPipeline 缓存**：`get_pipeline(lang_code)` 按语言代码延迟初始化并缓存（`_pipeline_am` 美式、`_pipeline_bf` 英式）。
- **合成**：`synthesize(text, voice, speed)` 返回 `(numpy_array, sample_rate)`；`synthesize_to_base64()` 归一化到 `[-1, 1]` 后用 `soundfile` 写内存 MP3 再 base64。
- **ECDICT 集成**：`stardict.db`（SQLite），`sqlite3.Row` 行工厂；每次请求新建连接（`check_same_thread=False`）用完即关；释义按词性前缀正则拆分；exchange 字段按 `/` 和 `:` 分割为词形变化字典。
- **批量翻译**：优先 `argostranslate`（神经机器翻译），未安装则 `try/except ImportError` 回退 ECDICT 逐词翻译。

### 9.6 Python 依赖 (`requirements.txt`)

要求 Python 3.10+：

| 依赖 | 版本 | 用途 |
|------|------|------|
| `kokoro` | `==0.9.4` | Kokoro TTS 引擎 |
| `soundfile` | `>=0.12.0` | 音频读写 |
| `fastapi` | `>=0.100.0` | Web 框架 |
| `uvicorn` | `>=0.23.0` | ASGI 服务器 |
| `torch` | `>=2.0.0` | 深度学习后端 |
| `spacy` | `>=3.8.0` | 英文 NLP |
| `pronouncing` | `>=2.0.0` | CMU 词典音节查询 |
| `en-core-web-sm` | `3.8.0` | spaCy 英文小模型 |

> `argostranslate` 在代码中被引用但未声明于 requirements.txt，运行时优雅降级。

### 9.7 启动脚本

- **`start.sh`**：激活 `venv`，运行 `python app.py`。
- **`start-tts.sh`**：一键启动 TTS + 前端。
  1. `curl /health` 检测 TTS 是否已运行，未运行则 `nohup python app.py > tts.log 2>&1 &` 后台启动，PID 写入 `tts.pid`。
  2. 切到 `wordcontext/` 运行 `npm run dev`，PID 写入 `.frontend.pid`。
  3. 输出访问地址，提示停止命令 `kill $(cat tts.pid) $(cat .frontend.pid)`。

### 9.8 与前端的集成

- 前端 `src/lib/kokoro/` 与 `src/lib/ecdict/` 共享 `http://localhost:8765` 后端。
- 跨域：后端 `allow_origins=["*"]`，前端 `localhost:5173` 跨域调用。
- **降级策略**：TTS 服务不可用时，`kokoro` 回退 Web Speech API，`ecdict` 静默返回空值。
- 集成进度详见 `wordcontext/docs/kokoro/INTEGRATION-v1.1.0.md`。

---

## 十、数据模型

### 10.1 ER 关系

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    Deck      │       │    Word      │       │    Card      │
│  (词书)       │       │  (单词)       │       │  (学习卡片)   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │◄──┐   │ id (PK)      │◄──────│ id (PK=wordId)│
│ name         │   │   │ word         │  1:1  │ deckId (FK)  │
│ description  │   │   │ phonetic     │       │ fsrs.due     │
│ wordCount    │   │   │ definitions  │       │ fsrs.stability│
│ tags[]       │   │   │ examples[]   │       │ fsrs.state   │
│ bookMatch    │   │   │ etymology    │       │ rating       │
│ wordIds[]    │   │   │ wordFamily[] │       │ lastReview   │
└──────────────┘   │   │ mnemonic     │       └──────────────┘
                   │   │ tags[]       │
                   │   └──────────────┘
                   │          │ 1:N
                   │          ▼
                   │   ┌──────────────┐       ┌──────────────┐
                   │   │ StudyLog     │       │  Settings    │
                   │   │ (学习日志)    │       │  (用户设置)   │
                   │   ├──────────────┤       ├──────────────┤
                   │   │ id (PK auto) │       │ id (PK)      │
                   │   │ date         │       │ fsrsParameters│
                   │   │ wordId (FK)  │       │ lastTrainedAt│
                   │   │ rating       │       │ reviewCount  │
                   │   │ state        │       └──────────────┘
                   │   │ elapsed_days │
                   │   │ scheduled_days│
                   │   │ review_duration│
                   │   │ timeSpent    │
                   │   └──────────────┘
                   │
                   └── Deck.wordIds[] → Word.id（逻辑关联）
```

### 10.2 FSRS 卡片状态枚举（`ts-fsrs` State）

| 值 | 状态 | 说明 |
|----|------|------|
| 0 | New | 新词，未学过 |
| 1 | Learning | 学习中 |
| 2 | Review | 复习中 |
| 3 | Relearning | 重新学习 |

### 10.3 评分枚举（`ts-fsrs` Rating）

| 值 | 评分 | 对应 ReviewRating |
|----|------|-------------------|
| 1 | Again | `'again'` |
| 2 | Hard | `'hard'` |
| 3 | Good | `'good'` |
| 4 | Easy | `'easy'` |

---

## 十一、依赖关系

### 11.1 模块间依赖图

```
                     ┌──────────────┐
                     │   phonics    │
                     └──┬─────┬─────┘
              动态import │     │ 动态import
                        ▼     ▼
                  ┌───────────┐  ┌──────────┐
                  │pronunciation│ │  kokoro  │
                  └─────┬─────┘  └──────────┘
                        │ 静态
                        ▼
                     ┌──────────┐
                     │  kokoro  │
                     └──────────┘

  ┌────────┐  type   ▲
  │  fsrs  │◄────────┤  (io 导入 newCard)
  └─┬──┬───┘         │
    │  │             ┌──┴──┐
    │  └────────────▶│ io  │
    │                └──┬──┘
    ▼                   │
  ┌────────┐            │
  │   db   │◄───────────┘  (io 读写 db)
  └────────┘

  ┌────────┐  独立     ┌──────────┐
  │ ecdict │           │ kokoro   │ (与 ecdict 共用 8765 端口)
  └────────┘           └──────────┘
```

**关键设计要点：**

1. **类型循环依赖处理**：`db` ↔ `fsrs` 通过 `import type` 切断运行时环（`db` 导入 `FSRSCard` 类型，`fsrs` 导入 `db` 实例）。
2. **动态 import 解环**：`phonics` → `pronunciation`/`kokoro` 用动态 import 避免循环依赖。
3. **统一发音入口**：UI 应调 `pronunciation.speakWord`（真人优先），自然拼读音素才直接调 `kokoro.speakPhoneme`。
4. **本地服务依赖**：`kokoro` 与 `ecdict` 共用 `http://localhost:8765` 后端，健康检查机制相似但各自独立缓存。
5. **Store 间接联动**：`useStatStore` 不直接调用 `useStudyStore`，通过共享 `db.studyLogs`（`rateWord` 写入）被动消费。

### 11.2 生产依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `react` | ^19.2.6 | UI 框架 |
| `react-dom` | ^19.2.6 | React DOM 渲染 |
| `ts-fsrs` | ^5.4.1 | FSRS 间隔重复算法 |
| `dexie` | ^4.4.3 | IndexedDB 封装 |
| `zustand` | ^5.0.14 | 状态管理 |
| `cmu-pronouncing-dictionary` | ^3.0.0 | CMU 发音词典（懒加载） |
| `howler` | ^2.2.4 | 音频播放（预留） |
| `recharts` | ^3.8.1 | 声明式图表库 |

### 11.3 开发依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `typescript` | ~6.0.2 | 类型检查 |
| `vite` | ^8.0.12 | 构建工具 |
| `@vitejs/plugin-react` | ^6.0.1 | React 支持 |
| `tailwindcss` | ^4.3.0 | CSS 框架 |
| `@tailwindcss/vite` | ^4.3.0 | Tailwind Vite 插件 |
| `eslint` | ^10.3.0 | 代码检查 |
| `typescript-eslint` | ^8.59.2 | TS ESLint 规则 |
| `eslint-plugin-react-hooks` | ^7.1.1 | React Hooks 规则 |
| `eslint-plugin-react-refresh` | ^0.5.2 | react-refresh 规则 |
| `@types/node` | ^24.12.3 | Node 类型 |
| `@types/react` | ^19.2.14 | React 类型 |
| `@types/react-dom` | ^19.2.3 | React DOM 类型 |
| `globals` | ^17.6.0 | 全局变量定义 |

### 11.4 Python 依赖

见 [9.6 Python 依赖](#96-python-依赖-requirementstxt)。

---

## 十二、项目运行方式

### 12.1 环境要求

| 环境 | 最低版本 | 推荐版本 |
|------|---------|---------|
| Node.js | 18.0.0 | 20.x LTS |
| npm | 9.0.0 | 10.x |
| Python（可选，TTS 服务） | 3.10 | 3.11+ |
| 浏览器 | Chrome 90+ / Safari 15+ / Firefox 90+ | 最新稳定版 |

### 12.2 前端开发

```bash
cd wordcontext
npm install      # 安装依赖
npm run dev      # 启动开发服务器 → http://localhost:5173
```

**脚本说明：**

| 命令 | 作用 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器（HMR） |
| `npm run build` | `tsc -b && vite build`，类型检查 + 构建 |
| `npm run lint` | ESLint 检查 |
| `npm run preview` | 预览构建产物 → http://localhost:4173 |

### 12.3 TTS 服务（可选，提升发音质量）

```bash
cd wordcontext/tts-service

# 首次：创建虚拟环境并安装依赖
python -m venv venv
source venv/bin/activate            # macOS/Linux
# venv\Scripts\activate             # Windows
pip install -r requirements.txt

# 启动 TTS 服务
./start.sh                          # 仅 TTS → http://localhost:8765
# 或一键启动 TTS + 前端
./start-tts.sh                      # TTS 8765 + 前端 5173
```

**首次启动说明**：Kokoro 模型（`kokoro-v1_0.pth`，327MB）会自动下载到 `~/.cache/kokoro/`，spaCy 英文模型 `en-core-web-sm`（12.8MB）按 requirements.txt 中 URL 安装。

**未启动 TTS 时的行为**：前端 `kokoro` 模块回退到浏览器 Web Speech API，`ecdict` 模块静默返回空值，应用核心功能不受影响。

### 12.4 数据存储位置

- **前端数据**：浏览器 IndexedDB（数据库名 `wordcontext`），域名级隔离，清除浏览器数据会丢失。可通过 DataManager 组件导出备份。
- **TTS 模型缓存**：`~/.cache/kokoro/`。
- **用户偏好**：`localStorage`（`kokoro_voice`、`kokoro_speed`、`wordcontext.pronunciation.provider` 等）。

### 12.5 快捷键速查

| 快捷键 | 作用 | 适用模式 |
|--------|------|---------|
| `J` / `↓` | 下一个单词 | 全局 |
| `K` / `↑` | 上一个单词 | 全局 |
| `1` / `2` / `3` | 评价（easy/good/again） | 速刷 / 沉浸(rate) |
| `1`-`4` | 选择答案 | 沉浸(quiz 未出结果时) |
| `Space` | 切换音标显隐 | 速刷 |
| `Enter` | 播放发音 | 全局 |
| `Tab` | 切换 quiz/rate 子模式 | 沉浸 |
| `←` / `A` | 上一个 | 沉浸 |
| `→` / `D` | 下一个 | 沉浸 |

> 快捷键在输入框聚焦时不生效（避免冲突）。

---

## 十三、构建与部署

### 13.1 生产构建

```bash
cd wordcontext
npm run build      # 产物在 wordcontext/dist/
npm run preview    # 本地预览 → http://localhost:4173
```

**构建产物：**

```
dist/
├── index.html
└── assets/
    ├── index-*.css                          # 主样式
    ├── index-*.js                           # 主 JS
    └── cmu-pronouncing-dictionary-*.js      # CMU 词典 chunk（懒加载）
```

### 13.2 静态部署

`dist/` 目录可部署到任意静态服务器（Nginx / Caddy / Vercel / Netlify / Cloudflare Pages）。

**Nginx 配置示例：**

```nginx
server {
    listen 80;
    server_name wordcontext.example.com;
    root /var/www/wordcontext/dist;
    index index.html;

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源长期缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # CMU 词典 chunk 长期缓存
    location ~* cmu-pronouncing-dictionary {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 13.3 GitHub Pages 自动部署

**CI 配置**：`.github/workflows/deploy.yml`

- **触发**：`push` 到 `main` 分支 或 `workflow_dispatch` 手动触发。
- **权限**：`contents: read`、`pages: write`、`id-token: write`。
- **并发**：`group: "pages"`，`cancel-in-progress: false`。
- **Job `build`**：checkout → setup Node 20（npm 缓存）→ `cd wordcontext && npm ci` → `npm run build`（`CI: true`）→ 上传 `wordcontext/dist` 为 Pages 产物。
- **Job `deploy`**：部署到 GitHub Pages，输出页面 URL。

> **注意**：CI 只部署**前端**，不部署 Python TTS 服务。线上环境的发音功能依赖 fallback 机制回退到 Web Speech API。

### 13.4 Docker 部署（前端）

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx vite build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t wordcontext .
docker run -p 8080:80 wordcontext   # → http://localhost:8080
```

---

*本文档基于代码实际状态生成，与 `docs/project/v1.1.0/PROJECT.md` 相比补充了 ECDICT 词典、Kokoro TTS、多 Provider 发音、交互式例句、Python TTS 服务等后续演进模块。*
