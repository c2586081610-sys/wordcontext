import type { WordEntry } from './index';

// CET4 核心词汇 A-B
export const WORDS_AB: WordEntry[] = [
  {
    id: 'w001', word: 'abandon', phonetic: '/əˈbændən/',
    definitions: [
      { pos: 'v.', meaning: '放弃；抛弃；遗弃' },
      { pos: 'n.', meaning: '放肆；放纵' },
    ],
    examples: [
      'He abandoned his wife and children.',
      'They abandoned the car in the snow.',
    ],
    etymology: 'ab-(离开) + don(给予) → 离开并给予 → 放弃',
    wordFamily: ['abandon', 'abandoned', 'abandoning', 'abandonment'],
    mnemonic: 'a+band(乐队)+on → 乐队解散了 → 放弃',
    tags: ['CET4', '考研'],
  },
  {
    id: 'w002', word: 'abstract', phonetic: '/ˈæbstrækt/',
    definitions: [
      { pos: 'adj.', meaning: '抽象的；理论的' },
      { pos: 'n.', meaning: '摘要；抽象概念' },
      { pos: 'v.', meaning: '提取；摘录' },
    ],
    examples: [
      'Abstract art is not easy to understand.',
      'Please write an abstract of this paper.',
    ],
    etymology: 'abs-(离开) + tract(拉) → 从具体中拉出来 → 抽象',
    wordFamily: ['abstract', 'abstraction', 'abstractly'],
    mnemonic: 'abs(绝对)+tract(拉) → 绝对拉出来 → 抽象的',
    tags: ['CET4', 'CET6', '考研'],
  },
  {
    id: 'w003', word: 'accelerate', phonetic: '/əkˈseləreɪt/',
    definitions: [
      { pos: 'v.', meaning: '加速；促进' },
    ],
    examples: [
      'The car accelerated quickly on the highway.',
    ],
    etymology: 'ac-(向) + celer(快速) + -ate → 使快速 → 加速',
    wordFamily: ['accelerate', 'acceleration', 'accelerator'],
    mnemonic: 'ac+celer(速度)+ate → 加速',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w004', word: 'accompany', phonetic: '/əˈkʌmpəni/',
    definitions: [
      { pos: 'v.', meaning: '陪伴；伴随；伴奏' },
    ],
    examples: [
      'She accompanied her friend to the hospital.',
    ],
    etymology: 'ac-(向) + company(伙伴) → 成为伙伴 → 陪伴',
    wordFamily: ['accompany', 'accompaniment', 'companion'],
    mnemonic: 'ac+company(公司) → 去公司陪着 → 陪伴',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w005', word: 'accumulate', phonetic: '/əˈkjuːmjəleɪt/',
    definitions: [
      { pos: 'v.', meaning: '积累；积聚' },
    ],
    examples: [
      'Dust had accumulated on the shelves.',
    ],
    etymology: 'ac-(向) + cumul(堆) + -ate → 堆起来 → 积累',
    wordFamily: ['accumulate', 'accumulation', 'accumulative'],
    mnemonic: 'ac+cumul(堆积)+ate → 不断堆积 → 积累',
    tags: ['CET4', 'CET6', '考研'],
  },
  {
    id: 'w006', word: 'accurate', phonetic: '/ˈækjərət/',
    definitions: [
      { pos: 'adj.', meaning: '精确的；准确的' },
    ],
    examples: [
      'The report is accurate and well-researched.',
    ],
    etymology: 'ac-(向) + cur(关心) + -ate → 仔细关心 → 精确',
    wordFamily: ['accurate', 'accuracy', 'accurately', 'inaccurate'],
    mnemonic: 'ac+cur(关心)+ate → 仔细关心细节 → 精确的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w007', word: 'achieve', phonetic: '/əˈtʃiːv/',
    definitions: [
      { pos: 'v.', meaning: '实现；取得；达到' },
    ],
    examples: [
      'She achieved her goal of becoming a doctor.',
    ],
    etymology: 'a-(向) + chieve(头) → 到达顶端 → 实现',
    wordFamily: ['achieve', 'achievement', 'achievable'],
    mnemonic: 'a+chieve(谐音"齐福") → 齐心获得福气 → 实现',
    tags: ['CET4'],
  },
  {
    id: 'w008', word: 'acknowledge', phonetic: '/əkˈnɒlɪdʒ/',
    definitions: [
      { pos: 'v.', meaning: '承认；确认；致谢' },
    ],
    examples: [
      'He acknowledged his mistake in public.',
    ],
    etymology: 'ac-(向) + know(知道) + -ledge → 使人知道 → 承认',
    wordFamily: ['acknowledge', 'acknowledgement'],
    mnemonic: 'ac+knowledge(知识) → 有了知识就承认 → 承认',
    tags: ['CET4', 'CET6', '考研'],
  },
  {
    id: 'w009', word: 'acquire', phonetic: '/əˈkwaɪər/',
    definitions: [
      { pos: 'v.', meaning: '获得；习得；收购' },
    ],
    examples: [
      'She acquired a new skill through practice.',
    ],
    etymology: 'ac-(向) + quire(寻求) → 寻求到 → 获得',
    wordFamily: ['acquire', 'acquisition', 'acquisitive'],
    mnemonic: 'ac+quire(寻求) → 不断寻求 → 获得',
    tags: ['CET4', 'CET6', '考研'],
  },
  {
    id: 'w010', word: 'adapt', phonetic: '/əˈdæpt/',
    definitions: [
      { pos: 'v.', meaning: '适应；改编' },
    ],
    examples: [
      'You need to adapt to the new environment.',
    ],
    etymology: 'ad-(向) + apt(适合) → 使适合 → 适应',
    wordFamily: ['adapt', 'adaptation', 'adaptable', 'adapter'],
    mnemonic: 'ad+apt(恰当) → 变得恰当 → 适应',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w011', word: 'adequate', phonetic: '/ˈædɪkwət/',
    definitions: [
      { pos: 'adj.', meaning: '充足的；适当的' },
    ],
    examples: [
      'Make sure you have adequate sleep before the exam.',
    ],
    etymology: 'ad-(向) + equ(平等) + -ate → 达到平等 → 充足',
    wordFamily: ['adequate', 'adequacy', 'adequately', 'inadequate'],
    mnemonic: 'ad+equ(平等)+ate → 达到平等水平 → 充足的',
    tags: ['CET4', 'CET6', '考研'],
  },
  {
    id: 'w012', word: 'adjust', phonetic: '/əˈdʒʌst/',
    definitions: [
      { pos: 'v.', meaning: '调整；适应' },
    ],
    examples: [
      'Please adjust the volume of the speaker.',
    ],
    etymology: 'ad-(向) + just(正确) → 使正确 → 调整',
    wordFamily: ['adjust', 'adjustment', 'adjustable'],
    mnemonic: 'ad+just(正好) → 调到正好 → 调整',
    tags: ['CET4'],
  },
  {
    id: 'w013', word: 'administration', phonetic: '/ədˌmɪnɪˈstreɪʃən/',
    definitions: [
      { pos: 'n.', meaning: '管理；行政；政府' },
    ],
    examples: [
      'The administration announced new policies.',
    ],
    etymology: 'ad-(向) + minister(管理) + -ation → 管理行为',
    wordFamily: ['administer', 'administration', 'administrative', 'administrator'],
    mnemonic: 'ad+minister(部长)+ation → 部长做的事 → 管理',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w014', word: 'adolescent', phonetic: '/ˌædəˈlesənt/',
    definitions: [
      { pos: 'n.', meaning: '青少年' },
      { pos: 'adj.', meaning: '青春期的' },
    ],
    examples: [
      'The movie is about an adolescent growing up.',
    ],
    etymology: 'ad-(向) + olesc(成长) + -ent → 正在成长 → 青少年',
    wordFamily: ['adolescent', 'adolescence'],
    mnemonic: 'ado(阿斗)+lescent → 阿斗还在成长 → 青少年',
    tags: ['CET4', 'CET6', '考研'],
  },
  {
    id: 'w015', word: 'advocate', phonetic: '/ˈædvəkeɪt/',
    definitions: [
      { pos: 'v.', meaning: '提倡；主张' },
      { pos: 'n.', meaning: '倡导者；拥护者' },
    ],
    examples: [
      'She advocates for equal rights.',
    ],
    etymology: 'ad-(向) + voc(声音) + -ate → 为…发声 → 提倡',
    wordFamily: ['advocate', 'advocacy'],
    mnemonic: 'ad+voc(声音)+ate → 为某事发声 → 提倡',
    tags: ['CET4', 'CET6', '考研'],
  },
  {
    id: 'w016', word: 'anticipate', phonetic: '/ænˈtɪsɪpeɪt/',
    definitions: [
      { pos: 'v.', meaning: '预料；期望' },
    ],
    examples: [
      'We anticipate a large crowd at the event.',
    ],
    etymology: 'anti-(前) + cip(拿) + -ate → 提前拿到 → 预料',
    wordFamily: ['anticipate', 'anticipation', 'anticipatory'],
    mnemonic: 'anti(前面)+cip(抓)+ate → 提前抓住 → 预料',
    tags: ['CET4', 'CET6', '考研'],
  },
  {
    id: 'w017', word: 'apparent', phonetic: '/əˈpærənt/',
    definitions: [
      { pos: 'adj.', meaning: '明显的；表面上的' },
    ],
    examples: [
      'It was apparent that he was lying.',
    ],
    etymology: 'ap-(向) + par(出现) + -ent → 出现的 → 明显的',
    wordFamily: ['apparent', 'apparently'],
    mnemonic: 'ap+parent(父母) → 父母面前很明显 → 明显的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w018', word: 'appetite', phonetic: '/ˈæpɪtaɪt/',
    definitions: [
      { pos: 'n.', meaning: '食欲；胃口；欲望' },
    ],
    examples: [
      'The long walk gave me a good appetite.',
    ],
    etymology: 'ap-(向) + pet(寻求) + -ite → 追求 → 欲望',
    wordFamily: ['appetite', 'appetizer'],
    mnemonic: 'ap+pet(宠物)+ite → 宠物想吃 → 食欲',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w019', word: 'approach', phonetic: '/əˈprəʊtʃ/',
    definitions: [
      { pos: 'v.', meaning: '接近；靠近' },
      { pos: 'n.', meaning: '方法；途径' },
    ],
    examples: [
      'We need a new approach to solve this problem.',
    ],
    etymology: 'ap-(向) + proach(近) → 向…靠近 → 接近',
    wordFamily: ['approach', 'approachable'],
    mnemonic: 'ap+proach(近) → 靠近 → 接近',
    tags: ['CET4'],
  },
  {
    id: 'w020', word: 'appropriate', phonetic: '/əˈprəʊpriət/',
    definitions: [
      { pos: 'adj.', meaning: '适当的；合适的' },
      { pos: 'v.', meaning: '拨款；挪用' },
    ],
    examples: [
      'Please wear appropriate clothing for the occasion.',
    ],
    etymology: 'ap-(向) + propri(自己的) + -ate → 变成自己的 → 适当的',
    wordFamily: ['appropriate', 'appropriately', 'inappropriate'],
    mnemonic: 'ap+propri(proper合适的)+ate → 合适的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w021', word: 'approve', phonetic: '/əˈpruːv/',
    definitions: [
      { pos: 'v.', meaning: '批准；赞成' },
    ],
    examples: [
      'The committee approved the new plan.',
    ],
    etymology: 'ap-(向) + prove(证明) → 向…证明 → 赞成',
    wordFamily: ['approve', 'approval', 'approved', 'disapprove'],
    mnemonic: 'ap+prove(证明) → 证明可行 → 批准',
    tags: ['CET4'],
  },
  {
    id: 'w022', word: 'arise', phonetic: '/əˈraɪz/',
    definitions: [
      { pos: 'v.', meaning: '出现；产生；起身' },
    ],
    examples: [
      'New problems arose during the project.',
    ],
    etymology: 'a-(向) + rise(升起) → 升起来 → 出现',
    wordFamily: ['arise', 'arose', 'arisen'],
    mnemonic: 'a+rise(升起) → 问题升起来 → 出现',
    tags: ['CET4'],
  },
  {
    id: 'w023', word: 'arrange', phonetic: '/əˈreɪndʒ/',
    definitions: [
      { pos: 'v.', meaning: '安排；整理；排列' },
    ],
    examples: [
      'I will arrange a meeting for tomorrow.',
    ],
    etymology: 'ar-(向) + range(排列) → 排列好 → 安排',
    wordFamily: ['arrange', 'arrangement', 'rearrange'],
    mnemonic: 'ar+range(范围) → 在范围内排好 → 安排',
    tags: ['CET4'],
  },
  {
    id: 'w024', word: 'artificial', phonetic: '/ˌɑːtɪˈfɪʃəl/',
    definitions: [
      { pos: 'adj.', meaning: '人工的；虚伪的' },
    ],
    examples: [
      'Artificial intelligence is changing our lives.',
    ],
    etymology: 'art(技巧) + fic(做) + -ial → 用技巧做的 → 人工的',
    wordFamily: ['artificial', 'artificially', 'artificiality'],
    mnemonic: 'arti(技巧)+fic(做)+ial → 用技巧做出来的 → 人工的',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w025', word: 'assess', phonetic: '/əˈses/',
    definitions: [
      { pos: 'v.', meaning: '评估；评定' },
    ],
    examples: [
      'We need to assess the impact of the policy.',
    ],
    etymology: 'as-(向) + sess(坐) → 坐在旁边看 → 评估',
    wordFamily: ['assess', 'assessment', 'assessor'],
    mnemonic: 'as+sess(坐) → 坐下来仔细看 → 评估',
    tags: ['CET4', 'CET6', '考研'],
  },
  {
    id: 'w026', word: 'assign', phonetic: '/əˈsaɪn/',
    definitions: [
      { pos: 'v.', meaning: '分配；指派' },
    ],
    examples: [
      'The teacher assigned homework to the students.',
    ],
    etymology: 'as-(向) + sign(标记) → 给…做标记 → 分配',
    wordFamily: ['assign', 'assignment', 'assignable'],
    mnemonic: 'as+sign(签名) → 签名分配 → 指派',
    tags: ['CET4'],
  },
  {
    id: 'w027', word: 'assist', phonetic: '/əˈsɪst/',
    definitions: [
      { pos: 'v.', meaning: '帮助；协助' },
    ],
    examples: [
      'Can I assist you with anything?',
    ],
    etymology: 'as-(向) + sist(站) → 站在旁边 → 协助',
    wordFamily: ['assist', 'assistance', 'assistant'],
    mnemonic: 'as+sist(站) → 站在旁边帮忙 → 协助',
    tags: ['CET4'],
  },
  {
    id: 'w028', word: 'associate', phonetic: '/əˈsəʊʃieɪt/',
    definitions: [
      { pos: 'v.', meaning: '联想；交往；关联' },
      { pos: 'n.', meaning: '同事；伙伴' },
    ],
    examples: [
      'People often associate wealth with happiness.',
    ],
    etymology: 'as-(向) + soci(同伴) + -ate → 成为同伴 → 交往',
    wordFamily: ['associate', 'association', 'associated'],
    mnemonic: 'as+soci(社会)+ate → 融入社会 → 交往',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w029', word: 'assume', phonetic: '/əˈsjuːm/',
    definitions: [
      { pos: 'v.', meaning: '假定；承担；呈现' },
    ],
    examples: [
      'I assume that you have read the report.',
    ],
    etymology: 'as-(向) + sume(拿) → 拿过来 → 承担',
    wordFamily: ['assume', 'assumption', 'assuming'],
    mnemonic: 'as+sume(拿) → 拿过来当真的 → 假定',
    tags: ['CET4', 'CET6', '考研'],
  },
  {
    id: 'w030', word: 'assure', phonetic: '/əˈʃʊər/',
    definitions: [
      { pos: 'v.', meaning: '保证；使确信' },
    ],
    examples: [
      'I assure you that everything is fine.',
    ],
    etymology: 'as-(向) + sure(确定) → 使确定 → 保证',
    wordFamily: ['assure', 'assurance', 'assured'],
    mnemonic: 'as+sure(确定) → 使人确定 → 保证',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w031', word: 'attach', phonetic: '/əˈtætʃ/',
    definitions: [
      { pos: 'v.', meaning: '附上；贴上；依恋' },
    ],
    examples: [
      'Please attach your resume to the email.',
    ],
    etymology: 'at-(向) + tach(钉) → 钉上去 → 附上',
    wordFamily: ['attach', 'attachment', 'attached'],
    mnemonic: 'at+tach(接触) → 接触上去 → 附上',
    tags: ['CET4'],
  },
  {
    id: 'w032', word: 'attain', phonetic: '/əˈteɪn/',
    definitions: [
      { pos: 'v.', meaning: '达到；获得' },
    ],
    examples: [
      'She attained a high level of proficiency in English.',
    ],
    etymology: 'at-(向) + tain(握住) → 握住 → 获得',
    wordFamily: ['attain', 'attainment', 'attainable'],
    mnemonic: 'at+tain(拿住) → 拿住了 → 获得',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w033', word: 'attempt', phonetic: '/əˈtempt/',
    definitions: [
      { pos: 'v.', meaning: '尝试；企图' },
      { pos: 'n.', meaning: '尝试；企图' },
    ],
    examples: [
      'He attempted to climb the mountain alone.',
    ],
    etymology: 'at-(向) + tempt(尝试) → 试图去做 → 尝试',
    wordFamily: ['attempt', 'attempted'],
    mnemonic: 'at+tempt(诱惑) → 被诱惑去试 → 尝试',
    tags: ['CET4'],
  },
  {
    id: 'w034', word: 'attribute', phonetic: '/əˈtrɪbjuːt/',
    definitions: [
      { pos: 'v.', meaning: '归因于' },
      { pos: 'n.', meaning: '属性；特质' },
    ],
    examples: [
      'She attributes her success to hard work.',
    ],
    etymology: 'at-(向) + tribut(给予) → 给予 → 归因于',
    wordFamily: ['attribute', 'attribution', 'attributable'],
    mnemonic: 'at+tribut(给予) → 把原因给予某事 → 归因于',
    tags: ['CET4', 'CET6', '考研'],
  },
  {
    id: 'w035', word: 'authority', phonetic: '/ɔːˈθɒrəti/',
    definitions: [
      { pos: 'n.', meaning: '权威；当局；权力' },
    ],
    examples: [
      'The local authorities decided to close the road.',
    ],
    etymology: 'author(创造者) + -ity → 创造者的力量 → 权威',
    wordFamily: ['authority', 'authorize', 'authoritative'],
    mnemonic: 'author(作者)+ity → 作者有权威 → 权威',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w036', word: 'available', phonetic: '/əˈveɪləbl/',
    definitions: [
      { pos: 'adj.', meaning: '可用的；有空的' },
    ],
    examples: [
      'Is this room available for a meeting?',
    ],
    etymology: 'avail(有用) + -able → 可用的',
    wordFamily: ['avail', 'available', 'availability', 'unavailable'],
    mnemonic: 'avail(有用)+able → 能用得上的 → 可用的',
    tags: ['CET4'],
  },
  {
    id: 'w037', word: 'aware', phonetic: '/əˈweər/',
    definitions: [
      { pos: 'adj.', meaning: '意识到的；知道的' },
    ],
    examples: [
      'Are you aware of the risks involved?',
    ],
    etymology: 'a-(向) + ware(小心) → 小心注意 → 意识到',
    wordFamily: ['aware', 'awareness', 'unaware'],
    mnemonic: 'a+ware(小心) → 小心注意到 → 意识到的',
    tags: ['CET4'],
  },
  {
    id: 'w038', word: 'awkward', phonetic: '/ˈɔːkwəd/',
    definitions: [
      { pos: 'adj.', meaning: '尴尬的；笨拙的' },
    ],
    examples: [
      'There was an awkward silence in the room.',
    ],
    etymology: 'awk(奇怪的) + -ward → 奇怪的方向 → 尴尬的',
    wordFamily: ['awkward', 'awkwardly', 'awkwardness'],
    mnemonic: 'awk(怪)+ward(方向) → 怪怪的 → 尴尬的',
    tags: ['CET4'],
  },
  {
    id: 'w039', word: 'barrier', phonetic: '/ˈbæriər/',
    definitions: [
      { pos: 'n.', meaning: '障碍；屏障；关卡' },
    ],
    examples: [
      'Language can be a barrier to communication.',
    ],
    etymology: 'barr(棒) + -ier → 用棒拦住 → 障碍',
    wordFamily: ['barrier', 'barriers'],
    mnemonic: 'barr(拦)+ier → 拦路的东西 → 障碍',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w040', word: 'benefit', phonetic: '/ˈbenɪfɪt/',
    definitions: [
      { pos: 'n.', meaning: '利益；好处；津贴' },
      { pos: 'v.', meaning: '受益；有利于' },
    ],
    examples: [
      'Regular exercise has many health benefits.',
    ],
    etymology: 'bene(好) + fic(做) → 做好事 → 利益',
    wordFamily: ['benefit', 'beneficial', 'beneficiary'],
    mnemonic: 'bene(好)+fit(适合) → 好而适合 → 利益',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w041', word: 'betray', phonetic: '/bɪˈtreɪ/',
    definitions: [
      { pos: 'v.', meaning: '背叛；泄露；暴露' },
    ],
    examples: [
      'He betrayed his country for money.',
    ],
    etymology: 'be-(使) + tray(交付) → 交付出去 → 背叛',
    wordFamily: ['betray', 'betrayal', 'betrayer'],
    mnemonic: 'be+tray(托盘) → 把秘密放在托盘上端出去 → 泄露',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w042', word: 'blame', phonetic: '/bleɪm/',
    definitions: [
      { pos: 'v.', meaning: '责备；归咎于' },
      { pos: 'n.', meaning: '责任；过失' },
    ],
    examples: [
      'Don\'t blame yourself for the mistake.',
    ],
    etymology: '古法语 blasmer → 责备',
    wordFamily: ['blame', 'blameless', 'blameworthy'],
    mnemonic: 'b+la(拉)+me → 拉我出来背锅 → 责备',
    tags: ['CET4'],
  },
  {
    id: 'w043', word: 'boost', phonetic: '/buːst/',
    definitions: [
      { pos: 'v.', meaning: '促进；增强；推动' },
      { pos: 'n.', meaning: '推动；提升' },
    ],
    examples: [
      'The new policy boosted the economy.',
    ],
    etymology: '拟声词，模仿推举的声音',
    wordFamily: ['boost', 'booster'],
    mnemonic: 'boo(嘘声)+st → 嘘声推一把 → 推动',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w044', word: 'boundary', phonetic: '/ˈbaʊndəri/',
    definitions: [
      { pos: 'n.', meaning: '边界；界限' },
    ],
    examples: [
      'The river forms the boundary between the two countries.',
    ],
    etymology: 'bound(绑定) + -ary → 绑定的范围 → 边界',
    wordFamily: ['boundary', 'boundaries'],
    mnemonic: 'bound(范围)+ary → 范围的线 → 边界',
    tags: ['CET4', 'CET6'],
  },
  {
    id: 'w045', word: 'burden', phonetic: '/ˈbɜːdən/',
    definitions: [
      { pos: 'n.', meaning: '负担；重担' },
      { pos: 'v.', meaning: '使负担' },
    ],
    examples: [
      'The cost of education is a heavy burden for many families.',
    ],
    etymology: '古英语 byrthen → 承载之物',
    wordFamily: ['burden', 'burdensome'],
    mnemonic: 'bur(埋)+den → 埋在心里很重 → 负担',
    tags: ['CET4', 'CET6'],
  },
];
