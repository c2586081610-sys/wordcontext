# 词境 (WordContext) — v1.1 版本计划

> 版本：v1.1.0 | 日期：2026-06-07
> 基于 v1.0 MVP 的全面升级计划

---

## 一、完整技术栈

### 1.1 前端技术栈

| 分类 | 技术 | 版本 | 用途 | 状态 |
|------|------|------|------|------|
| **框架** | React | ^19.2 | UI 框架 | ✅ 已有 |
| **语言** | TypeScript | ~6.0 | 类型安全 | ✅ 已有 |
| **构建** | Vite | ^8.0 | 开发服务器 + 构建 | ✅ 已有 |
| **样式** | Tailwind CSS | ^4.3 | 原子化 CSS | ✅ 已有 |
| **状态** | Zustand | ^5.0 | 全局状态管理 | ✅ 已有 |
| **数据库** | Dexie.js | ^4.4 | IndexedDB 封装 | ✅ 已有 |
| **算法** | ts-fsrs | ^5.4 | FSRS 间隔重复 | ✅ 已有 |
| **发音** | cmu-pronouncing-dictionary | ^3.0 | CMU 发音词典 | ✅ 已有 |
| **音频** | Howler.js | ^2.2 | 音频播放（预留） | ✅ 已有 |
| **路由** | React Router | ^7.x | SPA 路由 | 🆕 v1.1 新增 |
| **图表** | Recharts | ^2.x | 学习统计可视化 | 🆕 v1.1 新增 |
| **日历** | react-calendar-heatmap | — | 学习热力图 | 🆕 v1.1 新增 |
| **PWA** | vite-plugin-pwa | ^1.x | Service Worker + 离线 | 🆕 v1.1 新增 |
| **测试** | Vitest + Testing Library | — | 单元/组件测试 | 🆕 v1.1 新增 |
| **图标** | Lucide React | — | 统一图标库 | 🆕 v1.1 新增 |
| **TTS** | Edge TTS (via API) | — | 高质量发音 | 🆕 v1.1 新增 |

### 1.2 后端技术栈（v1.1 预留，v1.2 实现）

| 分类 | 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|------|
| **运行时** | Node.js | 20 LTS | 服务端运行 | — |
| **框架** | Hono | ^4.x | 轻量 Web 框架 | Cloudflare Workers 兼容 |
| **ORM** | Drizzle ORM | ^0.38 | 类型安全 ORM | 零运行时开销 |
| **认证** | better-auth | ^1.x | 开源认证库 | 支持 OAuth/邮箱 |
| **验证** | Zod | ^3.x | 请求验证 | 与 Drizzle 共享 schema |
| **API 风格** | REST | — | 接口规范 | JSON 请求/响应 |
| **部署** | Cloudflare Workers | — | Serverless | 全球边缘节点 |
| **文件存储** | R2 | — | 对象存储 | 视频/文件上传 |

### 1.3 数据库技术栈

| 分类 | 技术 | 用途 | 说明 |
|------|------|------|------|
| **客户端存储** | IndexedDB (Dexie.js) | 本地数据持久化 | v1.0 已有，v1.1 优化 |
| **服务端数据库** | PostgreSQL | 用户/词库/学习记录 | v1.2 后端上线时使用 |
| **连接池** | Neon | Serverless PostgreSQL | Cloudflare 原生支持 |
| **迁移工具** | Drizzle Kit | Schema 迁移管理 | — |
| **缓存** | Cloudflare KV | 热数据缓存 | 词库/配置等 |

### 1.4 开发工具链

| 分类 | 技术 | 用途 |
|------|------|------|
| **包管理** | npm | 依赖管理 |
| **代码检查** | ESLint ^10 | 代码规范 |
| **类型检查** | TypeScript ~6.0 | 编译时类型安全 |
| **测试** | Vitest | 单元/集成测试 |
| **E2E 测试** | Playwright | 端到端测试 |
| **CI/CD** | GitHub Actions | 自动化构建部署 |
| **部署** | Cloudflare Pages | 前端静态托管 |

### 1.5 技术架构图（v1.1 目标）

```
┌─────────────────────────────────────────────────────────────────┐
│                        前端 (React SPA)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │ 首页     │ │ 学习页   │ │ 统计页   │ │ 设置页           │   │
│  │ /        │ │ /study   │ │ /stats   │ │ /settings        │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────────────┘   │
│       │            │            │             │                  │
│  ┌────┴────────────┴────────────┴─────────────┴──────────────┐  │
│  │                  React Router v7                           │  │
│  └────────────────────────┬──────────────────────────────────┘  │
│                           │                                     │
│  ┌────────────────────────┴──────────────────────────────────┐  │
│  │              Zustand Stores                                │  │
│  │  useWordStore │ useStudyStore │ useUIStore │ useStatStore  │  │
│  └──────┬───────────────┬──────────────┬─────────────────────┘  │
│         │               │              │                        │
│  ┌──────┴───────┐ ┌─────┴──────┐ ┌────┴──────┐                │
│  │  phonics/    │ │   fsrs/    │ │   db/     │                │
│  │  拼读引擎    │ │ FSRS+训练  │ │ Dexie.js  │                │
│  │  CMU Dict   │ │ ts-fsrs    │ │ IndexedDB │                │
│  └──────────────┘ └────────────┘ └───────────┘                │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Service Worker (PWA)                         │   │
│  │  离线缓存 │ 后台同步 │ 推送通知 │ 随身听模式              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                    v1.2 后端上线后
                              │
┌─────────────────────────────────────────────────────────────────┐
│                     后端 (Cloudflare Workers)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │ Auth     │ │ Sync     │ │ Words    │ │ Video            │   │
│  │ 认证服务 │ │ 数据同步 │ │ 词库API  │ │ 视频处理         │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────────────┘   │
│       │            │            │             │                  │
│  ┌────┴────────────┴────────────┴─────────────┴──────────────┐  │
│  │                    Hono API Server                         │  │
│  └────────────────────────┬──────────────────────────────────┘  │
│                           │                                     │
│  ┌────────────────────────┴──────────────────────────────────┐  │
│  │  PostgreSQL (Neon) │ Cloudflare R2 │ Cloudflare KV        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、v1.1 待办清单

### Phase 1：Bug 修复（P0 紧急）

- [ ] **BUG-1** 示例数据重复插入报错
  - 文件：`src/stores/useStudyStore.ts` init()
  - 问题：每次刷新都尝试 bulkAdd，第二次起全部 ConstraintError
  - 方案：改为 `db.words.where('id').anyOf(SAMPLE_WORDS.map(w=>w.id)).count()` 判断是否已插入，或用 `bulkPut` 替代 `bulkAdd`

- [ ] **BUG-2** 快捷键提示框 HTML 渲染问题
  - 文件：`src/components/WordList/index.tsx` L226
  - 问题：JSX 字符串中 `<span class="kbd">` 不会渲染为 HTML
  - 方案：改为 JSX 元素渲染

- [ ] **BUG-3** 音节划分死循环（已修复，需验证）
  - 文件：`src/lib/phonics/engine.ts` syllabify()
  - 验证：对各种边界词（单辅音、连续元音、短词）测试

### Phase 2：核心功能（P1 高优）

- [ ] **FEAT-1** 扩充词库 20词 → 500+词
  - 数据源：开源 CET4 词库（ECDICT 等）
  - 格式：转换为 WordEntry 结构，含音标/释义/例句/词根/助记
  - 词库分表：CET4 / CET6 / 考研 / 雅思 / 托福
  - 助记/词根：可用 AI 批量生成后人工校验

- [ ] **FEAT-2** 暗色模式
  - Tailwind `dark:` 前缀 + `prefers-color-scheme` 系统跟随
  - 手动切换按钮（Header 右侧）
  - CSS 变量切换：`--color-bg-light` ↔ `--color-bg-dark`
  - 毛玻璃效果适配暗色：`glass` → `glass-dark`
  - 持久化偏好到 localStorage

- [ ] **FEAT-3** 学习统计面板
  - 新增路由：`/stats`
  - 学习日历热力图（类 GitHub 贡献图）
  - 每日学习量趋势图（Recharts 折线图）
  - 记忆强度分布饼图
  - 每日目标设置（新词 N 个 / 复习 N 个）
  - 连续打卡天数 + 最长连续天数
  - 今日进度环形图

- [ ] **FEAT-4** FSRS 参数自动训练
  - 完善复习日志：记录 `state`、`elapsed_days`、`scheduled_days`、`review_duration`
  - 训练触发：每 50 次复习后后台训练一次
  - 使用 `ts-fsrs` 的 `generatorParameters()` 从复习记录训练
  - 训练后参数持久化到 IndexedDB `settings` 表
  - 启动时加载已训练参数：`fsrs({ parameters: savedParams })`
  - 训练进度提示（首次训练需积累数据）

- [ ] **FEAT-5** 数据导入导出
  - 导出格式：JSON（完整数据）、CSV（表格）、Anki（.apkg）
  - 导入格式：JSON、CSV、Anki .apkg
  - 导出范围：全部 / 按词库 / 按标签
  - 导入时去重策略：跳过 / 覆盖 / 合并
  - 设置页新增"数据管理"区域

### Phase 3：体验优化（P2 中优）

- [ ] **UX-1** 速刷模式集成自然拼读
  - 选中词展开 PhonicsDisplay（可折叠）
  - 默认折叠，点击或按 `P` 键展开

- [ ] **UX-2** 选择题智能干扰项
  - 按词性（pos）优先匹配
  - 同词性池中随机选择
  - 避免已学过的简单词作为干扰项

- [ ] **UX-3** 搜索与筛选
  - Header 添加搜索框（Cmd+K 唤起）
  - 按标签筛选（CET4/考研/雅思）
  - 按状态筛选（新词/学习中/待复习）
  - 搜索结果高亮匹配

- [ ] **UX-4** 拼写测试模式
  - 新增子模式：听写模式
  - 播放发音 → 用户输入拼写 → 实时校验
  - 错误字母标红提示
  - 拼写正确后自动标记为"熟悉"

- [ ] **UX-5** 发音质量升级
  - 集成 Edge TTS API（免费、接近真人）
  - 保留 Web Speech API 作为离线 fallback
  - 音素级发音仍用 Web Speech API

- [ ] **UX-6** 每日目标与打卡
  - 每日新词目标 + 复习目标
  - 完成时庆祝动画
  - 连续打卡天数显示
  - Header 统计区显示今日进度

### Phase 4：架构改进（P2-P3）

- [ ] **ARCH-1** 添加 React Router 路由
  - 路由表：
    - `/` — 首页/学习
    - `/study` — 学习页（速刷/沉浸）
    - `/stats` — 统计面板
    - `/settings` — 设置页
    - `/word/:id` — 单词详情页
  - 懒加载各页面组件

- [ ] **ARCH-2** PWA 化
  - `vite-plugin-pwa` 集成
  - Service Worker 缓存策略：
    - App Shell：Cache First
    - CMU 词典：Cache First
    - API（未来）：Network First
  - `manifest.json` 配置（图标/主题色/启动页）
  - 离线可用性保障

- [ ] **ARCH-3** 核心算法单元测试
  - `src/lib/phonics/__tests__/engine.test.ts`
    - 音节划分：常见词/边界词/CMU 未收录词
    - 重音定位
    - 音素解析
  - `src/lib/fsrs/__tests__/index.test.ts`
    - 调度计算
    - 状态转换
    - 记忆强度计算
  - `src/lib/db/__tests__/db.test.ts`
    - CRUD 操作
    - 索引查询
  - `src/stores/__tests__/useStudyStore.test.ts`
    - 初始化流程
    - 评价流程
    - 统计计算

- [ ] **ARCH-4** React ErrorBoundary
  - 全局 ErrorBoundary 包裹 App
  - 页面级 ErrorBoundary 包裹各路由
  - 友好错误页面 + 重试按钮
  - 错误上报（console + 未来 Sentry）

- [ ] **ARCH-5** Store 拆分重构
  - `useWordStore` — 词库数据 + 搜索筛选
  - `useStudyStore` — 学习流程 + FSRS 调度
  - `useUIStore` — 视图模式 + 暗色模式 + 侧边栏
  - `useStatStore` — 学习统计 + 每日目标

- [ ] **ARCH-6** CMU 词典压缩优化
  - 当前：3.9MB JSON（986KB gzip）
  - 方案：转为紧凑二进制格式（Map<number, string>），预计压缩 60%+
  - 或按词频分片：前 5000 高频词独立 chunk，其余按需加载

---

## 三、v1.1 数据库 Schema 变更

### 新增表

```typescript
// 用户设置
type SettingsEntry = {
  id: string;                    // 'default'
  theme: 'light' | 'dark' | 'system';
  dailyNewWordGoal: number;      // 每日新词目标
  dailyReviewGoal: number;       // 每日复习目标
  fsrsParameters: number[] | null; // 训练后的 FSRS 参数
  lastTrainedAt: Date | null;    // 上次参数训练时间
  ttsProvider: 'web-speech' | 'edge-tts';
};

// 每日统计快照
type DailyStatEntry = {
  id: string;                    // '2026-06-07'
  date: string;
  newWordsLearned: number;
  wordsReviewed: number;
  totalReviews: number;
  correctRate: number;           // 正确率
  studyMinutes: number;
};
```

### studyLogs 表增强

```typescript
type StudyLog = {
  id?: number;
  date: string;
  wordId: string;
  rating: number;
  timeSpent: number;             // 秒
  // v1.1 新增字段
  state: number;                 // 评价时的卡片状态
  elapsed_days: number;          // 距上次复习天数
  scheduled_days: number;        // 原计划间隔天数
  review_duration: number;       // 本次复习耗时（毫秒）
};
```

---

## 四、v1.1 页面结构

```
/ (首页)
├── Header（词境 + 搜索 + 暗色切换 + 统计入口）
├── 今日进度卡片（新词 N/M · 复习 N/M · 连续打卡 N 天）
├── 学习区域
│   ├── 速刷模式
│   └── 沉浸模式
└── 底部快捷键栏

/stats (统计)
├── 学习日历热力图
├── 趋势图（7天/30天/全部）
├── 记忆强度分布
└── 累计数据（总词数/总复习次数/总学习时长）

/settings (设置)
├── 外观（暗色模式切换）
├── 学习（每日目标设置）
├── 发音（TTS 提供商选择）
├── 数据管理（导入/导出/清空）
├── 词库管理（选择词库/查看进度）
└── 关于（版本信息/开源协议）
```

---

## 五、版本里程碑

| 里程碑 | 内容 | 依赖 |
|--------|------|------|
| **v1.1-alpha** | Bug 修复 + 词库扩充 + 暗色模式 | 无 |
| **v1.1-beta** | 学习统计 + FSRS 训练 + 路由 | alpha |
| **v1.1-rc** | 数据导入导出 + PWA + 搜索筛选 + 测试 | beta |
| **v1.1.0** | 全部功能 + 体验优化 + 文档更新 | rc |

---

## 六、v1.2 远期规划（后端上线）

- 用户认证（better-auth + OAuth）
- 多端数据同步（IndexedDB ↔ PostgreSQL）
- 视频语境学习（上传 → Whisper 转写 → AI 提取词汇）
- AI 助记生成（LLM API）
- Chrome 扩展（网页划词收藏）
- 随身听模式（后台播放单词发音）

---

*v1.1 版本计划 | 2026-06-07*
