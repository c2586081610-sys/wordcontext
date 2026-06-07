> **📌 本文档已有版本化存档，最新版本请查看：[docs/project/v1.1.0/PROJECT.md](docs/project/v1.1.0/PROJECT.md)**
> 所有文档索引：[docs/INDEX.md](docs/INDEX.md)

# 词境 (WordContext) — 项目全景文档

> 版本：v1.0.0 | 日期：2026-06-07
> 技术栈：React 18 + TypeScript + Vite + Tailwind CSS v4 + ts-fsrs + Dexie.js

---

## 一、项目灵感

### 1.1 为什么做这个？

**背单词市场的核心痛点：**

| # | 痛点 | 现状 | 词境的解法 |
|---|------|------|-----------|
| 1 | 算法不科学 | 炭炭用固定艾宾浩斯曲线，所有人一样 | FSRS 个性化调度，比 SM-2 高效 20-40% |
| 2 | 不会发音 | 多数 APP 只有整词播放，不知道怎么拆读 | 自然拼读可视化拆解，逐音节/逐音素播放 |
| 3 | 脱离语境 | 背了单词不知道怎么用 | 第二阶段：视频/文件语境学习 |
| 4 | 功能割裂 | 炭炭极简但没语境，DejaVocab 有语境但没词库 | 取两者之长，融合为一体 |
| 5 | 平台受限 | 炭炭无 Web 端，DejaVocab 国内受限 | Web-first，浏览器即用 |
| 6 | 数据被锁 | 多数 APP 不让导出，换设备丢数据 | IndexedDB 本地存储，自由导入导出 |

**一句话定位：**
> 炭炭的简洁高效 + DejaVocab 的语境思维 + FSRS 的科学算法 + Web-first 的跨平台

### 1.2 设计哲学

```
① 打开就背 — 零学习成本，不需要理解"语料库"概念
② 科学记忆 — FSRS 算法个性化调度，不浪费时间在已会的词上
③ 会读才会背 — 自然拼读可视化，让你看到单词怎么拆、怎么读
④ 键盘优先 — 所有操作都有快捷键，效率为王
⑤ 数据归你 — 本地存储，零服务器依赖，数据可自由导出
```

### 1.3 技术选型理由

| 选择 | 原因 | 备选方案 | 为什么不用备选 |
|------|------|----------|---------------|
| React 18 | 生态成熟，组件化开发效率高 | Vue 3 | 团队更熟悉 React，shadcn/ui 生态更好 |
| TypeScript | 类型安全，减少运行时错误 | JavaScript | 项目规模大，TS 能显著降低维护成本 |
| Vite | 极速 HMR，ESM 原生支持 | Webpack | Vite 开发体验远超 Webpack，构建速度 10x |
| Tailwind CSS v4 | 原子化 CSS，零运行时，Vite 深度集成 | CSS Modules | Tailwind 开发效率更高，设计一致性更好 |
| Zustand | 轻量（1KB），无 boilerplate | Redux Toolkit | Zustand 对小项目更友好，API 简洁 |
| Dexie.js | IndexedDB 的最佳封装，支持索引/事务 | raw IndexedDB | 原生 API 太难用，Dexie 代码量减少 80% |
| ts-fsrs | FSRS 算法的 TS 实现，MIT 开源，活跃维护 | SM-2 (Anki) | FSRS 比 SM-2 高效 20-40%，有学术论文背书 |
| CMU Dict | 公有领域，13.4万词，机器可读 | eSpeak 生成 | CMU Dict 覆盖面广，数据质量高，直接 npm 安装 |
| Web Speech API | 浏览器内置，零成本，支持多语言 | Howler.js + 预录音频 | 无需存储音频文件，零带宽成本 |

---

## 二、项目结构总览

```
词境/
├── 产品设计方案.md                    # 产品需求文档（PRD）
├── 市场调研报告.md                    # 10 款竞品分析
├── PROJECT.md                        # ★ 本文件，项目全景文档
│
└── wordcontext/                      # ★ 前端项目根目录
    ├── index.html                    # 入口 HTML
    ├── package.json                  # 依赖声明
    ├── vite.config.ts                # ★ Vite 构建配置
    ├── tsconfig.json                 # TypeScript 根配置
    ├── tsconfig.app.json             # ★ 应用 TS 配置
    ├── tsconfig.node.json            # Node 环境 TS 配置
    ├── eslint.config.js              # ESLint 配置
    │
    ├── public/
    │   ├── favicon.svg               # 网站图标
    │   └── icons.svg                 # SVG 图标集
    │
    ├── src/
    │   ├── main.tsx                  # ★ 应用入口
    │   ├── App.tsx                   # ★ 根组件，路由 + 布局
    │   ├── index.css                 # ★ 全局样式 + Tailwind 配置
    │   │
    │   ├── lib/                      # ★ 核心算法层
    │   │   ├── phonics/              # ★ 自然拼读引擎
    │   │   │   ├── types.ts          # 类型定义
    │   │   │   ├── rules.ts          # 拼读规则 + 颜色映射
    │   │   │   ├── engine.ts         # ★ 核心引擎（CMU 集成 + 音节划分）
    │   │   │   └── index.ts          # 统一导出
    │   │   │
    │   │   ├── fsrs/                 # ★ FSRS 间隔重复
    │   │   │   └── index.ts          # FSRS 封装（调度 + 状态计算）
    │   │   │
    │   │   └── db/                   # ★ 数据持久层
    │   │       ├── index.ts          # Dexie 数据库定义
    │   │       └── sampleData.ts     # 示例词库（CET4 前 20 词）
    │   │
    │   ├── stores/                   # 状态管理
    │   │   └── useStudyStore.ts      # ★ Zustand 学习状态（核心 Store）
    │   │
    │   ├── components/               # UI 组件
    │   │   ├── Header/               # 顶部导航栏
    │   │   │   └── index.tsx
    │   │   ├── WordList/             # ★ 列表速刷模式
    │   │   │   └── index.tsx
    │   │   ├── WordDetail/           # ★ 沉浸详情模式
    │   │   │   └── index.tsx
    │   │   └── PhonicsDisplay/       # ★ 自然拼读可视化
    │   │       └── index.tsx
    │   │
    │   ├── pages/                    # 页面（预留，MVP 阶段未使用）
    │   └── assets/                   # 静态资源
    │
    └── dist/                         # 构建产物
        ├── index.html
        └── assets/
            ├── index-*.css           # 24.7KB (gzip 5.8KB)
            ├── index-*.js            # 344KB (gzip 109KB)
            └── cmu-pronouncing-dictionary-*.js  # 3.9MB (gzip 986KB，懒加载)
```

**核心文件标记（★）说明：** 这些文件是理解项目的关键入口，优先阅读。

---

## 三、每个文件深度解析

### 3.1 核心算法层 (`src/lib/`)

#### 3.1.1 `lib/phonics/engine.ts` ★ 自然拼读引擎

**职责：** 将英文单词拆解为音节和音素，生成可视化数据，驱动发音播放。

**执行流程：**
```
analyzeWord(word)
    │
    ├─ 1. 加载 CMU 词典（懒加载，首次 4MB）
    │
    ├─ 2. 查询 CMU 获取 ARPAbet 音素序列
    │     "abandon" → "AH0 B AE1 N D AH0 N"
    │
    ├─ 3. ARPAbet → IPA 转换
    │     "AH0" → "/ə/", "B" → "/b/", "AE1" → "/æ/"
    │
    ├─ 4. 音节划分（最大首音原则）
    │     "abandon" → ["a", "ban", "don"]
    │
    ├─ 5. 重读音节定位
    │     AE1 带重音标记 → 第 2 音节 "ban" 为重读
    │
    └─ 6. 组装 PhonicsBreakdown 返回
```

**导出函数列表：**

| 分类 | 函数 | 说明 |
|------|------|------|
| 核心 | `analyzeWord(word: string): Promise<PhonicsBreakdown>` | 完整自然拼读分析，返回音节/音素/重读信息 |
| 辅助 | `getSyllableDetails(word: string): Promise<SyllableInfo[]>` | 获取音节详细信息 |
| 发音 | `speakWord(word: string, lang?: string): void` | Web Speech API 播放整词发音 |
| 发音 | `speakPhoneme(ipa: string, lang?: string): void` | 播放单个音素 |

**设计决策：**
- **为什么用 CMU 词典而不是 eSpeak 实时生成？** CMU 是预编译好的 13.4 万词数据，查询速度 O(1)；eSpeak 需要运行时计算，延迟高且结果不如人工校准的 CMU 准确。
- **为什么懒加载？** CMU 词典 JSON 有 3.9MB，首屏不需要。用 `import()` 动态导入，Vite 自动 code-split 为独立 chunk。
- **为什么用最大首音原则划分音节？** 这是语言学标准算法，对英语准确率最高。`abandon` → `a·ban·don` 而不是 `ab·an·don`。

---

#### 3.1.2 `lib/phonics/rules.ts` — 拼读规则

**职责：** 定义音素类型映射、颜色编码、ARPAbet→IPA 转换表。

**关键数据结构：**

```typescript
// 颜色编码系统
const PHONEME_COLORS = {
  consonant: '#2563EB',      // 蓝色 — 辅音
  vowel: '#DC2626',          // 红色 — 元音
  blend: '#7C3AED',          // 紫色 — 辅音组合 (bl, str)
  digraph: '#7C3AED',        // 紫色 — 辅音二合字 (sh, ch, th)
  'r-controlled': '#0D9488', // 青色 — R 控元音 (ar, er, ir)
  silent: '#94A3B8',         // 灰色 — 静音字母
};

// ARPAbet → IPA 完整映射（39 个音素）
const ARPABET_TO_IPA = {
  'AA': '/ɑ/', 'AE': '/æ/', 'AH': '/ʌ/', 'AO': '/ɔ/',
  'AW': '/aʊ/', 'AX': '/ə/', 'AY': '/aɪ/', 'EH': '/ɛ/',
  'ER': '/ɝ/', 'EY': '/eɪ/', 'IH': '/ɪ/', 'IY': '/iː/',
  'OW': '/oʊ/', 'OY': '/ɔɪ/', 'UH': '/ʊ/', 'UW': '/uː/',
  'B': '/b/', 'CH': '/tʃ/', 'D': '/d/', 'DH': '/ð/',
  'F': '/f/', 'G': '/ɡ/', 'HH': '/h/', 'JH': '/dʒ/',
  'K': '/k/', 'L': '/l/', 'M': '/m/', 'N': '/n/',
  'NG': '/ŋ/', 'P': '/p/', 'R': '/r/', 'S': '/s/',
  'SH': '/ʃ/', 'T': '/t/', 'TH': '/θ/', 'V': '/v/',
  'W': '/w/', 'Y': '/j/', 'Z': '/z/', 'ZH': '/ʒ/',
};
```

---

#### 3.1.3 `lib/phonics/types.ts` — 类型定义

```typescript
type PhonemeType = 'consonant' | 'vowel' | 'blend' | 'digraph' | 'r-controlled' | 'silent';

type Phoneme = {
  grapheme: string;   // 对应的字母 "ban"
  ipa: string;        // IPA 音标 "/bæn/"
  arpabet: string;    // CMU ARPAbet "B AE1 N"
  type: PhonemeType;  // 音素类型
  color: string;      // 显示颜色
};

type PhonicsBreakdown = {
  word: string;           // 原词
  syllables: string[];    // 音节列表 ["a", "ban", "don"]
  phonemes: Phoneme[];    // 音素数组
  stressIndex: number;    // 重读音节索引
  silentLetters: number[];// 静音字母位置
};
```

---

#### 3.1.4 `lib/fsrs/index.ts` ★ FSRS 间隔重复

**职责：** 封装 ts-fsrs 库，提供卡片创建、复习调度、状态查询。

**导出函数列表：**

| 分类 | 函数 | 说明 |
|------|------|------|
| 创建 | `newCard(): FSRSCard` | 创建空白 FSRS 卡片（state=New） |
| 调度 | `scheduleReview(card, rating): FSRSCard` | 用户评价后计算下次复习时间 |
| 查询 | `getStateLabel(state: number): string` | 卡片状态中文名（新词/学习中/复习/重新学习） |
| 查询 | `getDueLabel(card: FSRSCard): string` | 下次复习时间的可读描述（"30 分钟后"） |
| 查询 | `getMemoryStrength(card: FSRSCard): number` | 记忆强度百分比 0-100 |

**三种评价与 FSRS 映射：**

```
用户操作          FSRS 评分      效果
─────────────────────────────────────────────
😊 熟悉 (easy)  → Rating.Easy  → stability 大幅增加，间隔显著延长
😐 模糊 (good)  → Rating.Good  → stability 适度增加，间隔正常延长
😣 忘记 (again) → Rating.Again → stability 重置，短期重新复习
```

**记忆强度计算公式：**
```
strength = min(100, round(stability / (stability + 10) * 100))

示例：
  stability=0   → 0%   （新词）
  stability=5   → 33%  （刚学）
  stability=10  → 50%  （中等）
  stability=30  → 75%  （较牢）
  stability=100 → 91%  （很牢）
```

---

#### 3.1.5 `lib/db/index.ts` ★ 数据持久层

**职责：** 定义 IndexedDB 数据库结构（Dexie.js），4 张表。

**数据表：**

| 表名 | 主键 | 索引 | 说明 |
|------|------|------|------|
| `words` | `id` | `word`, `*tags` | 单词条目（词义/音标/词根/助记） |
| `cards` | `id` | `deckId`, `fsrs.due`, `fsrs.state` | FSRS 学习卡片状态 |
| `decks` | `id` | `name`, `*tags` | 词书/词库 |
| `studyLogs` | `++id` | `date`, `wordId` | 学习日志（每次评价记录） |

**索引策略：**
- `cards.fsrs.due` — 查询"今天需要复习的词"时 O(log n)
- `cards.fsrs.state` — 按学习状态筛选（新词/学习中/复习）
- `words.*tags` — 多值索引，支持按标签（CET4/考研）筛选
- `studyLogs.date` — 按日期聚合学习统计

---

#### 3.1.6 `lib/db/sampleData.ts` — 示例词库

**职责：** 提供 20 个 CET4 核心词汇作为初始数据，含完整字段。

**数据结构示例（单个词条）：**

```json
{
  "id": "w001",
  "word": "abandon",
  "phonetic": "/əˈbændən/",
  "definitions": [
    { "pos": "v.", "meaning": "放弃；抛弃；遗弃" },
    { "pos": "n.", "meaning": "放肆；放纵" }
  ],
  "examples": [
    "He abandoned his wife and children.",
    "They abandoned the car in the snow."
  ],
  "etymology": "ab-(离开) + don(给予) → 离开并给予 → 放弃",
  "wordFamily": ["abandon", "abandoned", "abandoning", "abandonment"],
  "mnemonic": "a-band-on → 一个乐队解散了 → 放弃",
  "tags": ["CET4", "考研"]
}
```

---

### 3.2 状态管理层 (`src/stores/`)

#### 3.2.1 `stores/useStudyStore.ts` ★ 学习状态 Store

**职责：** 全局状态管理，连接数据层（Dexie）和 UI 层（组件），管理学习流程。

**核心功能模块：**

| 模块 | 功能 | 关键函数 |
|------|------|----------|
| 初始化 | 从 IndexedDB 加载数据，创建缺失的 FSRS 卡片 | `init()` |
| 模式切换 | 列表速刷 ↔ 沉浸详情 | `setViewMode(mode)` |
| 导航 | 单词列表上下切换 | `nextWord()`, `prevWord()`, `setCurrentIndex(i)` |
| 评价 | FSRS 调度 + 持久化 + 日志记录 | `rateWord(wordId, rating)` |
| 查询 | 当前单词/卡片/统计 | `getCurrentWord()`, `getCurrentCard()`, `getStats()` |
| 筛选 | 待复习/新词列表 | `getDueWords()`, `getNewWords()` |

**状态结构：**

```typescript
{
  words: WordEntry[],              // 所有单词
  cards: Map<string, CardEntry>,   // wordId → FSRS 卡片
  currentDeckId: string,           // 当前词书
  viewMode: 'list' | 'detail',     // 视图模式
  detailSubMode: 'quiz' | 'rate',  // 沉浸模式子模式
  currentIndex: number,            // 当前词索引
  showPhonetic: boolean,           // 是否显示音标
  isInitialized: boolean,          // 是否已初始化
}
```

**rateWord 流程：**
```
rateWord(wordId, rating)
    │
    ├─ 1. 从 cards Map 取出当前 FSRS 卡片
    │
    ├─ 2. 调用 scheduleReview(card, rating) 计算新的 FSRS 状态
    │
    ├─ 3. 更新 cards Map（内存）
    │
    ├─ 4. 持久化到 IndexedDB（db.cards.update）
    │
    └─ 5. 写入学习日志（db.studyLogs.add）
```

---

### 3.3 UI 组件层 (`src/components/`)

#### 3.3.1 `components/Header/index.tsx` — 顶部导航

**职责：** 显示应用名称、学习统计、模式切换按钮。

**页面结构：**
```
┌─────────────────────────────────────────────────────┐
│  词境 WordContext          20词  新词20  学习0  复习0  │
│                               [速刷] [沉浸]          │
└─────────────────────────────────────────────────────┘
```

---

#### 3.3.2 `components/WordList/index.tsx` ★ 列表速刷模式

**职责：** 炭炭式速刷界面，一屏 10-20 词，悬停释义，右侧评价。

**核心功能模块：**

| 模块 | 功能 | 关键交互 |
|------|------|----------|
| 单词列表 | 显示单词 + 音标 + 发音按钮 + 记忆强度条 | 点击选中 |
| 释义提示 | 选中词展开显示释义 | 自动展开 |
| 评价按钮 | 熟悉/模糊/忘记 三按钮 | 点击后飞出动画 + 自动下一个 |
| 快捷键 | J/K 导航, 1/2/3 评价, Space 释义, Enter 发音 | 全局键盘监听 |
| 分页 | 上一组/下一组（10 词一组） | 点击切换 |

**页面结构（ASCII 布局图）：**
```
┌─────────────────────────────────────────────────────┐
│  CET4 核心词汇                                       │
│  Unit 1 · 20 词    J K 导航  1 2 3 评价  Space 释义  │
│─────────────────────────────────────────────────────│
│                                                      │
│  abandon    /əˈbændən/  🔊  ▓▓▓░░░░░░░  新词        │
│    v. 放弃；抛弃；遗弃 · n. 放肆；放纵                │
│    [😊 熟悉]  [😐 模糊]  [😣 忘记]                   │
│                                                      │
│  abstract   /ˈæbstrækt/ 🔊  ▓▓▓░░░░░░░  新词        │
│  accelerate /əkˈselə... 🔊  ▓▓▓░░░░░░░  新词        │
│  accompany  /əˈkʌmpə... 🔊  ▓▓▓░░░░░░░  新词        │
│  accumulate /əˈkjuːm...  🔊  ▓▓▓░░░░░░░  新词        │
│  ...                                                 │
│─────────────────────────────────────────────────────│
│  当前第 1 / 20 词              [← 上一组] [下一组 →]  │
└─────────────────────────────────────────────────────┘
```

**动画系统：**
- `card-fly-out` — 评价后卡片向右飞出 + 旋转
- `card-slide-in` — 新卡片从左滑入
- `rating-btn` — 评价按钮 hover 放大 + active 缩小（spring 弹性）

---

#### 3.3.3 `components/WordDetail/index.tsx` ★ 沉浸详情模式

**职责：** 扇贝式详情界面，含选择释义 + 三段评价两种子模式。

**子模式 A — 选择释义：**
```
┌─────────────────────────────────────────────────────┐
│  ← 上一个            1 / 20           [选择] [评价]  │
│                                                      │
│                    abandon                           │
│                   /əˈbændən/                         │
│                  [ 播放发音 ]                         │
│                                                      │
│                  a · ban · don                        │
│                  红   蓝    蓝                        │
│                                                      │
│  ── 选择正确的中文意思 ──                             │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐                 │
│  │ A. adj. 抽象的│  │ B. n. 青少年  │                │
│  └──────────────┘  └──────────────┘                 │
│  ┌──────────────┐  ┌──────────────┐                 │
│  │ C. n. 管理    │  │ D. v. 放弃 ✓  │                │
│  └──────────────┘  └──────────────┘                 │
└─────────────────────────────────────────────────────┘
```

**子模式 B — 三段评价：**
```
┌─────────────────────────────────────────────────────┐
│  ← 上一个            1 / 20           [选择] [评价]  │
│                                                      │
│                    abandon                           │
│                   /əˈbændən/                         │
│                  [ 播放发音 ]                         │
│                                                      │
│              v. 放弃；抛弃；遗弃                      │
│              n. 放肆；放纵                            │
│                                                      │
│     [ 😊 熟悉 ]    [ 😐 模糊 ]    [ 😣 忘记 ]       │
│      不用再复习      需要巩固        重新学习          │
│                                                      │
│  ┌─ 助记 ──────────────────────────────────┐        │
│  │ a-band-on → 一个乐队解散了 → 放弃        │        │
│  ├─ 词根 ──────────────────────────────────┤        │
│  │ ab-(离开) + don(给予) → 离开并给予 → 放弃│        │
│  ├─ 词族 ──────────────────────────────────┤        │
│  │ abandon · abandoned · abandoning         │        │
│  └──────────────────────────────────────────┘        │
│                                                      │
│  例句:                                               │
│  1. He abandoned his wife and children.              │
│  2. They abandoned the car in the snow.              │
└─────────────────────────────────────────────────────┘
```

---

#### 3.3.4 `components/PhonicsDisplay/index.tsx` ★ 自然拼读可视化

**职责：** 将 PhonicsBreakdown 数据渲染为可交互的可视化组件。

**交互功能：**
- 点击音节 → Web Speech API 播放该音节发音
- 点击音素 → 播放单个音素
- 播放完整发音按钮
- 颜色图例（辅音蓝/元音红/组合紫/R控青）

---

### 3.4 入口文件

#### 3.4.1 `src/main.tsx` — 应用入口

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

#### 3.4.2 `src/App.tsx` — 根组件

**职责：** 应用壳，初始化数据，根据 viewMode 切换列表/详情视图。

**页面结构：**
```
┌─────────────────────────────────────────┐
│  Header（词境 + 统计 + 模式切换）         │
├─────────────────────────────────────────┤
│                                         │
│  viewMode === 'list'                    │
│    → <WordList />                       │
│                                         │
│  viewMode === 'detail'                  │
│    → <WordDetail />                     │
│                                         │
├─────────────────────────────────────────┤
│  底部快捷键提示栏                         │
│  J/K 导航 | 1/2/3 评价 | Space 释义     │
└─────────────────────────────────────────┘
```

---

### 3.5 配置文件

#### 3.5.1 `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': '/src' },
  },
})
```

#### 3.5.2 `tsconfig.app.json`

关键配置：
- `target: "es2023"` — 现代 JS 特性
- `module: "esnext"` — ESM 模块
- `verbatimModuleSyntax: true` — 要求显式 `import type`
- `jsx: "react-jsx"` — React 17+ JSX 转换

---

## 四、文件间联动关系图

### 4.1 ASCII 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                          UI 层 (components/)                     │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Header   │  │   WordList   │  │  WordDetail  │              │
│  │ 模式切换  │  │ 列表速刷模式  │  │ 沉浸详情模式  │              │
│  └─────┬────┘  └──────┬───────┘  └──────┬───────┘              │
│        │              │                  │                       │
│        │       ┌──────┴───────┐          │                       │
│        │       │PhonicsDisplay│          │                       │
│        │       │  拼读可视化   │          │                       │
│        │       └──────┬───────┘          │                       │
├────────┼──────────────┼──────────────────┼───────────────────────┤
│        │         状态管理层 (stores/)     │                       │
│        │       ┌──────┴───────┐          │                       │
│        └──────→│useStudyStore │←─────────┘                       │
│                │ 全局学习状态  │                                   │
│                └──────┬───────┘                                   │
├───────────────────────┼───────────────────────────────────────────┤
│                  算法层 (lib/)                                    │
│       ┌───────────────┼───────────────┐                          │
│  ┌────┴─────┐   ┌─────┴──────┐  ┌────┴─────┐                   │
│  │ phonics/  │   │   fsrs/    │  │   db/    │                   │
│  │ 拼读引擎  │   │ FSRS 调度  │  │ IndexedDB│                   │
│  └────┬─────┘   └─────┬──────┘  └────┬─────┘                   │
│       │               │               │                          │
│  ┌────┴─────┐   ┌─────┴──────┐  ┌────┴──────┐                  │
│  │CMU Dict  │   │  ts-fsrs   │  │  Dexie.js │                   │
│  │13.4万词  │   │  算法库     │  │  IDB封装  │                   │
│  └──────────┘   └────────────┘  └───────────┘                   │
├───────────────────────────────────────────────────────────────────┤
│                  浏览器 API                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Web Speech   │  │ IndexedDB    │  │ CSS Backdrop │           │
│  │ 语音合成      │  │ 本地存储     │  │ 毛玻璃效果   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 数据流向

```
用户操作                Store 处理              数据层
────────────────────────────────────────────────────────────

点击 "😊 熟悉"    →    rateWord(id, 'easy')
                       │
                       ├─ scheduleReview(card, easy)
                       │    └─ ts-fsrs 计算新 due/stability
                       │
                       ├─ db.cards.update()    →  IndexedDB
                       │
                       ├─ db.studyLogs.add()   →  IndexedDB
                       │
                       └─ 更新 cards Map       →  React 重渲染

页面加载              →    init()
                       │
                       ├─ db.words.toArray()   ←  IndexedDB
                       ├─ db.cards.toArray()   ←  IndexedDB
                       └─ 缺失卡片 → newCard() →  IndexedDB

点击音节 "ban"      →    speakWord('ban')
                       └─ speechSynthesis.speak()  →  Web Speech API
```

---

## 五、关键设计决策

### 5.1 为什么用 FSRS 而不是艾宾浩斯？

| 维度 | 艾宾浩斯（炭炭用） | FSRS（词境用） |
|------|-------------------|---------------|
| 间隔 | 固定：1-2-4-7-15-30 天 | 个性化，根据用户表现动态调整 |
| 参数 | 所有人相同 | 每个用户独立训练 |
| 效率 | 基准 | 比 SM-2 高 20-40% |
| 数据需求 | 无 | 需要学习数据积累 |
| 学术背书 | 1885 年论文 | 2023 年论文，FSRS5 最新版本 |

**决策：** FSRS 是目前最先进的间隔重复算法，且 ts-fsrs 有活跃维护的开源实现。

### 5.2 为什么用 CMU 词典而不是 eSpeak？

| 维度 | CMU Pronouncing Dictionary | eSpeak 实时生成 |
|------|---------------------------|----------------|
| 数据源 | 卡内基梅隆大学人工校准 | 算法推导 |
| 覆盖词数 | 13.4 万 | 无限（但质量低） |
| 查询速度 | O(1) 哈希表 | 需要运行时计算 |
| 准确度 | 高（含重音标记） | 中（规则推导有误差） |
| 包大小 | 3.9MB（懒加载） | 0（但需要运行时） |

**决策：** 用 CMU 作为主数据源，eSpeak 作为 fallback（CMU 中没有的词）。

### 5.3 为什么用 IndexedDB 而不是 localStorage？

| 维度 | localStorage | IndexedDB (Dexie) |
|------|-------------|-------------------|
| 容量 | 5MB | 无限制（通常 50MB+） |
| 数据结构 | 仅字符串 | 结构化对象 |
| 索引 | 无 | 支持多字段索引 |
| 事务 | 无 | 支持 |
| 查询 | 全量读取 | 按索引高效查询 |

**决策：** 单词数据量大（13.4万词 × 多字段），需要索引查询（按 due 日期筛选待复习词），localStorage 不够用。

### 5.4 为什么用 Zustand 而不是 Redux？

| 维度 | Redux Toolkit | Zustand |
|------|--------------|---------|
| 包大小 | ~11KB | ~1KB |
| Boilerplate | slices + thunks + selectors | 一个 create() 搞定 |
| 学习曲线 | 中等 | 极低 |
| 异步支持 | createAsyncThunk | 直接 async/await |

**决策：** 项目状态简单（主要是学习流程），不需要 Redux 的复杂度。

### 5.5 为什么 Tailwind CSS v4 而不是 CSS Modules？

| 维度 | CSS Modules | Tailwind CSS v4 |
|------|------------|-----------------|
| 开发效率 | 需要命名 + 切文件 | 直接在 JSX 中写 |
| 一致性 | 依赖开发者自觉 | 设计系统内置 |
| 包大小 | 按需 | 自动 tree-shake |
| Vite 集成 | 一般 | `@tailwindcss/vite` 深度集成 |

**决策：** Tailwind 的 `@tailwindcss/vite` 插件实现零配置集成，开发效率更高。

### 5.6 为什么 CMU 词典懒加载？

**问题：** CMU 词典 JSON 有 3.9MB，同步加载会阻塞首屏渲染。

**方案：**
```typescript
// engine.ts
let cmuDict = null;

async function loadCMUDict() {
  if (cmuDict) return cmuDict;       // 已加载则直接返回
  const mod = await import('cmu-pronouncing-dictionary');  // 动态导入
  cmuDict = mod.default || mod;
  return cmuDict;
}

// 分析单词时才加载
export async function analyzeWord(word) {
  const dict = await loadCMUDict();  // 首次调用时加载
  // ...
}
```

**效果：** Vite 自动将 `cmu-pronouncing-dictionary` 分为独立 chunk，首屏 JS 仅 344KB，CMU chunk 按需加载。

---

## 六、二开指南

### 6.1 添加新词库

**场景：** 扩充词库，添加考研/雅思/托福词汇。

**步骤：**

1. 在 `src/lib/db/sampleData.ts` 中添加 `WordEntry` 数组：

```typescript
export const IELTS_WORDS: WordEntry[] = [
  {
    id: 'ielts001',
    word: 'ubiquitous',
    phonetic: '/juːˈbɪkwɪtəs/',
    definitions: [{ pos: 'adj.', meaning: '无处不在的' }],
    examples: ['Smartphones have become ubiquitous in modern life.'],
    etymology: 'ubique(到处) + tous → 无处不在的',
    wordFamily: ['ubiquitous', 'ubiquity'],
    mnemonic: 'ubi(优比) + quit(退出) + ous → 到处都有优比退出 → 无处不在',
    tags: ['IELTS'],
  },
  // ...
];
```

2. 在 `useStudyStore.ts` 的 `init()` 中写入数据库：

```typescript
if (existingWords === 0) {
  await db.words.bulkAdd(SAMPLE_WORDS);
  await db.words.bulkAdd(IELTS_WORDS);  // 新增
  await db.decks.bulkAdd(SAMPLE_DECKS);
}
```

### 6.2 添加新的评价维度

**场景：** 增加"困难"评价（4 按钮变 4 按钮）。

**步骤：**

1. `lib/fsrs/index.ts` — `ReviewRating` 类型已包含 `'hard'`
2. `components/WordList/index.tsx` — 添加第 4 个按钮
3. `components/WordDetail/index.tsx` — 同步添加

### 6.3 切换到其他语言

**场景：** 支持日语/法语背单词。

**步骤：**

1. 替换 `cmu-pronouncing-dictionary` 为目标语言的发音词典
2. 修改 `lib/phonics/rules.ts` 中的音素映射表
3. 修改 `lib/phonics/engine.ts` 中的音节划分算法
4. `speakWord()` 的 `lang` 参数改为目标语言代码（如 `'ja-JP'`）

### 6.4 添加用户登录系统

**场景：** 多端同步需要用户账号。

**步骤：**

1. 后端：搭建 API 服务（推荐 Hono + Drizzle ORM）
2. `lib/db/index.ts` — 添加同步层，IndexedDB → 云端
3. `stores/useStudyStore.ts` — 添加登录状态
4. `components/Header/` — 添加用户头像/登录按钮

### 6.5 添加视频语境学习（第二阶段）

**步骤：**

1. `src/lib/` 新建 `video/` 模块
2. 集成 Whisper API（语音转文字）或本地模型
3. `src/components/` 新建 `VideoPlayer/` + `SubtitleViewer/`
4. 词汇点击 → 语境释义 → 一键收藏到 FSRS

---

## 七、部署方式

### 7.1 开发环境

```bash
# 前置要求
node >= 18.0.0
npm >= 9.0.0

# 安装依赖
cd 词境/wordcontext
npm install

# 启动开发服务器
npm run dev
# → http://localhost:5173

# 类型检查
npx tsc --noEmit

# 构建
npx vite build
```

### 7.2 生产部署

```bash
# 构建
npx vite build

# 预览构建产物
npx vite preview
# → http://localhost:4173

# 部署 dist/ 目录到任意静态服务器
# Nginx / Caddy / Vercel / Netlify / Cloudflare Pages
```

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

    # 静态资源缓存
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

### 7.3 Docker 部署

```dockerfile
# 多阶段构建
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
docker run -p 8080:80 wordcontext
# → http://localhost:8080
```

---

## 八、已知限制与改进方向

| # | 限制 | 影响 | 改进方向 |
|---|------|------|----------|
| 1 | CMU 词典不含中文释义 | 依赖手动填入的 WordEntry | 集成免费词典 API（如 Free Dictionary API） |
| 2 | 音节划分算法为简化版 | 部分复杂词划分不准 | 实现完整 Maximal Onset Principle + 例外表 |
| 3 | Web Speech API 发音质量一般 | 不如真人录音 | 集成 TTS 服务（如 Edge TTS，免费） |
| 4 | 无拼写测试 | 只能"认"不能"写" | 第二阶段：添加拼写输入 + 手写识别 |
| 5 | 无随身听模式 | 碎片时间利用不足 | 第二阶段：后台播放 + 定时关闭 |
| 6 | 无数据导入导出 | 换设备丢数据 | 第二阶段：CSV/JSON/Anki 格式导入导出 |
| 7 | 无词族自动关联 | 需手动维护 wordFamily | 集成 WordNet 或自建词族数据库 |
| 8 | 选择题干扰项随机 | 可能出现明显错误选项 | 用语义相似度选择干扰项 |
| 9 | 无暗色模式 | 夜间使用体验差 | Tailwind dark: 前缀 + 系统主题跟随 |
| 10 | 示例词库仅 20 词 | MVP 阶段演示用 | 扩充到 300+ 词库（四六级/考研/雅思/托福） |

---

## 九、API 接口文档

### 9.1 架构说明

**当前版本（MVP）为纯前端应用，无后端 API。** 所有数据存储在浏览器 IndexedDB 中。

### 9.2 内部数据接口（Store 层）

虽然没有 HTTP API，但 Store 层提供了完整的数据操作接口：

#### 学习操作

| 接口 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `init()` | 无 | `Promise<void>` | 初始化：加载词库，创建缺失卡片 |
| `rateWord(wordId, rating)` | `string, ReviewRating` | `void` | 评价单词，触发 FSRS 调度 |
| `nextWord()` | 无 | `void` | 切换到下一个单词 |
| `prevWord()` | 无 | `void` | 切换到上一个单词 |
| `setCurrentIndex(i)` | `number` | `void` | 跳转到指定索引 |

#### 查询接口

| 接口 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `getCurrentWord()` | 无 | `WordEntry \| null` | 获取当前单词完整数据 |
| `getCurrentCard()` | 无 | `CardEntry \| null` | 获取当前 FSRS 卡片状态 |
| `getDueWords()` | 无 | `WordEntry[]` | 获取所有到期需复习的词 |
| `getNewWords()` | 无 | `WordEntry[]` | 获取所有新词 |
| `getStats()` | 无 | `{total, newCount, learning, review}` | 学习统计 |

### 9.3 未来 API 规划（第二阶段）

```
POST   /api/auth/register          # 用户注册
POST   /api/auth/login             # 用户登录
GET    /api/decks                  # 获取词书列表
GET    /api/decks/:id/words        # 获取词书中的单词
POST   /api/sync                   # 同步学习数据
POST   /api/video/upload           # 上传视频
GET    /api/video/:id/subtitles    # 获取视频字幕
POST   /api/ai/extract             # AI 提取词汇
```

### 9.4 错误码定义（规划中）

| 错误码 | 含义 | 处理方式 |
|--------|------|----------|
| 1001 | 词书不存在 | 检查 deckId |
| 1002 | 单词不存在 | 检查 wordId |
| 2001 | 认证失败 | 重新登录 |
| 2002 | Token 过期 | 刷新 Token |
| 3001 | AI 配额用尽 | 升级套餐或等待重置 |
| 4001 | 文件格式不支持 | 检查文件类型 |
| 5000 | 服务器内部错误 | 重试或联系管理员 |

### 9.5 认证方式（规划中）

```
Authorization: Bearer <jwt_token>

Token 有效期：7 天
刷新机制：过期前 24 小时自动刷新
```

---

## 十、数据模型

### 10.1 ER 图

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    Deck      │       │    Word      │       │    Card      │
│  (词书)       │       │  (单词)       │       │  (学习卡片)   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │◄──┐   │ id (PK)      │◄──────│ id (PK=FK)  │
│ name         │   │   │ word         │  1:1  │ deckId (FK)  │
│ description  │   │   │ phonetic     │       │ fsrs.due     │
│ wordCount    │   │   │ definitions  │       │ fsrs.stability│
│ tags[]       │   │   │ examples[]   │       │ fsrs.difficulty│
│ bookMatch    │   │   │ etymology    │       │ fsrs.state   │
│ wordIds[]    │   │   │ wordFamily[] │       │ rating       │
└──────────────┘   │   │ mnemonic     │       │ lastReview   │
                   │   │ tags[]       │       └──────────────┘
                   │   └──────────────┘              │
                   │          │ 1:N                   │ 1:N
                   │          ▼                       ▼
                   │   ┌──────────────┐       ┌──────────────┐
                   │   │ StudyLog     │       │   (索引)      │
                   │   │ (学习日志)    │       │ fsrs.due     │
                   │   ├──────────────┤       │ fsrs.state   │
                   │   │ id (PK)      │       │ deckId       │
                   │   │ date         │       └──────────────┘
                   │   │ wordId (FK)  │
                   │   │ rating       │
                   │   │ timeSpent    │
                   │   └──────────────┘
                   │
                   └── Deck.wordIds[] → Word.id (逻辑关联)
```

### 10.2 表字段定义

#### words 表（单词）

| 字段 | 类型 | 约束 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | `string` | PRIMARY KEY | — | 唯一标识，如 "w001" |
| `word` | `string` | NOT NULL, INDEX | — | 英文单词，如 "abandon" |
| `phonetic` | `string` | — | — | IPA 音标，如 "/əˈbændən/" |
| `definitions` | `Definition[]` | — | `[]` | 词义列表 |
| `definitions[].pos` | `string` | — | — | 词性，如 "v.", "n.", "adj." |
| `definitions[].meaning` | `string` | — | — | 中文释义 |
| `examples` | `string[]` | — | `[]` | 例句列表 |
| `etymology` | `string` | — | `""` | 词源分析 |
| `wordFamily` | `string[]` | — | `[]` | 词族（同根词） |
| `mnemonic` | `string` | — | `""` | 助记方法 |
| `tags` | `string[]` | MULTI-INDEX | `[]` | 标签（CET4, 考研等） |

#### cards 表（学习卡片）

| 字段 | 类型 | 约束 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | `string` | PRIMARY KEY (= FK words.id) | — | 对应单词 ID |
| `deckId` | `string` | INDEX | — | 所属词书 ID |
| `fsrs` | `FSRSCard` | — | — | FSRS 状态对象 |
| `fsrs.due` | `Date` | INDEX | `new Date()` | 下次复习时间 |
| `fsrs.stability` | `number` | — | `0` | 记忆稳定性 |
| `fsrs.difficulty` | `number` | — | `0` | 卡片难度 |
| `fsrs.elapsed_days` | `number` | — | `0` | 已过天数 |
| `fsrs.scheduled_days` | `number` | — | `0` | 计划天数 |
| `fsrs.reps` | `number` | — | `0` | 复习次数 |
| `fsrs.lapses` | `number` | — | `0` | 遗忘次数 |
| `fsrs.state` | `number` | INDEX | `0` | 0=新词, 1=学习中, 2=复习, 3=重新学习 |
| `rating` | `number` | — | `0` | 最近评分 (1-4) |
| `lastReview` | `Date` | — | — | 最后复习时间 |

#### decks 表（词书）

| 字段 | 类型 | 约束 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | `string` | PRIMARY KEY | — | 如 "deck-cet4" |
| `name` | `string` | INDEX | — | 词书名称 |
| `description` | `string` | — | `""` | 描述 |
| `wordCount` | `number` | — | `0` | 单词总数 |
| `tags` | `string[]` | MULTI-INDEX | `[]` | 标签 |
| `bookMatch` | `string` | — | — | 搭配的实体书 |
| `wordIds` | `string[]` | — | `[]` | 单词 ID 列表 |

#### studyLogs 表（学习日志）

| 字段 | 类型 | 约束 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | `number` | PRIMARY KEY, AUTO | — | 自增 ID |
| `date` | `string` | INDEX | — | 日期 "2026-06-07" |
| `wordId` | `string` | INDEX | — | 单词 ID |
| `rating` | `number` | — | — | 评分 (1-4) |
| `timeSpent` | `number` | — | `0` | 学习时长（秒） |

### 10.3 索引策略

```
words:
  PK: id
  IDX: word          — 按单词名查询
  MIDX: tags         — 按标签筛选（CET4/考研）

cards:
  PK: id
  IDX: deckId        — 按词书筛选
  IDX: fsrs.due      — 查询待复习词（核心查询）
  IDX: fsrs.state    — 按状态筛选（新词/学习中/复习）

decks:
  PK: id
  IDX: name          — 按名称搜索
  MIDX: tags         — 按标签筛选

studyLogs:
  PK: id (auto)
  IDX: date          — 按日期聚合统计
  IDX: wordId        — 查某词的学习历史
```

---

## 十一、环境与依赖

### 11.1 运行环境要求

| 环境 | 最低版本 | 推荐版本 |
|------|---------|---------|
| Node.js | 18.0.0 | 20.x LTS |
| npm | 9.0.0 | 10.x |
| 浏览器 | Chrome 90+ / Safari 15+ / Firefox 90+ | 最新稳定版 |

### 11.2 依赖清单

#### 生产依赖

| 包名 | 版本 | 用途 | 协议 |
|------|------|------|------|
| `react` | ^19.1.0 | UI 框架 | MIT |
| `react-dom` | ^19.1.0 | React DOM 渲染 | MIT |
| `ts-fsrs` | ^4.5.0 | FSRS 间隔重复算法 | MIT |
| `dexie` | ^4.0.11 | IndexedDB 封装 | Apache-2.0 |
| `zustand` | ^5.0.5 | 状态管理 | MIT |
| `cmu-pronouncing-dictionary` | ^3.0.0 | CMU 发音词典 | ISC |
| `howler` | ^2.2.4 | 音频播放（预留） | MIT |

#### 开发依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `typescript` | ~5.8.3 | 类型检查 |
| `vite` | ^7.0.0 | 构建工具 |
| `@vitejs/plugin-react` | ^4.6.0 | React 支持 |
| `tailwindcss` | ^4.3.0 | CSS 框架 |
| `@tailwindcss/vite` | ^4.3.0 | Tailwind Vite 插件 |
| `eslint` | ^9.29.0 | 代码检查 |

### 11.3 环境变量

当前版本无需环境变量（纯前端，零配置）。

未来版本规划：

```env
# .env.example
VITE_API_URL=https://api.wordcontext.com
VITE_WHISPER_API_KEY=sk-xxx          # 语音转文字（第二阶段）
VITE_LLM_API_KEY=sk-xxx              # AI 助记生成（第三阶段）
```

### 11.4 依赖版本锁定策略

- 使用 `package-lock.json` 锁定精确版本
- 生产部署前执行 `npm ci`（基于 lock 文件安装）
- 每月检查一次安全更新：`npm audit`
- 主版本升级需人工测试后合入

---

## 十二、测试

### 12.1 测试策略

| 层级 | 覆盖范围 | 工具 | 优先级 |
|------|---------|------|--------|
| 单元测试 | phonics engine, fsrs 调度 | Vitest | P0 |
| 组件测试 | WordList, WordDetail, PhonicsDisplay | Vitest + Testing Library | P1 |
| 集成测试 | Store + DB 联动 | Vitest + fake-indexeddb | P1 |
| E2E 测试 | 完整学习流程 | Playwright | P2 |

### 12.2 如何运行测试

```bash
# 安装测试依赖（如未安装）
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# 运行所有测试
npx vitest

# 运行特定测试
npx vitest run src/lib/phonics/engine.test.ts

# 覆盖率报告
npx vitest run --coverage
```

### 12.3 关键测试用例

#### 自然拼读引擎

```typescript
describe('analyzeWord', () => {
  it('应该正确拆分 abandon 为三个音节', async () => {
    const result = await analyzeWord('abandon');
    expect(result.syllables).toEqual(['a', 'ban', 'don']);
  });

  it('应该识别重读音节', async () => {
    const result = await analyzeWord('abandon');
    expect(result.stressIndex).toBe(1); // "ban" 重读
  });

  it('CMU 词典中没有的词应该 fallback', async () => {
    const result = await analyzeWord('xyzabc');
    expect(result.phonemes.length).toBeGreaterThan(0);
  });
});
```

#### FSRS 调度

```typescript
describe('scheduleReview', () => {
  it('easy 评价应该大幅增加 stability', () => {
    const card = newCard();
    const result = scheduleReview(card, 'easy');
    expect(result.stability).toBeGreaterThan(card.stability);
  });

  it('again 评价应该重置卡片状态', () => {
    const card = newCard();
    const result = scheduleReview(card, 'again');
    expect(result.state).toBe(State.Learning);
  });
});
```

#### 数据库

```typescript
describe('Database', () => {
  it('应该能写入和读取单词', async () => {
    await db.words.add(SAMPLE_WORDS[0]);
    const word = await db.words.get('w001');
    expect(word?.word).toBe('abandon');
  });
});
```

---

## 十三、变更日志

### 版本号规则

采用 [语义化版本](https://semver.org/lang/zh-CN/)：`MAJOR.MINOR.PATCH`

- **MAJOR** — 不兼容的 API 变更
- **MINOR** — 向后兼容的功能新增
- **PATCH** — 向后兼容的问题修复

### 版本记录

#### v1.0.0 (2026-06-07) — MVP 初始版本

**核心功能：**
- ✅ 列表速刷模式（炭炭式）
- ✅ 沉浸详情模式（选择释义 + 三段评价）
- ✅ FSRS 间隔重复算法集成
- ✅ 自然拼读可视化（CMU 13.4万词）
- ✅ 音标发音（Web Speech API）
- ✅ 本地持久化（IndexedDB）
- ✅ macOS 风格毛玻璃 UI
- ✅ 全键盘快捷键
- ✅ 20 个 CET4 示例词汇

**技术栈：**
- React 19 + TypeScript + Vite 7 + Tailwind CSS v4
- ts-fsrs + Dexie.js + Zustand + CMU Pronouncing Dictionary

**已知问题：**
- 音节划分算法为简化版，部分复杂词不准
- 词库仅 20 词，需扩充
- 无暗色模式
- 无数据导入导出

---

## 十四、常见问题 (FAQ)

### 安装部署

**Q: `npm install` 很慢或失败？**

```bash
# 使用国内镜像
npm config set registry https://registry.npmmirror.com
npm install
```

**Q: `npm run dev` 启动后页面空白？**

1. 检查浏览器控制台是否有错误
2. 确认 Node.js 版本 >= 18
3. 删除 `node_modules` 重新安装：`rm -rf node_modules && npm install`

**Q: 构建报错 `MISSING_EXPORT`？**

这是 Vite 8 (Rolldown) 的已知行为。确保：
- 类型导入使用 `import type { X }` 而非 `import { X }`
- 类型导出使用 `export type X = ...` 而非 `export interface X`

**Q: CMU 词典加载失败？**

CMU 词典是懒加载的独立 chunk（3.9MB）。如果网络慢，首次点击单词时会有一段加载时间。检查：
- 浏览器 Network 面板是否有 404
- 是否有广告拦截器拦截了 `.js` 文件

### 数据相关

**Q: 数据存在哪里？换浏览器会丢吗？**

数据存储在浏览器 IndexedDB 中，域名级别隔离。同一浏览器同一域名下数据持久化。清除浏览器数据会丢失。

**Q: 如何备份学习数据？**

当前版本（MVP）暂未提供导出功能。可以通过浏览器 DevTools 手动导出：
1. F12 → Application → IndexedDB → wordcontext
2. 右键表 → Export

**Q: 如何清空数据重新开始？**

F12 → Application → IndexedDB → 右键 "wordcontext" → Delete Database，刷新页面。

### 功能相关

**Q: 发音功能不工作？**

Web Speech API 需要浏览器支持且系统有语音包。检查：
- Chrome: chrome://settings/content/sound
- macOS: 系统设置 → 辅助功能 → 朗读内容
- 确保不是静音标签页

**Q: 快捷键不响应？**

快捷键在输入框聚焦时不生效（避免冲突）。点击页面空白处后即可使用。

**Q: 为什么有些单词没有自然拼读拆解？**

CMU 词典覆盖 13.4 万词，但不包含所有专业术语。未收录的词会使用简单的逐字母 fallback，效果较差。

---

*文档版本：v1.0.0 | 最后更新：2026-06-07*
