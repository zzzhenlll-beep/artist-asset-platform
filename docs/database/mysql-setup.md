# 本地 MySQL 环境与运维

> 安装位置：**全部在 D 盘**  
> 版本：MySQL **8.4.10** Community（ZIP 解压方式）

---

## 1. 目录结构

```
D:\DevTools\mysql\           # 程序文件（bin、mysqld 等）
D:\DevTools\mysql-data\       # 数据文件（库表数据）
D:\DevTools\mysql\my.ini      # 配置文件
D:\DevTools\mysql\start-mysql.ps1
D:\DevTools\mysql\stop-mysql.ps1
```

---

## 2. 连接信息（开发环境）

| 项 | 值 |
|----|-----|
| 主机 | `127.0.0.1` |
| 端口 | `3306` |
| 数据库名 | `artist_assets` |
| 应用账号 | `creator` |
| 应用密码 | `creator_dev_pass` |
| root 密码 | `local_root_dev` |

**Prisma 连接串**（写入项目 `.env.local`）：

```env
DATABASE_URL="mysql://creator:creator_dev_pass@127.0.0.1:3306/artist_assets"
```

> 以上为本地开发默认密码，**勿用于生产**；上线前务必修改。

---

## 2. 新建数据库（首次）

```powershell
mysql -u root -plocal_root_dev -e "CREATE DATABASE IF NOT EXISTS artist_assets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -plocal_root_dev -e "GRANT ALL PRIVILEGES ON artist_assets.* TO 'creator'@'localhost'; FLUSH PRIVILEGES;"
```

---

## 3. 启动与停止

未安装 Windows 服务（需管理员权限），使用脚本启停进程：

```powershell
# 启动
powershell -ExecutionPolicy Bypass -File D:\DevTools\mysql\start-mysql.ps1

# 停止
powershell -ExecutionPolicy Bypass -File D:\DevTools\mysql\stop-mysql.ps1
```

验证：

```powershell
mysql -u creator -pcreator_dev_pass artist_assets -e "SELECT 1"
```

---

## 4. 常用命令

```powershell
# root 登录
mysql -u root -plocal_root_dev

# 查看库
mysql -u creator -pcreator_dev_pass -e "SHOW TABLES" artist_assets

# 备份（示例）
D:\DevTools\mysql\bin\mysqldump.exe -u creator -pcreator_dev_pass artist_assets > D:\DevTools\backup\artist_assets.sql
```

---

## 5. 与 Prisma 协作

```powershell
cd D:\开发\艺术家个人资产体系
pnpm prisma migrate dev    # 首次建表
pnpm prisma studio         # 可视化管理（可选）
```

`schema.prisma` 中：

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

---

## 6. 开机自启（可选）

若需开机自动启动，以**管理员**打开 PowerShell 执行一次：

```powershell
D:\DevTools\mysql\bin\mysqld.exe --install MySQL84 --defaults-file=D:\DevTools\mysql\my.ini
sc.exe config MySQL84 start= auto
net start MySQL84
```

---

## 7. 故障排查

| 现象 | 处理 |
|------|------|
| `Can't connect` | 先运行 `start-mysql.ps1`，等待 3–5 秒 |
| 端口 3306 占用 | `netstat -ano \| findstr 3306` 查占用进程 |
| 忘记 root 密码 | 参考 MySQL 8.4 文档 `--skip-grant-tables` 重置流程 |
| C 盘空间不足 | 确认 `datadir` 在 `D:/DevTools/mysql-data`（见 `my.ini`） |

---

## 8. 相关文档

- [环境与安装](../development/environment.md)
- [验证期数据模型](./validation-schema.md)
