# 更新日志

本项目所有重要变更均会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [1.1.0] - 2026-06-07

### Added

- **词库扩充**：示例词汇从 20 词扩充至 510 词（CET4 核心词汇），按字母分为 6 个数据文件（sampleData1~6.ts）
- **暗色模式**：支持浅色 / 深色 / 跟随系统三种模式循环切换，Header 右侧图标按钮操作，偏好持久化至 localStorage（key: `wordcontext-theme`），监听 `prefers-color-scheme` 媒体查询自动跟随系统
- **学习统计面板**：新增 `StatsPanel` 组件与 `useStatStore` 状态管理，包含五个区块——今日进度（双环形进度图）、学习日历（3 个月 CSS grid 热力图）、学习趋势（Recharts 折线图，7 天 / 30 天切换）、记忆强度分布（环形饼图 + 水平条形图）、累计数据
- **FSRS 参数自动训练**：增强 StudyLog 字段（state / elapsed_days / scheduled_days / review_duration），新增 settings 表持久化训练参数，简化版 5 维参数优化算法，累计 50 次复习后触发首次训练，之后每 50 次重新训练
- **数据导入导出**：新增 `DataManager` 组件与 `lib/io` 模块，支持 JSON（完整数据）和 CSV（单词表）双向导入导出，拖拽上传，导入时自动识别格式并去重跳过，清空数据需二次确认
- **数据库 Schema 升级**：从 v1 升级至 v2，新增 `settings` 表与 `DailyStatEntry` 类型，studyLogs 表新增 4 个字段

### Fixed

- **示例数据重复插入报错**：`useStudyStore.ts` 中 `init()` 的 `bulkAdd` 改为 `bulkPut`（Dexie upsert 操作），消除重复刷新时的 `ConstraintError: Key already exists in the object store`
- **快捷键提示框 HTML 渲染问题**：`WordList/index.tsx` 中悬浮提示从字符串拼接改为 JSX Fragment 渲染，`<span class="kbd">` 不再作为纯文本显示
- **音节划分死循环**：`phonics/engine.ts` 中 `syllabify()` 单辅音回退逻辑从 `i--` 改为 `i = j - 1`，消除 `RangeError: Invalid array length`

### Changed

- `useStudyStore.ts`：ViewMode 扩展（新增 stats / settings），集成暗色模式状态与 FSRS 训练逻辑
- `Header/index.tsx`：新增暗色模式切换按钮、统计面板入口、设置入口
- `App.tsx`：监听 `resolvedTheme` 变化同步 `dark` class 至 `document.documentElement`，新增 stats / settings 视图
- `index.css`：添加 `@custom-variant dark`、暗色 CSS 变量、`.dark` 覆盖样式
- `WordList/index.tsx`、`WordDetail/index.tsx`、`PhonicsDisplay/index.tsx`：全面添加 `dark:` 暗色样式适配
- `lib/db/sampleData.ts`：合并 6 个分文件导出 510 词，SAMPLE_DECKS 的 wordCount 和 wordIds 同步更新

---

## [1.0.0] - 2026-06-07

### Added

- **列表速刷模式**：炭炭式一屏多词界面，悬停释义，右侧三段评价（熟悉 / 模糊 / 忘记），评价后飞出动画 + 自动跳转
- **沉浸详情模式**：扇贝式单词详情，含选择释义（四选一）与三段评价两种子模式
- **FSRS 间隔重复算法集成**：基于 ts-fsrs 实现，支持卡片创建、复习调度、状态查询、记忆强度计算
- **自然拼读可视化**：基于 CMU Pronouncing Dictionary（13.4 万词）实现音节划分、音素解析、重音定位、ARPAbet→IPA 转换，颜色编码区分辅音 / 元音 / 组合 / R 控元音 / 静音字母
- **音标发音**：Web Speech API 整词发音与逐音素发音，点击音节 / 音素可交互播放
- **本地持久化**：IndexedDB（Dexie.js）4 张表（words / cards / decks / studyLogs），支持索引查询与事务操作
- **macOS 风格毛玻璃 UI**：`backdrop-blur` 毛玻璃卡片 + 圆角 + 阴影，视觉风格对标原生 macOS 应用
- **全键盘快捷键**：J/K 导航、1/2/3 评价、Space 释义、Enter 发音
- **20 个 CET4 示例词汇**：含完整字段（id / word / phonetic / definitions / examples / etymology / wordFamily / mnemonic / tags）

---

[1.1.0]: https://github.com/wordcontext/wordcontext/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/wordcontext/wordcontext/releases/tag/v1.0.0
