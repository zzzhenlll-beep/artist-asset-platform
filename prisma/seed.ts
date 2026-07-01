import { PrismaClient } from "@prisma/client";

import { SITE_IMAGES } from "../lib/site-images";
import { seedMagritte } from "./seed-magritte";

const prisma = new PrismaClient();

async function main() {
  await prisma.archiveLog.deleteMany();
  await prisma.collaborationIntent.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.artistFollow.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.workMedia.deleteMany();
  await prisma.work.deleteMany();
  await prisma.processAsset.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.earlySupporter.deleteMany();
  await prisma.series.deleteMany();
  await prisma.creator.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      phone: "13900000000",
      nickname: "平台管理员",
      role: "ADMIN",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      phone: "13800000000",
      nickname: "林墨染",
      avatarUrl: SITE_IMAGES.avatar,
      role: "CREATOR",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      phone: "13800000001",
      nickname: "陈序",
      avatarUrl: SITE_IMAGES.avatar,
      role: "CREATOR",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      phone: "13800000002",
      nickname: "周原",
      avatarUrl: SITE_IMAGES.avatar,
      role: "CREATOR",
    },
  });

  const user4 = await prisma.user.create({
    data: {
      phone: "13800000003",
      nickname: "玛格丽特",
      role: "CREATOR",
    },
  });

  const demoUser = await prisma.user.create({
    data: { phone: "13700000000", nickname: "艺术爱好者", role: "USER" },
  });

  const c1 = await prisma.creator.create({
    data: {
      userId: user1.id,
      displayName: "林墨染",
      city: "上海",
      medium: "数字插画 / 混合媒介",
      bio: "艺术与科技交叉背景，专注国潮插画与文创视觉。",
      statement:
        "我关注城市记忆与东方当代美学的交汇。作品不是单张图像，而是可被阅读、被跟踪的创作脉络——从草图到系列，从街巷到叙事。",
      keywords: ["城市记忆", "国潮", "叙事插画", "文创"],
      tags: ["插画", "国潮", "文创"],
      socialLinks: { weibo: "@linmoran", email: "studio@example.com" },
      openCollaboration: true,
      followerCount: 128,
    },
  });

  const c2 = await prisma.creator.create({
    data: {
      userId: user2.id,
      displayName: "陈序",
      city: "北京",
      medium: "影像 / 新媒体",
      bio: "超高清城市影像创作者，探索数字资产与实体制造的连接路径。",
      statement: "用镜头记录城市的呼吸节奏，把不可见的情绪转化为可积累的视觉资产。",
      keywords: ["城市影像", "超高清", "新媒体"],
      tags: ["影像", "城市", "超高清"],
      socialLinks: { instagram: "@chenxu.city" },
      openCollaboration: true,
      followerCount: 86,
    },
  });

  const c3 = await prisma.creator.create({
    data: {
      userId: user3.id,
      displayName: "周原",
      city: "景德镇",
      medium: "3D 视觉 / 产品设计",
      bio: "3D 视觉与产品概念设计，服务品牌联名与工厂打样落地。",
      statement: "传统器型与当代设计语言在我的实践中不断对话，目标是让创作可制造、可转化。",
      keywords: ["3D", "器型", "联名设计"],
      tags: ["3D", "产品设计", "联名"],
      openCollaboration: false,
      followerCount: 54,
    },
  });

  const s1 = await prisma.series.create({
    data: {
      creatorId: c1.id,
      title: "静安里系列",
      description: "以静安区历史肌理为灵感的数字街巷叙事系列。",
      themeEvolution: "从单幅街巷写生，发展为具有连续叙事的城市记忆档案。",
      startYear: 2024,
      coverUrl: SITE_IMAGES.cover,
      sortOrder: 1,
    },
  });

  const s2 = await prisma.series.create({
    data: {
      creatorId: c2.id,
      title: "霓虹序章",
      description: "夜间城市的光影切片与情绪氛围研究。",
      themeEvolution: "由静态摄影延伸至动态影像与装置参考。",
      startYear: 2025,
      coverUrl: SITE_IMAGES.series,
      sortOrder: 1,
    },
  });

  const w1 = await prisma.work.create({
    data: {
      creatorId: c1.id,
      seriesId: s1.id,
      title: "静安里 · 数字街巷",
      description:
        "以静安区历史肌理为灵感，融合超高清视听语汇的数字插画系列。适合文创礼盒、展览主视觉与品牌联名场景。",
      year: 2026,
      dimensions: "3840 × 2160 px",
      workMedium: "数字插画",
      saleStatus: "UNSOLD",
      edition: "1/1 数字原作",
      openPresaleConsult: true,
      status: "PUBLISHED",
      openCollaboration: true,
      viewCount: 2840,
      favoriteCount: 186,
      aiMeta: { aiGenerated: true, model: "mock" },
      publishedAt: new Date("2026-06-20"),
      media: {
        create: [{ url: SITE_IMAGES.work, sortOrder: 0 }],
      },
    },
  });

  const w2 = await prisma.work.create({
    data: {
      creatorId: c2.id,
      seriesId: s2.id,
      title: "霓虹序章",
      description: "夜间城市的光影切片，强调超高清细节与情绪氛围。",
      year: 2026,
      dimensions: "7680 × 4320 px",
      workMedium: "数字影像",
      saleStatus: "UNSOLD",
      status: "PUBLISHED",
      openCollaboration: true,
      viewCount: 1520,
      favoriteCount: 97,
      publishedAt: new Date("2026-06-18"),
      media: {
        create: [{ url: SITE_IMAGES.work, sortOrder: 0 }],
      },
    },
  });

  const w3 = await prisma.work.create({
    data: {
      creatorId: c3.id,
      title: "器象 · 青瓷新生",
      description: "传统纹样与当代产品造型的融合方案，面向文创制造合作。",
      year: 2025,
      dimensions: "30 × 18 × 12 cm",
      workMedium: "3D 渲染 / 概念设计",
      saleStatus: "UNSOLD",
      status: "PUBLISHED",
      openCollaboration: true,
      viewCount: 980,
      favoriteCount: 64,
      publishedAt: new Date("2026-05-10"),
      media: {
        create: [{ url: SITE_IMAGES.work, sortOrder: 0 }],
      },
    },
  });

  await prisma.work.create({
    data: {
      creatorId: c1.id,
      seriesId: s1.id,
      title: "静安里 · 雨巷",
      description: "系列第二件，强调雨夜反光与行人剪影的叙事层次。",
      year: 2025,
      workMedium: "数字插画",
      saleStatus: "UNSOLD",
      status: "PUBLISHED",
      openCollaboration: true,
      viewCount: 620,
      favoriteCount: 41,
      publishedAt: new Date("2025-11-08"),
      media: {
        create: [{ url: SITE_IMAGES.work, sortOrder: 0 }],
      },
    },
  });

  await prisma.rating.create({
    data: {
      workId: w1.id,
      adminId: admin.id,
      score: 4.5,
      comment: "概念完整、文化语境清晰，具备较强的商业联名与展陈转化潜力。",
    },
  });

  await prisma.rating.create({
    data: {
      workId: w2.id,
      adminId: admin.id,
      score: 4.0,
      comment: "画面张力突出，适合作为视听类内容的视觉母题。",
    },
  });

  const margaret = await seedMagritte(prisma, admin.id, user4.id);

  await prisma.timelineEvent.createMany({
    data: [
      {
        creatorId: c1.id,
        seriesId: s1.id,
        year: 2024,
        month: 3,
        title: "启动静安里系列",
        description: "确定以城市记忆为主线的长期系列方向。",
        eventType: "SERIES",
        sortOrder: 1,
      },
      {
        creatorId: c1.id,
        seriesId: s1.id,
        year: 2025,
        month: 11,
        title: "发布《雨巷》",
        description: "系列第二件公开，建立从写生到叙事的演化路径。",
        eventType: "PUBLICATION",
        sortOrder: 2,
      },
      {
        creatorId: c1.id,
        year: 2026,
        month: 6,
        title: "参加城市更新主题群展",
        description: "静安里系列完整版首次线下呈现。",
        eventType: "EXHIBITION",
        sortOrder: 3,
      },
      {
        creatorId: c2.id,
        seriesId: s2.id,
        year: 2025,
        month: 9,
        title: "霓虹序章研究启动",
        eventType: "SERIES",
        sortOrder: 1,
      },
    ],
  });

  await prisma.processAsset.createMany({
    data: [
      {
        creatorId: c1.id,
        seriesId: s1.id,
        title: "街巷草图 A",
        description: "系列初期的现场速写扫描件。",
        assetType: "SKETCH",
        url: SITE_IMAGES.work,
        visibility: "PUBLIC",
      },
      {
        creatorId: c1.id,
        seriesId: s1.id,
        title: "创作笔记 · 叙事结构",
        assetType: "NOTE",
        url: SITE_IMAGES.work,
        visibility: "PUBLIC",
      },
      {
        creatorId: c1.id,
        title: "工作室工作照",
        assetType: "STUDIO",
        url: SITE_IMAGES.work,
        visibility: "SUPPORTERS",
      },
    ],
  });

  await prisma.earlySupporter.createMany({
    data: [
      { creatorId: c1.id, name: "ArtLab 文化基金", note: "2024 年起持续跟踪", sortOrder: 1 },
      { creatorId: c1.id, name: "独立策展人 · 苏青", sortOrder: 2 },
      { creatorId: c1.id, name: "早期收藏者 12 人", note: "匿名展示", sortOrder: 3 },
    ],
  });

  await prisma.archiveLog.createMany({
    data: [
      {
        creatorId: c1.id,
        entityType: "SERIES",
        entityId: s1.id,
        action: "CREATE",
        description: "创建系列「静安里系列」",
      },
      {
        creatorId: c1.id,
        entityType: "WORK",
        entityId: w1.id,
        action: "PUBLISH",
        description: "首次公开发布作品《静安里 · 数字街巷》",
      },
      {
        creatorId: c1.id,
        entityType: "PROFILE",
        action: "UPDATE",
        description: "更新个人陈述与创作关键词",
      },
    ],
  });

  await prisma.artistFollow.create({
    data: { userId: demoUser.id, creatorId: margaret.creator.id },
  });

  await prisma.favorite.create({
    data: { userId: demoUser.id, workId: margaret.featuredWorkId },
  });

  await prisma.collaborationIntent.create({
    data: {
      userId: demoUser.id,
      workId: margaret.featuredWorkId,
      creatorId: margaret.creator.id,
      purpose: "玛格丽特作品研究合作与展览意向",
      contactName: "王先生",
      contactInfo: "138****8888",
      budgetRange: "5-10 万",
      message: "希望基于静安里系列做限定礼盒，需了解授权与合作流程。",
      status: "PENDING",
    },
  });

  console.log("Seed completed:", {
    artists: 4,
    margaretWorks: margaret.workIds.length,
    margaret: margaret.creator.id,
    admin: admin.phone,
    creator: user1.phone,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
