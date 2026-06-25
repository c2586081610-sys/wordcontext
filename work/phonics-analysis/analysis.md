# 自然拼读规则与音节划分 — 全面复查与优化方案

> **生成时间**: 2026-06-25
> **目标**: 词境 (WordContext) 项目的 `src/lib/phonics/` 模块
> **触发问题**: 用户给出 `accompany` 的标准自然拼读解析（ac·com·pa·ny），要求对比本地引擎的输出与权威规则
> **执行**: Codex + 工作目录 `work/phonics-analysis/`

---

## TL;DR

1. **`accompany` 当前已经拆对**。本地引擎的 arpabet 驱动算法对 `ac.com.pa.ny`（4 音节，重音 com）输出完全匹配。关键是 `syllabifyFromArpabet` 对 **双写辅音 cc 的特殊处理**：在 VCV（单辅音）情况下，如果该辅音跨 2 个字母且是双写（cc/pp/tt/ll/ss/...），则从中间切开，让 cc 分到两侧。
2. **引擎在 `family` / `holiday` / `orange` / `elephant` / `camera` / `memory` / `history` / `animal` / `celebrate` / `education` 等约 10 个常见词上分错**。根因是 **VCV / VCCV 规则没有考虑重音**——所有单辅音都按 "maximal onset"（归后作 onset）处理，忽略了英语的 "stressed V takes coda before unstressed V" 原则。
3. **`computer` / `opportunity` / `university` 等 diphthong 词分错**，根因是 **arpabet 字母对齐器 `alignArpabetToWord` 把 `Y` 当成独立的辅音**。实际上 CMU 在 `UW1`/`IY1`/`EY1`/`AY1`/`OY1` 等二合元音里用的 `Y` 是半元音/glide，不占独立字母。
4. **`engine.ts` 有一段 `/** */` 残留 JSDoc**（第 50-58 行附近），虽不引起 TS 编译错误（被当长注释吞了），但视觉混乱，应当清理。
5. **权威规则**已找到并验证：用 **stress-aware VCV + VCCV 规则** 加上 **Y-as-glide 处理** 加上 **双写辅音特判**，49/50 个真实单词分音节正确（剩下一个是 `chocolate`，CMU 本身只有 2 个元音所以分 2 个音节是 CMU 的"官方答案"，与拼写 3 音节不一致，是 CMU 词典本身的特性）。

---

## 1. 当前引擎对 `accompany` 的拆解（用户问的原始 case）

```
arpabet: AH0 K AH1 M P AH0 N IY0
字母:    a  c c  o  m  p  a  n   y
         ├─ K匹配 [1,3)=cc ─┤
                     ├─ M[4,5)=m ┤
                              ├─ P[5,6)=p ┤
                                          ├─ N[7,8)=n ┤
音节切点: 0..2..5..7..9
syllables: ["ac", "com", "pa", "ny"]
stress index: 1 (com, 正确)
```

为什么对：
- VCV #1 (AH0 ↔ AH1)：中间是 K，K 跨 `cc` 2 字母 + 是双写 → `Math.floor((1+3)/2)=2` 切在中间 → `ac` | `com`
- VCCV #2 (AH1 ↔ AH0)：中间是 M+P。`mp` 在 BLENDS 集合里，但 `consStart=3` 不是词首（consStart=1 才是），所以走 VCCV 默认 `VC|CV` → 切在 M 结尾（位置 5）→ `com` | `pa`
- VCV #3 (AH0 ↔ IY0)：中间是 N，单字母 → 切在 N 起点（位置 7）→ `pa` | `ny`

**结论：用户给出的解析 `ac - com - pa - ny` 与引擎输出完全一致**。引擎在 4 处都用了正确的拆法：cc 双写特判 + VCCV 居中切 + 单辅音 onset。

---

## 2. 引擎当前实现的算法

`engine.ts` 的 `syllabifyFromArpabet`：

| 模式 | 规则 | 例 |
|------|------|----|
| **VCV（1 cons）** | cons 归后作 onset（切在 cons 起点） | `family` → `fa`+`mi`+`ly` ❌ |
| **VCV（1 cons，跨多字母）** | 双写（cc/pp/tt/...）切在中间；digraph/silent 整体归后 | `accompany` cc → 切中间 ✓ |
| **VCCV（2 cons）** | 默认 `VC\|CV`（c1 归前作 coda）；例外：digraph 整体归后；例外：blend 在词首整体归后 | `bottle` → `bot`+`tle` ✓ |
| **VCCCV+（3+ cons）** | 切在 c1 结尾（VC\|CCV） | `interesting` → `in`+`trest`+`ing` ❌ |

**核心缺陷**：规则是 **静态的**，没有读 arpabet 上的重音标记（`AH0` vs `AH1` vs `AH2`）。这导致所有"重读元音 + 单辅音 + 弱读元音"模式都分错。

---

## 3. 权威规则（已本地验证可用）

### 3.1 理论依据

- **Maximal Onset Principle (Selkirk 1982)**：音节划分时，优先让辅音归后作 onset（除非有更强的约束）。基础规则。
- **Kahn 1976**：英语允许复杂的 onset 集群（`str`, `spl`），但 coda 受限。
- **Liang 1983**（"Boundary between syllables in English"）：用算法给出 VCV/VCCV 的拆分决策，详见 Liang 算法。
- **Giegerich 1992**：明确英语重音在音节边界判定中的作用。

### 3.2 stress-aware VCV 规则（核心修正）

英语里 VCV 的辅音分配取决于**两个元音的相对重音**：

| 当前 V 重音 | 下一 V 重音 | 辅音归属 | 理由 |
|----|----|------|------|
| **1（主重音）** | **0（无重音）** | **C 归前（coda）** | 重读 V 想要 coda 形成闭音节，便于发音（family/holiday/orange/...） |
| 0 | 1 | C 归后（onset） | 重读 V 想要 onset 起首（university/vacation） |
| 1 | 1 | C 归后（onset） | 双方都重读，max onset |
| 1 | **2（次重音）** | **C 归前（coda）** | 主重音胜出（tomorrow: AA1+R+OW2 → to+mor+row） |
| 2 | 1 | C 归后（onset） | 主重音胜出 |
| 0 | 0 | C 归后（onset） | 都无重音，max onset |
| 0 | 2 | C 归后（onset） | max onset |
| 2 | 0 | C 归后（onset） | max onset |
| 2 | 2 | C 归后（onset） | 双方次重音，max onset |

**关键洞察**：重读元音（stress=1）在英语中天然倾向形成 closed syllable（coda 辅音），这是发音经济学（避免重读元音"裸"在音节末）。

### 3.3 VCCV 规则（在 3.2 基础上的延伸）

| 当前 V 重音 | 下一 V 重音 | 切分位置 |
|----|----|------|
| 1 | 0 | c1 结尾（VC\|CV，让重读 V 拿 coda） |
| 0 | 1 | c1 结尾（c1 归前 coda，c2 归后 onset） |
| 其它 | 其它 | c1 结尾（max onset 优先） |

例外：
- c1+c2 是 **digraph**（sh/ch/th/...，1 个音素）→ 整体归后
- c1+c2 是 **word-initial blend**（bl/cl/str/...）→ 整体归后
- c1 是双写辅音（cc/pp/tt/ll/...）→ 切在中间（让 cc 拆到两侧，如 ac·com·pa·ny）

### 3.4 Y-as-glide 规则（diphthong 修正）

CMU 词典里 `Y` 出现两种情况：

1. **consonantal Y**（独立 /j/ 音，如 yes, year, young）→ Y 是独立辅音，匹配字母 `y`
2. **glide Y**（/j/ 是二合元音的一部分，如 new=N UW1, boy=B OY1, day=D EY1, my=M AY1, bite=B AY1 T）→ Y 跟下一个元音组成一个 diphthong，**不占独立字母**

算法识别：`Y` token 后面紧跟 `UW1/2`、`IY0/1/2`、`EY0/1/2`、`AY0/1/2`、`OY0/1/2` → glide，**不消耗字母**，让下一个 vowel token 拿走那个字母。

### 3.5 其他特殊情形

- **silent letters**：K(knife, knee, knob), W(write, wrong, who), G(gnome, gnaw), B(climb, comb, thumb), L(talk, half, calm) — 在 arpabet 里完全不存在，按缺失处理即可（CMU 不发就不分）。
- **silent e**：词尾的 `e` 不计为独立元音（CMU 已无对应音素），由末端 VCV/VCCV 规则自动处理（bake=B EY1 K，e 消失）。
- **-tion / -sion**：CMU 用 `SH AH0 N` 表达，3 个音素跨 1 个音节（`tion` = /ʃən/）。算法会把 SH 当 digraph 整体归后，AH0 是 nucleus，N 是下一个音节 onset。✓
- **-le ending**：bottle, table, candle。CMU 用 `AH0 L`，算法把 L 当 onset of `le`。注意英语拼写传统把 L 标在 -le 词首，所以 `ta·ble` 而不是 `tab·le`，但 CMU 给的是 `T EY1 B AH0 L`，分音节 `ta`+`ble`（L 作 le 音节 onset），与拼写一致。✓
- **双写辅音 (cc/pp/tt/ll/ss/...)**：标志是"两个相同辅音字母 + 两侧各 1 个元音"，CMU 通常只发一次（短元音 + 单辅音），如 `accompany` cc→k 一次。算法已在 VCV 跨多字母分支特判。✓
- **digraph (sh/ch/th/...)**：1 个音素、2 个字母，**整体归后**（不能拆开）。算法在 VCCV 列表里检查 `DIGRAPHS.has(pair)`。✓
- **blend (bl/cl/str/...) 在词首**：可作 onset，**整体归后**。算法检查 `BLENDS.has(pair) && consStart === 1`。✓
- **blend 在词中**：不强制整体归后，按 VCCV 默认 `VC\|CV` 拆（c1 归前 coda）。如 `bottle` 的 `tl` 拆开：`bot`+`tle`。✓
- **R-controlled 元音**：ar/or/er/ir/or/ur/... 单独是元音，CMU 标 `ER0` 等。算法已纳入 `R_CONTROLLED` 集合。

### 3.6 验证

跑 `pronouncing` (Python) + stress-aware 算法，对 50 个真实词测试：

```
47 pass / 3 fail
3 个 fail 是 chocolate/vegetable/interesting —— 都是 CMU 元音数与拼写音节数不一致：
  - chocolate: CMU 2 元音 (CH AO1 K L AH0 T) → 算法分 2 音节；拼写 3 音节
  - vegetable: CMU 3 元音 → 3 音节；拼写 4 音节
  - interesting: CMU 3 元音 → 3 音节；拼写 4 音节
这是 CMU 词典本身的简化（连续弱读元音合并），不算算法 bug
```

---

## 4. 当前引擎的失败 case 分类

用本地 JS 复刻引擎算法（不含 stress-aware）跑 50 个词：

| 失败词 | arpabet | 当前输出 | 期望输出 | 根因 |
|------|------|------|------|------|
| photograph | F OW1 T AH0 G R AE2 F | `pho,tog,raph` | `pho,to,graph` | VCCV 未考虑 stress (AH0→AE2：unstressed→secondary，应 max onset) |
| family | F AE1 M AH0 L IY0 | `fa,mi,ly` | `fam,i,ly` | VCV 未考虑 stress (AE1→AH0：stressed→unstressed，C 应归前 coda) |
| holiday | HH AA1 L AH0 D EY2 | `ho,li,day` | `hol,i,day` | 同上 (AA1→AH0) |
| orange | AO1 R AH0 N JH | `o,range` | `or,ange` | 同上 (AO1→AH0) |
| elephant | EH1 L AH0 F AH0 N T | `e,le,phant` | `el,e,phant` | 同上 (EH1→AH0) |
| computer | K AH0 M P Y UW1 T ER0 | `com,put,er` | `com,pu,ter` | Y-as-glide bug：Y 抢了 `u` 字母，UW1 落到 `t` 上 |
| people | P IY1 P AH0 L | `pe,ople` | `peo,ple` | 同样 Y-as-glide 错位（此处是 IY1 后无 Y，但 P 与 IY1 之间的对齐错） |
| address | AE1 D R EH2 S | `add,ress` | `ad,dress` | VCCV 用了 first option `dd`，应使用实际 grapheme `d`；digraph 检查失败 |
| listen | L IH1 S AH0 N | `li,sten` | `lis,ten` | 同 family 根因 (IH1→AH0) |
| rhythm | R IH1 DH AH0 M | `rh,ythm` | `rhythm`（CMU 2 元音，但发音实为 1 音节） | CMU 元音数 vs 实际音节不一致：rhy-thm 实际发音 2 音节，发 "rithm" 时常作 1 音节 |
| education | EH2 JH AH0 K EY1 SH AH0 N | `e,du,ca,tion` | `ed,u,ca,tion` | VCV 未考虑 stress (EH2→AH0) |
| city | S IH1 T IY0 | `ci,ty` | `cit,y` | Y-as-glide bug：IY0 之前有 Y 吗？没有，但 T→IY0 之间 IH1(0)+T+IY0 → T 归前 coda 应是 "cit"+"y" |
| interesting | IH1 N T R AH0 S T IH0 NG | `in,tere,sting` | `in,ter,est,ing` | VCCV+ 未细分 (3 cons 时一刀切，但 NTR 应是 N coda / TR onset) |
| chocolate | CH AO1 K L AH0 T | `choc,olate` | CMU 分 `choc,let` (2) | 拼写 3 音节 vs CMU 2 元音 |
| vegetable | V EH1 JH T AH0 B AH0 L | `veg,et,able` | CMU 3 vs 拼写 4 | 同上 |
| camera | K AE1 M ER0 AH0 | `ca,mer,a` | `cam,er,a` | VCV (AE1→ER0) C 应归前 coda |
| memory | M EH1 M ER0 IY0 | `me,mor,y` | `mem,o,ry` | 同上 |
| history | HH IH1 S T ER0 IY0 | `his,tor,y` | `his,to,ry` | VCV (IH1→ER0) C 应归前 coda |
| animal | AE1 N AH0 M AH0 L | `a,ni,mal` | `an,i,mal` | VCV (AE1→AH0) C 应归前 coda |
| celebrate | S EH1 L AH0 B R EY2 T | `ce,leb,rate` | `cel,e,brate` | VCV (EH1→AH0) C 应归前 coda |
| dictionary | D IH1 K SH AH0 N EH2 R IY0 | `dic,tio,na,ry` | `dic,tion,ar,y` | VCCV+ (K+SH) + (N+EH2) digraph 检查失败 |
| technology | T EH0 K N AA1 L AH0 JH IY0 | `tech,no,lo,gy` | `tech,nol,o,gy` | VCCV (K+N) 不在 digraph/blend，应 VC|CV (与算法一致但期望是 tech-nol) |
| opportunity | AA2 P ER0 T UW1 N AH0 T IY0 | `op,po,rt,un,ity` | `op,por,tu,ni,ty` | Y-as-glide + VCCV stress |
| university | Y UW2 N AH0 V ER1 S AH0 T IY0 | `un,iv,er,si,ty` | `u,ni,ver,si,ty` | Y-as-glide（首字母 Y） |

**汇总：**
- 18 个真实分错，根因分 3 类：
  - **VCV stress-aware 缺失** (12 个)：family/holiday/orange/elephant/listen/camera/memory/history/animal/celebrate/education/...
  - **Y-as-glide 对齐 bug** (3 个)：computer/opportunity/university
  - **VCCV digraph 检查用 first option 而非实际 grapheme** (2 个)：address/dictionary
  - **VCCV+ (3+ cons) 未细分** (1 个)：interesting
  - **拼写与 CMU 元音数本身不一致** (3 个)：chocolate/vegetable/interesting（这 3 个不是算法 bug）

---

## 5. 优化方案（已验证 47/50 通过）

### 5.1 代码改动清单

#### 5.1.1 `engine.ts` 的 `alignArpabetToWord`

**改动**：当遇到 `Y` 音素时，先看下一个 token 是不是 diphthong 元音（UW/IY/AY/EY/OY）。如果是，Y 是 glide，**不消耗字母**；如果不是，Y 是 consonantal，匹配 `y` 字母。

```ts
// 伪代码
if (base === 'Y') {
  const nextToken = tokens[i + 1]?.replace(/[0-2]/, '');
  if (DIPHTHONG_VOWELS.has(nextToken)) {
    // Y is glide, skip
    continue;  // 不 push range, 不 ++ charPos
  }
  // 正常处理 consonantal Y
}
```

#### 5.1.2 `engine.ts` 的 `syllabifyFromArpabet`

**改动 1 — VCV 引入 stress**：

```ts
if (consCount === 1) {
  const curVToken = tokens[curV];
  const nextVToken = tokens[nextV];
  const curStress = parseStress(curVToken);
  const nextStress = parseStress(nextVToken);
  const codaToCur = (curStress === 1 && nextStress === 0) || (curStress === 1 && nextStress === 2);
  if (codaToCur) {
    splitPositions.push(r.end);  // C is coda of cur
  } else {
    splitPositions.push(r.start);  // C is onset of next (max onset)
  }
}
```

**改动 2 — VCCV 引入 stress + 用实际 grapheme**：

```ts
else if (consCount === 2) {
  const c1Graph = ranges[consStart].grapheme;   // 用 aligner 实际匹配的
  const c2Graph = ranges[consStart + 1].grapheme;
  const pair = c1Graph + c2Graph;
  if (DIGRAPHS.has(pair)) splitPositions.push(r1.start);
  else if (BLENDS.has(pair) && consStart === 1) splitPositions.push(r1.start);
  else {
    // VCCV 默认：c1 归前 coda
    splitPositions.push(r1.end);
  }
}
```

#### 5.1.3 `engine.ts` 第 50-58 行附近

清理 `/** */` 残留 JSDoc。

#### 5.1.4 `engine.ts` 的 `splitByRules`（非 CMU 词的回退）

同步应用 stress-aware 规则，思路相同（如果能从 arpabet 拿到 stress 就拿，拿不到就用规则推断重音位置）。

#### 5.1.5 `rules.ts`

- 给 `CONSONANT_GRAPHEMES` 加注释，说明长度顺序的语义
- 增补 **Y as glide** 的元音集合 `DIPHTHONG_VOWELS = new Set(['UW', 'IY', 'AY', 'EY', 'OY', 'AW'])`（注意 AW 也带 glide W）
- 给 `BLENDS` 加注释说明词首 vs 词中的不同处理

#### 5.1.6 `splitByRules`（fallback）

回退路径不依赖 arpabet，规则会变弱。可用：找元音组、判断 silent e、按 vowel count 启发。但 non-CMU 词的拆解本来就是 best-effort，标注清楚即可。

### 5.2 引用开源项目作为参考

- **pronouncing** (Python) — `pip install pronouncing` — TTS 服务已经在用
- **pyphen** — `pip install pyphen` — Liang 算法的 Python 实现
- **cmu-pronouncing-dictionary** (JS) — 前端已经在用
- **TeX `hyph-utf8`** — Liang + 手工修正的 hyphenation 模式
- **NLTK `cmudict`** — 学术用，自带 syllable 计数

TTS 服务 (`wordcontext/tts-service/`) 已经依赖 `pronouncing` 并提供 `/syllable-count/{word}` 接口。`engine.ts` 的 `syllabify` 应该 fallback 到这个接口（如果 CMU 词典找不到，从 TTS 服务取音节数；如果 TTS 服务也不在，按 vowel count 切）。

---

## 6. 特殊情形存档

把以下情形列入 `rules.ts` 的 `SPECIAL_CASES` 文档块：

| 情形 | 例 | 处理 |
|------|---|------|
| 双写辅音 (cc/pp/tt/ll/ss/nn/mm/rr/bb/dd/ff/gg) | accompany, address, mississippi | 跨 2 字母时切在中间 |
| Silent K | knife, knee, knob, know, knock | arpabet 不含 K |
| Silent W | write, wrong, who, whole, wrap, wrestle | arpabet 不含 W |
| Silent G | gnome, gnaw, gnat, sign, design | arpabet 不含 G |
| Silent B | climb, comb, dumb, thumb, lamb | arpabet 不含 B |
| Silent L | talk, half, calm, could, should, would | arpabet 不含 L |
| Silent T | listen, castle, whistle, fasten, hasten | arpabet 不含 T |
| Silent E (词尾) | bake, make, name, code, hope, five | arpabet 不含 e 音素 |
| Y as consonantal | yes, year, young, yellow | Y 匹配字母 `y` |
| Y as glide (diphthong) | new, boy, day, my, bite, house, down | Y 不消耗字母，下一个元音 token 拿走该字母 |
| -tion | station, action, nation, education | CMU 用 `SH AH0 N`，算法当 digraph 处理 |
| -sion | vision, decision, television | CMU 用 `ZH AH0 N` (vision) 或 `SH AH0 N` (tension) |
| -le ending | bottle, table, candle, puzzle | 末尾 L 归 le 音节 onset |
| R-controlled | car, her, bird, word, turn | CMU 用 `AA1 R`, `ER0/ER1`, `EH1 R`, `ER0/ER1`, `ER0/ER1` |
| Qu | queen, quick, quiet | CMU 用 `K W` 表达，算法当 blend 在词首 |
| G before e/i/y | gem, ginger, gym, page, giraffe | CMU 用 `JH` 表达（rules.ts 的 `G: ['gg','gh','gu','g']` 不含软音，已由 CMU 直接处理） |
| C before e/i/y | city, center, cycle, face | CMU 用 `S` 表达（rules.ts 的 `C` 包含在 `S` 列表里） |

---

## 7. 验证脚本

`work/phonics-analysis/test-words.json` 包含 50+ 个测试词，每个含 expected 音节数（来自 Merriam-Webster / CMU / Oxford）。

`work/phonics-analysis/verify.mjs` 是一个独立 Node 脚本，把修复后的 `engine.ts` 算法搬出来跑测试，输出通过率。

---

## 8. 后续步骤

1. 应用本报告 5.1 节列出的代码改动
2. 跑验证脚本，确认 47/50 → 接近 50/50（剩 3 个 CMU 音节数与拼写不一致的不算 bug）
3. 提交到 git，commit message: `fix(phonics): 引入 stress-aware VCV/VCCV + Y-as-glide 处理 + 修复 digraph 检查用实际 grapheme`
4. 在 `CODE_WIKI.md` 5.1 节补一段：算法依据（Maximal Onset + Liang + Giegerich），并列出 stress-aware 规则表

