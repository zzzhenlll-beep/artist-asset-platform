# 本地图片存储

> 验证期：**所有图片存本机 D 盘**，不使用 OSS / 云存储。

---

## 1. 存储位置

```
D:\开发\艺术家个人资产体系\
└── storage/
    └── uploads/
        ├── works/          # 作品图片
        ├── avatars/        # 艺术家头像
        ├── process/        # 过程资产（草图、手稿等）
        └── temp/           # 上传中间文件
```

| 环境变量 | 说明 | 默认值 |
|----------|------|--------|
| `STORAGE_TYPE` | 固定 `local` | `local` |
| `STORAGE_ROOT` | 绝对路径根目录 | `D:\开发\艺术家个人资产体系\storage\uploads` |
| `STORAGE_PUBLIC_BASE` | 浏览器访问前缀 | `http://localhost:3000/api/media` |

---

## 2. 访问方式

| 操作 | 接口（规划） |
|------|----------------|
| 上传 | `POST /api/v1/media/upload` |
| 访问 | `GET /api/media/{category}/{filename}` |

---

## 3. 文件规则

| 项 | 限制 |
|----|------|
| 格式 | `image/jpeg`, `image/png`, `image/webp` |
| 单文件大小 | ≤ 10 MB |
| 作品 | `works/年/月/uuid.ext` |
| 过程资产 | `process/{artistId}/...` |
| 头像 | `avatars/{artistId}.webp` |

---

## 4. 相关文档

- [environment.md](../development/environment.md)
- [validation-mvp.md](../development/validation-mvp.md)
