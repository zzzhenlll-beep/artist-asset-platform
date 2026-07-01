# 发布到 GitHub（公开仓库）

> 适用于尚未注册 GitHub 账号的首次发布。按顺序完成即可得到公开访问地址。

---

## 第一步：注册 GitHub 账号（约 5 分钟）

1. 打开 **[https://github.com/signup](https://github.com/signup)**
2. 填写邮箱、密码、用户名（Username，例如 `your-name`，**全局唯一**）
3. 完成邮箱验证

记下你的 **用户名**，公开地址将是：

```text
https://github.com/<你的用户名>/artist-asset-platform
```

---

## 第二步：在 GitHub 创建空仓库

1. 登录后点击右上角 **+** → **New repository**
2. 填写：
   - **Repository name**：`artist-asset-platform`（建议与项目一致）
   - **Description**：艺术家个人资产体系 · 验证期 MVP
   - 选择 **Public**（公开）
   - **不要**勾选 “Add a README file”（本地已有代码）
3. 点击 **Create repository**

创建完成后，页面会显示推送命令，可先留着。

---

## 第三步：在本机推送代码

在项目根目录打开 PowerShell：

```powershell
cd D:\开发\艺术家个人资产体系

# 将 <你的用户名> 替换为 GitHub 用户名
$GITHUB_USER = "你的用户名"

git remote add origin "https://github.com/$GITHUB_USER/artist-asset-platform.git"
git branch -M main
git push -u origin main
```

首次 `git push` 会弹出浏览器或窗口要求登录 GitHub：

- 推荐使用 **Git Credential Manager** 浏览器登录
- 若提示 Personal Access Token，在 GitHub → Settings → Developer settings → Personal access tokens 创建（勾选 `repo` 权限）

---

## 第四步：确认公开可访问

推送成功后，在浏览器打开：

```text
https://github.com/<你的用户名>/artist-asset-platform
```

任何人可见代码与文档；**`.env.local` 不会上传**（已在 `.gitignore` 中排除）。

---

## 已包含 / 未包含的文件

| 包含 | 不包含 |
|------|--------|
| 全部源码、`docs/`、玛格丽特配图 `public/images/` | `node_modules/`、`.next/` |
| `prisma/`、`scripts/`、`.env.example` | `.env.local`（密钥） |
| 项目文档存档 | 本地 `storage/uploads/` 上传文件 |
| | 参赛用 `.pptx` / `.xlsx` / `.docx` |

---

## 常见问题

### push 被拒绝（rejected）

远程若误建了 README，先执行：

```powershell
git pull origin main --rebase --allow-unrelated-histories
git push -u origin main
```

### 想改仓库名

GitHub 仓库 Settings → General → Repository name 修改后，更新 remote：

```powershell
git remote set-url origin https://github.com/<用户名>/<新仓库名>.git
```

### 克隆到新机器

```powershell
git clone https://github.com/<用户名>/artist-asset-platform.git
cd artist-asset-platform
copy .env.example .env.local
pnpm install
pnpm db:setup
pnpm dev
```

---

## 一键脚本（注册并建库后）

**方式 A（推荐，不受 PowerShell 脚本策略限制）：**

```cmd
scripts\publish-github.cmd zzzhenlll-beep
```

**方式 B（PowerShell 脚本）：**

```powershell
powershell -ExecutionPolicy Bypass -File scripts\publish-github.ps1 -GitHubUser "你的用户名"
```
