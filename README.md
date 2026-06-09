# Portfolio 2026

这是一个“中文为主、英文为辅”的个人设计作品集壳子网站，使用 Next.js + TypeScript + Tailwind CSS 搭建。当前版本是单页滚动式个人设计档案：固定导航、封面、个人介绍、精选项目章节和联系方式。

## 核心编辑入口

```text
config/site.ts       网站文字、个人信息、导航、联系方式、社交链接
config/theme.ts      颜色、字体、圆角、背景网格、页面宽度等视觉变量
data/projects.ts     所有项目内容与图片路径
public/projects/     项目图片
public/profile/      个人照片占位
public/logo.svg      Logo
public/favicon.svg   Favicon
```

## 如何修改个人信息

打开 `config/site.ts`，常改字段包括：

```ts
authorName
authorNameEn
titleZh
titleEn
introZh
introEn
contact
socialLinks
about
footerTextZh
footerTextEn
```

当前已设置：

```text
中文名：陈子昂
英文名：Hayato
手机号：19357391198
WeChat：Chenziang21
邮箱：q2860646087@gmail.com
教育经历：浙江工商大学
```

## 如何修改颜色和圆角

打开 `config/theme.ts`，修改：

```ts
colors
borders.radius
borders.smallRadius
grid
layout
```

当前主要圆角为 `50px`，用于导航、按钮、图片区域和主要视觉容器。背景是米白色网格，网格颜色与间距也在 `theme.ts` 中配置。

## 如何修改字体

打开 `config/theme.ts`，修改：

```ts
fonts.chineseHeading
fonts.chinese
fonts.english
fonts.heading
fonts.body
fonts.weights
```

当前中文标题优先使用：

```text
ZCOOL KuaiLe / Noto Sans SC / Microsoft YaHei
```

如果需要 Google Fonts，可以在 `app/globals.css` 顶部加入 `@import`，再到 `config/theme.ts` 里调整字体名称。

## 如何替换个人照片

替换这个文件即可：

```text
public/profile/portrait.jpg
```

页面不会显示图片路径。替换同名图片后刷新网页即可。

## 如何替换项目图片

当前采用固定文件夹方式：

```text
public/projects/
  children-fashion/
    cover.jpg
    moodboard.jpg
    process-01.jpg
    process-02.jpg
    final-01.jpg
    final-02.jpg
  eyecare-ip/
    cover.jpg
    moodboard.jpg
    process-01.jpg
    process-02.jpg
    final-01.jpg
    final-02.jpg
  branding/
    cover.jpg
    moodboard.jpg
    process-01.jpg
    process-02.jpg
    final-01.jpg
    final-02.jpg
```

直接替换同名图片即可，不需要改页面代码。

## 如何新增项目

打开 `data/projects.ts`，复制一个项目对象到 `projects` 数组末尾，然后修改：

```ts
slug
order
title.zh / title.en
summary.zh / summary.en
year
category.zh / category.en
coverImage
detailImages
background
goals
process
applications
conclusion
```

`detailImages` 中可以用 `role` 标记图片类型：

```ts
role: "moodboard" | "process" | "final"
```

首页和详情页会自动读取项目数据，不需要手写新的项目页面。

## 如何替换 Logo 和 Favicon

Logo：

```text
public/logo.svg
```

Favicon：

```text
public/favicon.svg
```

如果想换路径，打开 `config/site.ts` 修改：

```ts
logo.image
favicon
```

## 本地运行

安装依赖：

```bash
npm install
```

启动预览：

```bash
npm run dev
```

打开：

```text
http://127.0.0.1:3020
```

如果 Node.js 安装在 `D:\Node.js`，可以直接使用：

```bat
scripts\install.bat
scripts\dev.bat
```

## 检查和构建

内容和图片路径检查：

```bash
npm run validate:content
```

类型检查：

```bash
npm run typecheck
```

生产构建：

```bash
npm run build
```

## 上传 GitHub

```bash
git init
git add .
git commit -m "Initial portfolio website"
git branch -M main
git remote add origin 你的 GitHub 仓库地址
git push -u origin main
```

## 部署 Vercel

1. 登录 Vercel。
2. 点击 New Project。
3. 选择 GitHub 中的作品集仓库。
4. Framework Preset 选择 Next.js。
5. Build Command 使用 `npm run build`。
6. Output Directory 保持默认。
7. 点击 Deploy。

之后每次推送到 GitHub，Vercel 会自动重新部署。

## 图片替换说明

当前项目采用严格的图片 slot 管理方式：页面不会自动扫描 `public/projects/` 文件夹，也不会把文件夹里的图片自动渲染出来。每一个图片位置都由 `data/projects.ts` 或 `config/site.ts` 中的固定路径控制。

### 图片文件夹结构

```text
public/assets/
  hero/
  about/
  icons/
  stickers/
  textures/
  characters/
  logo/

public/projects/
  children-fashion/
    cover/
    project-name/
    moodboard/
    pattern-design/
    application/
  eyecare-ip/
    cover/
    project-name/
    moodboard/
    ip-design/
    application/
  branding/
    cover/
    project-name/
    moodboard/
    visual-design/
    application/
```

每个空文件夹都保留了 `.gitkeep`，这样上传 GitHub 时文件夹不会丢失。

### 项目图片放置位置

Project 01 儿童服装图案设计：

```text
封面图：public/projects/children-fashion/cover/cover.png
H2 项目名称：public/projects/children-fashion/project-name/project-name.png
H2 灵感板：public/projects/children-fashion/moodboard/moodboard.png
H2 图案设计：public/projects/children-fashion/pattern-design/pattern-design.png
H2 产品应用：public/projects/children-fashion/application/application.png
```

Project 02 儿童护眼 IP 与文创设计：

```text
封面图：public/projects/eyecare-ip/cover/cover.png
H2 项目名称：public/projects/eyecare-ip/project-name/project-name.png
H2 灵感板：public/projects/eyecare-ip/moodboard/moodboard.png
H2 IP 与视觉设计：public/projects/eyecare-ip/ip-design/ip-design.png
H2 产品应用：public/projects/eyecare-ip/application/application.png
```

Project 03 品牌视觉识别设计：

```text
封面图：public/projects/branding/cover/cover.png
H2 项目名称：public/projects/branding/project-name/project-name.png
H2 灵感板：public/projects/branding/moodboard/moodboard.png
H2 视觉设计：public/projects/branding/visual-design/visual-design.png
H2 品牌应用：public/projects/branding/application/application.png
```

### 支持的网页图片格式

网页中建议使用：

```text
jpg
jpeg
png
webp
svg
gif
avif
```

组件中没有写死图片格式。如果你想把 `cover.png` 换成 `cover.webp`，只需要修改 `data/projects.ts` 中对应 slot 的 `src`。

### 如何替换图片

替换封面图：把图片放到对应项目的 `cover/` 文件夹，并在 `data/projects.ts` 中修改 `imageSlots.cover.src`。

替换 H2 项目名称图片：修改 `imageSlots.projectName.src`。

替换灵感板图片：修改 `imageSlots.moodboard.src`。

替换设计过程 / 设计展示图片：Project 01 修改 `imageSlots.design.src` 指向 `pattern-design/` 下的图片；Project 02 修改 `imageSlots.design.src` 指向 `ip-design/` 下的图片；Project 03 修改 `imageSlots.design.src` 指向 `visual-design/` 下的图片。

替换应用展示图片：修改 `imageSlots.application.src`。

如果某张图暂时没有准备好，可以把对应 `src` 留空，页面会显示占位文字，不会显示图片路径，也不会导致页面 500。

### 源文件说明

PSD、AI、CDR、EPS、PDF 等源文件不建议直接用于网页展示。这些文件可以作为本地源文件保存，但网页展示前请导出为：

```text
png
jpg
webp
svg
```

`.gitignore` 已忽略常见源文件格式，避免把大型设计源文件误传到 GitHub。

### 软件图标

软件图标路径在 `config/site.ts` 的 `about.softwareSkills` 中管理：

```text
public/assets/icons/illustrator.svg
public/assets/icons/photoshop.svg
public/assets/icons/procreate.svg
public/assets/icons/figma.svg
```

如果图标文件不存在，页面会显示统一的 Ai / Ps / Pr / Fg 占位文字。

### 个人照片

个人照片路径在 `config/site.ts` 的 `about.portrait.src` 中管理。当前建议路径：

```text
public/assets/about/profile.png
```

如果图片不存在，About 区域会继续显示 `YOUR PHOTO` / `照片占位`。

### Hero 角色或装饰图片

Hero 中的角色 / 贴纸位置在 `config/site.ts` 的 `cover.visual.characterSlots` 中管理。当前建议路径：

```text
public/assets/characters/hero-character-left.svg
public/assets/characters/hero-character-right.svg
```

不要在组件中新增角色位；只替换这些 slot 的 `src` 或把素材放到对应路径即可。

### 不要自动读取文件夹

本项目故意不实现自动扫描文件夹逻辑。所有图片出现在哪里，都由 `data/projects.ts` 或 `config/site.ts` 明确控制。这样后续新增图片不会破坏页面顺序，也不会让图片数量和布局失控。
