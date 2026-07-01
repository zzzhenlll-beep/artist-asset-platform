/**
 * 内容来源：玛格丽特博物馆官网
 * https://musee-magritte-museum.be/en
 * 整理为平台「艺术家资产档案」示范数据（中文呈现）
 * 图片资源见 public/images/magritte/（本地托管，无外部链接）
 */

import { MAGRITTE_IMAGES } from "./magritte-images";

export const MAGRITTE_PROFILE = {
  displayName: "玛格丽特",
  fullName: "René Magritte",
  lifespan: "1898–1967",
  city: "布鲁塞尔",
  birthplace: "比利时埃诺省莱西讷",
  medium: "油画 / 超现实主义",
  bio: "雷内·玛格丽特（René Magritte，1898–1967）是比利时超现实主义的核心人物。他迅速融入比利时、法国与美国艺术家圈层，并在一生中持续受其影响。其创作历经「阳光下的超现实主义」、1940 年代末的「母牛时期」，以及 1950–60 年代以重复手法与经典玛格丽特图像走向成熟的成功阶段。作品典藏、档案文献与影像材料现由比利时皇家美术博物馆系统保存。",
  statement:
    "「成为超现实主义者，就是摒弃似曾相识，去寻觅尚未被看见之物。」—— 超现实主义将 spontaneous、无意识与对理性的戏谑置于创作中心，创作过程本身优先于作为结果的艺术物项。",
  quote:
    "「我爱颠覆性幽默、雀斑、膝盖、女性的长发、自由奔跑的孩童之梦、街上奔跑的少女。」",
  keywords: ["超现实主义", "日常物像", "重复与变奏", "图像与语言", "比利时现代艺术"],
  tags: ["绘画", "超现实主义", "现代艺术"],
  socialLinks: {
    museum: "musee-magritte-museum.be",
    location: "Place royale 2, 1000 Brussels",
    email: "info@fine-arts-museum.be",
  },
  avatarUrl: MAGRITTE_IMAGES.portrait,
  followerCount: 195133,
} as const;

export const MAGRITTE_SERIES = [
  {
    title: "超现实主义绘画",
    description:
      "1926 年起，玛格丽特创作首批超现实主义画布。比利时是法国以外第一个形成超现实主义场景的国家；巴黎作为当时世界艺术之都，吸引了欧美艺术家共同参与这一运动。",
    themeEvolution:
      "从文学性超现实主义出发，发展为「阳光下的超现实主义」与日常物像的奇境并置；1940 年代末经历「母牛时期」的风格突变。",
    startYear: 1926,
    endYear: 1949,
    coverUrl: MAGRITTE_IMAGES.treacheryOfImages,
    sortOrder: 1,
  },
  {
    title: "重复与经典图像",
    description:
      "1950 与 1960 年代，艺术家以重复手法深入研究玛格丽特式图像母题，形成被广泛识别的视觉符号体系。",
    themeEvolution: "同一意象的多次变奏，使「熟悉之物」在重复中呈现陌生化效果。",
    startYear: 1950,
    endYear: 1967,
    coverUrl: MAGRITTE_IMAGES.golconda,
    sortOrder: 2,
  },
] as const;

export const MAGRITTE_WORKS = [
  {
    title: "形象的叛逆",
    titleEn: "The Treachery of Images",
    description:
      "画面下方书写「Ceci n'est pas une pipe（这不是一只烟斗）」，挑战图像与语言、再现与真实之间的常识关系——是玛格丽特最具代表性的观念绘画之一。",
    year: 1929,
    dimensions: "60.33 × 81.12 cm",
    workMedium: "布面油画",
    edition: "原作",
    imageUrl: MAGRITTE_IMAGES.treacheryOfImages,
    seriesIndex: 0,
    viewCount: 48200,
    favoriteCount: 3200,
    publishedAt: "1929-01-15",
    rating: {
      score: 5.0,
      comment: "以极简图像完成观念反转，是理解玛格丽特「图像叙事」能力的入门之作，具备极强的公共传播与阐释价值。",
    },
  },
  {
    title: "恋人",
    titleEn: "The Lovers",
    description:
      "被白布遮住面部的恋人亲吻，日常亲密场景被赋予神秘与隔离感，体现玛格丽特对「可见与不可见」的持续探索。",
    year: 1928,
    dimensions: "54 × 73.4 cm",
    workMedium: "布面油画",
    edition: "原作",
    imageUrl: MAGRITTE_IMAGES.lovers,
    seriesIndex: 0,
    viewCount: 35600,
    favoriteCount: 2100,
    publishedAt: "1928-06-01",
    rating: {
      score: 4.8,
      comment: "情感主题与超现实手法结合紧密，画面具有高度识别度，适合作为系列叙事与大众导览的核心作品。",
    },
  },
  {
    title: "戈尔孔达",
    titleEn: "Golconda",
    description:
      "空中悬浮着无数戴礼帽的男子，如同雨点般布满天空。重复的人形与都市背景形成荒诞而秩序井然的视觉结构。",
    year: 1953,
    dimensions: "80 × 100.3 cm",
    workMedium: "布面油画",
    edition: "原作",
    imageUrl: MAGRITTE_IMAGES.golconda,
    seriesIndex: 1,
    viewCount: 52100,
    favoriteCount: 4100,
    publishedAt: "1953-03-20",
    rating: {
      score: 4.9,
      comment: "重复母题与都市符号的完美结合，是研究其 1950 年代创作转向的关键作品。",
    },
  },
  {
    title: "人类之子",
    titleEn: "The Son of Man",
    description:
      "戴礼帽的绅士面部被一颗苹果遮挡，仅露出 eye 边缘。私人收藏中的名作，常被视为玛格丽特晚期自我形象的隐喻。",
    year: 1964,
    dimensions: "89 × 116 cm",
    workMedium: "布面油画",
    saleStatus: "PRIVATE" as const,
    edition: "私人收藏",
    imageUrl: MAGRITTE_IMAGES.sonOfMan,
    seriesIndex: 1,
    viewCount: 89400,
    favoriteCount: 6800,
    publishedAt: "1964-01-01",
    openPresaleConsult: false,
    rating: {
      score: 5.0,
      comment: "全球认知度最高的玛格丽特图像之一，符号简洁、语义开放，具有极强的文化影响力与传播数据。",
    },
  },
  {
    title: "光之帝国",
    titleEn: "The Empire of Light",
    description:
      "白昼明亮的天空与夜间黑暗的房屋并置，光线逻辑被故意打破，呈现梦境般的时空错位。",
    year: 1954,
    dimensions: "50.2 × 65.2 cm",
    workMedium: "布面油画",
    edition: "原作",
    imageUrl: MAGRITTE_IMAGES.empireOfLight,
    seriesIndex: 1,
    viewCount: 28700,
    favoriteCount: 1900,
    publishedAt: "1954-09-10",
    rating: {
      score: 4.7,
      comment: "光与暗的并置极具戏剧张力，适合用于解释其「理性戏谑」与梦境逻辑。",
    },
  },
] as const;

export const MAGRITTE_TIMELINE = [
  {
    year: 1898,
    month: 11,
    title: "出生于莱西讷",
    description: "1898 年 11 月 21 日出生于比利时埃诺省莱西讷（Lessines）。",
    eventType: "MILESTONE" as const,
    sortOrder: 1,
  },
  {
    year: 1924,
    month: null,
    title: "比利时超现实主义场景形成",
    description: "1924 年《超现实主义宣言》发表；比利时成为法国以外首个形成超现实主义艺术场景的国家。",
    eventType: "MILESTONE" as const,
    sortOrder: 2,
  },
  {
    year: 1926,
    month: null,
    title: "创作首批超现实主义画布",
    description: "标志着其创作进入超现实主义阶段，日常物像开始被赋予陌生化意义。",
    eventType: "SERIES" as const,
    sortOrder: 3,
    seriesIndex: 0,
  },
  {
    year: 1953,
    month: 3,
    title: "《戈尔孔达》完成",
    description: "重复人形母题的重要代表作，进入其 1950 年代成熟期。",
    eventType: "PUBLICATION" as const,
    sortOrder: 4,
    seriesIndex: 1,
  },
  {
    year: 1967,
    month: 8,
    title: "逝世于布鲁塞尔",
    description: "1967 年 8 月 15 日因胰腺癌在布鲁塞尔逝世。",
    eventType: "MILESTONE" as const,
    sortOrder: 5,
  },
  {
    year: 2026,
    month: 7,
    day: 12,
    title: "探索玛格丽特博物馆 · 导览活动（EN）",
    description: "成人导览：Chantal Clercx 带领参观馆藏与创作脉络。",
    eventType: "EXHIBITION" as const,
    sortOrder: 6,
  },
  {
    year: 2026,
    month: 8,
    day: 2,
    title: "探索玛格丽特博物馆 · 导览活动（EN）",
    description: "成人导览：Marie Sarr 带领参观。",
    eventType: "EXHIBITION" as const,
    sortOrder: 7,
  },
  {
    year: 2026,
    month: 8,
    day: 9,
    title: "探索玛格丽特博物馆 · 导览活动（EN）",
    description: "成人导览：Alberto Bagnara 带领参观。",
    eventType: "EXHIBITION" as const,
    sortOrder: 8,
  },
] as const;

export const MAGRITTE_ARCHIVE_NEWS = [
  {
    description: "玛格丽特 × Emily Mae Smith 联展项目发布",
    entityType: "PROFILE" as const,
    action: "NEWS",
    date: "2025-10",
  },
  {
    description: "玛格丽特博物馆完成新一轮翻新工程",
    entityType: "PROFILE" as const,
    action: "NEWS",
    date: "2025-06",
  },
  {
    description: "失落玛格丽特画作之谜终被破解",
    entityType: "WORK" as const,
    action: "NEWS",
    date: "2024-03",
  },
  {
    description: "Dalí & 玛格丽特联展观众达 195,133 人次，创 attendance 纪录",
    entityType: "PROFILE" as const,
    action: "NEWS",
    date: "2023-09",
  },
  {
    description: "苏富比举办玛格丽特专题学术研讨会",
    entityType: "PROFILE" as const,
    action: "NEWS",
    date: "2023-05",
  },
  {
    description: "推出面向儿童与青少年的全新语音导览",
    entityType: "PROFILE" as const,
    action: "NEWS",
    date: "2022-11",
  },
  {
    description: "馆藏线上数据库与作品典藏板块上线更新",
    entityType: "SERIES" as const,
    action: "UPDATE",
    date: "2022-01",
  },
] as const;

export const MAGRITTE_PROCESS_ASSETS = [
  {
    title: "作品典藏 · 绘画与纸本",
    description: "官网在线典藏数据库：涵盖绘画、纸本等多媒介作品，支持公众远程浏览。",
    assetType: "REFERENCE" as const,
    url: MAGRITTE_IMAGES.treacheryOfImages,
    visibility: "PUBLIC" as const,
    seriesIndex: 0,
  },
  {
    title: "档案文献",
    description: "皇家美术博物馆典藏之艺术家档案，供研究者深度查阅。",
    assetType: "EXHIBITION_PREP" as const,
    url: MAGRITTE_IMAGES.portrait,
    visibility: "PUBLIC" as const,
  },
  {
    title: "图书馆研究资料",
    description: "馆藏图书馆藏有大量关于玛格丽特与超现实主义的研究出版物。",
    assetType: "NOTE" as const,
    url: MAGRITTE_IMAGES.golconda,
    visibility: "PUBLIC" as const,
  },
  {
    title: "玛格丽特 40 部业余与无声电影",
    description: "馆藏影像资料：艺术家相关业余与无声电影档案（官网 Collections 栏目）。",
    assetType: "STUDIO" as const,
    url: MAGRITTE_IMAGES.empireOfLight,
    visibility: "SUPPORTERS" as const,
  },
  {
    title: "创作手稿与笔记",
    description: "早期构图试验与观念笔记，展示从观念到成品的演化链。",
    assetType: "SKETCH" as const,
    url: MAGRITTE_IMAGES.lovers,
    visibility: "PUBLIC" as const,
    seriesIndex: 0,
  },
] as const;

export const MAGRITTE_EARLY_SUPPORTERS = [
  { name: "比利时皇家美术博物馆", note: "作品与档案系统典藏机构", sortOrder: 1 },
  { name: "玛格丽特博物馆", note: "Place royale 2, Brussels", sortOrder: 2 },
  { name: "巴黎超现实主义艺术家群体", note: "1920 年代起持续交流", sortOrder: 3 },
  { name: "苏富比研究所", note: "专题研讨与学术支持", sortOrder: 4 },
] as const;

export const MAGRITTE_COLLECTIONS_INTRO =
  "官网与在线典藏数据库使公众可远程欣赏玛格丽特多元创作；研究者亦可深入皇家美术博物馆丰富档案——图书馆藏有大量关于玛格丽特与超现实主义的出版物。";
