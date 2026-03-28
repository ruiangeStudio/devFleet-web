# DevFleet Site - Long-term Memory

## Project Overview
- **Framework**: Vue 3 + Vite + TypeScript（无路由，单页落地页）
- **路径**: `d:\claw\site`
- **组件结构**: NavBar / HeroSection / FeaturesSection / ScreenshotsSection / CtaSection / FooterSection

## 多语言 (i18n) — 2026-03-28 实现（三语言：中/英/日）
- 使用 **vue-i18n v10**（Composition API 模式，`legacy: false`）
- 语言文件：`src/i18n/zh.ts`、`src/i18n/en.ts`、`src/i18n/ja.ts`、`src/i18n/ko.ts`、`src/i18n/de.ts`
- i18n 入口：`src/i18n/index.ts`（含 localStorage 持久化，key: `devfleet-locale`）
- 语言切换 composable：`src/composables/useLocale.ts`（三语言循环 zh→en→ja→zh）
- NavBar 右侧有地球仪图标语言下拉菜单，显示 `中`/`EN`/`JA`，点击展开选项列表，当前语言有勾选标记
- `v-click-outside` 全局指令注册在 `main.ts`，点击菜单外自动关闭
- FeaturesSection 用 `tm()` 读取数组类型翻译
- ScreenshotsSection：tabs 文本走翻译，图片路径单独维护（`imgMap` 数组）
- 默认语言：中文（`zh`）

## 图片资源
- 所有截图位于 `/public/img/` 目录
- 主截图: `ScreenShot_2026-03-27_222336_861.png`
