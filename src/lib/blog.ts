export type BlogCategoryId = "eco" | "map" | "shop" | "field";

export type BlogCopy = { zh: string; en: string };

export type BlogCategory = {
  id: BlogCategoryId;
  title: BlogCopy;
  dek: BlogCopy;
};

export type BlogPost = {
  slug: string;
  category: BlogCategoryId;
  date: string;
  title: BlogCopy;
  dek: BlogCopy;
  sources: BlogCopy;
  body: { zh: string[]; en: string[] };
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: "eco",
    title: { zh: "生态译学", en: "Eco-translatology" },
    dek: {
      zh: "文本生命、译者生存、翻译生态。适应是选择，不是迎合。",
      en: "Textual life, translator survival, translation ecology. Adaptation is a choice, not a bow.",
    },
  },
  {
    id: "map",
    title: { zh: "译学路径", en: "Studies map" },
    dek: {
      zh: "对等、语域、文化转向。先看文本落在哪条路上。",
      en: "Equivalence, register, the cultural turn. Name the path before the sentence.",
    },
  },
  {
    id: "shop",
    title: { zh: "工坊工序", en: "Shop craft" },
    dek: {
      zh: "护照、术语、语体、风险、签发。五个智能体各管一段。",
      en: "Passport, terms, style, risk, sign-off. Five agents, one desk.",
    },
  },
  {
    id: "field",
    title: { zh: "领域实践", en: "Field practice" },
    dek: {
      zh: "时政、法律、学科、非文学。先核验，再行文。",
      en: "Current affairs, law, primers, non-literary prose. Verify, then write.",
    },
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "from-center-to-duty",
    category: "eco",
    date: "2026-10-05",
    title: {
      zh: "从译者中心到译者责任",
      en: "From translator-centred to translator-responsible",
    },
    dek: {
      zh: "过程可以由译者主导，交稿却必须由人认领。合译把签发放在最后，不是装饰。",
      en: "The translator may lead the process. Someone still has to own the text. Sign-off is the point.",
    },
    sources: {
      zh: "胡庚申《从“译者主体”到“译者中心”》《从“译者中心”到“译者责任”》；傅敬民《行动·系统·功能》",
      en: "Hu Gengshen on translator-centredness and duty; Fu Jingmin on action, system, and function.",
    },
    body: {
      zh: [
        "翻译研究发现译者，是近几十年的大事。文化转向之后，译者不再被写成隐形的管道。胡庚申把这一发现推进一步：在翻译过程里，译者处在中心，因为只有人能协调原文、译文和翻译生态环境，并在适应与选择之间做决定。",
        "中心不是特权。同一条线索的下一句是责任。译者要对文本负责，也要对将接收这篇译文的生态负责：学科共同体、官方话语、法律效力、读者可能据此采取的行动。合译不让模型代替这一步。五个智能体可以起草、锁术语、标风险，最后一笔仍是人的签发。",
        "这与工坊的顺序一致。规划先写护照，等于承认环境先于句子。术语只锁已审核条目，等于拒绝用流利换口径。风险扫描六类，等于把批评从印象改成证据。签发不是按钮，是译者把自己的名字放回译文。",
        "AI 让中心更容易被误会成“谁写得快谁说了算”。恰恰相反：机器越顺，人越要站在责任这一端。合译把译者中心留给过程，把译者责任留给交付。",
      ],
      en: [
        "Translation studies found the translator. After the cultural turn, the translator was no longer written as an invisible pipe. Hu Gengshen takes that discovery one step further: in the process, the translator is central, because only a person can coordinate source, target, and the translation ecology, and choose.",
        "Centrality is not privilege. The next sentence is duty. The translator answers to the text and to the ecology that will receive it: a discipline, an official discourse, a legal effect, an action a reader might take. Cowork Translation does not let a model take that step. Five agents may draft, lock terms, and mark risk. The last mark is still a human sign-off.",
        "That is why the shop is ordered as it is. The passport admits that environment comes before the sentence. The glossary admits only approved names. The six-class scan turns criticism into evidence. Sign-off is not a button. It puts a name back on the text.",
        "AI makes it easy to confuse speed with authority. The smoother the machine, the more a person must stand at the responsible end. The shop keeps the translator at the centre of the process, and keeps duty at delivery.",
      ],
    },
  },
  {
    slug: "three-lives",
    category: "eco",
    date: "2026-10-05",
    title: {
      zh: "文本生命、译者生存、翻译生态",
      en: "Textual life, translator survival, translation ecology",
    },
    dek: {
      zh: "生态翻译学不是一句绿色比喻。它给工坊三件必须同时成立的事。",
      en: "Eco-translatology is not a green metaphor. It gives the shop three things that must hold at once.",
    },
    sources: {
      zh: "胡庚申、王园《生态翻译学研究范式》；《生态翻译学理论系统建模与具象呈现》；《文本移植的生命存续》；《生态翻译学解读》",
      en: "Hu and Wang on the eco-paradigm; Hu on modelling, textual transplant, and eco-translatology as an approach.",
    },
    body: {
      zh: [
        "生态翻译学把翻译写成三个核心理念：翻译即文本移植，翻译即适应选择，翻译即生态平衡。对应到研究主题，就是文本生命、译者生存、翻译生态。少写任何一项，翻译都会偏成别的东西：只顾文本，会变成不顾读者的硬译；只顾译者，会变成不顾原文的改写；只顾环境，会变成迎合。",
        "“生生之谓译”说的是移植之后文本还要活。活不是更顺。源文若短促、重复、犹豫，译文把它抹平，生命就断了。语体智能体因此被限制：可以改节奏与称谓，不能改事实，也不能把一篇公报养成通稿。",
        "适应选择不是随手换词。语言维、文化维、交际维要分开看。规划护照的用处，就是先写清这一篇最险的是哪一维。经济学导论里，概念名属于语言维的死线；时政里，机关名属于文化维与交际维的死线。",
        "合译用五个智能体把这三生拆开做，再在签发处收拢。规划看生态，术语与翻译看移植是否走样，语体看生命还在不在，风险看平衡有没有被假流畅破坏。",
      ],
      en: [
        "Eco-translatology writes translation as three ideas at once: textual transplant, adaptation and selection, and eco-balance. The matching themes are textual life, translator survival, and translation ecology. Drop one, and the work becomes something else: hard translation without a reader, rewriting without a source, or mere accommodation.",
        "“Sheng sheng” means the text must go on living after the transplant. Living is not smoother. If the source is short, repetitive, or hesitant, and the target irons that out, the life breaks. That is why Style may touch rhythm and address, but not facts, and may not raise a communique into house style.",
        "Adaptation is not casual substitution. Language, culture, and communication have to be seen apart. The passport exists to name the most dangerous dimension before anyone drafts. In an economics primer, concept names are a language-dimension red line. In current affairs, institution names are a cultural and communicative red line.",
        "The five agents split the three lives, then gather them at sign-off. Planner watches the ecology. Terminology and Translator watch the transplant. Style asks whether the text is still alive. Risk asks whether balance was broken by false fluency.",
      ],
    },
  },
  {
    slug: "passport",
    category: "map",
    date: "2026-10-05",
    title: {
      zh: "翻译护照：对等有边界，环境要先写下来",
      en: "The translation passport: equivalence has a border",
    },
    dek: {
      zh: "奈达的动态对等常被误读成可以改事实。芒迪的导论提醒我们：先看文本落在哪条路径。",
      en: "Nida’s dynamic equivalence is often misread as a licence to change facts. Munday’s map says: name the path first.",
    },
    sources: {
      zh: "《新编奈达论翻译》；Jeremy Munday Introducing Translation Studies 及其中译本；The Translation Studies Reader；Bassnett, Translation, History and Culture",
      en: "Nida on translation; Munday’s Introducing Translation Studies; The Translation Studies Reader; Bassnett, Translation, History and Culture.",
    },
    body: {
      zh: [
        "芒迪的好处，是把译学写成可以走路的地图：对等与功能、语域与语篇、文化与改写、译者显身、新技术。合译默认走受控对等。时政、法律、非文学信息文本，先保证读者能核验，再谈显身。",
        "奈达区分形式对等与动态对等，是为了让译文在目标语里产生相近的反应。它从来不是授权改数字、改机关、改否定。动态对等的边界，就是护照里的事实锚点。锚点之外，句法可以适应；锚点之上，形式必须保全。",
        "巴斯奈特把翻译放进历史与文化，提醒我们环境会改写文本。合译承认这一点，但把改写权收回译者签发之前：规划可以写“读者是外交同行”，语体可以按此收紧情态，翻译不得把“所谓”删掉，也不得给一个没有术语命中的机构发明英文名。",
        "所以护照要先写，而且要写得像一份工作文件：语域、读者、锚点、策略、应核验的来源。策略只写到方法一层。词类转换是技巧，不能冒充总方针。",
      ],
      en: [
        "Munday’s gift is a map you can walk: equivalence and function, register and discourse, culture and rewriting, the visible translator, new technologies. Cowork Translation defaults to constrained equivalence. For current affairs, law, and non-literary information, verification comes before visibility.",
        "Nida’s formal and dynamic equivalence exist so a text can live in another language with a comparable effect. They never licensed a change of number, institution, or negation. The border of dynamic equivalence is the passport’s fact anchors. Beyond them, syntax may adapt. On them, form must hold.",
        "Bassnett puts translation inside history and culture, and reminds us that environments rewrite texts. The shop admits that, then takes rewriting back from the machine: Planner may name a diplomatic reader, Style may tighten modality, Translator may not drop a hedge or invent an official English name.",
        "So the passport comes first, and it has to read like a working paper: register, audience, anchors, strategy, sources to check. Strategy stops at method. A word-class shift is a technique. It is not a policy.",
      ],
    },
  },
  {
    slug: "strategy-method-technique",
    category: "map",
    date: "2026-10-05",
    title: {
      zh: "策略、方法、技巧不要混在一张护照里",
      en: "Do not mix strategy, method, and technique",
    },
    dek: {
      zh: "概念一混，规划会把词序写成路线，风险会把技巧写成事故。",
      en: "Once the terms blur, Planner writes word order as a route, and Risk writes a technique as an accident.",
    },
    sources: {
      zh: "熊兵《翻译研究中的概念混淆》；罗迪江《翻译研究中的问题域转换》",
      en: "Xiong Bing on confused concepts; Luo Dijiang on shifts of problem field.",
    },
    body: {
      zh: [
        "熊兵指出，译学里长期把翻译策略、翻译方法、翻译技巧混用。策略是宏观取向，例如偏异化还是偏归化。方法是实现策略的路径，例如直译、意译。技巧是局部操作，例如词类转换、增词、视角转换。",
        "混用的代价很具体。护照若写“策略：词类转换”，等于没有策略。风险若把一次合理的断句标成“意义偏移”，会逼译者把英语重新写成汉语的流水句。问题域一旦转错，译者会站到文本外面，专门和句子过不去。",
        "合译的约定是：规划只准写策略与方法，并点出高风险位置；翻译在锁定术语之后使用技巧；风险先问策略有没有被违背，再问局部是否失真。一篇译文可以有很多技巧，却只有一个被护照承认的取向。",
        "这也是为什么术语智能体不发明译名。发明译名看起来像技巧，其实已经改了策略：从“保全官方名称”滑到了“解释给读者听”。解释可以放进注释或待核验标记，不能偷偷变成正文里的新机关。",
      ],
      en: [
        "Xiong Bing notes a long confusion among strategy, method, and technique. Strategy is the orientation: more foreignizing, more domesticating. Method is the path: literal, sense-for-sense. Technique is local: a word-class shift, an addition, a change of perspective.",
        "The cost is concrete. If a passport writes “strategy: word-class shift”, there is no strategy. If Risk marks a fair English break as drift, it forces the translator back into a Chinese run-on. If the problem field is wrong, the translator stands outside the text and wrestles sentences.",
        "The shop’s rule: Planner writes strategy and method, and names the danger spots. Translator uses technique only after terms lock. Risk asks whether the strategy was broken, then whether a local move failed. A draft may use many techniques. It may have only one orientation the passport accepts.",
        "That is also why Terminology does not invent names. An invented official name looks like technique and is actually a change of strategy: from preserving the name to explaining it. Explanation belongs in a note or a [VERIFY] mark, not in a new institution inside the sentence.",
      ],
    },
  },
  {
    slug: "nonliterary-verify",
    category: "field",
    date: "2026-10-05",
    title: {
      zh: "非文学翻译：先核验，再行文",
      en: "Non-literary work: verify, then write",
    },
    dek: {
      zh: "李长栓把非文学写成可问责的信息转移。《译海一粟》补充手艺：先保住关系，再断句。",
      en: "Li Changshuan treats non-literary translation as accountable transfer. The nine-hundred examples add craft: keep the relation, then break the sentence.",
    },
    sources: {
      zh: "李长栓《非文学翻译理论与实践》；《译海一粟：汉英翻译九百例》；鲍雪敏经济学导论汉英实践报告；景风华《法史万象》",
      en: "Li Changshuan on non-literary practice; Yi Hai Yi Su; Bao’s economics report; Jing Fenghua on traditional legal culture.",
    },
    body: {
      zh: [
        "非文学翻译的第一句话不是“译得像不像英语”，而是“读者能不能拿着译文去核对原文”。合同、公报、导论、法史叙述，都是信息与责任的转移。漂亮而无法核验，是失败。",
        "李长栓一路强调查证。合译把它落成工序：术语表先锁已审核名称；没有命中就标待核验；规划把数字、否定、引语写成锚点。翻译智能体被禁止为了通顺补上源文没有的因果。",
        "《译海一粟》里常见的汉英难题是流水句。手艺是先找出逻辑主语和关系，再决定在哪里断。断句是技巧，添加“therefore”是增译。四字格能直译且不误导就直译，不能就用中性说明，不要另找一个英语典故来顶替。",
        "学科导论与法史还多一层。经济学概念首次出现后不得换一套近义；古代制度词语不能翻译成 common law 的现成对应物。一名一事，全文只许一种写法。",
      ],
      en: [
        "The first question in non-literary work is not whether it sounds like English. It is whether a reader can take the target back to the source. Contracts, communiques, primers, and legal-historical prose transfer information and duty. Beautiful and unverifiable is a failure.",
        "Li Changshuan keeps returning to checking. The shop turns that into a procedure: lock approved names, mark misses for verification, write numbers, negation, and quotations into the passport. Translator may not add a cause the source never stated.",
        "The usual Chinese–English problem in the nine-hundred examples is the run-on. The craft is to find the logical subject and the relation, then decide where to break. Breaking is technique. Adding “therefore” is addition. A four-character phrase that can be rendered straight without misleading should be. Otherwise use a neutral gloss. Do not swap in another culture’s allusion.",
        "Primers and legal history add a further rule. An economics term, once set, may not be stylishly varied. An ancient institution may not be recast as a ready common-law counterpart. One name, one thing, one rendering.",
      ],
    },
  },
  {
    slug: "ai-ecology",
    category: "eco",
    date: "2026-10-05",
    title: {
      zh: "AI 语境下，谁适应谁",
      en: "In an AI ecology, who adapts to whom",
    },
    dek: {
      zh: "基础服务可以机器化，高端服务必须人文化。合译站在后一条轨道。",
      en: "Basic service can be machined. High-end service stays human. The shop stands on the second track.",
    },
    sources: {
      zh: "胡庚申、王园《从生态翻译学视角看AI语境下我国翻译生态的重构与适应》；何刚强生态翻译学十大趋势；Cay Dollerup 论生态译学语境",
      en: "Hu and Wang on AI and China’s translation ecology; He Gangqiang’s ten trends; Dollerup on eco-translatology in context.",
    },
    body: {
      zh: [
        "胡庚申、王园把 AI 之后的翻译生态写成一次重构：人机协助加深，垂直领域更分，技术与人文化必须再平衡。他们提出的适应方案很硬：基础服务 AI 化，高端服务人文化。",
        "合译不和第一轨道抢速度。它做的是第二轨道：护照、术语、风险、签发。机器已经会写很顺的句子，工坊要做的是不让顺滑变成文本生产失控，也不让译者群落只剩下点按钮的人。",
        "适应不是译者去迎合模型的平均文体。生态翻译学里的适应，是选择让文本在目标生态里活下来。模型给出的往往是最大概率的通稿。通稿对公报、法条、学科定义常常是错的生态。",
        "因此免费体验一次五个智能体之后，仍然要人来看风险、改术语、签字。密钥可以换成你自己的模型，责任不能换成模型。谁适应谁，答案在签发栏，不在生成速度。",
      ],
      en: [
        "Hu and Wang write the post-AI ecology as a reconstruction: deeper human–machine work, more vertical specialism, and a new balance between technique and the human. Their adaptation is blunt: machine the basic track; keep the high track human.",
        "Cowork Translation does not race the first track. It works the second: passport, glossary, risk, sign-off. Machines already write smooth sentences. The shop exists so smoothness does not become uncontrolled production, and so the translator community is not reduced to people who press a button.",
        "Adaptation is not the translator bowing to a model’s average style. In eco-translatology, adaptation is the selection that lets a text live in its target ecology. A model often offers the most probable house style. House style is often the wrong ecology for a communique, a statute, or a definition.",
        "That is why, after one free five-agent run, a person still reads the risks, edits the terms, and signs. You may change the key. You may not change the duty. Who adapts to whom is answered in the sign-off box, not in the generation speed.",
      ],
    },
  },
  {
    slug: "lock-the-name",
    category: "shop",
    date: "2026-10-05",
    title: {
      zh: "先锁名字，再作文",
      en: "Lock the name, then write the sentence",
    },
    dek: {
      zh: "缩略词和国际组织名已经进入术语表。WTO 不是 WHO。这不是小事。",
      en: "Abbreviations and organization names are now in the glossary. WTO is not WHO. That is not a small thing.",
    },
    sources: {
      zh: "《常用英文缩略词》；《国际组织和机构名称》；杜争鸣《时政用语中译英释例》；胡庚申《从术语看译论》",
      en: "The abbreviation lists; Du Zhengming’s current-affairs examples; Hu Gengshen on terms and theory.",
    },
    body: {
      zh: [
        "时政和机构翻译里，名字先于句子。欧盟、世卫、世贸、上合、东盟，各有已经审核的写法。把世界贸易组织写成 World Health Organization，不是语体问题，是术语事故。",
        "原表里就有混用的痕迹：同一缩写 WTO 被派给贸易、旅游、卫生。合译入库时拆开了：WTO 只锁世贸，WHO 只锁世卫，旅游组织走向 UNWTO。亚洲开发银行与非洲开发银行都曾被写成 ADB，术语表用注释把它们分开。",
        "常见缩略词同样处理。GDP、CEO、FOB、L/C 进入术语表后，翻译不得改成更“解释性”的说法，除非源文本身在解释。聊天缩写和单字母宗教、军种代码没有入库，以免误锁。",
        "术语智能体不生产新词，只执行最长匹配。规划可以把未命中的机构标成高风险，翻译必须写 [VERIFY]。人审核之后，它才成为术语表里的下一条。这就是“从术语看译论”在工坊里的用法：术语是选择的结果，不是联想的开始。",
      ],
      en: [
        "In current affairs and institutional prose, the name comes before the sentence. EU, WHO, WTO, SCO, ASEAN already have approved renderings. Writing World Health Organization for the trade body is not a style fault. It is a terminology accident.",
        "The source lists already blurred a few letters: WTO was asked to cover trade, tourism, and health. The shop split them. WTO locks the trade body, WHO locks health, tourism goes to UNWTO. Asian and African development banks both appeared as ADB; the notes keep them apart.",
        "Everyday abbreviations are treated the same. Once GDP, CEO, FOB, and L/C are in the glossary, Translator may not replace them with a more explanatory phrase unless the source itself explains. Chat slang and single-letter religious or service codes were not imported, so they cannot false-lock.",
        "Terminology does not invent. It runs longest match. Planner may mark a miss as high risk. Translator must write [VERIFY]. Only after a person approves it does it become the next glossary line. That is how “seeing theory through terms” works here: a term is the result of a choice, not the start of a guess.",
      ],
    },
  },
  {
    slug: "adapt-select",
    category: "eco",
    date: "2026-10-05",
    title: {
      zh: "适应选择：三维转换，不是随便改",
      en: "Adaptation and selection: three dimensions, not casual change",
    },
    dek: {
      zh: "语言维、文化维、交际维要分开看。护照先写清哪一维最险。",
      en: "Language, culture, and communication come apart. The passport names the danger first.",
    },
    sources: {
      zh: "胡庚申适应选择论；鲍雪敏《经济学学科导论》汉英实践报告；《生态翻译学理论系统建模与具象呈现》",
      en: "Hu Gengshen on adaptation and selection; Bao Xuemin’s economics report; Hu on modelling eco-translatology.",
    },
    body: {
      zh: [
        "适应选择常被缩成一句“译得更像目标语”。胡庚申的用法更硬：译者先适应翻译生态环境，再做有维度的选择。语言维管句法与术语形态，文化维管制度与习语能否存活，交际维管读者要完成什么行为。",
        "三维不能互相顶替。把机关名意译成解释，看起来像文化维的适应，其实是交际维的越权：读者得到了说明，失去了可核验的专名。经济学导论里换一套更漂亮的近义概念，是语言维失守。",
        "规划护照的工作，就是在动笔前写出这一篇最险的维度。时政常常是文化维与交际维；学科导论常常是语言维；讲演稿才更多碰到交际维的语气。",
        "合译把选择留给人。智能体可以提出适应方案，不能把通顺当成已经完成的选择。没有写明维度的“意译”，在工坊里不算策略。",
      ],
      en: [
        "Adaptation and selection is often flattened into “make it sound more like the target language”. Hu Gengshen’s use is harder: the translator first adapts to the translation ecology, then selects along dimensions. Language covers syntax and term form. Culture covers whether an institution or idiom can live. Communication covers what the reader must be able to do.",
        "The three cannot stand in for one another. Explaining an institution away looks like cultural adaptation and is a communicative overreach: the reader gets a gloss and loses a checkable name. Swapping a prettier near-synonym in an economics primer is a language-dimension failure.",
        "The passport’s job is to name the most dangerous dimension before anyone drafts. Current affairs often sit in culture and communication. A primer often sits in language. A speech more often sits in tone.",
        "The shop leaves selection to a person. Agents may propose an adaptation. They may not treat smoothness as a finished choice. A “sense-for-sense” line with no dimension named is not a strategy here.",
      ],
    },
  },
  {
    slug: "translator-in-ecology",
    category: "eco",
    date: "2026-10-05",
    title: {
      zh: "译者不在文本外面",
      en: "The translator is not outside the text",
    },
    dek: {
      zh: "问题域一转，译者就从生态里的选择者，变成句子的局外加工者。",
      en: "Shift the problem field, and the translator leaves the ecology to wrestle sentences.",
    },
    sources: {
      zh: "罗迪江《翻译研究中的问题域转换》《译者研究的问题转换与生态定位》；傅敬民《行动·系统·功能》",
      en: "Luo Dijiang on problem-field shifts and the translator’s ecological place; Fu Jingmin on action, system, and function.",
    },
    body: {
      zh: [
        "罗迪江谈问题域转换，是怕译者研究停在“人如何处理句子”。生态定位把译者放回翻译生态：文本、读者、制度、行业，都在同一张关系网里。译者是选择者，不是局外的加工站。",
        "问题域转错，工坊也会错。只盯词序，风险会把合理断句写成事故。只盯通顺，规划会把环境写成“读着舒服就行”。傅敬民说的行动、系统、功能，提醒我们译文要在一个系统里起作用，而不只是完成一次生成。",
        "合译的五个智能体因此不是五支笔，是五次站位：规划看生态，术语看名称在共同体里能否成立，翻译看移植，语体看生命，风险看功能有没有被假流畅破坏。",
        "签发把译者重新放进生态。点了签发，就不是“模型写过”的文本，而是进入某一话语场的文本。人站在场内，才谈得上适应。",
      ],
      en: [
        "Luo Dijiang’s shift of problem field is a warning: translator studies must not stop at “how a person handles a sentence”. An ecological place puts the translator back among text, reader, institution, and trade. The translator selects. The translator is not an outside processing station.",
        "A wrong field makes a wrong shop. Watch only word order, and Risk will mark a fair break as an accident. Watch only smoothness, and Planner will write the environment as “as long as it reads well”. Fu Jingmin’s action, system, and function remind us that a target text must work inside a system, not merely finish a generation.",
        "The five agents are not five pens. They are five standpoints: Planner sees the ecology, Terminology asks whether a name can stand in a community, Translator watches the transplant, Style watches life, Risk watches whether function was broken by false fluency.",
        "Sign-off puts the translator back in the ecology. Once signed, the text is no longer “something a model wrote”. It enters a discourse. Adaptation only makes sense from inside that field.",
      ],
    },
  },
  {
    slug: "nida-border",
    category: "map",
    date: "2026-10-05",
    title: {
      zh: "动态对等停在事实面前",
      en: "Dynamic equivalence stops at the facts",
    },
    dek: {
      zh: "相近的读者反应，不能用改数字、改机关、改否定去换。",
      en: "A comparable effect is not bought by changing a number, an institution, or a negation.",
    },
    sources: {
      zh: "《新编奈达论翻译》；Munday 对奈达的梳理；The Translation Studies Reader 中的对等传统",
      en: "Nida on translation; Munday’s account of Nida; the equivalence tradition in The Translation Studies Reader.",
    },
    body: {
      zh: [
        "奈达把形式对等和动态对等分开，是为了让译文在另一种语言里产生相近的反应。圣经翻译的经验常被误读成：意思到了，形式可以让路。非文学里，这句话会变成事故。",
        "形式保全的是锚点。日期、数量、专名、职务、引语、否定、逻辑连接，属于必须带走的形式。动态对等管的是锚点之外：句长、词序、是否拆开汉语流水句。",
        "合译把这条边界写进护照。规划列出锚点，翻译不得为了“更像英语”把“尚未”译成肯定，也不得把“三个机构”写成“有关方面”。没有术语命中的官方名称，标待核验，不另起一个听起来更自然的名字。",
        "对等传统从奈达走到后来的功能与目的，始终有一条没变：反应可以调整，事实不能替换。工坊站在这条没变的线上。",
      ],
      en: [
        "Nida split formal and dynamic equivalence so a text could live in another language with a comparable effect. Bible-translation lore is often misread as: once the sense arrives, form may give way. In non-literary work, that sentence becomes an accident.",
        "Form holds the anchors. Dates, quantities, names, titles, quotations, negation, and logical links must travel. Dynamic equivalence works beyond them: sentence length, order, whether a Chinese run-on may break.",
        "The shop writes that border into the passport. Planner lists the anchors. Translator may not turn “not yet” into a positive to sound more English, and may not turn “three institutions” into “the parties concerned”. An official name with no glossary hit is marked for verification, not replaced with a more natural invention.",
        "From Nida through later functional and skopos talk, one line does not move: effect may be adjusted, facts may not be swapped. The shop stands on that unmoved line.",
      ],
    },
  },
  {
    slug: "culture-turn",
    category: "map",
    date: "2026-10-05",
    title: {
      zh: "文化转向之后，改写权仍在签发前",
      en: "After the cultural turn, rewriting still waits for sign-off",
    },
    dek: {
      zh: "巴斯奈特提醒环境会改写文本。合译承认这一点，但不把改写交给模型。",
      en: "Bassnett reminds us that environments rewrite texts. The shop admits that, and still keeps rewriting from the model.",
    },
    sources: {
      zh: "Bassnett, Translation, History and Culture；方华文《20世纪中国翻译史》；The Translation Studies Reader",
      en: "Bassnett, Translation, History and Culture; Fang Huawen on twentieth-century Chinese translation history; The Translation Studies Reader.",
    },
    body: {
      zh: [
        "文化转向之后，翻译不再被看成两种语言之间的纯转换。巴斯奈特把翻译放进历史与文化：谁在译、为谁译、在什么样的权力关系里译，都会改写文本。二十世纪中国翻译史把这条写得很具体：同一部书，不同年代会换一套关键词。",
        "承认改写，不等于授权模型改写。环境可以进入护照：读者是外交同行，还是学科入门者；文本是公报，还是讲义。语体可以按此收紧或放松情态。翻译却不能把“所谓”删掉，也不能把一个历史机构译成今天的对应部委。",
        "方华文梳理的译名之争，说明名称本身就是历史。合译把已审核名称锁进术语表，就是把某一时刻的选择固定下来，供人检查，而不是让每次生成重新发明历史。",
        "所以文化转向在工坊里的用法很窄、也很硬：规划写环境，人来决定改写到哪一步。模型只在锁定之后活动。",
      ],
      en: [
        "After the cultural turn, translation is no longer a pure transfer between languages. Bassnett puts it inside history and culture: who translates, for whom, and under what power, will rewrite the text. Twentieth-century Chinese translation history makes that concrete: the same book changes its keywords by decade.",
        "To admit rewriting is not to licence a model to rewrite. Environment may enter the passport: a diplomatic peer or a first-year student; a communique or a primer. Style may tighten or loosen modality. Translator may not drop a hedge, and may not recast a historical office as today’s ministry.",
        "The name debates Fang Huawen records show that a rendering is already history. Locking approved names in the glossary fixes a choice at a moment, so it can be checked, instead of letting each generation invent the history again.",
        "So the cultural turn is used narrowly and firmly here: Planner writes the environment, a person decides how far rewriting may go. The model moves only after the lock.",
      ],
    },
  },
  {
    slug: "register-three",
    category: "map",
    date: "2026-10-05",
    title: {
      zh: "语域三变量：语场、语旨、语式",
      en: "Three variables of register: field, tenor, mode",
    },
    dek: {
      zh: "在谈什么、对谁说话、用什么通道。语体只能让这三项更贴护照。",
      en: "What is at stake, who is spoken to, through what channel. Style may only bring these closer to the passport.",
    },
    sources: {
      zh: "Munday 对 Hallidayan register 的转述；李平、何三宁《翻译批评与鉴赏》",
      en: "Munday’s account of Hallidayan register; Li Ping and He Sanning on translation criticism.",
    },
    body: {
      zh: [
        "语域不是“正式一点或口语一点”的滑杆。韩礼德路径把它拆成语场、语旨、语式。语场是在谈什么：公报、合同、讲义。语旨是对谁说话：公众、同行、当事人。语式是通道：书面、口述痕迹、屏幕短句。",
        "护照先写这三项，语体才有工作范围。把条约改成博客口吻，是改了语场。把对当事人的责任句改成无人称通稿，是改了语旨。把口头重复全部删光，可能改了语式，也抽掉了文本生命。",
        "翻译批评要分层。达意错误归风险，不在语体里偷偷改。语体只问：这三项是否更贴护照。修订后再核一遍锁定术语，确认一个都没被换掉。",
        "合译因此不设“写得更好”的语体目标。更好没有尺度。贴护照才有尺度。",
      ],
      en: [
        "Register is not a slider between formal and colloquial. The Hallidayan path splits it into field, tenor, and mode. Field is what is at stake: communique, contract, primer. Tenor is who is spoken to: the public, peers, a party. Mode is the channel: written prose, a spoken trace, a short screen line.",
        "The passport writes these three first, so Style has a range. Turning a treaty into a blog voice changes field. Turning a sentence of duty into impersonal copy changes tenor. Deleting all spoken repetition may change mode and drain the textual life.",
        "Criticism must be layered. Errors of sense belong to Risk, not to a quiet Style rewrite. Style only asks whether the three variables sit closer to the passport. After revision, locked terms are checked again. None may have been swapped.",
        "The shop therefore has no Style goal called “better writing”. Better has no measure. Fit-to-passport does.",
      ],
    },
  },
  {
    slug: "six-risks",
    category: "shop",
    date: "2026-10-05",
    title: {
      zh: "六类风险要对着护照看",
      en: "The six risks are read against the passport",
    },
    dek: {
      zh: "术语、偏移、漏译增译、立场、语体、幻觉。每一类都要有证据，或明确写无。",
      en: "Terms, drift, gaps, stance, register, hallucination. Each class needs evidence, or an explicit none.",
    },
    sources: {
      zh: "合译风险规程；李平、何三宁《翻译批评与鉴赏》；胡庚申《从“译者中心”到“译者责任”》",
      en: "The shop’s risk protocol; Li and He on criticism; Hu Gengshen on translator duty.",
    },
    body: {
      zh: [
        "风险扫描不是再写一篇印象式书评。六类要分别对着原文、译文、护照和术语表看。术语：锁定词是否被换，缩略词是否张冠李戴。意义偏移：因果、程度、范围。漏译或增译：承诺、否定、数字。情态立场：责任归属与评价色彩。语体：语场是否被改写。幻觉：源文没有的机关、日期、引用。",
        "批评一旦混层，扫描就会失效。词序调整被写成策略失败，真正的机关错译反而标成 none。流利不是无风险。模型越顺，幻觉越要单独开一类。",
        "高严重级必须有对照证据。总体评语只回答一件事：能否进入签发，缺的是哪一类证据。没有术语命中的官方名称，至少在术语类里留一条待核验。",
        "签发者看的不是“模型有没有扫过”，而是这六张卡片有没有被摊开。摊开了，人才能负责。",
      ],
      en: [
        "A risk scan is not another impressionistic review. The six classes are read against source, target, passport, and glossary. Terms: whether a lock was swapped, whether an abbreviation was misapplied. Drift: cause, degree, scope. Gaps: commitments, negation, numbers. Stance: who bears duty, and what is praised or blamed. Register: whether the field was rewritten. Hallucination: an institution, date, or quotation the source never had.",
        "Once criticism mixes layers, the scan fails. A word-order shift is written as a failed strategy, and a true institutional error is marked none. Fluency is not an absence of risk. The smoother the model, the more hallucination needs its own class.",
        "High severity needs parallel evidence. The overall line answers one thing: can this enter sign-off, and which class of evidence is missing. An official name with no glossary hit must at least remain a terminology item for verification.",
        "The signer does not ask whether a model scanned. The signer asks whether the six cards were laid on the table. Only then can a person take duty.",
      ],
    },
  },
  {
    slug: "style-does-not-rewrite",
    category: "shop",
    date: "2026-10-05",
    title: {
      zh: "语体可以润，不能改写",
      en: "Style may polish. It may not rewrite.",
    },
    dek: {
      zh: "节奏、称谓、情态强弱可以动。事实锚点和锁定术语不能动。",
      en: "Rhythm, address, and the force of modality may move. Fact anchors and locked terms may not.",
    },
    sources: {
      zh: "胡庚申《文本移植的生命存续》；李平、何三宁《翻译批评与鉴赏》",
      en: "Hu Gengshen on the afterlife of a textual transplant; Li and He on translation criticism.",
    },
    body: {
      zh: [
        "语体智能体最容易越权。初稿一顺，就想再顺一点：把短句接长，把重复删掉，把“必须”改成“似可”。这些改动常常不是语体，是事实和立场。",
        "文本移植要让文本继续活。源文短促就保持短促，源文重复就保留必要重复。把一篇公报养成通稿，生命就断了。把责任句改成无人称，签发者会失去自己的位置。",
        "合译给语体的指令因此很窄：只修订语域、节奏与情态，不得改写事实锚点和强制术语。修订后必须再对一遍术语表。换掉一个锁定词，语体即失败。",
        "达意问题交给风险，不在语体里“顺便修好”。修好而没有证据，等于把扫描变成装饰。",
      ],
      en: [
        "Style is the agent most ready to overreach. Once a draft is smooth, it wants to be smoother: join short sentences, cut repetition, turn “must” into “might”. Those moves are often not style. They are facts and stance.",
        "A transplant has to let the text go on living. If the source is short, stay short. If it repeats, keep the necessary repeat. Raising a communique into house copy breaks the life. Turning a sentence of duty into the impersonal leaves the signer with no place to stand.",
        "The shop therefore gives Style a narrow brief: revise register, rhythm, and modality; do not rewrite fact anchors or forced terms. After revision, the glossary is checked again. Swap one locked word, and Style has failed.",
        "Problems of sense go to Risk. They are not “fixed along the way” in Style. A quiet fix with no evidence turns the scan into decoration.",
      ],
    },
  },
  {
    slug: "sign-off-gate",
    category: "shop",
    date: "2026-10-05",
    title: {
      zh: "签发是闸门，不是按钮",
      en: "Sign-off is a gate, not a button",
    },
    dek: {
      zh: "五个智能体把初稿和风险摊在桌上。你改完再签，译员的名字还是你的。",
      en: "Five agents lay out a draft and the risks. You edit, then you sign. The byline stays yours.",
    },
    sources: {
      zh: "胡庚申《从“译者中心”到“译者责任”》；合译使用约定",
      en: "Hu Gengshen on translator duty; the shop’s terms of use.",
    },
    body: {
      zh: [
        "合译不替你交稿。规划、术语、翻译、语体、风险只提供起草与检查。交付发生在签发。点下签发，表示你读过锚点、术语和风险，并接受对文本的责任。",
        "这不是法律套话，是工序。没有签发，译文就还停在工坊里，不能被当成已交付的成品。模型流利，不能缩短这一步。免费体验跑完五个智能体，同样要人来看。",
        "签发前可以改语体修订，可以退回术语表补一条已审核名称。闸门的意义是：这些动作发生在你的名字之前，而不是之后由模型悄悄完成。",
        "译者中心在过程，译者责任在交付。闸门把这两句话接起来。少了它，工坊只是一个更快的黑箱。",
      ],
      en: [
        "Cowork Translation does not publish for you. Planner, Terminology, Translator, Style, and Risk draft and check. Delivery happens at sign-off. The click says you have read the anchors, the terms, and the risks, and you accept the text.",
        "That is not legal boilerplate. It is procedure. Without sign-off, the target stays in the shop. It is not a finished delivery. Model fluency cannot shorten this. After the one free five-agent run, a person still has to look.",
        "Before the gate you may edit the Style revision, or send a newly approved name back to the glossary. The gate means those moves happen before your name, not afterwards in a quiet model pass.",
        "The translator is central in the process, and responsible at delivery. The gate joins those two sentences. Without it, the shop is only a faster black box.",
      ],
    },
  },
  {
    slug: "longest-match",
    category: "shop",
    date: "2026-10-05",
    title: {
      zh: "最长匹配优先",
      en: "Longest match first",
    },
    dek: {
      zh: "“上海合作组织”先于“上海”。术语表按长度排序，不是按印象排序。",
      en: "“Shanghai Cooperation Organization” beats “Shanghai”. The glossary sorts by length, not by hunch.",
    },
    sources: {
      zh: "合译术语匹配规则；胡庚申《从术语看译论》；《国际组织和机构名称》",
      en: "The shop’s matching rule; Hu Gengshen on terms and theory; the organization-name list.",
    },
    body: {
      zh: [
        "术语锁定若按短词先匹配，长名称会被拆碎。“上海合作组织”会先被“上海”拿走，后面只剩无法对上的残片。合译因此按源文形式的长度从长到短匹配，命中区间不再重复占用。",
        "英文缩略词还要过词边界。短词如 IT、WHO、EU 区分大小写，避免把普通英文里的 it、who 锁成术语。聊天缩写没有入库，也是怕误锁。",
        "机构、缩略词与通用域在匹配时一并生效。你选法律或文学，联合国和世卫仍然能锁上。这不是让术语表膨胀成一部词典，而是承认专名会穿过领域。",
        "从术语看译论：术语是已经做完的选择。最长匹配只是把选择执行准确。执行不准，等于选择没有发生。",
      ],
      en: [
        "If short forms match first, long names break. “Shanghai Cooperation Organization” loses its first two syllables to “Shanghai”, and the rest cannot lock. The shop therefore matches from longest source form to shortest, and a hit occupies its span.",
        "English abbreviations also need word boundaries. Short forms such as IT, WHO, and EU are case-sensitive, so ordinary it and who are not locked. Chat slang was not imported, for the same reason.",
        "Institution, abbreviation, and general domains fire together. Choose law or literature, and United Nations or WHO can still lock. That is not a dictionary dumped into every job. It is an admission that proper names cross fields.",
        "Seeing theory through terms: a term is a finished choice. Longest match only executes the choice accurately. Execute it badly, and the choice never happened.",
      ],
    },
  },
  {
    slug: "current-affairs",
    category: "field",
    date: "2026-10-05",
    title: {
      zh: "时政用语：对照，不创作",
      en: "Current affairs: match the register, do not invent",
    },
    dek: {
      zh: "机关、会议、文件、职务先对口径。情态词不能减弱，也不能加码。",
      en: "Offices, meetings, documents, and titles match the official rendering. Modality may not be softened or raised.",
    },
    sources: {
      zh: "杜争鸣《时政用语中译英释例》；《国际组织和机构名称》",
      en: "Du Zhengming’s current-affairs examples; the organization-name list.",
    },
    body: {
      zh: [
        "时政翻译的第一动作是对照，不是作文。既有机关、会议、文件、职务，一律从术语表。写得更顺的近义，只要换了口径，就是错。",
        "情态词是第二道死线。“坚定”“所谓”“妥善”“绝不”带着立场。减弱它们，是立场错误；加码它们，同样是立场错误。数字、年份、届次必须原样进入译文。",
        "释例书的用处，不是提供可以抄的整段，而是训练眼睛：哪里已经有官方译法，哪里只是普通叙述。合译把前者锁住，后者交给翻译智能体在护照里活动。",
        "没有命中的新机构名，标待核验。人核对后再入库。时政生态不接受一次生成定名。",
      ],
      en: [
        "The first move in current-affairs translation is matching, not composing. Existing offices, meetings, documents, and titles come from the glossary. A smoother near-synonym that changes the official rendering is simply wrong.",
        "Modality is the second red line. Words of resolve, scare-quotes, care, and refusal carry stance. Soften them, and stance fails. Raise them, and stance fails too. Numbers, years, and session counts enter as they stand.",
        "Example books are not there to be copied in blocks. They train the eye: where an official rendering already exists, and where the prose is ordinary narration. The shop locks the first, and lets Translator move inside the passport on the second.",
        "A new institution with no hit is marked for verification. A person checks it, then it enters the glossary. A current-affairs ecology does not accept a name coined in one generation.",
      ],
    },
  },
  {
    slug: "legal-history-names",
    category: "field",
    date: "2026-10-05",
    title: {
      zh: "法史词语：一名一事",
      en: "Legal-historical terms: one name, one thing",
    },
    dek: {
      zh: "廷杖、秋审、例，不是现代刑法里的现成对应物。",
      en: "Court beating, autumn assizes, and substatutes are not ready counterparts in modern criminal law.",
    },
    sources: {
      zh: "景风华《法史万象：中国传统法律文化撷英》；李长栓《非文学翻译理论与实践》",
      en: "Jing Fenghua on traditional Chinese legal culture; Li Changshuan on non-literary practice.",
    },
    body: {
      zh: [
        "传统法律文化词语最容易被译成读者熟悉的现代法。廷杖不是 corporal punishment 的一个例子那么简单，秋审也不是普通的 appeal。一名一事：能用通行英译就锁定，没有通行译法时用拼音加中性说明，或标待核验。",
        "套用 common law 的对应物，是文化维的假适应。读者以为自己懂了，其实换了一套制度。法史叙述的责任，是让读者知道这是另一套生态，而不是把它擦成今天的法庭。",
        "同一词语在全文只能有一种写法。第一次出现可以带说明，后文不得改成更“好懂”的另一个词。说明属于注释或括注，不属于新的制度名。",
        "法律域打开时，机构名与缩略词仍然生效。现代条约里的联合国，和古代的秋审，可以出现在同一篇综述里，但它们不共用一套译法逻辑。",
      ],
      en: [
        "Traditional legal-cultural terms are easily recast as familiar modern law. Court beating is not simply an instance of corporal punishment, and the autumn assizes are not an ordinary appeal. One name, one thing: lock a received English rendering if it exists; otherwise use pinyin plus a neutral gloss, or mark for verification.",
        "A ready common-law counterpart is a false cultural adaptation. The reader thinks they understand, and has changed systems. Legal-historical prose owes the reader another ecology, not a wiped modern courtroom.",
        "The same term may have only one rendering in a text. The first occurrence may carry a gloss. Later lines may not switch to a more “helpful” word. A gloss is a note or a parenthesis. It is not a new institutional name.",
        "When the law domain is open, institution names and abbreviations still fire. The United Nations in a modern treaty and the autumn assizes in an older account may share a survey essay. They do not share a logic of rendering.",
      ],
    },
  },
  {
    slug: "economics-primer",
    category: "field",
    date: "2026-10-05",
    title: {
      zh: "学科导论：概念锁定，句法可适",
      en: "A primer: lock the concept, adapt the syntax",
    },
    dek: {
      zh: "定义句保持判断结构。例子可以调语序，数据与政策名不能改。",
      en: "Definition sentences keep their judgement form. Examples may change order. Data and policy names may not.",
    },
    sources: {
      zh: "鲍雪敏《经济学学科导论》汉英实践报告；胡庚申适应选择论",
      en: "Bao Xuemin’s report on translating an economics primer; Hu Gengshen on adaptation and selection.",
    },
    body: {
      zh: [
        "学科导论看起来像可以意译的教材，其实是概念的第一次公开命名。适应性选择转换在这里很具体：语言维上，概念首次出现用锁定译名，后文不得换一套近义；交际维上，定义句保持“甲是乙”的判断结构，让学生能划重点。",
        "例子可以略调语序，让英语可读。数据、国别、政策名称不行。把“约”写成精确数字，或把一个组织写成另一个更常见的缩写，都属于语言维与文化维同时失守。",
        "规划应把核心概念列入关键术语，并标明哪些是已审核、哪些待核验。翻译不得在待核验处“先用一个好听的”。",
        "导论的读者是入门者，不是让译者把难词擦掉的理由。擦掉难词，生态里就少了一个可以继续讨论的名字。",
      ],
      en: [
        "A disciplinary primer looks free for sense-for-sense work. It is often the first public naming of a concept. Adaptive selection is concrete here. On the language dimension, a concept is locked at first mention and not stylishly varied later. On the communicative dimension, a definition keeps an “A is B” judgement, so a student can underline it.",
        "Examples may shift order for English readability. Data, country names, and policy titles may not. Turning “about” into an exact figure, or swapping an organization for a more common abbreviation, fails language and culture together.",
        "Planner should list the core concepts as key terms, and mark which are already approved and which still need verification. Translator may not “use a nicer one for now” at a verification point.",
        "A primer’s reader is a beginner. That is not a reason to wipe hard words. Wipe the hard word, and the ecology loses a name that discussion can keep using.",
      ],
    },
  },
  {
    slug: "run-on-craft",
    category: "field",
    date: "2026-10-05",
    title: {
      zh: "流水句先保住关系，再断句",
      en: "Keep the relation, then break the run-on",
    },
    dek: {
      zh: "断句是技巧。添加 therefore 是增译。四字格不要另找一个典故来顶替。",
      en: "Breaking is technique. Adding therefore is addition. A four-character phrase does not get another culture’s allusion.",
    },
    sources: {
      zh: "《译海一粟：汉英翻译九百例》；李长栓《非文学翻译理论与实践》",
      en: "Yi Hai Yi Su: nine hundred Chinese–English examples; Li Changshuan on non-literary practice.",
    },
    body: {
      zh: [
        "汉语流水句是汉英翻译里最常见的手艺题。先找出逻辑主语和关系：谁做了什么，什么导致什么，哪一句只是并列。再决定在哪里断成英语的句子。",
        "断句本身不是背叛。添加源文没有的因果词才是。therefore、thus、which means 一旦出现，就要能在原文里指到对应的关系。指不到，就是增译。",
        "四字格能直译且不误导，就直译。不能，就用中性说明。另找一个英语典故来顶替，是文化维的假适应：读者得到了熟悉的画面，失去了原来的制度或意象。",
        "这些都是技巧，必须服从护照里的方法。护照若写直译为主，断句可以发生，典故替换不能发生。技巧没有自己的总方针。",
      ],
      en: [
        "The Chinese run-on is the ordinary craft problem in Chinese–English work. Find the logical subject and the relation first: who did what, what led to what, which clauses are only coordinate. Then decide where English may break.",
        "The break itself is not a betrayal. Adding a causal word the source never had is. If therefore, thus, or which means appears, it must point to a relation in the source. If it cannot, it is addition.",
        "A four-character phrase that can be rendered straight without misleading should be. Otherwise use a neutral gloss. Swapping in another culture’s allusion is a false cultural adaptation: the reader gets a familiar picture and loses the original institution or image.",
        "These are techniques. They obey the method in the passport. If the passport says literal first, a break may happen and an allusion-swap may not. Technique has no policy of its own.",
      ],
    },
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getCategory(id: BlogCategoryId) {
  return BLOG_CATEGORIES.find((item) => item.id === id);
}

export function postsByCategory() {
  return BLOG_CATEGORIES.map((category) => ({
    ...category,
    posts: BLOG_POSTS.filter((post) => post.category === category.id),
  }));
}

export function allSlugs() {
  return BLOG_POSTS.map((post) => post.slug);
}
