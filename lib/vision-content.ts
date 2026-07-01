export const industryPainPoints = [
  {
    id: "interpretation",
    title: "解释权被垄断",
    summary: "艺术家为什么重要、作品为什么有价值，长期依赖少数中介叙事，大众很难参与「理解」。",
    drivers: ["画廊", "策展人", "评论家", "学院系统", "拍卖行叙事"],
    marginalNote: "大众很难参与「理解」。",
  },
  {
    id: "pricing",
    title: "定价权被垄断",
    summary: "艺术品价格很多时候不是透明形成的，而是关系与背书叠加的结果。",
    drivers: [
      "关系网络",
      "展览履历",
      "机构背书",
      "圈层稀缺性",
      "私下报价系统",
    ],
    marginalNote: "大众看不懂，也无法判断价格逻辑。",
  },
  {
    id: "early-signals",
    title: "早期艺术家没有资产化机制",
    summary:
      "年轻艺术家在「被大机构看到之前」，其实已有许多价值信号，却很少被系统记录成「资产」。",
    drivers: [
      "创作持续性",
      "风格演化",
      "社群认可",
      "文本能力",
      "项目能力",
      "跨界能力",
      "数字作品传播力",
    ],
    marginalNote: "这些信号分散在各处，难以被第三方持续跟踪。",
  },
  {
    id: "soft-assets",
    title: "软资产没有被定价",
    summary: "硬资产可以持有与交易，软资产却极少被结构化记录与展示——这正是差异化的关键。",
    drivers: [],
    marginalNote: "今天市场里，软资产很少被结构化地记录和展示。",
  },
] as const;

export const hardAssets = [
  "作品原件",
  "版画",
  "雕塑",
  "手稿",
  "周边",
  "已售 / 未售库存",
] as const;

export const softAssets = [
  "风格识别度",
  "叙事能力",
  "作品宇宙观",
  "社群关系",
  "展览经历",
  "合作履历",
  "传播数据",
  "收藏者结构",
  "二级市场表现",
  "文化影响力",
] as const;

export const margaretCaseIntro = {
  name: "玛格丽特",
  fullName: "René Magritte",
  tagline: "比利时超现实主义画家 · 艺术家资产档案示范案例",
  context:
    "内容整理自玛格丽特博物馆（musee-magritte-museum.be）：生平、典藏、展览动态与活动信息，被结构化为本平台的六模块艺术家档案——展示硬资产（作品）、软资产（叙事、声誉、过程材料）如何被系统记录与公开解释。",
};
