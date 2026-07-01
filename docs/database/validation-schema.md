# 验证期数据模型

对应 Prisma schema 设计说明。完整 ER 见 [PROJECT_PLAN.md](../../PROJECT_PLAN.md) §9（完整第一期）。

---

## 1. ER 关系

```
users 1──1 creators
users 1──N favorites
users 1──N collaboration_intents

creators 1──N works

works 1──N work_media
works 1──N favorites
works 0──1 ratings (验证期每作品至多一条正式评级)
works 1──N collaboration_intents
```

---

## 2. 表定义

### users

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | PK |
| phone | String | 唯一，登录标识 |
| nickname | String? | 显示名 |
| avatar_url | String? | 头像 URL（`/api/media/avatars/...`） |
| role | Enum | `USER` \| `CREATOR` \| `ADMIN` |
| created_at | DateTime | |
| updated_at | DateTime | |

> 验证期简化：Creator 通过 `role=CREATOR` + `creators` 扩展表表示，不做多角色 JSON。

---

### creators

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | PK |
| user_id | UUID | FK → users，唯一 |
| bio | Text? | 简介 |
| tags | Json | 领域标签数组，如 `["插画","国潮"]` |
| open_collaboration | Boolean | 默认 true |
| created_at | DateTime | |

---

### works

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | PK |
| creator_id | UUID | FK → creators |
| title | String | |
| description | Text? | |
| status | Enum | `DRAFT` \| `PUBLISHED` \| `ARCHIVED` |
| open_collaboration | Boolean | 是否开放合作咨询 |
| view_count | Int | 默认 0 |
| favorite_count | Int | 冗余计数，可选 |
| ai_meta | Json? | `{ title, description, tags, model, generated_at }` |
| metadata_hash | String? | **预留**第三期上链 |
| published_at | DateTime? | |
| created_at | DateTime | |
| updated_at | DateTime | |

---

### work_media

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | PK |
| work_id | UUID | FK → works |
| url | String | 媒体访问路径，如 `/api/media/works/...` |
| sort_order | Int | 默认 0，验证期单图为主 |
| created_at | DateTime | |

---

### ratings

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | PK |
| work_id | UUID | FK → works，唯一（验证期一作品一条） |
| admin_id | UUID | FK → users |
| score | Decimal(2,1) | 1.0 – 5.0 |
| comment | Text | 公开短评 |
| created_at | DateTime | |
| updated_at | DateTime | |

---

### favorites

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | PK |
| user_id | UUID | FK → users |
| work_id | UUID | FK → works |
| created_at | DateTime | |

**唯一约束**：`(user_id, work_id)`

---

### collaboration_intents

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | PK |
| user_id | UUID | FK → users |
| work_id | UUID? | FK → works，可选 |
| purpose | Text | 用途/需求说明 |
| contact_name | String | |
| contact_info | String | 电话或微信 |
| budget_range | String? | 枚举或自由文本 |
| message | Text? | 完整陈述（可含 AI 草稿） |
| status | Enum | `PENDING` \| `CONTACTED` \| `CLOSED` |
| created_at | DateTime | |
| updated_at | DateTime | |

---

## 3. Prisma Schema 参考（MySQL）

数据库：**本地 MySQL 8.4** · 连接见 [mysql-setup.md](./mysql-setup.md)

实现时写入 `prisma/schema.prisma`：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  USER
  CREATOR
  ADMIN
}

enum WorkStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum IntentStatus {
  PENDING
  CONTACTED
  CLOSED
}

model User {
  id        String   @id @default(uuid()) @db.Char(36)
  phone     String   @unique @db.VarChar(20)
  nickname  String?  @db.VarChar(64)
  avatarUrl String?  @map("avatar_url") @db.VarChar(512)
  role      UserRole @default(USER)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  creator   Creator?
  favorites Favorite[]
  intents   CollaborationIntent[]

  @@map("users")
}

model Creator {
  id                String   @id @default(uuid()) @db.Char(36)
  userId            String   @unique @map("user_id") @db.Char(36)
  bio               String?  @db.Text
  tags              Json?
  openCollaboration Boolean  @default(true) @map("open_collaboration")
  createdAt         DateTime @default(now()) @map("created_at")

  user  User   @relation(fields: [userId], references: [id])
  works Work[]

  @@map("creators")
}

model Work {
  id                String     @id @default(uuid()) @db.Char(36)
  creatorId         String     @map("creator_id") @db.Char(36)
  title             String     @db.VarChar(200)
  description       String?    @db.Text
  status            WorkStatus @default(DRAFT)
  openCollaboration Boolean    @default(true) @map("open_collaboration")
  viewCount         Int        @default(0) @map("view_count")
  favoriteCount     Int        @default(0) @map("favorite_count")
  aiMeta            Json?      @map("ai_meta")
  metadataHash      String?    @map("metadata_hash") @db.VarChar(64)
  publishedAt       DateTime?  @map("published_at")
  createdAt         DateTime   @default(now()) @map("created_at")
  updatedAt         DateTime   @updatedAt @map("updated_at")

  creator   Creator              @relation(fields: [creatorId], references: [id])
  media     WorkMedia[]
  rating    Rating?
  favorites Favorite[]
  intents   CollaborationIntent[]

  @@index([status, publishedAt])
  @@index([creatorId])
  @@map("works")
}

model WorkMedia {
  id        String   @id @default(uuid()) @db.Char(36)
  workId    String   @map("work_id") @db.Char(36)
  url       String   @db.VarChar(1024)
  sortOrder Int      @default(0) @map("sort_order")
  createdAt DateTime @default(now()) @map("created_at")

  work Work @relation(fields: [workId], references: [id], onDelete: Cascade)

  @@map("work_media")
}

model Rating {
  id        String   @id @default(uuid()) @db.Char(36)
  workId    String   @unique @map("work_id") @db.Char(36)
  adminId   String   @map("admin_id") @db.Char(36)
  score     Decimal  @db.Decimal(2, 1)
  comment   String   @db.Text
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  work Work @relation(fields: [workId], references: [id])

  @@map("ratings")
}

model Favorite {
  id        String   @id @default(uuid()) @db.Char(36)
  userId    String   @map("user_id") @db.Char(36)
  workId    String   @map("work_id") @db.Char(36)
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])
  work Work @relation(fields: [workId], references: [id])

  @@unique([userId, workId])
  @@map("favorites")
}

model CollaborationIntent {
  id          String       @id @default(uuid()) @db.Char(36)
  userId      String       @map("user_id") @db.Char(36)
  workId      String?      @map("work_id") @db.Char(36)
  purpose     String       @db.Text
  contactName String       @map("contact_name") @db.VarChar(64)
  contactInfo String       @map("contact_info") @db.VarChar(128)
  budgetRange String?      @map("budget_range") @db.VarChar(64)
  message     String?      @db.Text
  status      IntentStatus @default(PENDING)
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  user User  @relation(fields: [userId], references: [id])
  work Work? @relation(fields: [workId], references: [id])

  @@index([status, createdAt])
  @@map("collaboration_intents")
}
```

---

## 4. 索引说明

Prisma `@@index` 已在模型中声明；也可在 MySQL 中手动核对：

```sql
SHOW INDEX FROM works;
SHOW INDEX FROM collaboration_intents;
```

---

## 5. 完整第一期将新增的表（预览）

不在验证期创建：

- `comments`  
- `follows`  
- `notifications`  
- `collaboration_demands`  
- `ai_suggestions`  
- 向量检索字段（完整第一期可用 MySQL 8 向量扩展或独立检索服务）  

见 [architecture/evolution.md](../architecture/evolution.md)。
