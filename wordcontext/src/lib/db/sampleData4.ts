import type { WordEntry } from './index';

// CET4 核心词汇 I-O
export const WORDS_IO: WordEntry[] = [
  {
    id: 'w203', word: 'identical', phonetic: '/aɪˈdentɪkl/',
    definitions: [
      { pos: 'adj.', meaning: '完全相同的；同一的' },
    ],
    examples: [
      'The two pictures look identical.',
    ],
    etymology: 'ident(相同) + -ical → 相同的',
    wordFamily: ['identical', 'identically', 'identify', 'identity'],
    mnemonic: 'ident(相同)+ical → 完全相同的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w204', word: 'identify', phonetic: '/aɪˈdentɪfaɪ/',
    definitions: [
      { pos: 'v.', meaning: '识别；确认；认同' },
    ],
    examples: [
      'Can you identify the suspect?',
    ],
    etymology: 'ident(相同) + -ify → 使成为相同 → 识别',
    wordFamily: ['identify', 'identification', 'identity', 'identical'],
    mnemonic: 'ident(相同)+ify → 找出相同的 → 识别',
    tags: ['CET4'],
  },
  {
    id: 'w205', word: 'ignorant', phonetic: '/ˈɪɡnərənt/',
    definitions: [
      { pos: 'adj.', meaning: '无知的；愚昧的' },
    ],
    examples: [
      'He is ignorant of the basic facts.',
    ],
    etymology: 'i-(不) + gnor(知道) + -ant → 不知道的 → 无知的',
    wordFamily: ['ignore', 'ignorant', 'ignorance'],
    mnemonic: 'i(不)+gnor(知)+ant → 不知道 → 无知的',
    tags: ['CET4'],
  },
  {
    id: 'w206', word: 'illustrate', phonetic: '/ˈɪləstreɪt/',
    definitions: [
      { pos: 'v.', meaning: '说明；阐明；给…插图' },
    ],
    examples: [
      'The report is illustrated with charts and graphs.',
    ],
    etymology: 'il-(进入) + lustr(光) + -ate → 照亮 → 说明',
    wordFamily: ['illustrate', 'illustration', 'illustrative'],
    mnemonic: 'il+lustr(光)+ate → 用光照亮 → 说明',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w207', word: 'imaginary', phonetic: '/ɪˈmædʒɪnəri/',
    definitions: [
      { pos: 'adj.', meaning: '想象的；虚构的' },
    ],
    examples: [
      'The story is about an imaginary world.',
    ],
    etymology: 'imagin(想象) + -ary → 想象的',
    wordFamily: ['imagine', 'imaginary', 'imagination', 'imaginative'],
    mnemonic: 'imagin(想象)+ary → 想象出来的 → 虚构的',
    tags: ['CET4'],
  },
  {
    id: 'w208', word: 'immediate', phonetic: '/ɪˈmiːdiət/',
    definitions: [
      { pos: 'adj.', meaning: '立即的；直接的' },
    ],
    examples: [
      'We need an immediate response.',
    ],
    etymology: 'im-(不) + medi(中间) + -ate → 没有中间的 → 直接的',
    wordFamily: ['immediate', 'immediately', 'immediacy'],
    mnemonic: 'im(无)+medi(中间)+ate → 没有中间环节 → 直接的',
    tags: ['CET4'],
  },
  {
    id: 'w209', word: 'immense', phonetic: '/ɪˈmens/',
    definitions: [
      { pos: 'adj.', meaning: '巨大的；广大的' },
    ],
    examples: [
      'The universe is immense beyond imagination.',
    ],
    etymology: 'im-(不) + mens(测量) + -e → 无法测量的 → 巨大的',
    wordFamily: ['immense', 'immensely', 'immensity'],
    mnemonic: 'im(不)+mens(测量)+e → 大到无法测量 → 巨大的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w210', word: 'impact', phonetic: '/ˈɪmpækt/',
    definitions: [
      { pos: 'n.', meaning: '影响；冲击力' },
      { pos: 'v.', meaning: '影响；冲击' },
    ],
    examples: [
      'The policy had a significant impact on education.',
    ],
    etymology: 'im-(进入) + pact(压紧) → 压入 → 冲击',
    wordFamily: ['impact', 'impacted', 'impacting'],
    mnemonic: 'im+pact(紧) → 紧紧压入 → 冲击/影响',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w211', word: 'implement', phonetic: '/ˈɪmplɪment/',
    definitions: [
      { pos: 'v.', meaning: '实施；执行' },
      { pos: 'n.', meaning: '工具；器具' },
    ],
    examples: [
      'The government implemented new regulations.',
    ],
    etymology: 'im-(进入) + ple(填满) + -ment → 填满 → 实施',
    wordFamily: ['implement', 'implementation'],
    mnemonic: 'im+ple(填)+ment → 填满执行 → 实施',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w212', word: 'implication', phonetic: '/ˌɪmplɪˈkeɪʃən/',
    definitions: [
      { pos: 'n.', meaning: '含义；暗示；牵连' },
    ],
    examples: [
      'What are the implications of this decision?',
    ],
    etymology: 'im-(进入) + plic(折叠) + -ation → 折叠在里面 → 暗示',
    wordFamily: ['imply', 'implication', 'implicit'],
    mnemonic: 'im+plic(折)+ation → 折在里面没说出来的 → 暗示',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w213', word: 'impose', phonetic: '/ɪmˈpəʊz/',
    definitions: [
      { pos: 'v.', meaning: '强加；征收；利用' },
    ],
    examples: [
      'The government imposed a new tax on imports.',
    ],
    etymology: 'im-(进入) + pos(放) + -e → 放进去 → 强加',
    wordFamily: ['impose', 'imposition', 'imposing'],
    mnemonic: 'im+pos(放)+e → 硬放进去 → 强加',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w214', word: 'impress', phonetic: '/ɪmˈpres/',
    definitions: [
      { pos: 'v.', meaning: '使印象深刻；使钦佩' },
    ],
    examples: [
      'She impressed everyone with her performance.',
    ],
    etymology: 'im-(进入) + press(压) → 压入心中 → 使印象深刻',
    wordFamily: ['impress', 'impression', 'impressive', 'impressed'],
    mnemonic: 'im+press(压) → 压入心中 → 使印象深刻',
    tags: ['CET4'],
  },
  {
    id: 'w215', word: 'incline', phonetic: '/ɪnˈklaɪn/',
    definitions: [
      { pos: 'v.', meaning: '倾向；倾斜' },
      { pos: 'n.', meaning: '斜坡；倾向' },
    ],
    examples: [
      'I incline to believe his story.',
    ],
    etymology: 'in-(进入) + clin(弯曲) + -e → 向内弯 → 倾向',
    wordFamily: ['incline', 'inclination', 'inclined'],
    mnemonic: 'in+cline(倾斜) → 向某方向倾斜 → 倾向',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w216', word: 'incorporate', phonetic: '/ɪnˈkɔːpəreɪt/',
    definitions: [
      { pos: 'v.', meaning: '包含；合并；组成公司' },
    ],
    examples: [
      'We will incorporate your suggestions into the plan.',
    ],
    etymology: 'in-(进入) + corpor(体) + -ate → 成为一体 → 合并',
    wordFamily: ['incorporate', 'incorporation', 'incorporated'],
    mnemonic: 'in+corpor(体)+ate → 成为一体 → 合并',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w217', word: 'indicate', phonetic: '/ˈɪndɪkeɪt/',
    definitions: [
      { pos: 'v.', meaning: '表明；指示；暗示' },
    ],
    examples: [
      'Research indicates that the drug is effective.',
    ],
    etymology: 'in-(向) + dic(说) + -ate → 向…说 → 表明',
    wordFamily: ['indicate', 'indication', 'indicator', 'indicative'],
    mnemonic: 'in+dic(说)+ate → 说出来 → 表明',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w218', word: 'individual', phonetic: '/ˌɪndɪˈvɪdʒuəl/',
    definitions: [
      { pos: 'adj.', meaning: '个人的；个别的' },
      { pos: 'n.', meaning: '个人' },
    ],
    examples: [
      'Each individual has different strengths.',
    ],
    etymology: 'in-(不) + divid(分割) + -ual → 不可分割的 → 个体的',
    wordFamily: ['individual', 'individually', 'individualism'],
    mnemonic: 'in(不)+divid(分)+ual → 不可再分的 → 个体的',
    tags: ['CET4'],
  },
  {
    id: 'w219', word: 'inevitable', phonetic: '/ɪnˈevɪtəbl/',
    definitions: [
      { pos: 'adj.', meaning: '不可避免的' },
    ],
    examples: [
      'Change is inevitable in a growing organization.',
    ],
    etymology: 'in-(不) + evit(避免) + -able → 不可避免的',
    wordFamily: ['inevitable', 'inevitably', 'inevitability'],
    mnemonic: 'in(不)+evit(避免)+able → 无法避免的 → 不可避免的',
    tags: ['CET4', 'CET6', '考研'],
  },
  {
    id: 'w220', word: 'influence', phonetic: '/ˈɪnfluəns/',
    definitions: [
      { pos: 'n.', meaning: '影响；势力' },
      { pos: 'v.', meaning: '影响' },
    ],
    examples: [
      'Parents have a great influence on their children.',
    ],
    etymology: 'in-(进入) + flu(流) + -ence → 流入 → 影响',
    wordFamily: ['influence', 'influential', 'influenced'],
    mnemonic: 'in+flu(流)+ence → 流入心中 → 影响',
    tags: ['CET4'],
  },
  {
    id: 'w221', word: 'inform', phonetic: '/ɪnˈfɔːm/',
    definitions: [
      { pos: 'v.', meaning: '通知；告知' },
    ],
    examples: [
      'Please inform us of any changes.',
    ],
    etymology: 'in-(进入) + form(形式) → 使成形 → 通知',
    wordFamily: ['inform', 'information', 'informative', 'informed'],
    mnemonic: 'in+form(形状) → 给出形状 → 通知',
    tags: ['CET4'],
  },
  {
    id: 'w222', word: 'initial', phonetic: '/ɪˈnɪʃəl/',
    definitions: [
      { pos: 'adj.', meaning: '最初的；开始的' },
      { pos: 'n.', meaning: '首字母' },
    ],
    examples: [
      'My initial reaction was surprise.',
    ],
    etymology: 'in-(进入) + it(走) + -ial → 走进去的 → 最初的',
    wordFamily: ['initial', 'initially', 'initiate', 'initiative'],
    mnemonic: 'init(开始)+ial → 开始的 → 最初的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w223', word: 'innocent', phonetic: '/ˈɪnəsənt/',
    definitions: [
      { pos: 'adj.', meaning: '无辜的；天真的' },
      { pos: 'n.', meaning: '无辜者' },
    ],
    examples: [
      'He was proved innocent of the crime.',
    ],
    etymology: 'in-(不) + noc(伤害) + -ent → 不伤害人的 → 无辜的',
    wordFamily: ['innocent', 'innocence', 'innocently'],
    mnemonic: 'in(不)+noc(伤害)+ent → 没有害人的 → 无辜的',
    tags: ['CET4'],
  },
  {
    id: 'w224', word: 'innovation', phonetic: '/ˌɪnəˈveɪʃən/',
    definitions: [
      { pos: 'n.', meaning: '创新；革新' },
    ],
    examples: [
      'Innovation is the key to business success.',
    ],
    etymology: 'in-(进入) + nov(新) + -ation → 引入新事物 → 创新',
    wordFamily: ['innovate', 'innovation', 'innovative', 'innovator'],
    mnemonic: 'in+nov(新)+ation → 引入新的 → 创新',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w225', word: 'inquire', phonetic: '/ɪnˈkwaɪər/',
    definitions: [
      { pos: 'v.', meaning: '询问；调查' },
    ],
    examples: [
      'I would like to inquire about the job opening.',
    ],
    etymology: 'in-(进入) + quire(寻求) → 深入寻求 → 询问',
    wordFamily: ['inquire', 'inquiry', 'inquiring'],
    mnemonic: 'in+quire(寻求) → 深入探求 → 询问',
    tags: ['CET4'],
  },
  {
    id: 'w226', word: 'insert', phonetic: '/ɪnˈsɜːt/',
    definitions: [
      { pos: 'v.', meaning: '插入；嵌入' },
      { pos: 'n.', meaning: '插入物' },
    ],
    examples: [
      'Please insert your card into the machine.',
    ],
    etymology: 'in-(进入) + sert(放) → 放进去 → 插入',
    wordFamily: ['insert', 'insertion'],
    mnemonic: 'in+sert(放) → 放进去 → 插入',
    tags: ['CET4'],
  },
  {
    id: 'w227', word: 'inspect', phonetic: '/ɪnˈspekt/',
    definitions: [
      { pos: 'v.', meaning: '检查；视察' },
    ],
    examples: [
      'The police inspected the vehicle carefully.',
    ],
    etymology: 'in-(进入) + spect(看) → 看进去 → 检查',
    wordFamily: ['inspect', 'inspection', 'inspector'],
    mnemonic: 'in+spect(看) → 仔细看进去 → 检查',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w228', word: 'inspire', phonetic: '/ɪnˈspaɪər/',
    definitions: [
      { pos: 'v.', meaning: '激励；启发；使产生灵感' },
    ],
    examples: [
      'Her story inspired many young people.',
    ],
    etymology: 'in-(进入) + spir(呼吸) + -e → 吸入气息 → 启发',
    wordFamily: ['inspire', 'inspiration', 'inspired', 'inspiring'],
    mnemonic: 'in+spir(呼吸)+e → 吸入灵气 → 启发',
    tags: ['CET4'],
  },
  {
    id: 'w229', word: 'install', phonetic: '/ɪnˈstɔːl/',
    definitions: [
      { pos: 'v.', meaning: '安装；设置；任命' },
    ],
    examples: [
      'We need to install new software on the computer.',
    ],
    etymology: 'in-(进入) + stall(站) → 站进去 → 安装',
    wordFamily: ['install', 'installation', 'installer'],
    mnemonic: 'in+stall(站) → 让设备站进去 → 安装',
    tags: ['CET4'],
  },
  {
    id: 'w230', word: 'instance', phonetic: '/ˈɪnstəns/',
    definitions: [
      { pos: 'n.', meaning: '实例；情况' },
    ],
    examples: [
      'There are many instances of this phenomenon.',
    ],
    etymology: 'in-(在) + st(站) + -ance → 站在那里 → 实例',
    wordFamily: ['instance', 'instances', 'instant'],
    mnemonic: 'in+st(站)+ance → 站在那的例子 → 实例',
    tags: ['CET4'],
  },
  {
    id: 'w231', word: 'instinct', phonetic: '/ˈɪnstɪŋkt/',
    definitions: [
      { pos: 'n.', meaning: '本能；直觉' },
    ],
    examples: [
      'Birds have an instinct to fly south in winter.',
    ],
    etymology: 'in-(内) + stinct(刺) → 内心刺动 → 本能',
    wordFamily: ['instinct', 'instinctive', 'instinctively'],
    mnemonic: 'in+stinct(刺) → 内心被刺动 → 本能',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w232', word: 'institute', phonetic: '/ˈɪnstɪtjuːt/',
    definitions: [
      { pos: 'n.', meaning: '学院；研究所' },
      { pos: 'v.', meaning: '制定；创立' },
    ],
    examples: [
      'She works at a research institute.',
    ],
    etymology: 'in-(进入) + stitut(建立) + -e → 建立起来 → 学院',
    wordFamily: ['institute', 'institution', 'institutional'],
    mnemonic: 'in+stitut(建立)+e → 建立的地方 → 学院',
    tags: ['CET4'],
  },
  {
    id: 'w233', word: 'insurance', phonetic: '/ɪnˈʃʊərəns/',
    definitions: [
      { pos: 'n.', meaning: '保险；保险费' },
    ],
    examples: [
      'Do you have health insurance?',
    ],
    etymology: 'in-(进入) + sur(确定) + -ance → 使确定 → 保险',
    wordFamily: ['insure', 'insurance', 'insurer'],
    mnemonic: 'in+sur(确定)+ance → 确保安全 → 保险',
    tags: ['CET4'],
  },
  {
    id: 'w234', word: 'intellectual', phonetic: '/ˌɪntəˈlektʃuəl/',
    definitions: [
      { pos: 'adj.', meaning: '智力的；理性的' },
      { pos: 'n.', meaning: '知识分子' },
    ],
    examples: [
      'She is an intellectual woman with broad knowledge.',
    ],
    etymology: 'intel(在…之间) + lect(选择) + -ual → 能选择的 → 智力的',
    wordFamily: ['intellect', 'intellectual', 'intellectually'],
    mnemonic: 'intel(中间)+lect(选)+ual → 能从中选择 → 智力的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w235', word: 'intense', phonetic: '/ɪnˈtens/',
    definitions: [
      { pos: 'adj.', meaning: '强烈的；紧张的；热情的' },
    ],
    examples: [
      'The competition is very intense this year.',
    ],
    etymology: 'in-(进入) + tens(伸展) + -e → 伸展到极限 → 强烈的',
    wordFamily: ['intense', 'intensity', 'intensive', 'intensively'],
    mnemonic: 'in+tens(拉)+e → 拉到极限 → 强烈的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w236', word: 'interact', phonetic: '/ˌɪntərˈækt/',
    definitions: [
      { pos: 'v.', meaning: '互动；交流；相互作用' },
    ],
    examples: [
      'Students should interact more with each other.',
    ],
    etymology: 'inter-(相互) + act(行动) → 相互行动 → 互动',
    wordFamily: ['interact', 'interaction', 'interactive'],
    mnemonic: 'inter(相互)+act(行动) → 相互行动 → 互动',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w237', word: 'interfere', phonetic: '/ˌɪntəˈfɪər/',
    definitions: [
      { pos: 'v.', meaning: '干涉；妨碍' },
    ],
    examples: [
      'Don\'t interfere in other people\'s affairs.',
    ],
    etymology: 'inter-(之间) + fere(打击) → 在中间打击 → 干涉',
    wordFamily: ['interfere', 'interference', 'interfering'],
    mnemonic: 'inter(中间)+fere(打) → 在中间打岔 → 干涉',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w238', word: 'interpret', phonetic: '/ɪnˈtɜːprɪt/',
    definitions: [
      { pos: 'v.', meaning: '解释；口译；理解' },
    ],
    examples: [
      'How do you interpret this data?',
    ],
    etymology: 'inter-(之间) + pret(价值) → 在之间传递价值 → 口译',
    wordFamily: ['interpret', 'interpretation', 'interpreter'],
    mnemonic: 'inter(之间)+pret → 在两种语言之间转换 → 口译',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w239', word: 'intimate', phonetic: '/ˈɪntɪmət/',
    definitions: [
      { pos: 'adj.', meaning: '亲密的；私人的' },
      { pos: 'n.', meaning: '密友' },
    ],
    examples: [
      'They are intimate friends.',
    ],
    etymology: 'intim(最内) + -ate → 最内部的 → 亲密的',
    wordFamily: ['intimate', 'intimately', 'intimacy'],
    mnemonic: 'intim(内部)+ate → 最内部的 → 亲密的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w240', word: 'invade', phonetic: '/ɪnˈveɪd/',
    definitions: [
      { pos: 'v.', meaning: '入侵；侵略；涌入' },
    ],
    examples: [
      'The enemy invaded the country at dawn.',
    ],
    etymology: 'in-(进入) + vad(走) + -e → 走进去 → 入侵',
    wordFamily: ['invade', 'invasion', 'invader'],
    mnemonic: 'in+vad(走)+e → 走进来 → 入侵',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w241', word: 'investigate', phonetic: '/ɪnˈvestɪɡeɪt/',
    definitions: [
      { pos: 'v.', meaning: '调查；研究' },
    ],
    examples: [
      'The police are investigating the crime.',
    ],
    etymology: 'in-(进入) + vestig(痕迹) + -ate → 追踪痕迹 → 调查',
    wordFamily: ['investigate', 'investigation', 'investigator'],
    mnemonic: 'in+vestig(痕迹)+ate → 追踪痕迹 → 调查',
    tags: ['CET4'],
  },
  {
    id: 'w242', word: 'involve', phonetic: '/ɪnˈvɒlv/',
    definitions: [
      { pos: 'v.', meaning: '涉及；包含；使参与' },
    ],
    examples: [
      'The project involves a lot of research.',
    ],
    etymology: 'in-(进入) + volv(卷) + -e → 卷进去 → 涉及',
    wordFamily: ['involve', 'involvement', 'involved'],
    mnemonic: 'in+volv(卷)+e → 卷进去 → 涉及',
    tags: ['CET4'],
  },
  {
    id: 'w243', word: 'isolate', phonetic: '/ˈaɪsəleɪt/',
    definitions: [
      { pos: 'v.', meaning: '隔离；孤立' },
      { pos: 'adj.', meaning: '孤立的' },
    ],
    examples: [
      'The patient was isolated to prevent infection.',
    ],
    etymology: 'isol(岛) + -ate → 使成孤岛 → 隔离',
    wordFamily: ['isolate', 'isolation', 'isolated'],
    mnemonic: 'isol(岛)+ate → 像岛一样孤立 → 隔离',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w244', word: 'justify', phonetic: '/ˈdʒʌstɪfaɪ/',
    definitions: [
      { pos: 'v.', meaning: '证明…正当；为…辩护' },
    ],
    examples: [
      'How can you justify such behavior?',
    ],
    etymology: 'just(公正) + -ify → 使公正 → 证明正当',
    wordFamily: ['justify', 'justification', 'justified'],
    mnemonic: 'just(正义)+ify(使) → 使之正义 → 证明正当',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w245', word: 'launch', phonetic: '/lɔːntʃ/',
    definitions: [
      { pos: 'v.', meaning: '发射；发起；推出' },
      { pos: 'n.', meaning: '发射；推出' },
    ],
    examples: [
      'The company launched a new product last week.',
    ],
    etymology: '古法语 lanchier → 投掷',
    wordFamily: ['launch', 'launcher', 'launching'],
    mnemonic: 'laun(跑)+ch → 跑出去 → 发射',
    tags: ['CET4'],
  },
  {
    id: 'w246', word: 'legitimate', phonetic: '/lɪˈdʒɪtɪmət/',
    definitions: [
      { pos: 'adj.', meaning: '合法的；正当的' },
      { pos: 'v.', meaning: '使合法' },
    ],
    examples: [
      'That is a perfectly legitimate question.',
    ],
    etymology: 'leg(法律) + -itim + -ate → 合乎法律的 → 合法的',
    wordFamily: ['legitimate', 'legitimately', 'legitimacy'],
    mnemonic: 'leg(法律)+itim+ate → 合乎法律 → 合法的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w247', word: 'liberal', phonetic: '/ˈlɪbərəl/',
    definitions: [
      { pos: 'adj.', meaning: '自由的；开明的；慷慨的' },
    ],
    examples: [
      'She has liberal views on education.',
    ],
    etymology: 'liber(自由) + -al → 自由的',
    wordFamily: ['liberal', 'liberally', 'liberalism', 'liberate'],
    mnemonic: 'liber(自由)+al → 自由的 → 开明的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w248', word: 'likewise', phonetic: '/ˈlaɪkwaɪz/',
    definitions: [
      { pos: 'adv.', meaning: '同样地；也' },
    ],
    examples: [
      'He voted for the proposal, and she did likewise.',
    ],
    etymology: 'like(相似) + -wise(方式) → 相似的方式 → 同样地',
    wordFamily: ['like', 'likewise'],
    mnemonic: 'like(像)+wise(方式) → 用像的方式 → 同样地',
    tags: ['CET4'],
  },
  {
    id: 'w249', word: 'literacy', phonetic: '/ˈlɪtərəsi/',
    definitions: [
      { pos: 'n.', meaning: '读写能力；素养' },
    ],
    examples: [
      'The government is promoting adult literacy programs.',
    ],
    etymology: 'liter(文字) + -acy → 文字能力 → 读写能力',
    wordFamily: ['literacy', 'literate', 'illiterate', 'literature'],
    mnemonic: 'liter(文字)+acy → 文字能力 → 读写能力',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w250', word: 'maintain', phonetic: '/meɪnˈteɪn/',
    definitions: [
      { pos: 'v.', meaning: '维持；保养；坚持' },
    ],
    examples: [
      'It is important to maintain a healthy lifestyle.',
    ],
    etymology: 'main(手) + tain(握住) → 握在手中 → 维持',
    wordFamily: ['maintain', 'maintenance', 'maintainable'],
    mnemonic: 'main(手)+tain(握) → 握住不放 → 维持',
    tags: ['CET4'],
  },
  {
    id: 'w251', word: 'manufacture', phonetic: '/ˌmænjuˈfæktʃər/',
    definitions: [
      { pos: 'v.', meaning: '制造；生产' },
      { pos: 'n.', meaning: '制造；产品' },
    ],
    examples: [
      'This factory manufactures electronic components.',
    ],
    etymology: 'manu(手) + fact(做) + -ure → 用手做 → 制造',
    wordFamily: ['manufacture', 'manufacturer', 'manufacturing'],
    mnemonic: 'manu(手)+fact(做)+ure → 用手做 → 制造',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w252', word: 'mature', phonetic: '/məˈtʃʊər/',
    definitions: [
      { pos: 'adj.', meaning: '成熟的；深思熟虑的' },
      { pos: 'v.', meaning: '成熟；到期' },
    ],
    examples: [
      'She is very mature for her age.',
    ],
    etymology: 'matur(成熟) + -e → 成熟的',
    wordFamily: ['mature', 'maturity', 'maturation'],
    mnemonic: 'matur(成熟)+e → 成熟的',
    tags: ['CET4'],
  },
  {
    id: 'w253', word: 'measure', phonetic: '/ˈmeʒər/',
    definitions: [
      { pos: 'v.', meaning: '测量；衡量' },
      { pos: 'n.', meaning: '措施；量度' },
    ],
    examples: [
      'We must take measures to reduce pollution.',
    ],
    etymology: 'mens(测量) + -ure → 测量',
    wordFamily: ['measure', 'measurement', 'measurable'],
    mnemonic: 'meas(量)+ure → 量 → 测量',
    tags: ['CET4'],
  },
  {
    id: 'w254', word: 'mechanism', phonetic: '/ˈmekənɪzəm/',
    definitions: [
      { pos: 'n.', meaning: '机制；机械装置' },
    ],
    examples: [
      'We need to understand the mechanism of the disease.',
    ],
    etymology: 'mechan(机器) + -ism → 机器的运作 → 机制',
    wordFamily: ['mechanic', 'mechanism', 'mechanical', 'mechanics'],
    mnemonic: 'mechan(机器)+ism → 机器运作方式 → 机制',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w255', word: 'medium', phonetic: '/ˈmiːdiəm/',
    definitions: [
      { pos: 'n.', meaning: '媒介；中间；手段' },
      { pos: 'adj.', meaning: '中等的' },
    ],
    examples: [
      'Television is a powerful medium for advertising.',
    ],
    etymology: 'medi(中间) + -um → 中间物 → 媒介',
    wordFamily: ['medium', 'media', 'median'],
    mnemonic: 'medi(中间)+um → 中间的东西 → 媒介',
    tags: ['CET4'],
  },
  {
    id: 'w256', word: 'mental', phonetic: '/ˈmentl/',
    definitions: [
      { pos: 'adj.', meaning: '精神的；心理的；智力的' },
    ],
    examples: [
      'Mental health is as important as physical health.',
    ],
    etymology: 'ment(心灵) + -al → 心灵的 → 精神的',
    wordFamily: ['mental', 'mentally', 'mentality'],
    mnemonic: 'ment(心)+al → 心的 → 精神的',
    tags: ['CET4'],
  },
  {
    id: 'w257', word: 'merchant', phonetic: '/ˈmɜːtʃənt/',
    definitions: [
      { pos: 'n.', meaning: '商人；批发商' },
    ],
    examples: [
      'The merchant traded goods along the Silk Road.',
    ],
    etymology: 'merc(贸易) + -hant → 做贸易的人 → 商人',
    wordFamily: ['merchant', 'merchandise', 'commerce'],
    mnemonic: 'merc(贸易)+hant → 做贸易的人 → 商人',
    tags: ['CET4'],
  },
  {
    id: 'w258', word: 'merely', phonetic: '/ˈmɪəli/',
    definitions: [
      { pos: 'adv.', meaning: '仅仅；只不过' },
    ],
    examples: [
      'He is merely a child.',
    ],
    etymology: 'mere(纯粹的) + -ly → 纯粹地 → 仅仅',
    wordFamily: ['mere', 'merely'],
    mnemonic: 'mere(仅仅)+ly → 仅仅',
    tags: ['CET4'],
  },
  {
    id: 'w259', word: 'military', phonetic: '/ˈmɪlɪtəri/',
    definitions: [
      { pos: 'adj.', meaning: '军事的；军人的' },
      { pos: 'n.', meaning: '军队' },
    ],
    examples: [
      'The military took control of the government.',
    ],
    etymology: 'milit(士兵) + -ary → 士兵的 → 军事的',
    wordFamily: ['military', 'militarily', 'militant'],
    mnemonic: 'milit(兵)+ary → 当兵的 → 军事的',
    tags: ['CET4'],
  },
  {
    id: 'w260', word: 'minimum', phonetic: '/ˈmɪnɪməm/',
    definitions: [
      { pos: 'n.', meaning: '最小值；最低限度' },
      { pos: 'adj.', meaning: '最小的；最低的' },
    ],
    examples: [
      'The minimum wage has been increased.',
    ],
    etymology: 'minim(最小) + -um → 最小值',
    wordFamily: ['minimum', 'minimize', 'minimal', 'minimums'],
    mnemonic: 'minim(最小)+um → 最小值',
    tags: ['CET4'],
  },
  {
    id: 'w261', word: 'moderate', phonetic: '/ˈmɒdərət/',
    definitions: [
      { pos: 'adj.', meaning: '适度的；温和的' },
      { pos: 'v.', meaning: '节制；减轻' },
    ],
    examples: [
      'Moderate exercise is good for health.',
    ],
    etymology: 'moder(适度) + -ate → 适度的',
    wordFamily: ['moderate', 'moderately', 'moderation'],
    mnemonic: 'moder(适度)+ate → 适度的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w262', word: 'modify', phonetic: '/ˈmɒdɪfaɪ/',
    definitions: [
      { pos: 'v.', meaning: '修改；调整' },
    ],
    examples: [
      'We need to modify the plan to fit the budget.',
    ],
    etymology: 'mod(模式) + -ify → 改变模式 → 修改',
    wordFamily: ['modify', 'modification', 'modifier'],
    mnemonic: 'mod(模式)+ify → 改变模式 → 修改',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w263', word: 'monitor', phonetic: '/ˈmɒnɪtər/',
    definitions: [
      { pos: 'v.', meaning: '监控；监测' },
      { pos: 'n.', meaning: '显示器；班长' },
    ],
    examples: [
      'The doctor monitored the patient\'s condition.',
    ],
    etymology: 'monit(警告) + -or → 警告者 → 监控',
    wordFamily: ['monitor', 'monitoring', 'monitory'],
    mnemonic: 'monit(提醒)+or → 不断提醒 → 监控',
    tags: ['CET4'],
  },
  {
    id: 'w264', word: 'moral', phonetic: '/ˈmɒrəl/',
    definitions: [
      { pos: 'adj.', meaning: '道德的；道义的' },
      { pos: 'n.', meaning: '道德；寓意' },
    ],
    examples: [
      'He has high moral standards.',
    ],
    etymology: 'mor(风俗) + -al → 风俗的 → 道德的',
    wordFamily: ['moral', 'morally', 'morality', 'immoral'],
    mnemonic: 'mor(风俗)+al → 社会风俗规范 → 道德的',
    tags: ['CET4'],
  },
  {
    id: 'w265', word: 'motivate', phonetic: '/ˈməʊtɪveɪt/',
    definitions: [
      { pos: 'v.', meaning: '激励；激发' },
    ],
    examples: [
      'What motivates you to work so hard?',
    ],
    etymology: 'mot(动) + -iv + -ate → 使动 → 激励',
    wordFamily: ['motive', 'motivate', 'motivation', 'motivated'],
    mnemonic: 'mot(动)+ivate → 使人动起来 → 激励',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w266', word: 'negotiate', phonetic: '/nɪˈɡəʊʃieɪt/',
    definitions: [
      { pos: 'v.', meaning: '谈判；协商' },
    ],
    examples: [
      'The two sides are negotiating a peace agreement.',
    ],
    etymology: 'neg-(不) + oti(闲暇) + -ate → 没有闲暇 → 忙于谈判',
    wordFamily: ['negotiate', 'negotiation', 'negotiator'],
    mnemonic: 'neg(不)+oti(闲)+ate → 没闲着 → 忙着谈判',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w267', word: 'neutral', phonetic: '/ˈnjuːtrəl/',
    definitions: [
      { pos: 'adj.', meaning: '中立的；中性的' },
    ],
    examples: [
      'Switzerland remained neutral during the war.',
    ],
    etymology: 'neutr( neither ) + -al → 两者都不 → 中立的',
    wordFamily: ['neutral', 'neutrality', 'neutralize'],
    mnemonic: 'neutr(中)+al → 中间的 → 中立的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w268', word: 'noble', phonetic: '/ˈnəʊbl/',
    definitions: [
      { pos: 'adj.', meaning: '高尚的；贵族的' },
      { pos: 'n.', meaning: '贵族' },
    ],
    examples: [
      'He is a man of noble character.',
    ],
    etymology: '拉丁语 nobilis(知名的) → 贵族的',
    wordFamily: ['noble', 'nobly', 'nobility'],
    mnemonic: 'nobl(知名)+e → 出名的高贵 → 高尚的',
    tags: ['CET4'],
  },
  {
    id: 'w269', word: 'notion', phonetic: '/ˈnəʊʃən/',
    definitions: [
      { pos: 'n.', meaning: '概念；观念；想法' },
    ],
    examples: [
      'She rejected the notion that money brings happiness.',
    ],
    etymology: 'not(知道) + -ion → 知道的东西 → 观念',
    wordFamily: ['notion', 'notional', 'notions'],
    mnemonic: 'not(知道)+ion → 脑中知道的东西 → 观念',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w270', word: 'numerous', phonetic: '/ˈnjuːmərəs/',
    definitions: [
      { pos: 'adj.', meaning: '众多的；许多的' },
    ],
    examples: [
      'There are numerous reasons for the failure.',
    ],
    etymology: 'numer(数字) + -ous → 数量多的 → 众多的',
    wordFamily: ['number', 'numerous', 'numerical'],
    mnemonic: 'numer(数)+ous → 数量很多 → 众多的',
    tags: ['CET4'],
  },
  {
    id: 'w271', word: 'objective', phonetic: '/əbˈdʒektɪv/',
    definitions: [
      { pos: 'adj.', meaning: '客观的；目标的' },
      { pos: 'n.', meaning: '目标；目的' },
    ],
    examples: [
      'We need an objective assessment of the situation.',
    ],
    etymology: 'object(对象) + -ive → 面向对象的 → 客观的',
    wordFamily: ['object', 'objective', 'objectively', 'objectivity'],
    mnemonic: 'object(对象)+ive → 面对事实 → 客观的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w272', word: 'oblige', phonetic: '/əˈblaɪdʒ/',
    definitions: [
      { pos: 'v.', meaning: '迫使；施恩于；感激' },
    ],
    examples: [
      'The law obliges parents to send their children to school.',
    ],
    etymology: 'ob-(向) + lig(绑定) → 绑住 → 迫使',
    wordFamily: ['oblige', 'obligation', 'obligatory'],
    mnemonic: 'ob+lig(绑)+e → 绑住 → 迫使',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w273', word: 'observe', phonetic: '/əbˈzɜːv/',
    definitions: [
      { pos: 'v.', meaning: '观察；遵守；庆祝' },
    ],
    examples: [
      'Scientists observe the behavior of animals in the wild.',
    ],
    etymology: 'ob-(向) + serv(保持) → 保持注意 → 观察',
    wordFamily: ['observe', 'observation', 'observer', 'observatory'],
    mnemonic: 'ob+serv(保持)+e → 保持关注 → 观察',
    tags: ['CET4'],
  },
  {
    id: 'w274', word: 'obtain', phonetic: '/əbˈteɪn/',
    definitions: [
      { pos: 'v.', meaning: '获得；得到' },
    ],
    examples: [
      'She obtained a scholarship to study abroad.',
    ],
    etymology: 'ob-(向) + tain(握住) → 握住 → 获得',
    wordFamily: ['obtain', 'obtainable', 'obtainment'],
    mnemonic: 'ob+tain(握) → 紧紧握住 → 获得',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w275', word: 'obvious', phonetic: '/ˈɒbviəs/',
    definitions: [
      { pos: 'adj.', meaning: '明显的；显而易见的' },
    ],
    examples: [
      'It is obvious that he is lying.',
    ],
    etymology: 'ob-(在) + vi(路) + -ous → 在路上的 → 明显的',
    wordFamily: ['obvious', 'obviously', 'obviousness'],
    mnemonic: 'ob+vi(路)+ous → 摆在路上的 → 明显的',
    tags: ['CET4'],
  },
  {
    id: 'w276', word: 'occasion', phonetic: '/əˈkeɪʒən/',
    definitions: [
      { pos: 'n.', meaning: '场合；时机；原因' },
    ],
    examples: [
      'He wore a suit on the occasion of his daughter\'s wedding.',
    ],
    etymology: 'oc-(向) + cas(落下) + -ion → 落下的时刻 → 时机',
    wordFamily: ['occasion', 'occasional', 'occasionally'],
    mnemonic: 'oc+cas(落)+ion → 时机降临 → 场合',
    tags: ['CET4'],
  },
  {
    id: 'w277', word: 'occupy', phonetic: '/ˈɒkjupaɪ/',
    definitions: [
      { pos: 'v.', meaning: '占据；使忙碌' },
    ],
    examples: [
      'Reading occupies most of my free time.',
    ],
    etymology: 'oc-(向) + cup(抓) + -y → 抓住 → 占据',
    wordFamily: ['occupy', 'occupation', 'occupant'],
    mnemonic: 'oc+cup(抓)+y → 抓住不放 → 占据',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w278', word: 'occur', phonetic: '/əˈkɜːr/',
    definitions: [
      { pos: 'v.', meaning: '发生；出现；想到' },
    ],
    examples: [
      'The accident occurred at midnight.',
    ],
    etymology: 'oc-(向) + cur(跑) → 跑过来 → 发生',
    wordFamily: ['occur', 'occurrence', 'occurring'],
    mnemonic: 'oc+cur(跑) → 跑出来了 → 发生',
    tags: ['CET4'],
  },
  {
    id: 'w279', word: 'offend', phonetic: '/əˈfend/',
    definitions: [
      { pos: 'v.', meaning: '冒犯；得罪；违反' },
    ],
    examples: [
      'I hope I didn\'t offend you.',
    ],
    etymology: 'of-(向) + fend(打击) → 打击 → 冒犯',
    wordFamily: ['offend', 'offense', 'offensive', 'offender'],
    mnemonic: 'of+fend(打) → 打击别人 → 冒犯',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w280', word: 'operate', phonetic: '/ˈɒpəreɪt/',
    definitions: [
      { pos: 'v.', meaning: '操作；运营；动手术' },
    ],
    examples: [
      'The machine operates smoothly.',
    ],
    etymology: 'oper(工作) + -ate → 工作 → 操作',
    wordFamily: ['operate', 'operation', 'operator', 'operational'],
    mnemonic: 'oper(工作)+ate → 使之工作 → 操作',
    tags: ['CET4'],
  },
  {
    id: 'w281', word: 'oppose', phonetic: '/əˈpəʊz/',
    definitions: [
      { pos: 'v.', meaning: '反对；对抗' },
    ],
    examples: [
      'Many people opposed the new law.',
    ],
    etymology: 'op-(对面) + pos(放) + -e → 放在对面 → 反对',
    wordFamily: ['oppose', 'opposition', 'opposite', 'opponent'],
    mnemonic: 'op+pos(放)+e → 放在对立面 → 反对',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w282', word: 'option', phonetic: '/ˈɒpʃən/',
    definitions: [
      { pos: 'n.', meaning: '选择；选项' },
    ],
    examples: [
      'You have several options to choose from.',
    ],
    etymology: 'opt(选择) + -ion → 选择',
    wordFamily: ['option', 'optional', 'optionally'],
    mnemonic: 'opt(选择)+ion → 选择 → 选项',
    tags: ['CET4'],
  },
  {
    id: 'w283', word: 'original', phonetic: '/əˈrɪdʒɪnl/',
    definitions: [
      { pos: 'adj.', meaning: '原始的；独创的' },
      { pos: 'n.', meaning: '原作；原件' },
    ],
    examples: [
      'The original idea was much simpler.',
    ],
    etymology: 'origin(起源) + -al → 起源的 → 原始的',
    wordFamily: ['origin', 'original', 'originally', 'originality'],
    mnemonic: 'origin(起源)+al → 最初的 → 原始的',
    tags: ['CET4'],
  },
  {
    id: 'w284', word: 'outcome', phonetic: '/ˈaʊtkʌm/',
    definitions: [
      { pos: 'n.', meaning: '结果；成果' },
    ],
    examples: [
      'We are satisfied with the outcome of the negotiation.',
    ],
    etymology: 'out(出) + come(来) → 出来的东西 → 结果',
    wordFamily: ['outcome', 'outcomes'],
    mnemonic: 'out(出)+come(来) → 出来的 → 结果',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w285', word: 'overcome', phonetic: '/ˌəʊvəˈkʌm/',
    definitions: [
      { pos: 'v.', meaning: '克服；战胜' },
    ],
    examples: [
      'She overcame many difficulties to achieve success.',
    ],
    etymology: 'over(越过) + come(来) → 越过来 → 克服',
    wordFamily: ['overcome', 'overcame'],
    mnemonic: 'over(越过)+come(来) → 越过障碍 → 克服',
    tags: ['CET4'],
  },
  {
    id: 'w286', word: 'overlook', phonetic: '/ˌəʊvəˈlʊk/',
    definitions: [
      { pos: 'v.', meaning: '忽视；俯瞰；宽容' },
    ],
    examples: [
      'We should not overlook this important detail.',
    ],
    etymology: 'over(上面) + look(看) → 从上面看 → 俯瞰/忽视',
    wordFamily: ['overlook', 'overlooked'],
    mnemonic: 'over(上面)+look(看) → 从上面看过去 → 忽视',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w287', word: 'overwhelm', phonetic: '/ˌəʊvəˈwelm/',
    definitions: [
      { pos: 'v.', meaning: '压倒；淹没；使不知所措' },
    ],
    examples: [
      'She was overwhelmed by the news.',
    ],
    etymology: 'over(超过) + whelm(翻转) → 翻转压倒 → 压倒',
    wordFamily: ['overwhelm', 'overwhelming', 'overwhelmingly'],
    mnemonic: 'over(过)+whelm(压) → 压过来 → 压倒',
    tags: ['CET4', 'CET6'],
  },
];
