# 验证期 MVP 交付存档

> **项目名称**：艺术家个人资产体系  
> **存档日期**：2026-07-02  
> **阶段定位**：验证期 MVP · 售前阶段资产档案（非 NFT / 链上 / 完整支付）  
> **示范案例**：玛格丽特档案馆（René Magritte，内容整理自 [玛格丽特博物馆官网](https://musee-magritte-museum.be/en)）

本文档记录当前代码库**已交付**的功能、页面结构、数据与运维方式，供后续迭代、演示与交接使用。规划类文档见 [PROJECT_PLAN.md](../../PROJECT_PLAN.md) 与 [docs/README.md](../README.md)。

---

## 1. 产品定位（当前版本）

| 维度 | 说明 |
|------|------|
| 核心目标 | 把艺术家在售前阶段的个人资产（硬资产 + 软资产）做成**可见、可理解、可积累、可参与** |
| 交付形态 | 每位艺术家一个「资产档案页」（6 模块聚合）+ 发现 / 行业洞察 / 合作咨询 |
| 示范路径 | 以 **玛格丽特** 为完整档案案例，演示平台能力 |
| 明确不做 | 链上确权、NFT 标准化发行、完整支付闭环（见 [003-presale-not-nft.md](../decisions/003-presale-not-nft.md)） |

---

## 2. 信息架构（两层前台）

前台 UI 参考 [玛格丽特博物馆官网](https://musee-magritte-museum.be/en) 的编辑式、机构感布局，**仅做两层**：首页 + 一级内容页，后台维持功能型 UI、未做博物馆风格深改。

```
首页 /
├── 关于体系        → /vision（行业洞察 · 四大痛点 + 硬/软资产 + 玛格丽特案例）
├── 艺术家档案      → /artists/[id]（6 模块 · 以玛格丽特为示范）
├── 作品与系列      → /discover
└── 咨询支持        → /collaborate

艺术家档案子页（仍属一级内容）
├── /artists/[id]/works/[workId]   作品详情
├── /artists/[id]/series/[seriesId] 系列详情
└── /artists/[id]/timeline         完整时间轴
```

### 2.1 首页模块对应

| 首页区块 | 博物馆官网对应 | 数据来源 |
|----------|----------------|----------|
| Hero「玛格丽特档案馆」 | 馆藏引言 | `lib/magritte-archive-content.ts` |
| 四宫格入口 | About / Visit / Collections / Resources | `components/museum/portal-grid.tsx` |
| 档案动态 | News | 玛格丽特 `ArchiveLog` |
| 创作活动 | Activities | 玛格丽特 `TimelineEvent` |
| 艺术家索引 | — | 全站已发布创作者 |

### 2.2 视觉规范

- 主色：博物馆蓝 `#1e3a5f`（`app/globals.css` · `.bg-museum`）
- 标题：衬线字体（`.font-serif`）
- 布局：`.museum-container`、`.museum-section-title`、`.museum-link`
- 布局组件：`components/layout/header.tsx`、`footer.tsx`、`components/museum/*`

---

## 3. 艺术家资产档案 · 六模块（已实现）

详细字段说明见 [mvp-modules.md](../product/mvp-modules.md)。

| 模块 | 页面位置 | 实现要点 |
|------|----------|----------|
| 1 基础身份 | 档案页 Hero | 姓名、媒介、城市、关键词、陈述、社媒、关注 |
| 2 作品档案 | 「作品典藏」 | 结构化字段 + 评级 + 浏览/收藏统计 |
| 3 系列与时间线 | 「系列与创作脉络」+ `/timeline` | 系列封面、主题演化、年度节点 |
| 4 过程资产 | 「过程资产」 | 公开 / 支持者可见分级 |
| 5 支持者关系 | 「支持者关系」 | 早期支持者名单、关注按钮 |
| 6 可验证记录 | 「档案动态」 | `ArchiveLog` 时间线 |

聚合组件：`components/artists/artist-archive.tsx`  
数据查询：`lib/artists.ts` → `getArtistArchive()`

---

## 4. 玛格丽特示范案例

### 4.1 内容来源与文件

| 文件 | 职责 |
|------|------|
| `lib/magritte-archive-content.ts` | 生平、系列、作品、时间轴、档案动态、过程资产、支持者（中文） |
| `lib/magritte-images.ts` | 本地图片路径常量 |
| `prisma/seed-magritte.ts` | 写入完整玛格丽特档案 |
| `lib/vision-content.ts` | 行业洞察页案例引言 |

### 4.2 示范数据规模

| 类型 | 数量 | 说明 |
|------|------|------|
| 系列 | 2 | 超现实主义绘画；重复与经典图像 |
| 代表作 | 5 | 形象的叛逆、恋人、戈尔孔达、人类之子、光之帝国 |
| 时间轴 | 8 | 传记节点 + 2026 导览活动 |
| 档案动态 | 7+ | 联展、翻新、失落画作、观众纪录等 |
| 过程资产 | 5 | 典藏、档案、图书馆、影片、手稿 |
| 早期支持者 | 4 | 皇家美术博物馆、玛格丽特博物馆等 |

### 4.3 行业洞察（/vision）

- 四大行业痛点、硬资产 / 软资产清单（已去掉 NFT 表述）
- 玛格丽特作为案例艺术家，链至完整档案页

---

## 5. 图片资源策略（本地托管 · 禁止运行时外链）

**原则**：页面展示不依赖 Wikimedia、picsum 等外部图片；下载失败时必须有配图，不允许空白占位。

### 5.1 目录结构

```
public/images/
├── magritte/              # 玛格丽特档案专用
│   ├── portrait.jpg
│   ├── the-treachery-of-images.jpg
│   ├── the-lovers.jpg
│   ├── golconda.jpg
│   ├── the-son-of-man.jpg
│   ├── the-empire-of-light.jpg
│   └── *.svg              # 每张作品对应的 SVG 备用配图（下载脚本自动生成）
└── placeholders/          # 全站通用
    ├── avatar.svg
    ├── work.svg
    ├── cover.svg
    └── series.svg
```

用户上传内容仍走 `storage/uploads/` + `/api/media/*`（见 [local-storage.md](../storage/local-storage.md)）。

### 5.2 下载与初始化

```powershell
pnpm download:magritte-images   # 尝试拉取 JPG；失败则保留 SVG 配图
pnpm db:setup                   # 下载图片 + prisma db push + seed
```

脚本：`scripts/download-magritte-images.ts`  
配图生成：`lib/art-placeholder-svg.ts`（博物馆风格 SVG）

### 5.3 运行时降级链

组件 `components/ui/site-image.tsx` + 工具 `lib/site-images.ts`：

```
主图 URL → 同名 .svg → 通用 placeholders/*.svg
```

全站作品卡、艺术家卡、档案页、系列页、详情页均已接入，**无「暂无封面」空态**。

---

## 6. 技术栈与目录

| 层级 | 选型 |
|------|------|
| 框架 | Next.js 15（App Router）+ React 19 |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 4 |
| ORM | Prisma 6 + MySQL 8 |
| 认证 | JWT Cookie（`lib/auth.ts`） |
| 包管理 | pnpm |

```
艺术家个人资产体系/
├── app/                      # 页面与 API 路由
│   ├── page.tsx              # 首页（博物馆式）
│   ├── vision/               # 行业洞察
│   ├── discover/             # 作品与系列
│   ├── artists/[id]/         # 档案 · 作品 · 系列 · 时间轴
│   ├── collaborate/          # 合作咨询
│   ├── login/
│   ├── dashboard/            # 创作者后台
│   ├── admin/                # 管理端
│   └── api/                  # 认证、媒体、作品、关注等
├── components/
│   ├── artists/              # 档案页、卡片、关注
│   ├── museum/               # 门户网格、编辑列表、Hero
│   ├── ui/site-image.tsx     # 本地配图 + 降级
│   └── works/
├── lib/
│   ├── magritte-archive-content.ts
│   ├── magritte-images.ts
│   ├── site-images.ts
│   ├── artists.ts / serializers.ts / vision-content.ts
│   ├── db.ts / auth.ts / storage.ts / ai.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── seed-magritte.ts
├── public/images/            # 静态配图（需纳入版本库或 setup 生成）
├── scripts/download-magritte-images.ts
├── storage/uploads/          # 运行时上传
└── docs/                     # 项目文档
```

---

## 7. 路由与 API 一览

### 7.1 主要页面

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/vision` | 行业洞察 |
| `/discover` | 发现 · 艺术家与作品 |
| `/artists/[id]` | 艺术家资产档案（6 模块） |
| `/artists/[id]/works/[workId]` | 作品详情 |
| `/artists/[id]/series/[seriesId]` | 系列详情 |
| `/artists/[id]/timeline` | 时间轴 |
| `/collaborate` | 合作 / 支持意向 |
| `/login` | 演示登录 |
| `/dashboard/*` | 创作者后台（档案、上传、系列、过程、时间轴） |
| `/admin` | 管理端（评级等） |

### 7.2 主要 API（节选）

| 路径 | 用途 |
|------|------|
| `POST /api/auth/login` | 演示登录 |
| `POST /api/media/upload` | 图片上传 |
| `GET /api/media/[...path]` | 本地存储读取 |
| `GET/POST /api/works` | 作品 CRUD |
| `POST /api/follow` | 关注艺术家 |
| `POST /api/favorites` | 收藏作品 |
| `POST /api/intents` | 合作意向 |
| `POST /api/ratings` | 管理员评级 |

---

## 8. 数据库与演示账号

### 8.1 连接

```env
DATABASE_URL="mysql://creator:creator_dev_pass@127.0.0.1:3306/artist_assets"
```

MySQL 启动与建库见 [mysql-setup.md](../database/mysql-setup.md)。

### 8.2 演示账号（seed 后）

| 手机号 | 角色 | 说明 |
|--------|------|------|
| `13800000000` | 创作者 | 林墨染（演示创作者后台） |
| `13800000003` | 创作者 | 玛格丽特档案绑定账号 |
| `13900000000` | 管理员 | 平台管理员 · 作品评级 |
| `13700000000` | 普通用户 | 关注 / 收藏 / 意向演示 |

登录页验证码任意填写即可（验证期 Mock）。

### 8.3 常用命令

```powershell
# 启动 MySQL
powershell -File D:\DevTools\mysql\start-mysql.ps1

cd D:\开发\艺术家个人资产体系

# 开发
pnpm dev                    # http://localhost:3000

# 数据库（推荐一键）
pnpm db:setup

# 或分步
pnpm db:generate
pnpm exec prisma db push
pnpm db:seed

# 生产构建
pnpm build
pnpm start
```

> **注意**：开发时不要与 `pnpm build` 并行跑 `pnpm dev`，避免 `.next` 缓存冲突导致 500。若异常，删除 `.next` 后重启 dev。

---

## 9. 验收对照（当前版本）

| 项 | 状态 |
|----|------|
| Prisma + MySQL 数据模型 | ✅ |
| 6 模块艺术家档案页 | ✅ |
| 玛格丽特完整示范数据 | ✅ |
| 博物馆风格两层前台 | ✅ |
| 行业洞察 + 玛格丽特案例 | ✅ |
| 发现 / 作品 / 系列 / 时间轴 | ✅ |
| 关注、收藏、合作意向 | ✅ |
| 创作者后台 CRUD | ✅ |
| 管理端评级 | ✅ |
| 本地图片 + 无空占位 | ✅ |
| 链上 / NFT / 支付 | ⏸ 不在本阶段 |
| 后台 UI 博物馆化 | ⏸ 未做 |
| PWA / 小程序 | ⏸ 见决策 002，后续 |

---

## 10. 已知限制与后续建议

1. **玛格丽特图片**：首次 `download:magritte-images` 依赖外网拉取 JPG；失败时自动使用同目录 SVG 配图，不影响展示。
2. **演示艺术家**（林墨染等）使用通用 `placeholders/*.svg`，非真实作品图。
3. **AI 分析**：`lib/ai.ts` 依赖 `LLM_API_BASE` 等环境变量，未配置时相关 API 不可用。
4. **迁移**：若从 shadow DB 受限环境迁移，当前使用 `prisma db push` 而非 `migrate dev`。
5. **下一步（建议）**：预售咨询工作流、支持者可见内容、gallery 多图、SEO、后台 UI 统一。

---

## 11. 相关文档索引

| 文档 | 路径 |
|------|------|
| 文档总索引 | [docs/README.md](../README.md) |
| 产品愿景 | [product/overview.md](../product/overview.md) |
| 6 模块说明 | [product/mvp-modules.md](../product/mvp-modules.md) |
| 验证期范围 | [development/validation-mvp.md](../development/validation-mvp.md) |
| 开发环境 | [development/environment.md](../development/environment.md) |
| 技术架构 | [architecture/overview.md](../architecture/overview.md) |
| 本地存储 | [storage/local-storage.md](../storage/local-storage.md) |
| 架构决策 ADR | [decisions/](../decisions/) |

---

## 12. 变更摘要（相对初始规划）

| 变更 | 说明 |
|------|------|
| 示范案例 | 虚构「窗景与记忆」→ 玛格丽特博物馆真实内容 |
| 前台 UI | 通用 SaaS 风 → 博物馆双层机构风 |
| 图片策略 | 外链 Wikimedia → `public/images` 本地 + SVG 降级 |
| 行业洞察 | 新增 `/vision`，展示痛点与资产分类 |
| dev 构建 | 去掉 dev 默认 `--turbopack`，减少 Windows 缓存问题 |

---

*本文档随 MVP 交付快照编写；功能变更请同步更新本节或另建版本存档。*
