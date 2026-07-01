# 艺术家个人资产体系

验证期 MVP · 玛格丽特档案馆示范案例

## 快速启动

```powershell
# 需本地 MySQL，见 .env.example 配置 DATABASE_URL
copy .env.example .env.local
pnpm install
pnpm db:setup
pnpm dev
```

访问：**http://localhost:3000**

## 演示账号

| 手机号 | 角色 |
|--------|------|
| `13800000000` | 创作者 |
| `13900000000` | 管理员 |
| `13700000000` | 普通用户 |

登录验证码任意填写。

## 主要页面

- `/` 首页
- `/vision` 行业洞察
- `/discover` 作品与系列
- `/artists/[id]` 艺术家资产档案
