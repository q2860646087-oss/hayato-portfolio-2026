# AGENTS.md

本文档为 Codex (Codex.ai/code) 提供本仓库的开发指导。

## 沟通规则

1. **与用户沟通时必须使用简体中文。**
2. 代码文件名、路径名、命令、变量名保持原文，不要翻译。
3. 代码注释默认保持项目现有语言，除非用户明确要求改成中文。
4. 修改任何文件前，必须先用中文说明修改计划和将要修改的文件。
5. 未经用户确认，不要直接大范围重构。
6. 不要删除现有图片资源。
7. 不要随意修改用户的简历、项目经历、作品集文案。
8. 优先保持当前 Hero 页的视觉风格、已有图层关系、z-index 和动画逻辑。
9. 涉及 `app/globals.css`、`app/page.tsx`、图片路径、z-index、动画时必须特别谨慎。
10. 每次修改后用中文总结：修改了哪些文件、每个文件改了什么、如何本地预览。
11. 本地预览命令：`npm run dev`，地址 http://127.0.0.1:3020。
12. 如果用户要求"先分析"，则只分析，不修改文件。

## 常用命令

```bash
npm install              # 安装依赖
npm run dev              # 启动开发服务器，地址 http://127.0.0.1:3020
npm run build            # 静态导出到 out/ 目录
npm run typecheck        # TypeScript 类型检查
npm run validate:content # 校验项目数据和图片路径
```

Windows 批处理备选：`scripts/install.bat`、`scripts/dev.bat`、`scripts/build.bat`

## 架构概览

这是一个 **Next.js 15 静态导出型作品集**（单页滚动 + 锚点导航），使用 React 19、TypeScript 和 Tailwind CSS。网站定位为"中文为主、英文为辅"的个人设计作品集壳子。

### 关键架构决策

- **静态导出**：`next.config.ts` 设置了 `output: "export"`（当 `GITHUB_ACTIONS=true` 时）、`trailingSlash: true`，以及可配置的 `basePath` 用于 GitHub Pages 部署。`lib/assetPath.ts` 中的 `assetPath()` 辅助函数为所有资源路径前置 base path。
- **单页滚动**：导航使用锚点链接（`#about`、`#work`、`#contact`）。Header 组件通过 `IntersectionObserver` 高亮当前可视区域。
- **CSS 集中管理**：`app/globals.css`（约 2400 行）包含所有自定义样式。Tailwind 仅用于 utility classes；设计系统通过 `config/theme.ts` 定义的 CSS 自定义属性实现。
- **无 Next.js Image 优化**：因静态导出需要，`images.unoptimized = true`。所有图片使用原生 `<img>` 标签配合 lazy loading（Hero 区域除外，使用 priority）。
- **无自动文件夹扫描**：图片路径在 `data/projects.ts` 和 `config/site.ts` 中显式声明。缺失的图片会显示占位文字而非导致页面报错。

### 数据流

```
config/site.ts          → 全站文字、个人信息、联系方式、社交链接、Hero 配置、About 信息
config/theme.ts         → CSS 自定义属性（颜色、字体、网格、布局）
data/projects.ts        → 项目定义（含图片 slot、章节、段落）
data/projectCanvas.ts   → 将 Project 转换为 FreeCanvas 页面（1440x3200 画布上的绝对定位元素）
lib/assetPath.ts        → 为 GitHub Pages 部署前置 basePath
```

### 页面结构

```
app/
  layout.tsx            → 根布局：Header + children + Footer，通过 <style> 注入主题 CSS
  page.tsx              → 首页：Hero → About → Projects → Contact（所有组件内联定义）
  globals.css           → 全部自定义样式（约 2400 行）
  projects/
    page.tsx            → 重定向到 /#work
    [slug]/page.tsx     → 动态项目详情页，使用 FreeCanvas 渲染
  about/page.tsx        → 关于页（重定向到 /#about）
  contact/page.tsx      → 联系页（重定向到 /#contact）
  not-found.tsx         → 404 页面
  error.tsx             → 客户端错误边界
  global-error.tsx      → 全局错误边界
```

### 组件库

| 组件 | 用途 |
|------|------|
| `Header` | 固定导航栏，IntersectionObserver 检测当前激活区块，移动端汉堡菜单 |
| `Footer` | 版权信息 + 社交链接 |
| `StyledHero` | Hero 区域，多层 PNG 合成、角落文字卡片、跑马灯横幅 |
| `HeroMarquee` | 无限循环滚动的装饰条（支持左右方向） |
| `HeroPixelBlast` | Hero 区域的像素风装饰层 |
| `CircularText` | 旋转圆形文字装饰 |
| `Reveal` | 基于 IntersectionObserver 的滚动渐入动画（支持延迟参数） |
| `ManagedImage` | 图片包裹组件，缺失图片时优雅降级为占位文字 |
| `ImageBlock` | 带标题的样式化图片框 |
| `ProjectCard` | 项目缩略图卡片 |
| `FreeCanvas` | 响应式缩放画布渲染器，用于项目详情页（将 1440x3200 画布缩放到视口） |

### 主题系统

所有视觉变量集中在 `config/theme.ts`。`createThemeCss()` 函数生成包含 CSS 自定义属性（`--color-primary`、`--radius`、`--grid-size` 等）的 `<style>` 块，注入到 `<head>` 中。Tailwind 配置将这些变量映射到 utility classes。

修改颜色、字体或布局只需编辑 `config/theme.ts` 中的 `themeConfig`，无需改动 CSS。

### 新增项目步骤

1. 在 `data/projects.ts` 的 `projects` 数组中添加条目
2. 将图片放入 `public/projects/<slug>/` 目录
3. 更新 `imageSlots`、`detailImages`、`workChapters` 和文本段落
4. 首页和项目详情页会自动识别新项目

## 编辑指南

- **站点文字 / 个人信息**：`config/site.ts` — 修改 `authorName`、`introZh`、`contact`、`socialLinks` 等
- **颜色 / 字体 / 布局**：`config/theme.ts` — 修改 `themeConfig` 对象
- **项目内容**：`data/projects.ts` — 修改 `projects` 数组
- **Hero 图片**：`config/site.ts` → `hero.*` 和 `cover.*`
- **个人照片**：`config/site.ts` → `about.portrait.src`
- **软件图标**：`config/site.ts` → `about.tools`
- **项目图片**：放入 `public/projects/<slug>/`，在 `data/projects.ts` 中更新路径

## 部署

- **Vercel**：关联 GitHub 仓库，Framework Preset 选 Next.js，Build Command 填 `npm run build`
- **GitHub Pages**：推送时设置 `GITHUB_ACTIONS=true` 环境变量触发静态导出，`basePath: "/hayato-portfolio-2026"`
- **手动部署**：`npm run build` → 部署 `out/` 目录
