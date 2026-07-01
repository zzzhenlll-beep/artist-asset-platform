# ADR-001：验证期采用 Next.js 全栈单体架构

- **状态**：已接受  
- **日期**：2026-06-26  
- **阶段**：验证期 MVP  

---

## 背景

项目处于 OPC 初创验证阶段，需在 4–6 周内交付可演示、可内测的 MVP，兼容 PC 与手机。团队规模小，需控制运维复杂度。

可选方案：

1. Next.js 全栈（API Routes + 页面一体）  
2. Next.js 前端 + NestJS 独立后端  
3. Next.js 前端 + Supabase BaaS 为主  
4. 微服务架构  

---

## 决策

**验证期采用方案 1：Next.js 全栈单体。**

数据库使用 MySQL + Prisma；**图片存本地 `storage/uploads`**；AI 通过服务端调用大模型 API。

---

## 理由

| 因素 | 说明 |
|------|------|
| 交付速度 | 单仓库、单部署，无跨服务联调 |
| 团队规模 | OPC 一人或极小团队可维护 |
| 流量预期 | 验证期内测，无高并发需求 |
| AI 集成 | Server Actions / API Routes 足够同步调用 |
| 后期演进 | 业务验证后可拆 NestJS，前端可复用 |

---

## 后果

### 正面

- 开发、部署、调试路径最短  
- TypeScript 全栈类型一致  
- Vercel 一键 Staging  

### 负面

- API 与页面耦合在同一进程，后期需 discipline 避免 `app/` 臃肿  
- 长时间 AI 任务可能阻塞请求（验证期可接受；完整版引入队列）  
- 不适合验证期结束后立即支撑极高并发（届时再拆）  

---

## 何时复审

- 验证期结束，进入完整第一期前  
- 或出现：API 路由 > 40 个、AI 模块 > 2000 行、需独立扩缩容  

复审选项：拆 NestJS 模块化单体，Next.js 保留为前端 + BFF。

---

## 相关文档

- [architecture/overview.md](../architecture/overview.md)  
- [decisions/002-responsive-web.md](./002-responsive-web.md)  
- [PROJECT_PLAN.md](../../PROJECT_PLAN.md) §8  
