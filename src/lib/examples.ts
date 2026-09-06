export const POLITICAL_EXAMPLES = [
  {
    title: "智能经济",
    text: "打造智能经济新形态。深化拓展“人工智能+”。",
  },
  {
    title: "新质生产力",
    text: "因地制宜发展新质生产力。",
  },
  {
    title: "江山人民",
    text: "江山就是人民，人民就是江山。中国共产党领导人民打江山、守江山，守的是人民的心。",
  },
] as const;

export const DEMO_EXAMPLES = [
  {
    title: "用例 1",
    text: "Oracle Exadata Database Machine is powerful.",
    expected: "甲骨文中国 原厂Exadata数据库一体机 非常强大。",
  },
  {
    title: "用例 2",
    text: "Oracle Database Appliance delivers exceptional cost-effectiveness for enterprise database workloads.",
    expected:
      "原厂ODA数据库一体机 为企业级数据库工作负载提供了卓越的成本效益。",
  },
] as const;

export const SEED_TERMS = [
  {
    term: "Oracle",
    translation: "甲骨文中国",
    domain: "TEST",
    note: "教材用例：验证通用品牌名会被强制改写",
  },
  {
    term: "Exadata Database Machine",
    translation: "原厂Exadata数据库一体机",
    domain: "TEST",
    note: "教材用例：最长术语优先",
  },
  {
    term: "Oracle Database Appliance",
    translation: "原厂ODA数据库一体机",
    domain: "TEST",
    note: "教材用例：避免先匹配到 Oracle",
  },
  {
    term: "LLM",
    translation: "大语言模型",
    domain: "技术",
  },
  {
    term: "RAG",
    translation: "检索增强生成",
    domain: "技术",
  },
  {
    term: "prompt",
    translation: "提示词",
    domain: "技术",
  },
] as const;
