# 词境 (WordContext) — 文件夹命名规范

> 本文档规定词境项目的文件夹结构规则、命名模式和文件放置要求，确保项目组织一致、可维护、可追溯。

---

## 一、项目整体文件夹结构规则

### 1.1 根目录结构

```
词境/                                  # 项目根目录
├── wordcontext/                       # 代码目录（前端应用）
│   ├── src/                           # 源代码
│   │   ├── assets/                    # 静态资源（图片、图标等）
│   │   ├── components/                # React 组件（按功能模块分文件夹）
│   │   ├── lib/                       # 核心库/工具模块
│   │   ├── stores/                    # Zustand 状态管理
│   │   ├── App.tsx                    # 应用入口组件
│   │   ├── App.css                    # 应用样式
│   │   ├── index.css                  # 全局样式
│   │   └── main.tsx                   # 渲染入口
│   ├── public/                        # 公共静态资源（不经过构建）
│   ├── dist/                          # 构建产物（不提交 Git）
│   ├── package.json                   # 项目配置
│   ├── vite.config.ts                 # Vite 配置
│   ├── tsconfig.json                  # TypeScript 配置
│   └── eslint.config.js               # ESLint 配置
├── docs/                              # 项目文档
│   ├── templates/                     # 文档模板
│   ├── standards/                     # 规范文档
│   └── releases/                      # 版本发布材料
│       └── v{MAJOR}.{MINOR}.{PATCH}/  # 按版本号组织
└── PROJECT.md                         # 项目概览文档
```

### 1.2 命名基本原则

| 规则 | 说明 | 正确示例 | 错误示例 |
|------|------|---------|---------|
| 使用小写字母 | 文件夹名全部小写 | `components/` | `Components/` |
| 使用短横线分隔 | 多词文件夹用 `-` 连接 | `sample-data/` | `sampleData/`、`sample_data/` |
| 见名知义 | 文件夹名应清晰表达内容 | `phonics/` | `mod1/`、`utils2/` |
| 避免缩写 | 除非是通用缩写 | `database/` | `db/`（代码目录中 `db/` 已为约定俗成，可保留） |
| 不使用数字前缀 | 不用数字排序 | `assets/` | `01-assets/` |

---

## 二、版本更新材料的文件夹命名模式

### 2.1 版本发布文件夹

版本发布材料统一存放在 `docs/releases/` 下，每个版本一个文件夹：

```
docs/releases/v{MAJOR}.{MINOR}.{PATCH}/
```

**命名规则：**

- 前缀 `v` 必须小写
- 版本号三段式：`MAJOR.MINOR.PATCH`
- 每段为非负整数，无前导零
- 示例：`v1.0.0/`、`v1.1.0/`、`v2.0.0/`

### 2.2 版本发布文件夹内的标准文件清单

每个版本发布文件夹内应包含以下标准文件：

```
docs/releases/v{MAJOR}.{MINOR}.{PATCH}/
├── CHANGELOG.md          # 变更日志（必选）
├── VERSION_PLAN.md       # 版本计划（必选，仅 MINOR 及以上版本）
├── MIGRATION_GUIDE.md    # 迁移指南（可选，有破坏性变更时必选）
├── RELEASE_NOTES.md      # 发布说明（可选，面向用户的摘要）
└── assets/               # 版本相关素材（可选，截图、视频等）
```

**文件说明：**

| 文件 | 必选/可选 | 说明 |
|------|---------|------|
| `CHANGELOG.md` | 必选 | 完整的版本变更记录，包含新增、修改、删除、修复的详细列表 |
| `VERSION_PLAN.md` | MINOR 及以上必选 | 版本开发计划，包含里程碑、待办清单、技术方案 |
| `MIGRATION_GUIDE.md` | 有破坏性变更时必选 | 从上一版本升级的迁移指南，包含数据迁移、API 变更、配置变更 |
| `RELEASE_NOTES.md` | 可选 | 面向用户的发布摘要，突出新功能和重要修复 |
| `assets/` | 可选 | 版本相关的截图、视频、架构图等素材 |

---

## 三、文件放置要求

### 3.1 代码目录（wordcontext/src/）

| 文件类型 | 放置位置 | 命名规范 | 示例 |
|---------|---------|---------|------|
| React 组件 | `src/components/{ComponentName}/` | PascalCase 文件夹，`index.tsx` 入口 | `src/components/WordList/index.tsx` |
| 组件样式 | 与组件同目录 | 与组件同名 `.css` 或使用 Tailwind | `src/components/WordList/WordList.css` |
| 核心库模块 | `src/lib/{module-name}/` | kebab-case 文件夹 | `src/lib/phonics/` |
| 库入口文件 | `src/lib/{module-name}/index.ts` | `index.ts` | `src/lib/fsrs/index.ts` |
| 库子模块 | `src/lib/{module-name}/{sub}.ts` | kebab-case 文件名 | `src/lib/phonics/engine.ts` |
| 状态管理 | `src/stores/` | camelCase，`use` 前缀 | `src/stores/useStudyStore.ts` |
| 静态资源 | `src/assets/` | kebab-case | `src/assets/hero.png` |
| 测试文件 | 与被测文件同目录的 `__tests__/` | `{name}.test.ts` | `src/lib/phonics/__tests__/engine.test.ts` |

### 3.2 文档目录（docs/）

| 文件类型 | 放置位置 | 命名规范 | 示例 |
|---------|---------|---------|------|
| 文档模板 | `docs/templates/` | SCREAMING_SNAKE_CASE | `VERSION_UPDATE_TEMPLATE.md` |
| 规范文档 | `docs/standards/` | SCREAMING_SNAKE_CASE | `FOLDER_NAMING_CONVENTIONS.md` |
| 版本发布材料 | `docs/releases/v{版本号}/` | SCREAMING_SNAKE_CASE | `CHANGELOG.md` |
| API 文档 | `docs/api/` | kebab-case | `fsrs-api.md` |
| 用户指南 | `docs/user-guide/` | kebab-case | `getting-started.md` |
| 数据库文档 | `docs/database/` | kebab-case | `schema.md` |

### 3.3 项目根目录

| 文件类型 | 放置位置 | 说明 |
|---------|---------|------|
| 项目概览 | `PROJECT.md` | 项目整体介绍、技术栈、架构 |
| 产品设计 | `产品设计方案.md` | 产品设计文档 |
| 市场调研 | `市场调研报告.md` | 市场分析文档 |

---

## 四、目录树示例

### 4.1 完整项目目录树

```
词境/
├── wordcontext/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── components/
│   │   │   ├── DataManager/
│   │   │   │   └── index.tsx
│   │   │   ├── Header/
│   │   │   │   └── index.tsx
│   │   │   ├── PhonicsDisplay/
│   │   │   │   └── index.tsx
│   │   │   ├── StatsPanel/
│   │   │   │   └── index.tsx
│   │   │   ├── WordDetail/
│   │   │   │   └── index.tsx
│   │   │   └── WordList/
│   │   │       └── index.tsx
│   │   ├── lib/
│   │   │   ├── db/
│   │   │   │   ├── __tests__/
│   │   │   │   │   └── db.test.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── sampleData.ts
│   │   │   │   ├── sampleData1.ts
│   │   │   │   ├── sampleData2.ts
│   │   │   │   ├── sampleData3.ts
│   │   │   │   ├── sampleData4.ts
│   │   │   │   ├── sampleData5.ts
│   │   │   │   └── sampleData6.ts
│   │   │   ├── fsrs/
│   │   │   │   ├── __tests__/
│   │   │   │   │   └── index.test.ts
│   │   │   │   └── index.ts
│   │   │   ├── io/
│   │   │   │   └── index.ts
│   │   │   └── phonics/
│   │   │       ├── __tests__/
│   │   │       │   └── engine.test.ts
│   │   │       ├── engine.ts
│   │   │       ├── index.ts
│   │   │       ├── rules.ts
│   │   │       └── types.ts
│   │   ├── stores/
│   │   │   ├── __tests__/
│   │   │   │   └── useStudyStore.test.ts
│   │   │   ├── useStatStore.ts
│   │   │   └── useStudyStore.ts
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── dist/                            # 构建产物（.gitignore）
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── eslint.config.js
│   └── index.html
├── docs/
│   ├── templates/
│   │   ├── VERSION_UPDATE_TEMPLATE.md
│   │   └── CODE_FIX_TEMPLATE.md
│   ├── standards/
│   │   └── FOLDER_NAMING_CONVENTIONS.md
│   ├── api/
│   │   └── (API 文档)
│   ├── user-guide/
│   │   └── (用户指南)
│   ├── database/
│   │   └── (数据库文档)
│   └── releases/
│       ├── v1.0.0/
│       │   ├── CHANGELOG.md
│       │   └── VERSION_PLAN.md
│       └── v1.1.0/
│           ├── CHANGELOG.md
│           ├── VERSION_PLAN.md
│           └── RELEASE_NOTES.md
├── PROJECT.md
├── 产品设计方案.md
└── 市场调研报告.md
```

### 4.2 版本发布目录示例

```
docs/releases/
├── v1.0.0/
│   ├── CHANGELOG.md
│   └── VERSION_PLAN.md
├── v1.0.1/
│   └── CHANGELOG.md
├── v1.1.0/
│   ├── CHANGELOG.md
│   ├── VERSION_PLAN.md
│   ├── MIGRATION_GUIDE.md
│   ├── RELEASE_NOTES.md
│   └── assets/
│       ├── dark-mode-preview.png
│       └── stats-panel-screenshot.png
└── v2.0.0/
    ├── CHANGELOG.md
    ├── VERSION_PLAN.md
    ├── MIGRATION_GUIDE.md
    └── RELEASE_NOTES.md
```

---

## 五、命名禁忌

### 5.1 不允许的字符

| 禁忌 | 说明 | 错误示例 | 正确示例 |
|------|------|---------|---------|
| 空格 | 文件夹名不得包含空格 | `my folder/` | `my-folder/` |
| 中文 | 代码目录和 docs 子目录不得使用中文 | `组件/` | `components/` |
| 特殊符号 | 不得使用 `@ # $ % ^ & * ! ~ \` 等 | `v1.0@beta/` | `v1.0.0/` |
| 前导零 | 版本号段不得有前导零 | `v01.01.00/` | `v1.1.0/` |
| 下划线 | 文件夹名不使用下划线（`__tests__` 除外） | `word_list/` | `wordlist/` 或 `WordList/` |

### 5.2 不允许的格式

| 禁忌 | 说明 | 错误示例 | 正确示例 |
|------|------|---------|---------|
| 大写版本号前缀 | 版本号 `v` 必须小写 | `V1.1.0/` | `v1.1.0/` |
| 缺少版本号段 | 必须三段式 | `v1.1/` | `v1.1.0/` |
| 驼峰文件夹名 | 代码目录文件夹不用 camelCase | `wordDetail/` | `WordDetail/`（组件）或 `word-detail/`（工具） |
| 临时文件名 | 不得使用 `tmp`、`temp`、`old`、`backup` | `old-components/` | 直接删除或归档 |
| 含义不明 | 不得使用无意义命名 | `misc/`、`other/` | 按功能归类到具体文件夹 |

### 5.3 例外情况

| 例外 | 说明 |
|------|------|
| `__tests__/` | 测试文件夹使用双下划线为业界约定（Jest/Vitest 默认识别） |
| `dist/` | 构建产物目录，遵循 Vite 默认约定 |
| `.vscode/` | 编辑器配置目录，以点开头为隐藏目录 |
| 项目根目录中文文件 | `产品设计方案.md`、`市场调研报告.md` 等面向产品/业务的文档允许中文命名 |

---

*词境文件夹命名规范 | 项目结构一致性保障*
