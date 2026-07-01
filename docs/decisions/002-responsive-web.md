# ADR-002：PC 与手机采用 Mobile First 响应式 Web

- **状态**：已接受  
- **日期**：2026-06-26  
- **阶段**：验证期 MVP  

---

## 背景

平台需在 PC 与手机上均可使用。验证期资源有限，需选择多端策略。

可选方案：

1. **响应式 Web**（一套代码，Tailwind 断点）  
2. 独立手机站（m.example.com）  
3. 微信小程序  
4. React Native / Flutter 原生 App  
5. 响应式 Web + PWA  

---

## 决策

**采用方案 5：Mobile First 响应式 Web + 可选 PWA。**

- 不开发小程序与原生 App（验证期）  
- 同一 URL、同一 Next.js 代码库  
- 布局：手机默认单列 + 底部导航；PC 使用 `md:` / `lg:` 扩展多列  

---

## 理由

| 方案 | 评估 |
|------|------|
| 响应式 Web | 一套代码覆盖 PC/手机，创作者可用手机上传，成本最低 |
| 独立 m 站 | 双倍维护，SEO 分裂，拒绝 |
| 小程序 | 需双端、审核、微信生态绑定；验证期 unnecessary |
| 原生 App | 周期长，拒绝 |
| PWA | 增量成本低，改善手机「像 App」的体验 |

目标用户（创作者、藏家）验证期通过链接分享即可访问，H5 足够。

---

## 实现要点

### 布局

```tsx
// 示例：手机底栏仅 sm 以下显示
<nav className="fixed bottom-0 inset-x-0 md:hidden">...</nav>
<header className="hidden md:block">...</header>
```

### 上传

- 手机：`<input accept="image/*" capture="environment" />`  
- PC：拖拽区 + 点击选择  

### 触控

- 按钮最小高度 44px  
- 避免 hover-only 交互  

### PWA

- `public/manifest.json`  
- `icons/` 192、512  
- 验证期不实现 Service Worker 离线  

### 测试设备

- iOS Safari（最新）  
- Android Chrome（最新）  
- PC Chrome / Edge  

---

## 后果

### 正面

- 开发效率最高  
- 赛事 Demo 可同时演示手机与 PC  
- 微信内打开 H5 无需额外开发  

### 负面

- 无法使用小程序分享、支付、订阅消息（后期可加）  
- 极致原生体验（手势、推送）需 App 或小程序  
- 弱网离线不可用（未做 SW 缓存）  

---

## 何时复审

- 验证期用户强烈需求微信小程序  
- 或需应用商店分发、推送通知  

复审选项：保留 Web 为主，增量开发 uni-app/Taro 小程序壳调用同一 API。

---

## 相关文档

- [development/validation-mvp.md](../development/validation-mvp.md) §4  
- [architecture/overview.md](../architecture/overview.md) §3  
