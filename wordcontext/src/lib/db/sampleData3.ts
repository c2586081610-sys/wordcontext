import type { WordEntry } from './index';

// CET4 核心词汇 E-H
export const WORDS_EH: WordEntry[] = [
  {
    id: 'w137', word: 'economy', phonetic: '/ɪˈkɒnəmi/',
    definitions: [
      { pos: 'n.', meaning: '经济；节约' },
    ],
    examples: [
      'The economy is recovering from the recession.',
    ],
    etymology: '希腊语 oikonomia(家庭管理) → 经济',
    wordFamily: ['economy', 'economic', 'economical', 'economics', 'economist'],
    mnemonic: 'eco(生态)+nomy(法则) → 管理的法则 → 经济',
    tags: ['CET4'],
  },
  {
    id: 'w138', word: 'efficient', phonetic: '/ɪˈfɪʃənt/',
    definitions: [
      { pos: 'adj.', meaning: '高效的；有效率的' },
    ],
    examples: [
      'This new method is much more efficient.',
    ],
    etymology: 'ef-(出) + fic(做) + -ient → 做出来的 → 高效的',
    wordFamily: ['efficient', 'efficiency', 'efficiently'],
    mnemonic: 'ef+fic(做)+ient → 做得又快又好 → 高效的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w139', word: 'elaborate', phonetic: '/ɪˈlæbərət/',
    definitions: [
      { pos: 'adj.', meaning: '精心制作的；详尽的' },
      { pos: 'v.', meaning: '详细阐述' },
    ],
    examples: [
      'Could you elaborate on your proposal?',
    ],
    etymology: 'e-(出) + labor(劳动) + -ate → 用心劳作 → 精心制作的',
    wordFamily: ['elaborate', 'elaboration', 'elaborately'],
    mnemonic: 'e+labor(劳动)+ate → 用心劳动做出来的 → 精心制作的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w140', word: 'eliminate', phonetic: '/ɪˈlɪmɪneɪt/',
    definitions: [
      { pos: 'v.', meaning: '消除；淘汰' },
    ],
    examples: [
      'We need to eliminate all sources of error.',
    ],
    etymology: 'e-(出) + limin(门槛) + -ate → 赶出门 → 消除',
    wordFamily: ['eliminate', 'elimination', 'eliminator'],
    mnemonic: 'e+limin(门槛)+ate → 赶出门外 → 淘汰',
    tags: ['CET4', 'CET6', '考研'],
  },
  {
    id: 'w141', word: 'embrace', phonetic: '/ɪmˈbreɪs/',
    definitions: [
      { pos: 'v.', meaning: '拥抱；接受；包含' },
      { pos: 'n.', meaning: '拥抱' },
    ],
    examples: [
      'We should embrace new ideas with an open mind.',
    ],
    etymology: 'em-(进入) + brace(手臂) → 进入手臂 → 拥抱',
    wordFamily: ['embrace', 'embracement'],
    mnemonic: 'em+brace(手臂) → 投入双臂 → 拥抱',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w142', word: 'emerge', phonetic: '/ɪˈmɜːdʒ/',
    definitions: [
      { pos: 'v.', meaning: '出现；浮现；兴起' },
    ],
    examples: [
      'New evidence emerged during the investigation.',
    ],
    etymology: 'e-(出) + merge(浸入) → 从浸入中出来 → 出现',
    wordFamily: ['emerge', 'emergence', 'emergency', 'emergent'],
    mnemonic: 'e(出)+merge(沉) → 从沉没中浮出 → 出现',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w143', word: 'emotion', phonetic: '/ɪˈməʊʃən/',
    definitions: [
      { pos: 'n.', meaning: '情感；情绪' },
    ],
    examples: [
      'She showed no emotion when she heard the news.',
    ],
    etymology: 'e-(出) + mot(动) + -ion → 动出来 → 情感',
    wordFamily: ['emotion', 'emotional', 'emotionally', 'emotionless'],
    mnemonic: 'e+mot(动)+ion → 内心激动 → 情感',
    tags: ['CET4'],
  },
  {
    id: 'w144', word: 'emphasize', phonetic: '/ˈemfəsaɪz/',
    definitions: [
      { pos: 'v.', meaning: '强调；着重' },
    ],
    examples: [
      'The teacher emphasized the importance of reading.',
    ],
    etymology: 'em-(进入) + phas(表现) + -ize → 使表现出来 → 强调',
    wordFamily: ['emphasize', 'emphasis', 'emphatic'],
    mnemonic: 'em+phas(阶段)+ize → 在某个阶段突出 → 强调',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w145', word: 'encounter', phonetic: '/ɪnˈkaʊntər/',
    definitions: [
      { pos: 'v.', meaning: '遇到；遭遇' },
      { pos: 'n.', meaning: '遭遇；相遇' },
    ],
    examples: [
      'We encountered many difficulties along the way.',
    ],
    etymology: 'en-(进入) + counter(对面) → 走到对面 → 遭遇',
    wordFamily: ['encounter', 'encounters'],
    mnemonic: 'en+counter(对面) → 走到对面碰上 → 遭遇',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w146', word: 'enhance', phonetic: '/ɪnˈhɑːns/',
    definitions: [
      { pos: 'v.', meaning: '增强；提高；改善' },
    ],
    examples: [
      'Good lighting can enhance the beauty of a room.',
    ],
    etymology: 'en-(使) + hance(高) → 使变高 → 增强',
    wordFamily: ['enhance', 'enhancement', 'enhanced'],
    mnemonic: 'en+hance(高) → 使更高 → 增强',
    tags: ['CET4', 'CET6', '考研'],
  },
  {
    id: 'w147', word: 'enormous', phonetic: '/ɪˈnɔːməs/',
    definitions: [
      { pos: 'adj.', meaning: '巨大的；庞大的' },
    ],
    examples: [
      'The project requires an enormous amount of money.',
    ],
    etymology: 'e-(出) + norm(标准) + -ous → 超出标准 → 巨大的',
    wordFamily: ['enormous', 'enormously', 'enormity'],
    mnemonic: 'e+norm(正常)+ous → 超出正常 → 巨大的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w148', word: 'ensure', phonetic: '/ɪnˈʃʊər/',
    definitions: [
      { pos: 'v.', meaning: '确保；保证' },
    ],
    examples: [
      'Please ensure that all doors are locked.',
    ],
    etymology: 'en-(使) + sure(确定) → 使确定 → 确保',
    wordFamily: ['ensure', 'ensurance'],
    mnemonic: 'en+sure(确定) → 使确定 → 确保',
    tags: ['CET4'],
  },
  {
    id: 'w149', word: 'enterprise', phonetic: '/ˈentəpraɪz/',
    definitions: [
      { pos: 'n.', meaning: '企业；事业；进取心' },
    ],
    examples: [
      'She works for a large enterprise.',
    ],
    etymology: 'enter(进入) + prise(抓住) → 抓住机会进入 → 企业',
    wordFamily: ['enterprise', 'enterprising', 'entrepreneur'],
    mnemonic: 'enter+prise(抓) → 进去抓住机会 → 企业',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w150', word: 'equivalent', phonetic: '/ɪˈkwɪvələnt/',
    definitions: [
      { pos: 'adj.', meaning: '等同的；等价的' },
      { pos: 'n.', meaning: '等价物' },
    ],
    examples: [
      'One dollar is equivalent to about seven yuan.',
    ],
    etymology: 'equi(平等) + val(价值) + -ent → 价值相等 → 等价的',
    wordFamily: ['equivalent', 'equivalence'],
    mnemonic: 'equi(平等)+val(价值)+ent → 价值相等 → 等价的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w151', word: 'essential', phonetic: '/ɪˈsenʃəl/',
    definitions: [
      { pos: 'adj.', meaning: '必要的；本质的' },
      { pos: 'n.', meaning: '必需品；要素' },
    ],
    examples: [
      'Water is essential for life.',
    ],
    etymology: 'ess(存在) + -ent + -ial → 存在的根本 → 本质的',
    wordFamily: ['essential', 'essentially', 'essence'],
    mnemonic: 'ess(本质)+ential → 关乎本质的 → 必要的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w152', word: 'establish', phonetic: '/ɪˈstæblɪʃ/',
    definitions: [
      { pos: 'v.', meaning: '建立；确立；查实' },
    ],
    examples: [
      'The school was established in 1950.',
    ],
    etymology: 'e-(出) + stabl(稳定) + -ish → 使稳定 → 建立',
    wordFamily: ['establish', 'establishment', 'established'],
    mnemonic: 'e+stabl(稳定)+ish → 使稳定下来 → 建立',
    tags: ['CET4'],
  },
  {
    id: 'w153', word: 'evaluate', phonetic: '/ɪˈvæljueɪt/',
    definitions: [
      { pos: 'v.', meaning: '评估；评价' },
    ],
    examples: [
      'We need to evaluate the effectiveness of the program.',
    ],
    etymology: 'e-(出) + valu(价值) + -ate → 定出价值 → 评估',
    wordFamily: ['evaluate', 'evaluation', 'evaluative'],
    mnemonic: 'e+valu(价值)+ate → 定出价值 → 评估',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w154', word: 'evidence', phonetic: '/ˈevɪdəns/',
    definitions: [
      { pos: 'n.', meaning: '证据；迹象' },
    ],
    examples: [
      'There is no evidence to support this claim.',
    ],
    etymology: 'e-(出) + vid(看) + -ence → 看出来的 → 证据',
    wordFamily: ['evidence', 'evident', 'evidently'],
    mnemonic: 'e+vid(看)+ence → 能看出来的 → 证据',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w155', word: 'evolve', phonetic: '/ɪˈvɒlv/',
    definitions: [
      { pos: 'v.', meaning: '进化；发展；逐步形成' },
    ],
    examples: [
      'The company has evolved into a global brand.',
    ],
    etymology: 'e-(出) + volv(转) + -e → 向外转 → 进化',
    wordFamily: ['evolve', 'evolution', 'evolutionary'],
    mnemonic: 'e+volv(转)+e → 向外展开 → 进化',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w156', word: 'exaggerate', phonetic: '/ɪɡˈzædʒəreɪt/',
    definitions: [
      { pos: 'v.', meaning: '夸大；夸张' },
    ],
    examples: [
      'Don\'t exaggerate the difficulty of the task.',
    ],
    etymology: 'ex-(出) + agger(堆) + -ate → 堆出来 → 夸大',
    wordFamily: ['exaggerate', 'exaggeration', 'exaggerated'],
    mnemonic: 'ex+agger(堆)+ate → 堆得超出 → 夸大',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w157', word: 'exceed', phonetic: '/ɪkˈsiːd/',
    definitions: [
      { pos: 'v.', meaning: '超过；超越' },
    ],
    examples: [
      'The results exceeded our expectations.',
    ],
    etymology: 'ex-(出) + ceed(走) → 走出去 → 超过',
    wordFamily: ['exceed', 'excess', 'excessive'],
    mnemonic: 'ex(出)+ceed(走) → 走出去超出了 → 超过',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w158', word: 'exception', phonetic: '/ɪkˈsepʃən/',
    definitions: [
      { pos: 'n.', meaning: '例外；异议' },
    ],
    examples: [
      'Everyone must follow the rules without exception.',
    ],
    etymology: 'ex-(出) + cept(拿) + -ion → 拿出去 → 例外',
    wordFamily: ['exception', 'exceptional', 'exceptionally'],
    mnemonic: 'ex+cept(拿)+ion → 拿出去不算 → 例外',
    tags: ['CET4'],
  },
  {
    id: 'w159', word: 'excessive', phonetic: '/ɪkˈsesɪv/',
    definitions: [
      { pos: 'adj.', meaning: '过度的；过多的' },
    ],
    examples: [
      'Excessive drinking is harmful to health.',
    ],
    etymology: 'excess(超过) + -ive → 超过的 → 过度的',
    wordFamily: ['excess', 'excessive', 'excessively'],
    mnemonic: 'excess(超过)+ive → 超过限度的 → 过度的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w160', word: 'exclude', phonetic: '/ɪkˈskluːd/',
    definitions: [
      { pos: 'v.', meaning: '排除；排斥' },
    ],
    examples: [
      'The price excludes tax.',
    ],
    etymology: 'ex-(出) + clud(关闭) + -e → 关在外面 → 排除',
    wordFamily: ['exclude', 'exclusion', 'exclusive', 'exclusively'],
    mnemonic: 'ex(出)+clud(关)+e → 关在外面 → 排除',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w161', word: 'execute', phonetic: '/ˈeksɪkjuːt/',
    definitions: [
      { pos: 'v.', meaning: '执行；处决' },
    ],
    examples: [
      'The plan was executed perfectly.',
    ],
    etymology: 'ex-(出) + ecu(跟随) + -te → 跟随出去 → 执行',
    wordFamily: ['execute', 'execution', 'executive'],
    mnemonic: 'ex+ecu(跟随)+te → 跟着做 → 执行',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w162', word: 'exhibit', phonetic: '/ɪɡˈzɪbɪt/',
    definitions: [
      { pos: 'v.', meaning: '展览；展示' },
      { pos: 'n.', meaning: '展品；展览' },
    ],
    examples: [
      'The museum exhibits paintings by local artists.',
    ],
    etymology: 'ex-(出) + hibit(持有) → 拿出来 → 展览',
    wordFamily: ['exhibit', 'exhibition', 'exhibitor'],
    mnemonic: 'ex(出)+hibit(拿) → 拿出来给人看 → 展览',
    tags: ['CET4'],
  },
  {
    id: 'w163', word: 'expand', phonetic: '/ɪkˈspænd/',
    definitions: [
      { pos: 'v.', meaning: '扩展；膨胀；详述' },
    ],
    examples: [
      'The company plans to expand its business overseas.',
    ],
    etymology: 'ex-(出) + pand(展开) → 向外展开 → 扩展',
    wordFamily: ['expand', 'expansion', 'expansive'],
    mnemonic: 'ex(出)+pand(展开) → 向外展开 → 扩展',
    tags: ['CET4'],
  },
  {
    id: 'w164', word: 'exploit', phonetic: '/ɪkˈsplɔɪt/',
    definitions: [
      { pos: 'v.', meaning: '利用；开发；剥削' },
      { pos: 'n.', meaning: '功绩；壮举' },
    ],
    examples: [
      'We must exploit every opportunity to learn.',
    ],
    etymology: 'ex-(出) + ploit(折叠) → 展开折叠 → 开发',
    wordFamily: ['exploit', 'exploitation', 'exploitable'],
    mnemonic: 'ex+ploit(折) → 展开利用 → 开发',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w165', word: 'expose', phonetic: '/ɪkˈspəʊz/',
    definitions: [
      { pos: 'v.', meaning: '暴露；揭露；使接触' },
    ],
    examples: [
      'The report exposed the corruption in the government.',
    ],
    etymology: 'ex-(出) + pos(放) + -e → 放在外面 → 暴露',
    wordFamily: ['expose', 'exposure', 'exposed'],
    mnemonic: 'ex(出)+pos(放)+e → 放在外面 → 暴露',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w166', word: 'extend', phonetic: '/ɪkˈstend/',
    definitions: [
      { pos: 'v.', meaning: '延伸；扩大；给予' },
    ],
    examples: [
      'We decided to extend the deadline by one week.',
    ],
    etymology: 'ex-(出) + tend(伸展) → 向外伸展 → 延伸',
    wordFamily: ['extend', 'extension', 'extensive', 'extent'],
    mnemonic: 'ex(出)+tend(伸) → 向外伸 → 延伸',
    tags: ['CET4'],
  },
  {
    id: 'w167', word: 'extraordinary', phonetic: '/ɪkˈstrɔːdɪnəri/',
    definitions: [
      { pos: 'adj.', meaning: '非凡的；特别的' },
    ],
    examples: [
      'She has an extraordinary talent for music.',
    ],
    etymology: 'extra-(超出) + ordinary(普通) → 超出普通 → 非凡的',
    wordFamily: ['extraordinary', 'extraordinarily'],
    mnemonic: 'extra(额外)+ordinary(普通) → 超出普通 → 非凡的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w168', word: 'extreme', phonetic: '/ɪkˈstriːm/',
    definitions: [
      { pos: 'adj.', meaning: '极端的；极度的' },
      { pos: 'n.', meaning: '极端；极限' },
    ],
    examples: [
      'The weather here is very extreme.',
    ],
    etymology: 'extr(外面) + -eme → 最外面的 → 极端的',
    wordFamily: ['extreme', 'extremely', 'extremist'],
    mnemonic: 'extr(外)+eme → 最外面的 → 极端的',
    tags: ['CET4'],
  },
  {
    id: 'w169', word: 'facility', phonetic: '/fəˈsɪləti/',
    definitions: [
      { pos: 'n.', meaning: '设施；设备；便利' },
    ],
    examples: [
      'The hotel has excellent sports facilities.',
    ],
    etymology: 'facil(容易) + -ity → 使容易的东西 → 设施',
    wordFamily: ['facility', 'facilities', 'facilitate'],
    mnemonic: 'fac(做)+ility → 帮助做事的东西 → 设施',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w170', word: 'faculty', phonetic: '/ˈfækəlti/',
    definitions: [
      { pos: 'n.', meaning: '全体教员；才能；系' },
    ],
    examples: [
      'She is a member of the faculty at the university.',
    ],
    etymology: 'fac(做) + -ulty → 做事的能力 → 才能',
    wordFamily: ['faculty', 'faculties'],
    mnemonic: 'fac(做)+ulty → 能做事 → 才能/全体教员',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w171', word: 'faithful', phonetic: '/ˈfeɪθfʊl/',
    definitions: [
      { pos: 'adj.', meaning: '忠实的；忠诚的' },
    ],
    examples: [
      'He has been a faithful friend for many years.',
    ],
    etymology: 'faith(信任) + -ful → 充满信任的 → 忠实的',
    wordFamily: ['faith', 'faithful', 'faithfully', 'faithless'],
    mnemonic: 'faith(信任)+ful → 充满信任 → 忠实的',
    tags: ['CET4'],
  },
  {
    id: 'w172', word: 'fatal', phonetic: '/ˈfeɪtl/',
    definitions: [
      { pos: 'adj.', meaning: '致命的；灾难性的' },
    ],
    examples: [
      'The accident proved to be fatal.',
    ],
    etymology: 'fat(命运) + -al → 命中注定的 → 致命的',
    wordFamily: ['fatal', 'fatally', 'fatality'],
    mnemonic: 'fat(命运)+al → 命运注定的 → 致命的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w173', word: 'favorable', phonetic: '/ˈfeɪvərəbl/',
    definitions: [
      { pos: 'adj.', meaning: '有利的；赞成的' },
    ],
    examples: [
      'The weather conditions are favorable for sailing.',
    ],
    etymology: 'favor(赞成) + -able → 可赞成的 → 有利的',
    wordFamily: ['favor', 'favorable', 'favorably', 'favorite'],
    mnemonic: 'favor(赞成)+able → 值得赞成的 → 有利的',
    tags: ['CET4'],
  },
  {
    id: 'w174', word: 'feasible', phonetic: '/ˈfiːzəbl/',
    definitions: [
      { pos: 'adj.', meaning: '可行的；可能的' },
    ],
    examples: [
      'Is it feasible to finish the project by next month?',
    ],
    etymology: 'feas(做) + -ible → 能做的 → 可行的',
    wordFamily: ['feasible', 'feasibility'],
    mnemonic: 'feas(做)+ible → 能做出来的 → 可行的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w175', word: 'feature', phonetic: '/ˈfiːtʃər/',
    definitions: [
      { pos: 'n.', meaning: '特征；特色；专题' },
      { pos: 'v.', meaning: '以…为特色' },
    ],
    examples: [
      'The phone has many new features.',
    ],
    etymology: 'feat(做) + -ure → 做出来的样子 → 特征',
    wordFamily: ['feature', 'featured', 'featureless'],
    mnemonic: 'feat(做)+ure → 做出来的样子 → 特征',
    tags: ['CET4'],
  },
  {
    id: 'w176', word: 'flexible', phonetic: '/ˈfleksəbl/',
    definitions: [
      { pos: 'adj.', meaning: '灵活的；柔韧的' },
    ],
    examples: [
      'We need a more flexible approach to this problem.',
    ],
    etymology: 'flex(弯曲) + -ible → 能弯曲的 → 灵活的',
    wordFamily: ['flexible', 'flexibility', 'flexibly'],
    mnemonic: 'flex(弯)+ible → 能弯曲的 → 灵活的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w177', word: 'flourish', phonetic: '/ˈflʌrɪʃ/',
    definitions: [
      { pos: 'v.', meaning: '繁荣；茂盛；挥舞' },
    ],
    examples: [
      'The economy is flourishing under the new policy.',
    ],
    etymology: 'flor(花) + -ish → 像花一样 → 繁荣',
    wordFamily: ['flourish', 'flourishing'],
    mnemonic: 'flour(花)+ish → 像花一样盛开 → 繁荣',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w178', word: 'forecast', phonetic: '/ˈfɔːkɑːst/',
    definitions: [
      { pos: 'v.', meaning: '预测；预报' },
      { pos: 'n.', meaning: '预测；预报' },
    ],
    examples: [
      'The weather forecast says it will rain tomorrow.',
    ],
    etymology: 'fore-(前) + cast(投) → 提前投出 → 预测',
    wordFamily: ['forecast', 'forecaster', 'forecasting'],
    mnemonic: 'fore(前)+cast(投) → 提前投出 → 预测',
    tags: ['CET4'],
  },
  {
    id: 'w179', word: 'former', phonetic: '/ˈfɔːmər/',
    definitions: [
      { pos: 'adj.', meaning: '以前的；前任的' },
      { pos: 'n.', meaning: '前者' },
    ],
    examples: [
      'The former president gave a speech yesterday.',
    ],
    etymology: 'form(形式) + -er → 以前的形式 → 以前的',
    wordFamily: ['former', 'formerly'],
    mnemonic: 'form(形式)+er → 以前那个形式 → 以前的',
    tags: ['CET4'],
  },
  {
    id: 'w180', word: 'formula', phonetic: '/ˈfɔːmjələ/',
    definitions: [
      { pos: 'n.', meaning: '公式；配方；方案' },
    ],
    examples: [
      'There is no simple formula for success.',
    ],
    etymology: 'form(形式) + -ula → 小的形式 → 公式',
    wordFamily: ['formula', 'formulate', 'formulation'],
    mnemonic: 'form(形式)+ula → 规范的形式 → 公式',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w181', word: 'fortune', phonetic: '/ˈfɔːtʃuːn/',
    definitions: [
      { pos: 'n.', meaning: '财富；运气；命运' },
    ],
    examples: [
      'He made a fortune in the stock market.',
    ],
    etymology: 'fort(运气) + -une → 运气 → 财富',
    wordFamily: ['fortune', 'fortunate', 'fortunately', 'misfortune'],
    mnemonic: 'fort(强)+une → 强运 → 运气/财富',
    tags: ['CET4'],
  },
  {
    id: 'w182', word: 'foundation', phonetic: '/faʊnˈdeɪʃən/',
    definitions: [
      { pos: 'n.', meaning: '基础；基金会；地基' },
    ],
    examples: [
      'Trust is the foundation of any good relationship.',
    ],
    etymology: 'found(建立) + -ation → 建立的基础 → 基础',
    wordFamily: ['found', 'foundation', 'founder'],
    mnemonic: 'found(建立)+ation → 建立之基 → 基础',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w183', word: 'fragment', phonetic: '/ˈfræɡmənt/',
    definitions: [
      { pos: 'n.', meaning: '碎片；片段' },
      { pos: 'v.', meaning: '使成碎片' },
    ],
    examples: [
      'Only a fragment of the original painting survives.',
    ],
    etymology: 'frag(打破) + -ment → 打破的 → 碎片',
    wordFamily: ['fragment', 'fragmentary', 'fragmentation'],
    mnemonic: 'frag(破)+ment → 破碎的部分 → 碎片',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w184', word: 'framework', phonetic: '/ˈfreɪmwɜːk/',
    definitions: [
      { pos: 'n.', meaning: '框架；体制；结构' },
    ],
    examples: [
      'We need a legal framework to regulate this industry.',
    ],
    etymology: 'frame(框架) + work(工作) → 工作的框架 → 框架',
    wordFamily: ['framework', 'frameworks'],
    mnemonic: 'frame(框架)+work(工作) → 工作的骨架 → 框架',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w185', word: 'frequent', phonetic: '/ˈfriːkwənt/',
    definitions: [
      { pos: 'adj.', meaning: '频繁的；经常的' },
      { pos: 'v.', meaning: '常去' },
    ],
    examples: [
      'Frequent practice is the key to improvement.',
    ],
    etymology: 'frequ(频繁) + -ent → 频繁的',
    wordFamily: ['frequent', 'frequently', 'frequency'],
    mnemonic: 'frequ(频繁)+ent → 频繁的',
    tags: ['CET4'],
  },
  {
    id: 'w186', word: 'frustrate', phonetic: '/frʌˈstreɪt/',
    definitions: [
      { pos: 'v.', meaning: '使沮丧；挫败' },
    ],
    examples: [
      'The delay frustrated all our plans.',
    ],
    etymology: 'frustr(徒劳) + -ate → 使徒劳 → 挫败',
    wordFamily: ['frustrate', 'frustration', 'frustrated', 'frustrating'],
    mnemonic: 'frustr(徒劳)+ate → 让人白费力气 → 使沮丧',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w187', word: 'fulfill', phonetic: '/fʊlˈfɪl/',
    definitions: [
      { pos: 'v.', meaning: '履行；实现；满足' },
    ],
    examples: [
      'She fulfilled her dream of becoming a doctor.',
    ],
    etymology: 'ful(满) + fill(填充) → 填满 → 履行',
    wordFamily: ['fulfill', 'fulfillment'],
    mnemonic: 'ful(满)+fill(填) → 填满了 → 实现',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w188', word: 'fundamental', phonetic: '/ˌfʌndəˈmentl/',
    definitions: [
      { pos: 'adj.', meaning: '基本的；根本的' },
      { pos: 'n.', meaning: '基本原理' },
    ],
    examples: [
      'Education is a fundamental right for every child.',
    ],
    etymology: 'fund(基础) + -ment + -al → 基础的 → 根本的',
    wordFamily: ['fundamental', 'fundamentally', 'fundamentals'],
    mnemonic: 'fund(基础)+mental → 基础性的 → 根本的',
    tags: ['CET4', 'CET6', '考研'],
  },
  {
    id: 'w189', word: 'generate', phonetic: '/ˈdʒenəreɪt/',
    definitions: [
      { pos: 'v.', meaning: '产生；发电；引起' },
    ],
    examples: [
      'The project will generate more employment opportunities.',
    ],
    etymology: 'gener(产生) + -ate → 使产生 → 产生',
    wordFamily: ['generate', 'generation', 'generator'],
    mnemonic: 'gener(产生)+ate → 使产生 → 产生',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w190', word: 'generous', phonetic: '/ˈdʒenərəs/',
    definitions: [
      { pos: 'adj.', meaning: '慷慨的；大方的；丰富的' },
    ],
    examples: [
      'He is very generous with his time.',
    ],
    etymology: 'gener(产生) + -ous → 不断产生的 → 丰富的/慷慨的',
    wordFamily: ['generous', 'generously', 'generosity'],
    mnemonic: 'gener(产生)+ous → 不断产生好意 → 慷慨的',
    tags: ['CET4'],
  },
  {
    id: 'w191', word: 'genuine', phonetic: '/ˈdʒenjuɪn/',
    definitions: [
      { pos: 'adj.', meaning: '真正的；真诚的' },
    ],
    examples: [
      'Is this a genuine diamond?',
    ],
    etymology: 'genu(膝盖) + -ine → 古罗马父亲将新生儿放在膝上承认 → 真正的',
    wordFamily: ['genuine', 'genuinely', 'genuineness'],
    mnemonic: 'genu(天生)+ine → 天生的 → 真正的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w192', word: 'globe', phonetic: '/ɡləʊb/',
    definitions: [
      { pos: 'n.', meaning: '地球；球体；地球仪' },
    ],
    examples: [
      'People from all over the globe attended the conference.',
    ],
    etymology: '拉丁语 globus(球) → 地球',
    wordFamily: ['globe', 'global', 'globally', 'globalization'],
    mnemonic: 'glob(球)+e → 球形 → 地球',
    tags: ['CET4'],
  },
  {
    id: 'w193', word: 'govern', phonetic: '/ˈɡʌvən/',
    definitions: [
      { pos: 'v.', meaning: '统治；管理；支配' },
    ],
    examples: [
      'The country is governed by a president.',
    ],
    etymology: 'gubern(驾驶) → 驾驶国家 → 统治',
    wordFamily: ['govern', 'government', 'governor', 'governance'],
    mnemonic: 'govern(驾驶) → 驾驶方向盘 → 统治',
    tags: ['CET4'],
  },
  {
    id: 'w194', word: 'gradual', phonetic: '/ˈɡrædʒuəl/',
    definitions: [
      { pos: 'adj.', meaning: '逐渐的；逐步的' },
    ],
    examples: [
      'There has been a gradual improvement in the economy.',
    ],
    etymology: 'grad(步) + -ual → 一步一步的 → 逐渐的',
    wordFamily: ['gradual', 'gradually'],
    mnemonic: 'grad(步)+ual → 一步一步 → 逐渐的',
    tags: ['CET4'],
  },
  {
    id: 'w195', word: 'guarantee', phonetic: '/ˌɡærənˈtiː/',
    definitions: [
      { pos: 'v.', meaning: '保证；担保' },
      { pos: 'n.', meaning: '保证；担保；保修单' },
    ],
    examples: [
      'We guarantee delivery within 24 hours.',
    ],
    etymology: '西班牙语 garante(担保人) → 保证',
    wordFamily: ['guarantee', 'guaranteed', 'guarantor'],
    mnemonic: 'guar(守卫)+antee → 守卫到底 → 保证',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w196', word: 'harmony', phonetic: '/ˈhɑːməni/',
    definitions: [
      { pos: 'n.', meaning: '和谐；协调' },
    ],
    examples: [
      'They live together in harmony.',
    ],
    etymology: 'harmo(连接) + -ny → 连接在一起 → 和谐',
    wordFamily: ['harmony', 'harmonious', 'harmonize'],
    mnemonic: 'harm(适合)+ony → 互相适合 → 和谐',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w197', word: 'harvest', phonetic: '/ˈhɑːvɪst/',
    definitions: [
      { pos: 'n.', meaning: '收获；收成' },
      { pos: 'v.', meaning: '收割；收获' },
    ],
    examples: [
      'The farmers are busy with the harvest.',
    ],
    etymology: '古英语 hærfest(秋天) → 收获季节',
    wordFamily: ['harvest', 'harvester', 'harvesting'],
    mnemonic: 'harv(抓)+est → 抓住果实 → 收获',
    tags: ['CET4'],
  },
  {
    id: 'w198', word: 'hesitate', phonetic: '/ˈhezɪteɪt/',
    definitions: [
      { pos: 'v.', meaning: '犹豫；踌躇' },
    ],
    examples: [
      'Don\'t hesitate to ask for help.',
    ],
    etymology: 'hesit(粘) + -ate → 粘住不动 → 犹豫',
    wordFamily: ['hesitate', 'hesitation', 'hesitant'],
    mnemonic: 'hesit(粘)+ate → 粘住走不动 → 犹豫',
    tags: ['CET4'],
  },
  {
    id: 'w199', word: 'highlight', phonetic: '/ˈhaɪlaɪt/',
    definitions: [
      { pos: 'v.', meaning: '强调；突出' },
      { pos: 'n.', meaning: '亮点；精彩部分' },
    ],
    examples: [
      'The report highlights the need for reform.',
    ],
    etymology: 'high(高) + light(光) → 用高光照亮 → 突出',
    wordFamily: ['highlight', 'highlighted', 'highlights'],
    mnemonic: 'high(高)+light(光) → 用高光打亮 → 突出',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w200', word: 'horizon', phonetic: '/həˈraɪzn/',
    definitions: [
      { pos: 'n.', meaning: '地平线；视野；范围' },
    ],
    examples: [
      'Travel broadens your horizons.',
    ],
    etymology: 'horiz(界限) + -on → 看到的界限 → 地平线',
    wordFamily: ['horizon', 'horizontal', 'horizontally'],
    mnemonic: 'hori(边界)+zon → 天边的线 → 地平线',
    tags: ['CET4'],
  },
  {
    id: 'w201', word: 'hostile', phonetic: '/ˈhɒstaɪl/',
    definitions: [
      { pos: 'adj.', meaning: '敌对的；不友好的' },
    ],
    examples: [
      'They received a hostile reception from the crowd.',
    ],
    etymology: 'host(敌人) + -ile → 敌人的 → 敌对的',
    wordFamily: ['hostile', 'hostility', 'hostilely'],
    mnemonic: 'host(敌人)+ile → 像敌人一样 → 敌对的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w202', word: 'humble', phonetic: '/ˈhʌmbl/',
    definitions: [
      { pos: 'adj.', meaning: '谦逊的；卑微的' },
      { pos: 'v.', meaning: '使谦逊' },
    ],
    examples: [
      'He is a humble man despite his great achievements.',
    ],
    etymology: 'hum(地面) + -ble → 贴近地面的 → 谦逊的',
    wordFamily: ['humble', 'humbly', 'humility'],
    mnemonic: 'hum(地面)+ble → 贴近地面 → 谦逊的',
    tags: ['CET4', 'CET6'],
  },
];
