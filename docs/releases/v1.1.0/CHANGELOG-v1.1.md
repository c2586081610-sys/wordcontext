# 词境 (WordContext) — v1.1 修复与升级文档

> 版本：v1.1.0 | 日期：2026-06-07
> 从 v1.0.0 升级至 v1.1.0 的完整变更记录

---

## 一、Phase 1：Bug 修复

### BUG-1：示例数据重复插入报错

| 项目 | 内容 |
|------|------|
| **文件** | `src/stores/useStudyStore.ts` |
| **问题** | `init()` 使用 `bulkAdd()` 写入示例数据，第二次刷新时因主键冲突抛出 `ConstraintError: Key already exists in the object store` |
| **修复** | 将 `bulkAdd` 改为 `bulkPut`（Dexie 的 upsert 操作，存在则更新，不存在则插入） |
| **影响** | 消除控制台红色报错，数据初始化更健壮 |

```typescript
// 修复前
await db.words.bulkAdd(SAMPLE_WORDS);
await db.decks.bulkAdd(SAMPLE_DECKS);

// 修复后
await db.words.bulkPut(SAMPLE_WORDS);
await db.decks.bulkPut(SAMPLE_DECKS);
```

---

### BUG-2：快捷键提示框 HTML 渲染问题

| 项目 | 内容 |
|------|------|
| **文件** | `src/components/WordList/index.tsx` |
| **问题** | 悬浮提示使用字符串拼接 `'按 <span class="kbd">1</span> ...'`，React 将其作为纯文本渲染，`<span>` 标签直接显示在页面上 |
| **修复** | 改为 JSX Fragment 渲染，`<span className="kbd">` 作为真实 DOM 元素 |

```typescript
// 修复前
{hoveredRating === 'easy' && '按 <span class="kbd">1</span> 标记为熟悉 — 大幅延长复习间隔'}

// 修复后
{hoveredRating === 'easy' && <>按 <span className="kbd">1</span> 标记为熟悉 — 大幅延长复习间隔</>}
```

---

### BUG-3：音节划分死循环

| 项目 | 内容 |
|------|------|
| **文件** | `src/lib/phonics/engine.ts` |
| **问题** | `syllabify()` 在单辅音情况下使用 `i--` 回退，但 for 循环的 `i++` 又抵消了回退，导致无限循环 → `RangeError: Invalid array length` |
| **修复** | 改为 `i = j - 1`，直接跳到辅音位置让下一轮循环处理 |
| **验证** | 对 20 个常见词测试，无限循环已消除。部分词音节划分精度仍有提升空间（后续优化项） |

```typescript
// 修复前
i--; // 回退，让下一个循环处理这个辅音

// 修复后
i = j - 1; // 跳到辅音，让下一个循环处理
```

---

## 二、Phase 2：核心功能

### FEAT-1：扩充词库 20词 → 510词

| 项目 | 内容 |
|------|------|
| **规模** | 从 20 个 CET4 示例词汇扩充到 **510 个** CET4 核心词汇 |
| **文件结构** | 按字母分 6 个文件，在 `sampleData.ts` 中合并导出 |

| 文件 | 字母范围 | 词条数 |
|------|---------|--------|
| `sampleData1.ts` | A-B | 45 |
| `sampleData2.ts` | C-D | 91 |
| `sampleData3.ts` | E-H | 66 |
| `sampleData4.ts` | I-O | 85 |
| `sampleData5.ts` | P-S | 106 |
| `sampleData6.ts` | T-Z + 补充 | 117 |

**数据质量：**
- 每个词条含完整字段：id, word, phonetic, definitions, examples, etymology, wordFamily, mnemonic, tags
- 音标使用 IPA 格式
- 例句地道实用
- 助记包含谐音、词根联想、场景联想等多种方式
- SAMPLE_DECKS 的 wordCount 和 wordIds 已同步更新

---

### FEAT-2：暗色模式

| 项目 | 内容 |
|------|------|
| **模式** | 浅色 / 深色 / 跟随系统（三种模式循环切换） |
| **切换方式** | Header 右侧太阳/月亮/电脑图标按钮 |
| **持久化** | localStorage（key: `wordcontext-theme`） |
| **系统跟随** | 监听 `prefers-color-scheme` 媒体查询变化 |

**修改的文件：**

| 文件 | 变更 |
|------|------|
| `src/index.css` | 添加 `@custom-variant dark`、暗色 CSS 变量、`.dark` 覆盖样式 |
| `src/stores/useStudyStore.ts` | 新增 `ThemeMode` 类型、`theme`/`resolvedTheme` 状态、`setTheme()`/`toggleTheme()` 方法 |
| `src/App.tsx` | 监听 `resolvedTheme` 变化同步 `dark` class 到 `document.documentElement` |
| `src/components/Header/index.tsx` | 新增主题切换按钮（SunIcon/MoonIcon/SystemIcon） |
| `src/components/WordList/index.tsx` | 全面添加 `dark:` 样式适配 |
| `src/components/WordDetail/index.tsx` | 全面添加 `dark:` 样式适配 |
| `src/components/PhonicsDisplay/index.tsx` | 暗色背景/文字/边框适配 |

**暗色配色方案：**

| 元素 | 亮色 | 暗色 |
|------|------|------|
| 背景 | `#F8FAFC` | `#0F172A` |
| 卡片 | `rgba(255,255,255,0.72)` | `rgba(15,23,42,0.72)` |
| 主文字 | `slate-800` | `slate-200` |
| 次要文字 | `slate-500` | `slate-400` |
| 边框 | `slate-100/200` | `slate-700/600` |

---

### FEAT-3：学习统计面板

| 项目 | 内容 |
|------|------|
| **入口** | Header "统计" 按钮 |
| **视图模式** | `viewMode === 'stats'` |

**新增文件：**

| 文件 | 功能 |
|------|------|
| `src/stores/useStatStore.ts` | 统计状态管理（每日统计/连续打卡/今日进度/记忆分布/每日目标） |
| `src/components/StatsPanel/index.tsx` | 统计面板 UI 组件 |

**统计面板包含五个区块：**

1. **今日进度** — 双环形进度图（新词 N/M · 复习 N/M）+ 连续打卡天数 + 正确率/学习时长
2. **学习日历** — 最近 3 个月 CSS grid 热力图，5 级蓝色渐变
3. **学习趋势** — Recharts 折线图，支持 7天/30天 切换
4. **记忆强度分布** — Recharts 环形饼图 + 水平条形图
5. **累计数据** — 总词数/总复习次数/总学习时长

**数据库新增类型：**
```typescript
type DailyStatEntry = {
  id: string;                 // date as id
  date: string;
  newWordsLearned: number;
  wordsReviewed: number;
  totalReviews: number;
  correctRate: number;
  studyMinutes: number;
};
```

---

### FEAT-4：FSRS 参数自动训练

| 项目 | 内容 |
|------|------|
| **训练阈值** | 累计 50 次复习后触发首次训练，之后每 50 次重新训练 |
| **训练方式** | 简化版 5 维参数优化算法 |
| **持久化** | settings 表（id: 'fsrs'） |

**修改的文件：**

| 文件 | 变更 |
|------|------|
| `src/lib/db/index.ts` | StudyLog 新增 `state`/`elapsed_days`/`scheduled_days`/`review_duration` 字段；新增 `SettingsEntry` 类型和 `settings` 表；数据库版本升级 v1→v2 |
| `src/lib/fsrs/index.ts` | 新增 `getFSRS()`/`updateFSRSInstance()`/`scheduleReviewWithLog()`/`loadFSRSParameters()`/`trainParameters()`/`checkAndTrainIfNeeded()` |
| `src/stores/useStudyStore.ts` | `init()` 中加载已训练参数；`rateWord()` 中记录增强日志并检查训练条件 |

**简化版 5 维训练算法：**

| 维度 | 优化参数 | 依据 |
|------|---------|------|
| 实际记忆保持率 | `request_retention` | Review 状态下成功回忆比例 |
| 首次评价分布 | `w[0]-w[3]` 初始稳定性 | 用户评分倾向 |
| 评价难度分布 | `w[4]` 难度参数 | Again/Easy 比例 |
| 复习间隔表现 | `w[8]` 稳定性增长因子 | 成功/遗忘的平均间隔比 |
| 复习速度 | `w[17]` 短期记忆参数 | Learning 状态下的平均耗时 |

---

### FEAT-5：数据导入导出

| 项目 | 内容 |
|------|------|
| **导出格式** | JSON（完整数据）、CSV（单词表） |
| **导入格式** | JSON、CSV（自动识别） |
| **入口** | Header 齿轮图标 → 设置视图 |

**新增文件：**

| 文件 | 功能 |
|------|------|
| `src/lib/io/index.ts` | 数据导入导出核心模块 |
| `src/components/DataManager/index.tsx` | 数据管理 UI 组件 |

**核心功能：**

| 功能 | 说明 |
|------|------|
| `exportAll(format)` | 导出全部数据（JSON 含 words/cards/decks/studyLogs，CSV 含单词表） |
| `exportByDeck(deckId, format)` | 按词库导出 |
| `importData(file)` | 导入数据（自动识别格式，去重跳过已有数据） |
| `clearAllData()` | 清空所有数据（需二次确认） |

**JSON 导出格式：**
```json
{
  "version": "1.1",
  "exportDate": "2026-06-07T12:00:00.000Z",
  "words": [...],
  "cards": [...],
  "decks": [...],
  "studyLogs": [...]
}
```

**CSV 导出格式：** `word,phonetic,pos,meaning,tags,state,stability,due`，带 UTF-8 BOM 头

**DataManager UI 三个区域：**
- 导出区域：格式选择 + 范围选择 + 导出按钮
- 导入区域：拖拽上传 + 文件选择 + 预览 + 确认
- 危险区域：清空数据（红色警示 + 二次确认）

---

## 三、变更文件清单

### 新增文件（8 个）

| 文件 | 说明 |
|------|------|
| `src/lib/db/sampleData1.ts` | 词库数据 A-B（45词） |
| `src/lib/db/sampleData2.ts` | 词库数据 C-D（91词） |
| `src/lib/db/sampleData3.ts` | 词库数据 E-H（66词） |
| `src/lib/db/sampleData4.ts` | 词库数据 I-O（85词） |
| `src/lib/db/sampleData5.ts` | 词库数据 P-S（106词） |
| `src/lib/db/sampleData6.ts` | 词库数据 T-Z（117词） |
| `src/stores/useStatStore.ts` | 学习统计状态管理 |
| `src/components/StatsPanel/index.tsx` | 统计面板组件 |
| `src/lib/io/index.ts` | 数据导入导出模块 |
| `src/components/DataManager/index.tsx` | 数据管理 UI 组件 |

### 修改文件（8 个）

| 文件 | 变更摘要 |
|------|---------|
| `src/stores/useStudyStore.ts` | bulkPut修复 + ViewMode扩展 + 暗色模式状态 + FSRS训练集成 |
| `src/lib/db/index.ts` | StudyLog增强 + SettingsEntry + DailyStatEntry + DB v2 |
| `src/lib/fsrs/index.ts` | 参数训练6个新函数 + FSRS实例动态更新 |
| `src/lib/phonics/engine.ts` | syllabify死循环修复 |
| `src/components/WordList/index.tsx` | 快捷键提示修复 + 暗色模式适配 |
| `src/components/WordDetail/index.tsx` | 暗色模式适配 |
| `src/components/PhonicsDisplay/index.tsx` | 暗色模式适配 |
| `src/components/Header/index.tsx` | 暗色切换按钮 + 统计入口 + 设置入口 |
| `src/App.tsx` | 暗色模式class同步 + stats/settings视图 |
| `src/index.css` | 暗色CSS变量 + @custom-variant dark |
| `src/lib/db/sampleData.ts` | 合并6个分文件导出510词 |

---

## 四、数据库 Schema 变更（v1 → v2）

### studyLogs 表新增字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `state` | `number` | 评价时的卡片状态 |
| `elapsed_days` | `number` | 距上次复习天数 |
| `scheduled_days` | `number` | 原计划间隔天数 |
| `review_duration` | `number` | 本次复习耗时（毫秒） |

### 新增表

| 表名 | 主键 | 说明 |
|------|------|------|
| `settings` | `id` | 用户设置（FSRS参数/主题/目标等） |

---

## 五、验证结果

| 检查项 | 结果 |
|--------|------|
| TypeScript 编译 (`tsc --noEmit`) | ✅ 零错误 |
| Vite 开发服务器启动 | ✅ 正常 |
| 浏览器加载 | ✅ 无报错 |
| 词库数据 | ✅ 510词完整 |
| 暗色模式切换 | ✅ 三模式循环 |
| 统计面板 | ✅ 五区块显示 |
| FSRS 训练 | ✅ 逻辑完整，待积累数据后触发 |
| 数据导入导出 | ✅ JSON/CSV 双向 |

---

*v1.1 修复与升级文档 | 2026-06-07*
