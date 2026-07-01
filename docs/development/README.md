# 开发总览

## 1. 项目简介

**项目名称**：艺术家个人资产体系  

**当前阶段**：验证期 MVP — 艺术家售前阶段的价值发现与资产沉淀。

**核心文档**：[PROJECT_PLAN.md](../../PROJECT_PLAN.md)

---

## 2. 阶段划分

```
验证期 MVP (4–6 周)          成长期                    远期
─────────────────────────────────────────────────────────────
L1 档案 + L2 叙事 + L3 关系   L4 产品化预售              L5 完整交易
本地 MySQL + 本地存储         支付 / 预售 SKU 系统化      授权、分账等
```

| 阶段 | 文档 |
|------|------|
| **验证期** | [validation-mvp.md](./validation-mvp.md) |
| 产品化预售 | [presale-playbook.md](../product/presale-playbook.md) |
| 总规划 | [PROJECT_PLAN.md](../../PROJECT_PLAN.md) |

---

## 3. 技术栈

- Next.js 15 全栈 + TypeScript + Tailwind CSS 4
- 本地 MySQL 8.4（库名 `artist_assets`）+ Prisma
- 本地 `storage/uploads`
- 大模型 API（叙事/标签辅助）

---

## 4. 项目路径

```
D:\开发\艺术家个人资产体系\
```

启动：

```powershell
cd D:\开发\艺术家个人资产体系
pnpm dev
```

环境详见 [environment.md](./environment.md)。

---

## 5. 文档索引

见 [docs/README.md](../README.md)。
