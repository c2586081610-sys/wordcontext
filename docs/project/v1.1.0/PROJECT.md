> 文档版本：v1.1.0 | 更新日期：2026-06-07 | 对应软件版本：v1.1.0
> 变更摘要：反映 v1.1 架构变更——暗色模式、学习统计面板、FSRS 参数训练、数据导入导出、词库扩充至 510 词、Bug 修复、Store 拆分、数据库 Schema 升级

# 词境 (WordContext) — 项目全景文档

> 版本：v1.1.0 | 日期：2026-06-07
> 技术栈：React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + ts-fsrs + Dexie.js + Recharts + Lucide React

---

## 一、项目灵感

### 1.1 为什么做这个？

**背单词市场的核心痛点：**

| # | 痛点 | 现状 | 词境的解法 |
|---|------|------|-----------|
| 1 | 算法不科学 | 炭炭用固定艾宾浩斯曲线，所有人一样 | FSRS 个性化调度，比 SM-2 高效 20-40%，v1.1 新增参数自动训练 |
| 2 | 不会发音 | 多数 APP 只有整词播放，不知道怎么拆读 | 自然拼读可视化拆解，逐音节/逐音素播放 |
| 3 | 脱离语境 | 背了单词不知道怎么用 | 第二阶段：视频/文件语境学习 |
| 4 | 功能割裂 | 炭炭极简但没语境，DejaVocab 有语境但没词库 | 取两者之长，融合为一体 |
| 5 | 平台受限 | 炭炭无 Web 端，DejaVocab 国内受限 | Web-first，浏览器即用 |
| 6 | 数据被锁 | 多数 APP 不让导出，换设备丢数据 | v1.1 新增 JSON/CSV 双向导入导出 |

**一句话定位：**
> 炭炭的简洁高效 + DejaVocab 的语境思维 + FSRS 的科学算法 + Web-first 的跨平台

### 1.2 设计哲学

```
① 打开就背 — 零学习成本，不需要理解"语料库"概念
② 科学记忆 — FSRS 算法个性化调度，v1.1 自动训练参数，越用越精准
③ 会读才会背 — 自然拼读可视化，让你看到单词怎么拆、怎么读
④ 键盘优先 — 所有操作都有快捷键，效率为王
⑤ 数据归你 — v1.1 新增导入导出，本地存储 + 自由迁移
⑥ 护眼体验 — v1.1 新增暗色模式，浅色/深色/跟随系统三模式切换
```

### 1.3 技术选型理由

| 选择 | 原因 | 备选方案 | 为什么不用备选 |
|------|------|----------|---------------|
| React 19 | 生态成熟，组件化开发效率高 | Vue 3 | 团队更熟悉 React，shadcn/ui 生态更好 |
| TypeScript | 类型安全，减少运行时错误 | JavaScript | 项目规模大，TS 能显著降低维护成本 |
| Vite 8 | 极速 HMR，ESM 原生支持 | Webpack | Vite 开发体验远超 Webpack，构建速度 10x |
| Tailwind CSS v4 | 原子化 CSS，零运行时，Vite 深度集成 | CSS Modules | Tailwind 开发效率更高，设计一致性更好 |
| Zustand | 轻量（1KB），无 boilerplate | Redux Toolkit | Zustand 对小项目更友好，API 简洁 |
| Dexie.js | IndexedDB 的最佳封装，支持索引/事务 | raw IndexedDB | 原生 API 太难用，Dexie 代码量减少 80% |
| ts-fsrs | FSRS 算法的 TS 实现，MIT 开源，活跃维护 | SM-2 (Anki) | FSRS 比 SM-2 高效 20-40%，有学术论文背书 |
| CMU Dict | 公有领域，13.4万词，机器可读 | eSpeak 生成 | CMU Dict 覆盖面广，数据质量高，直接 npm 安装 |
| Web Speech API | 浏览器内置，零成本，支持多语言 | Howler.js + 预录音频 | 无需存储音频文件，零带宽成本 |
| Recharts | 🆕 v1.1 声明式图表库，React 生态 | Chart.js | Recharts 原生 React 组件，开发效率更高 |
| Lucide React | 🆕 v1.1 统一图标库，Tree-shakeable | 自定义 SVG | 统一风格，按需加载，包体积小 |

---

## 二、项目结构总览

```
词境/
├── docs/                            # ★ 版本化文档目录（v1.1 新增）
│   ├── INDEX.md                     # 文档索引
│   ├── product/                     # 产品设计文档
│   │   ├── v1.0.0/产品设计方案.md
│   │   └── v1.1.0/产品设计方案.md
│   ├── research/                    # 市场调研文档
│   │   ├── v1.0.0/市场调研报告.md
│   │   └── v1.1.0/市场调研报告.md
│   ├── project/                     # 项目全景文档
│   │   ├── v1.0.0/PROJECT.md
│   │   └── v1.1.0/PROJECT.md
│   └── releases/                    # 版本发布文档
│       └── v1.1.0/
│           ├── VERSION-v1.1.md
│           └── CHANGELOG-v1.1.md
│
└── wordcontext/                     # ★ 前端项目根目录
    ├── index.html                   # 入口 HTML
    ├── package.json                 # 依赖声明
    ├── vite.config.ts               # ★ Vite 构建配置
    ├── tsconfig.json                # TypeScript 根配置
    ├── tsconfig.app.json            # ★ 应用 TS 配置
    ├── tsconfig.node.json           # Node 环境 TS 配置
    ├── eslint.config.js             # ESLint 配置
    │
    ├── public/
    │   ├── favicon.svg              # 网站图标
    │   └── icons.svg                # SVG 图标集
    │
    ├── src/
    │   ├── main.tsx                 # ★ 应用入口
    │   ├── App.tsx                  # ★ 根组件，暗色模式 + 多视图
    │   ├── index.css                # ★ 全局样式 + Tailwind + 暗色变量
    │   │
    │   ├── lib/                     # ★ 核心算法层
    │   │   ├── phonics/             # ★ 自然拼读引擎
    │   │   │   ├── types.ts         # 类型定义
    │   │   │   ├── rules.ts         # 拼读规则 + 颜色映射
    │   │   │   ├── engine.ts        # ★ 核心引擎（死循环已修复）
    │   │   │   └── index.ts         # 统一导出
    │   │   │
    │   │   ├── fsrs/                # ★ FSRS 间隔重复（v1.1 新增参数训练）
    │   │   │   └── index.ts         # FSRS 封装 + 训练 + 动态实例
    │   │   │
    │   │   ├── db/                  # ★ 数据持久层（v1.1 Schema 升级 v2）
    │   │   │   ├── index.ts         # Dexie 数据库定义（v2，新增 settings 表）
    │   │   │   ├── sampleData.ts    # 词库合并导出（510 词）
    │   │   │   ├── sampleData1.ts   # 🆕 词库 A-B（45词）
    │   │   │   ├── sampleData2.ts   # 🆕 词库 C-D（91词）
    │   │   │   ├── sampleData3.ts   # 🆕 词库 E-H（66词）
    │   │   │   ├── sampleData4.ts   # 🆕 词库 I-O（85词）
    │   │   │   ├── sampleData5.ts   # 🆕 词库 P-S（106词）
    │   │   │   └── sampleData6.ts   # 🆕 词库 T-Z（117词）
    │   │   │
    │   │   └── io/                  # 🆕 v1.1 数据导入导出
    │   │       └── index.ts         # JSON/CSV 导入导出核心模块
    │   │
    │   ├── stores/                  # 状态管理（v1.1 拆分为多 Store）
    │   │   ├── useStudyStore.ts     # ★ Zustand 学习状态（核心 Store）
    │   │   └── useStatStore.ts      # 🆕 v1.1 学习统计状态
    │   │
    │   ├── components/              # UI 组件
    │   │   ├── Header/              # 顶部导航栏（v1.1 新增暗色切换 + 统计入口）
    │   │   │   └── index.tsx
    │   │   ├── WordList/             # ★ 列表速刷模式（v1.1 暗色适配 + 提示修复）
    │   │   │   └── index.tsx
    │   │   ├── WordDetail/           # ★ 沉浸详情模式（v1.1 暗色适配）
    │   │   │   └── index.tsx
    │   │   ├── PhonicsDisplay/       # ★ 自然拼读可视化（v1.1 暗色适配）
    │   │   │   └── index.tsx
    │   │   ├── StatsPanel/           # 🆕 v1.1 学习统计面板
    │   │   │   └── index.tsx
    │   │   └── DataManager/          # 🆕 v1.1 数据管理 UI
    │   │       └── index.tsx
    │   │
    │   ├── pages/                   # 页面（预留，MVP 阶段未使用）
    │   └── assets/                  # 静态资源
    │
    └── dist/                        # 构建产物
        ├── index.html
        └── assets/
            ├── index-*.css
            ├── index-*.js
            └── cmu-pronouncing-dictionary-*.js
```

**v1.1 新增/变更文件标记：** 🆕 表示 v1.1 新增文件，★ 标记的文件如有变更会在对应章节说明。

---

## 三、v1.1 变更摘要

### 3.1 Bug 修复

| Bug | 文件 | 修复方式 |
|-----|------|---------|
| 示例数据重复插入报错 | `useStudyStore.ts` init() | `bulkAdd` → `bulkPut`（upsert） |
| 快捷键提示框 HTML 渲染 | `WordList/index.tsx` L226 | 字符串拼接 → JSX Fragment |
| 音节划分死循环 | `phonics/engine.ts` syllabify() | `i--` → `i = j - 1` |

### 3.2 核心功能新增

| 功能 | 新增/修改文件 | 说明 |
|------|-------------|------|
| 暗色模式 | `index.css`, `useStudyStore.ts`, `App.tsx`, `Header`, `WordList`, `WordDetail`, `PhonicsDisplay` | 三模式切换 + 持久化 |
| 学习统计面板 | `useStatStore.ts`, `StatsPanel/index.tsx` | 日历热力图 + 趋势图 + 记忆分布 |
| FSRS 参数训练 | `fsrs/index.ts`, `db/index.ts`, `useStudyStore.ts` | 每 50 次复习自动训练 |
| 数据导入导出 | `io/index.ts`, `DataManager/index.tsx` | JSON/CSV 双向 |
| 词库扩充 | `sampleData1-6.ts`, `sampleData.ts` | 20 词 → 510 词 |

### 3.3 数据库 Schema 变更（v1 → v2）

**studyLogs 表新增字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `state` | `number` | 评价时的卡片状态 |
| `elapsed_days` | `number` | 距上次复习天数 |
| `scheduled_days` | `number` | 原计划间隔天数 |
| `review_duration` | `number` | 本次复习耗时（毫秒） |

**新增表：**

| 表名 | 主键 | 说明 |
|------|------|------|
| `settings` | `id` | 用户设置（FSRS参数/主题/目标等） |

---

## 四、每个文件深度解析（v1.1 变更部分）

### 4.1 `lib/fsrs/index.ts` ★ FSRS 间隔重复（v1.1 增强）

**v1.1 新增函数：**

| 分类 | 函数 | 说明 |
|------|------|------|
| 实例管理 | `getFSRS(): FSRS` | 获取当前 FSRS 实例（可能含训练后参数） |
| 实例管理 | `updateFSRSInstance(params: number[]): void` | 用训练后参数更新 FSRS 实例 |
| 调度增强 | `scheduleReviewWithLog(card, rating): { card, log }` | 调度同时返回增强日志 |
| 参数训练 | `loadFSRSParameters(): Promise<number[] \| null>` | 从 IndexedDB 加载已训练参数 |
| 参数训练 | `trainParameters(logs): number[]` | 从复习记录训练参数（简化 5 维） |
| 参数训练 | `checkAndTrainIfNeeded(): Promise<void>` | 检查是否满足训练条件并执行 |

### 4.2 `lib/db/index.ts` ★ 数据持久层（v1.1 Schema 升级）

**v1.1 数据库版本升级 v1 → v2：**

```typescript
// v1.1 新增表
settings: 'id'  // 用户设置

// v1.1 新增类型
type SettingsEntry = {
  id: string;
  theme: 'light' | 'dark' | 'system';
  dailyNewWordGoal: number;
  dailyReviewGoal: number;
  fsrsParameters: number[] | null;
  lastTrainedAt: Date | null;
  ttsProvider: 'web-speech' | 'edge-tts';
};

type DailyStatEntry = {
  id: string;
  date: string;
  newWordsLearned: number;
  wordsReviewed: number;
  totalReviews: number;
  correctRate: number;
  studyMinutes: number;
};
```

### 4.3 `lib/io/index.ts` 🆕 数据导入导出

**核心函数：**

| 函数 | 说明 |
|------|------|
| `exportAll(format)` | 导出全部数据（JSON 含 words/cards/decks/studyLogs，CSV 含单词表） |
| `exportByDeck(deckId, format)` | 按词库导出 |
| `importData(file)` | 导入数据（自动识别格式，去重跳过已有数据） |
| `clearAllData()` | 清空所有数据（需二次确认） |

### 4.4 `stores/useStudyStore.ts` ★ 学习状态 Store（v1.1 增强）

**v1.1 变更：**
- `bulkAdd` → `bulkPut` 修复重复插入
- ViewMode 扩展：新增 `'stats'` | `'settings'` 视图模式
- 新增暗色模式状态：`theme` / `resolvedTheme` / `setTheme()` / `toggleTheme()`
- FSRS 训练集成：`init()` 中加载已训练参数，`rateWord()` 中记录增强日志并检查训练条件

### 4.5 `stores/useStatStore.ts` 🆕 学习统计状态

**职责：** 管理学习统计数据、每日目标、连续打卡。

**核心功能：**

| 模块 | 功能 | 关键函数 |
|------|------|----------|
| 今日进度 | 新词/复习进度环形图数据 | `getTodayProgress()` |
| 学习日历 | 最近 3 个月热力图数据 | `getCalendarData()` |
| 学习趋势 | 7天/30天趋势数据 | `getTrendData(days)` |
| 记忆分布 | 按强度分组的词汇分布 | `getMemoryDistribution()` |
| 每日目标 | 目标设置 + 完成判断 | `getDailyGoalStatus()` |
| 连续打卡 | 连续天数 + 最长记录 | `getStreak()` |

### 4.6 `components/StatsPanel/index.tsx` 🆕 学习统计面板

**五个区块：**
1. 今日进度 — 双环形进度图（新词 N/M · 复习 N/M）+ 连续打卡天数 + 正确率/学习时长
2. 学习日历 — 最近 3 个月 CSS grid 热力图，5 级蓝色渐变
3. 学习趋势 — Recharts 折线图，支持 7天/30天 切换
4. 记忆强度分布 — Recharts 环形饼图 + 水平条形图
5. 累计数据 — 总词数/总复习次数/总学习时长

### 4.7 `components/DataManager/index.tsx` 🆕 数据管理 UI

**三个区域：**
- 导出区域：格式选择（JSON/CSV）+ 范围选择 + 导出按钮
- 导入区域：拖拽上传 + 文件选择 + 预览 + 确认
- 危险区域：清空数据（红色警示 + 二次确认）

---

## 五、文件间联动关系图（v1.1）

### 5.1 ASCII 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                          UI 层 (components/)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Header   │  │ WordList │  │WordDetail│  │ StatsPanel   │   │
│  │ 模式+暗色 │  │ 速刷模式  │  │ 详情模式  │  │ 🆕 统计面板  │   │
│  └─────┬────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│        │             │             │                │            │
│        │       ┌─────┴──────┐     │       ┌────────┴──────┐    │
│        │       │PhonicsDisp │     │       │ DataManager   │    │
│        │       │  拼读可视化  │     │       │ 🆕 数据管理    │    │
│        │       └─────┬──────┘     │       └────────┬──────┘    │
├────────┼─────────────┼────────────┼────────────────┼───────────┤
│        │        状态管理层 (stores/)                │           │
│        │  ┌─────────┴──────────┐  │  ┌────────────┴────────┐  │
│        └─→│  useStudyStore     │←─┘  │  useStatStore       │  │
│           │ 学习+暗色+FSRS训练 │     │ 🆕 统计+目标+打卡   │  │
│           └─────────┬──────────┘     └────────────┬────────┘  │
├─────────────────────┼──────────────────────────────┼───────────┤
│                算法层 (lib/)                        │           │
│     ┌───────────────┼───────────────┐              │           │
│ ┌───┴─────┐   ┌─────┴──────┐  ┌────┴─────┐  ┌────┴──────┐    │
│ │ phonics/ │   │   fsrs/    │  │   db/    │  │  io/      │    │
│ │ 拼读引擎 │   │ FSRS+训练  │  │ IDB v2   │  │ 🆕 导入导出│    │
│ └────┬────┘   └─────┬──────┘  └────┬─────┘  └───────────┘    │
│      │              │              │                           │
│ ┌────┴────┐   ┌─────┴──────┐  ┌───┴───────┐                  │
│ │CMU Dict │   │  ts-fsrs   │  │  Dexie.js │                   │
│ │13.4万词 │   │  +训练算法  │  │  +settings│                   │
│ └─────────┘   └────────────┘  └───────────┘                   │
├─────────────────────────────────────────────────────────────────┤
│                  浏览器 API + 第三方服务                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │Web Speech│  │IndexedDB │  │  Recharts │  │  Edge TTS    │   │
│  │ 语音合成  │  │ 本地存储  │  │ 🆕 图表   │  │ 🆕 高质量TTS │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 六、关键设计决策

### 6.1 为什么 v1.1 拆分 Store？

| 维度 | 单 Store (v1.0) | 多 Store (v1.1) |
|------|-----------------|-----------------|
| 文件大小 | useStudyStore 超过 500 行 | 每个 Store 100-200 行 |
| 关注点 | 学习+UI+统计混合 | 学习/统计/UI 分离 |
| 重渲染 | 任意状态变化触发全部 | 按需订阅，减少重渲染 |
| 可维护性 | 修改一个功能影响全局 | 独立修改，互不影响 |

**v1.1 Store 拆分方案（规划中，v1.1 部分实现）：**
- `useStudyStore` — 学习流程 + FSRS 调度 + 暗色模式
- `useStatStore` — 学习统计 + 每日目标 + 打卡
- `useWordStore`（规划）— 词库数据 + 搜索筛选
- `useUIStore`（规划）— 视图模式 + 侧边栏

### 6.2 为什么 FSRS 训练用简化版 5 维算法？

| 维度 | 完整 FSRS 训练 | 简化 5 维训练 |
|------|---------------|---------------|
| 参数数量 | 19 个 | 5 个关键维度 |
| 训练数据需求 | 1000+ 次复习 | 50 次即可启动 |
| 计算复杂度 | 高（需优化器） | 低（统计计算） |
| 效果 | 最优 | 足够好（80% 效果） |

**决策：** v1.1 用简化版快速启动训练，积累更多数据后升级为完整版。

### 6.3 为什么暗色模式用 Tailwind `dark:` 而不是 CSS 变量？

| 维度 | CSS 变量 | Tailwind dark: |
|------|---------|----------------|
| 一致性 | 需手动维护变量映射 | 与设计系统一致 |
| 开发效率 | 每个组件写两套 | 直接在 class 中写 |
| Tree-shaking | 全量引入 | 自动按需 |
| 运行时切换 | 需 JS 操作 | 切换 class 即可 |

**决策：** Tailwind `dark:` 前缀 + `@custom-variant dark` 配置，运行时通过 `document.documentElement.classList.toggle('dark')` 切换。

---

## 七、v1.1 页面结构

```
/ (首页)
├── Header（词境 + 搜索 + 暗色切换 + 统计入口 + 设置入口）
├── 今日进度卡片（新词 N/M · 复习 N/M · 连续打卡 N 天）
├── 学习区域
│   ├── 速刷模式
│   └── 沉浸模式
└── 底部快捷键栏

/stats (统计) — v1.1 新增
├── 学习日历热力图
├── 趋势图（7天/30天/全部）
├── 记忆强度分布
└── 累计数据（总词数/总复习次数/总学习时长）

/settings (设置) — v1.1 新增
├── 外观（暗色模式切换）
├── 学习（每日目标设置）
├── 发音（TTS 提供商选择）
├── 数据管理（导入/导出/清空）
├── 词库管理（选择词库/查看进度）
└── 关于（版本信息/开源协议）
```

---

## 八、已知限制与改进方向

| # | 限制 | 影响 | 改进方向 | 版本 |
|---|------|------|----------|------|
| 1 | CMU 词典不含中文释义 | 依赖手动填入的 WordEntry | 集成免费词典 API | v1.2 |
| 2 | 音节划分算法为简化版 | 部分复杂词划分不准 | 实现完整 Maximal Onset Principle + 例外表 | v1.2 |
| 3 | 词库仅 510 词 | 远低于竞品 300+ 词书 | 加速扩充至 3000+ 词 | v1.2 |
| 4 | 无路由系统 | 单页面，URL 不变 | React Router v7 集成 | v1.2 |
| 5 | 无 PWA 支持 | 无法离线使用 | vite-plugin-pwa 集成 | v1.2 |
| 6 | 无拼写测试 | 只能"认"不能"写" | 听写模式 | v1.2 |
| 7 | 无搜索筛选 | 无法快速查找单词 | Cmd+K 搜索 | v1.2 |
| 8 | Store 未完全拆分 | useStudyStore 仍较大 | useWordStore + useUIStore 拆分 | v1.2 |
| 9 | 无 ErrorBoundary | 组件错误导致白屏 | 全局 + 页面级 ErrorBoundary | v1.2 |
| 10 | CMU 词典 3.9MB | 首次加载慢 | 按词频分片或紧凑二进制格式 | v1.2 |

---

## 九、变更日志

### v1.1.0 (2026-06-07) — 功能增强版本

**Bug 修复：**
- ✅ 示例数据重复插入报错（bulkAdd → bulkPut）
- ✅ 快捷键提示框 HTML 渲染问题（字符串 → JSX）
- ✅ 音节划分死循环（i-- → i = j - 1）

**核心功能：**
- ✅ 暗色模式（浅色/深色/跟随系统三模式切换）
- ✅ 学习统计面板（日历热力图 + 趋势图 + 记忆分布 + 每日目标）
- ✅ FSRS 参数自动训练（简化 5 维算法，每 50 次复习触发）
- ✅ 数据导入导出（JSON/CSV 双向）
- ✅ 词库扩充至 510 词（CET4 核心词汇，按字母分 6 个文件）

**架构改进：**
- ✅ 数据库 Schema 升级 v1 → v2（新增 settings 表，studyLogs 增强字段）
- ✅ FSRS 模块增强（6 个新函数，支持动态实例更新）
- ✅ Store 部分拆分（新增 useStatStore）

### v1.0.0 (2026-06-07) — MVP 初始版本

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

---

## 十、环境与依赖

### 10.1 运行环境要求

| 环境 | 最低版本 | 推荐版本 |
|------|---------|---------|
| Node.js | 18.0.0 | 20.x LTS |
| npm | 9.0.0 | 10.x |
| 浏览器 | Chrome 90+ / Safari 15+ / Firefox 90+ | 最新稳定版 |

### 10.2 依赖清单

#### 生产依赖

| 包名 | 版本 | 用途 | 协议 | 版本变更 |
|------|------|------|------|---------|
| `react` | ^19.2.0 | UI 框架 | MIT | v1.1 升级 |
| `react-dom` | ^19.2.0 | React DOM 渲染 | MIT | v1.1 升级 |
| `ts-fsrs` | ^5.4.0 | FSRS 间隔重复算法 | MIT | v1.1 升级 |
| `dexie` | ^4.4.0 | IndexedDB 封装 | Apache-2.0 | v1.1 升级 |
| `zustand` | ^5.0.5 | 状态管理 | MIT | — |
| `cmu-pronouncing-dictionary` | ^3.0.0 | CMU 发音词典 | ISC | — |
| `howler` | ^2.2.4 | 音频播放（预留） | MIT | — |
| `recharts` | ^2.x | 🆕 学习统计可视化 | MIT | v1.1 新增 |
| `lucide-react` | ^0.x | 🆕 统一图标库 | ISC | v1.1 新增 |

#### 开发依赖

| 包名 | 版本 | 用途 | 版本变更 |
|------|------|------|---------|
| `typescript` | ~6.0 | 类型检查 | v1.1 升级 |
| `vite` | ^8.0 | 构建工具 | v1.1 升级 |
| `@vitejs/plugin-react` | ^4.6.0 | React 支持 | — |
| `tailwindcss` | ^4.3.0 | CSS 框架 | — |
| `@tailwindcss/vite` | ^4.3.0 | Tailwind Vite 插件 | — |
| `eslint` | ^10.0 | 代码检查 | v1.1 升级 |
| `vitest` | ^3.x | 🆕 单元/组件测试 | v1.1 新增 |
| `@testing-library/react` | ^16.x | 🆕 组件测试 | v1.1 新增 |

---

## 十一、v1.2 规划

### Phase 1：架构改进
- React Router v7 路由集成
- Store 完全拆分（useWordStore + useUIStore）
- React ErrorBoundary
- 核心算法单元测试（Vitest）

### Phase 2：功能增强
- 搜索与筛选（Cmd+K）
- 拼写测试模式（听写）
- PWA 化（离线可用）
- 词库扩充至 3000+ 词

### Phase 3：后端上线
- 用户认证（better-auth + OAuth）
- 多端数据同步（IndexedDB ↔ PostgreSQL）
- 视频语境学习
- AI 助记生成

---

*文档版本：v1.1.0 | 最后更新：2026-06-07*
