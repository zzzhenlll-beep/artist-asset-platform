# 架构演进路径

从验证期 MVP 到完整平台的分阶段升级说明。

---

## 演进总览

```mermaid
flowchart LR
  V[验证期 MVP<br/>4-6周] --> P1[完整第一期<br/>10-12周]
  P1 --> P2[第二期<br/>工厂协作]
  P2 --> P3[第三期<br/>区块链]
  P3 --> P4[第四期<br/>规模化]
```

---

## 阶段对比

| 维度 | 验证期 | 完整第一期 | 第二～四期 |
|------|--------|------------|------------|
| **文档** | `docs/development/validation-mvp.md` | `PROJECT_PLAN.md` | PROJECT_PLAN §3 |
| **后端** | Next.js API Routes | 可选拆 NestJS 模块化单体 | 微服务按需 |
| **数据表** | 6 张 | 10+ 张 | 持续扩展 |
| **AI** | 1–2 项 | 7+ 项 | AIGC 深度集成 |
| **向量** | 无 | pgvector | 搜索服务 |
| **缓存/队列** | 无 | Redis 可选 | 消息队列 |
| **互动** | 收藏 | + 关注、评论、通知 | 社区增强 |
| **评级** | 单一总分 | 多维 + AI 草稿 | 链上存证 |
| **合作** | 表单 | AI 解析 + 匹配 | 工作流 + 订单 |
| **区块链** | 无 | 无 | 第三期核心 |
| **多端** | 响应式 Web | + 小程序可选 | 全渠道 |

---

## 验证期 → 完整第一期：迁移要点

### 可保留（无需重写）

- Next.js 前端页面与组件（增量扩展）  
- Prisma + PostgreSQL（迁移追加表）  
- OSS 存储与 URL 结构  
- 用户与创作者基础数据  

### 需扩展

| 项 | 动作 |
|----|------|
| 数据模型 | 新增 comments、follows、notifications、demands、ai_suggestions 等 |
| AI | 独立 `packages/ai` 或 NestJS `ai` 模块；引入 pgvector |
| 后端 | 若 Next.js API 变复杂，拆 NestJS，Next.js 仅做 BFF/前端 |
| 管理后台 | 扩展专家评级、AI 日志、匹配管理 |
| 部署 | 加 Redis、异步任务（BullMQ） |

### 数据库预留（验证期即可加 nullable 字段）

`works` 表：

```prisma
metadataHash  String?  @map("metadata_hash")  // 第三期上链
embedding     Unsupported("vector")?           // 第一期 matching 时再加
```

---

## 决策门槛：何时进入完整第一期

满足 [acceptance.md](../development/acceptance.md) 量化指标，且复盘决策为「进入完整第一期」后：

1. 更新 `docs/development/README.md` 当前阶段说明  
2. 按 PROJECT_PLAN 调整里程碑  
3. 评估是否拆 NestJS（建议：日活/接口 > 30 或 AI 逻辑 > 2000 行时再拆）  

---

## 第三期区块链接入点

验证期与完整第一期均**不实现**链上逻辑，仅在数据层预留：

- `works.metadata_hash`
- `ratings.attestation_hash`（完整第一期加表时预留）
- 与中技链对接放在独立 `blockchain/` 适配模块（第三期）
