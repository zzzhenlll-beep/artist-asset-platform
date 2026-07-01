# 艺术家个人资产体系

艺术家**售前阶段**的价值发现与资产沉淀平台。当前处于 **验证期 MVP** 开发阶段。

> 核心：把艺术家在售前阶段的个人资产（硬资产 + 软资产）做成可见、可理解、可积累、可参与。  
> 后期方向：定制化 · 产品化预售（非标准化 NFT 发行）。

---

## 文档

| 文档 | 说明 |
|------|------|
| **[docs/archive/mvp-delivery-2026-07.md](./docs/archive/mvp-delivery-2026-07.md)** | **验证期 MVP 交付存档（当前版本）** |
| **[PROJECT_PLAN.md](./PROJECT_PLAN.md)** | 项目总规划 |
| [docs/README.md](./docs/README.md) | 开发文档索引 |
| [docs/product/overview.md](./docs/product/overview.md) | 产品愿景 |
| [docs/product/presale-playbook.md](./docs/product/presale-playbook.md) | 定制化产品化预售 |
| [docs/development/validation-mvp.md](./docs/development/validation-mvp.md) | 验证期范围 |
| [docs/development/environment.md](./docs/development/environment.md) | 开发环境 |

---

## 当前阶段

- **架构**：Next.js 全栈 + 本地 MySQL + 本地图片（`public/images` + `storage/uploads`）
- **示范案例**：玛格丽特档案馆（René Magritte · 内容来源 [玛格丽特博物馆](https://musee-magritte-museum.be/en)）
- **多端**：Mobile First 响应式 Web（博物馆风格两层前台）
- **聚焦**：艺术家资产档案（6 模块）+ 支持者关系 + 行业洞察
- **链上 / NFT**：不在本阶段

---

## 项目目录

```
艺术家个人资产体系/
├── app/                  # Next.js 页面
├── components/
├── docs/                 # 项目文档
├── lib/
├── public/images/        # 玛格丽特与通用本地配图
├── storage/uploads/      # 用户上传图片
├── PROJECT_PLAN.md
└── .env.example
```

---

## 启动开发

```powershell
# 1. 启动 MySQL（重启电脑后需执行）
powershell -File D:\DevTools\mysql\start-mysql.ps1

# 2. 进入项目
cd D:\开发\艺术家个人资产体系
copy .env.example .env.local

# 3. 安装依赖（首次）
pnpm install

# 4. 初始化数据库与配图（首次）
pnpm db:setup

# 5. 启动
pnpm dev
```

浏览器：**http://localhost:3000**

若 `pnpm dev` 报 500 或缓存异常，删除 `.next` 目录后重新执行 `pnpm dev`。

---

## 从旧项目迁移

本项目由 `D:\开发\数字创作者经济平台` 迁移而来，产品方向已调整为「艺术家个人资产体系」。旧目录可保留作参考，后续开发以本目录为准。
