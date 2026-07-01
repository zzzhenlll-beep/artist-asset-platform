# 开发与运行环境

> 最后更新：2026-07-01 · Windows 10  
> 项目路径：**`D:\开发\艺术家个人资产体系`**

---

## 1. 环境清单

| 工具 | 版本 | 路径 |
|------|------|------|
| Node.js | v24.18.0 | `D:\DevTools\nodejs` |
| pnpm | 11.9.0 | `D:\DevTools\pnpm` |
| MySQL | 8.4.10 | `D:\DevTools\mysql` |
| Git | 2.54.0 | 系统 |

**注意**：C 盘空间紧张，新软件装 D 盘。

---

## 2. MySQL

| 项 | 值 |
|----|-----|
| 端口 | 3306 |
| 数据库 | `artist_assets`（新建，见 mysql-setup.md） |
| 用户 | `creator` / `creator_dev_pass` |
| 数据目录 | `D:\DevTools\mysql-data` |

```powershell
powershell -File D:\DevTools\mysql\start-mysql.ps1
```

```env
DATABASE_URL="mysql://creator:creator_dev_pass@127.0.0.1:3306/artist_assets"
```

---

## 3. 项目初始化

```powershell
powershell -File D:\DevTools\mysql\start-mysql.ps1
cd D:\开发\艺术家个人资产体系
copy .env.example .env.local
pnpm install
pnpm db:setup    # 玛格丽特配图 + prisma db push + seed
pnpm dev
```

交付存档详见 [../archive/mvp-delivery-2026-07.md](../archive/mvp-delivery-2026-07.md)。

---

## 4. 目录

```
D:\开发\艺术家个人资产体系\
├── app/
├── components/
├── docs/
├── lib/
├── public/images/        # 玛格丽特与通用 SVG/JPG 配图
├── storage/uploads/
│   ├── works/
│   ├── avatars/
│   ├── process/      # 过程资产（规划）
│   └── temp/
└── .env.local
```

---

## 5. 外部服务

| 服务 | 用途 | 验证期 |
|------|------|--------|
| 大模型 API | AI 叙事/标签 | 需 Key |
| 短信 | 登录 | MOCK_AUTH=true 可跳过 |

---

## 6. 自检

```powershell
node -v
pnpm -v
mysql -u creator -pcreator_dev_pass artist_assets -e "SELECT 1"
```
