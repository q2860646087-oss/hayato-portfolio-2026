import { assetPath } from "@/lib/assetPath";

export type BilingualText = {
  zh: string;
  en: string;
};

export type ProjectImage = {
  src: string;
  alt: string;
  captionZh: string;
  captionEn: string;
  role?: "moodboard" | "process" | "final";
};

export type ProjectImageSlot = {
  label: string;
  src?: string;
  alt: string;
  placeholder: string;
};

export type ProjectImageSlots = {
  cover: ProjectImageSlot;
  projectName: ProjectImageSlot;
  moodboard: ProjectImageSlot;
  design: ProjectImageSlot;
  application: ProjectImageSlot;
};

export type ProjectSection = {
  titleZh: string;
  titleEn: string;
  items: string[];
};

export type ProjectInfoPoint = {
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  emphasis?: boolean;
};

export type ProjectWorkChapter = {
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  imageSlot: keyof ProjectImageSlots;
  placeholderEn: string;
};

export type Project = {
  slug: string;
  order: string;
  title: BilingualText;
  summary: BilingualText;
  year: string;
  category: BilingualText;
  tools: string[];
  keywords: string[];
  imageSlots: ProjectImageSlots;
  coverImage: string;
  detailImages: ProjectImage[];
  infoPoints: ProjectInfoPoint[];
  workChapters: ProjectWorkChapter[];
  brief: ProjectSection;
  designIdea: ProjectSection;
  projectType: ProjectSection;
  background: ProjectSection;
  goals: ProjectSection;
  process: ProjectSection;
  applications: ProjectSection;
  conclusion: ProjectSection;
};

const projectImageBase = assetPath("/projects");

export const projects: Project[] = [
  {
    slug: "childrens-apparel-pattern-design",
    order: "Project 01",
    title: {
      zh: "儿童服装图案设计",
      en: "Children's Apparel Pattern Design",
    },
    summary: {
      zh: "围绕儿童服饰场景建立图案系统，适用于面料、包装和延展物料。",
      en: "A flexible pattern system for children's apparel, textiles, and related brand touchpoints.",
    },
    year: "2026",
    category: {
      zh: "图案设计 / 面料插画",
      en: "Pattern Design / Textile Illustration",
    },
    tools: ["Illustrator", "Photoshop", "Procreate"],
    keywords: ["儿童友好", "图案系统", "面料延展"],
    imageSlots: {
      cover: {
        label: "PROJECT VISUAL",
        src: `${projectImageBase}/children-fashion/cover.jpg`,
        alt: "儿童服装图案设计封面图",
        placeholder: "作品内容整理中",
      },
      projectName: {
        label: "PROJECT NAME",
        src: `${projectImageBase}/children-fashion/cover.jpg`,
        alt: "儿童服装图案设计项目名称图片",
        placeholder: "作品内容整理中",
      },
      moodboard: {
        label: "MOODBOARD",
        src: `${projectImageBase}/children-fashion/moodboard.jpg`,
        alt: "儿童服装图案设计灵感板图片",
        placeholder: "作品内容整理中",
      },
      design: {
        label: "PATTERN DESIGN",
        src: `${projectImageBase}/children-fashion/process-01.jpg`,
        alt: "儿童服装图案设计图片",
        placeholder: "作品内容整理中",
      },
      application: {
        label: "PRODUCT APPLICATION",
        src: `${projectImageBase}/children-fashion/final-01.jpg`,
        alt: "儿童服装图案设计产品应用图片",
        placeholder: "作品内容整理中",
      },
    },
    coverImage: `${projectImageBase}/children-fashion/cover.jpg`,
    detailImages: [
      {
        src: `${projectImageBase}/children-fashion/moodboard.jpg`,
        alt: "儿童服饰图案设计灵感板",
        captionZh: "灵感板",
        captionEn: "Moodboard",
        role: "moodboard",
      },
      {
        src: `${projectImageBase}/children-fashion/process-01.jpg`,
        alt: "儿童服饰图案设计过程一",
        captionZh: "设计过程 01",
        captionEn: "Process 01",
        role: "process",
      },
      {
        src: `${projectImageBase}/children-fashion/process-02.jpg`,
        alt: "儿童服饰图案设计过程二",
        captionZh: "设计过程 02",
        captionEn: "Process 02",
        role: "process",
      },
      {
        src: `${projectImageBase}/children-fashion/final-01.jpg`,
        alt: "儿童服饰图案设计最终展示一",
        captionZh: "关键视觉 01",
        captionEn: "Final 01",
        role: "final",
      },
      {
        src: `${projectImageBase}/children-fashion/final-02.jpg`,
        alt: "儿童服饰图案设计最终展示二",
        captionZh: "应用展示 02",
        captionEn: "Final 02",
        role: "final",
      },
    ],
    infoPoints: [
      {
        titleZh: "项目背景",
        titleEn: "Background",
        descriptionZh: "围绕儿童服装图案建立可延展的视觉系统，让系列产品在日常穿着场景中保持统一而有趣的识别。",
        descriptionEn: "A pattern system for children's apparel that supports consistent and playful product expression.",
      },
      {
        titleZh: "设计方向",
        titleEn: "Design Direction",
        descriptionZh: "整体主题偏向柔和、活泼、亲近自然，以明亮色彩、童趣角色和重复纹样回应儿童审美。",
        descriptionEn: "Soft, playful, nature-friendly visuals with bright colors, character elements, and repeat patterns.",
        emphasis: true,
      },
      {
        titleZh: "产品类别",
        titleEn: "Product Category",
        descriptionZh: "适用于袜子、内裤、家居服、T 恤、配饰、包装、吊牌及相关延展物料。",
        descriptionEn: "Socks, underwear, loungewear, T-shirts, accessories, packaging, tags, and related touchpoints.",
      },
    ],
    workChapters: [
      {
        titleZh: "灵感板",
        titleEn: "Moodboard",
        descriptionZh: "品牌调研、竞品参考、色彩趋势、材质参考、图案方向与儿童审美趋势的视觉整理。",
        descriptionEn: "Brand research, competitor references, color trends, material cues, pattern directions, and children's visual preferences.",
        imageSlot: "moodboard",
        placeholderEn: "Research Notes",
      },
      {
        titleZh: "图案设计",
        titleEn: "Pattern Design",
        descriptionZh: "角色设计、图形元素、花型设计、重复纹样、定位图案与配色探索。",
        descriptionEn: "Character design, graphic elements, floral systems, repeat patterns, placement graphics, and color exploration.",
        imageSlot: "design",
        placeholderEn: "Pattern System",
      },
      {
        titleZh: "产品应用",
        titleEn: "Product Application",
        descriptionZh: "袜子、内裤、服装、包装、吊牌与场景效果图的应用展示。",
        descriptionEn: "Applications across socks, underwear, apparel, packaging, hang tags, and scene mockups.",
        imageSlot: "application",
        placeholderEn: "Product Application",
      },
    ],
    background: {
      titleZh: "设计背景",
      titleEn: "Background",
      items: ["项目围绕儿童服饰图案的系列化应用展开，重点观察日常穿着、面料延展与包装物料中的统一识别需求。"],
    },
    brief: {
      titleZh: "项目简述",
      titleEn: "Brief",
      items: ["围绕儿童服饰建立可持续延展的图案系统，让图形语言适配服装、包装与传播物料。"],
    },
    designIdea: {
      titleZh: "设计想法",
      titleEn: "Design Idea",
      items: ["以童趣观察、柔和色彩和重复图案为线索，形成亲切且具有系列感的视觉语言。"],
    },
    projectType: {
      titleZh: "项目类型",
      titleEn: "Project Type",
      items: ["儿童产品视觉 / 图案设计 / 面料插画"],
    },
    goals: {
      titleZh: "设计目标",
      titleEn: "Goals",
      items: ["目标一：建立清晰的图案风格。", "目标二：保证后续系列可延展。"],
    },
    process: {
      titleZh: "设计过程",
      titleEn: "Process",
      items: ["收集灵感与色彩参考。", "绘制图案元素并测试重复方式。", "整理可用于服装和包装的视觉系统。"],
    },
    applications: {
      titleZh: "应用展示",
      titleEn: "Applications",
      items: ["服装面料应用。", "吊牌、包装、周边物料应用。"],
    },
    conclusion: {
      titleZh: "项目总结",
      titleEn: "Summary",
      items: ["本项目完成了从图案语言、重复纹样到产品应用的基础整理，为后续服装与包装系列延展提供视觉依据。"],
    },
  },
  {
    slug: "children-eye-care-ip-cultural-creative-design",
    order: "Project 02",
    title: {
      zh: "儿童护眼 IP 与文创设计",
      en: "Children Eye Care IP & Cultural Creative Design",
    },
    summary: {
      zh: "以儿童护眼传播为主题，建立角色 IP、视觉语言与文创应用方向。",
      en: "A child-friendly IP and cultural creative system for eye care communication.",
    },
    year: "2026",
    category: {
      zh: "IP 设计 / 文创设计",
      en: "IP Design / Cultural Creative",
    },
    tools: ["Illustrator", "Photoshop", "Procreate"],
    keywords: ["护眼科普", "角色 IP", "文创延展"],
    imageSlots: {
      cover: {
        label: "PROJECT VISUAL",
        src: `${projectImageBase}/eyecare-ip/cover.jpg`,
        alt: "儿童护眼 IP 与文创设计封面图",
        placeholder: "作品内容整理中",
      },
      projectName: {
        label: "PROJECT NAME",
        src: `${projectImageBase}/eyecare-ip/cover.jpg`,
        alt: "儿童护眼 IP 与文创设计项目名称图片",
        placeholder: "作品内容整理中",
      },
      moodboard: {
        label: "MOODBOARD",
        src: `${projectImageBase}/eyecare-ip/moodboard.jpg`,
        alt: "儿童护眼 IP 与文创设计灵感板图片",
        placeholder: "作品内容整理中",
      },
      design: {
        label: "IP & VISUAL DESIGN",
        src: `${projectImageBase}/eyecare-ip/process-01.jpg`,
        alt: "儿童护眼 IP 与视觉设计图片",
        placeholder: "作品内容整理中",
      },
      application: {
        label: "PRODUCT APPLICATION",
        src: `${projectImageBase}/eyecare-ip/final-01.jpg`,
        alt: "儿童护眼 IP 与文创设计产品应用图片",
        placeholder: "作品内容整理中",
      },
    },
    coverImage: `${projectImageBase}/eyecare-ip/cover.jpg`,
    detailImages: [
      {
        src: `${projectImageBase}/eyecare-ip/moodboard.jpg`,
        alt: "儿童护眼 IP 灵感板",
        captionZh: "灵感板",
        captionEn: "Moodboard",
        role: "moodboard",
      },
      {
        src: `${projectImageBase}/eyecare-ip/process-01.jpg`,
        alt: "儿童护眼 IP 设计过程一",
        captionZh: "设计过程 01",
        captionEn: "Process 01",
        role: "process",
      },
      {
        src: `${projectImageBase}/eyecare-ip/process-02.jpg`,
        alt: "儿童护眼 IP 设计过程二",
        captionZh: "设计过程 02",
        captionEn: "Process 02",
        role: "process",
      },
      {
        src: `${projectImageBase}/eyecare-ip/final-01.jpg`,
        alt: "儿童护眼 IP 关键视觉一",
        captionZh: "关键视觉 01",
        captionEn: "Final 01",
        role: "final",
      },
      {
        src: `${projectImageBase}/eyecare-ip/final-02.jpg`,
        alt: "儿童护眼 IP 应用展示二",
        captionZh: "应用展示 02",
        captionEn: "Final 02",
        role: "final",
      },
    ],
    infoPoints: [
      {
        titleZh: "项目背景",
        titleEn: "Background",
        descriptionZh: "以儿童护眼传播为主题，将医学科普内容转译成更容易被儿童理解和接受的视觉语言。",
        descriptionEn: "A child-friendly visual translation of eye-care education and medical communication.",
      },
      {
        titleZh: "设计方向",
        titleEn: "Design Direction",
        descriptionZh: "围绕护眼科普、儿童友好视觉、IP 形象和医疗文创方向，建立亲切、有陪伴感的视觉系统。",
        descriptionEn: "Eye-care education, child-friendly visuals, IP characters, and medical cultural creative design.",
        emphasis: true,
      },
      {
        titleZh: "产品类别",
        titleEn: "Product Category",
        descriptionZh: "护眼手册、贴纸、任务卡、打卡板、眼镜布、镜盒与文创周边等。",
        descriptionEn: "Eye-care manuals, stickers, task cards, check-in boards, lens cloths, cases, and creative merchandise.",
      },
    ],
    workChapters: [
      {
        titleZh: "灵感板",
        titleEn: "Moodboard",
        descriptionZh: "医院背景、儿童护眼知识、儿童插画风格、色彩参考、IP 参考与文创产品参考。",
        descriptionEn: "Hospital context, eye-care knowledge, children's illustration styles, color references, IP references, and product cues.",
        imageSlot: "moodboard",
        placeholderEn: "Research Notes",
      },
      {
        titleZh: "IP 与视觉设计",
        titleEn: "IP & Visual Design",
        descriptionZh: "IP 形象设计、角色表情、动作延展、辅助图形、页面视觉与色彩系统。",
        descriptionEn: "IP character design, expressions, motion extensions, supporting graphics, page visuals, and color system.",
        imageSlot: "design",
        placeholderEn: "Visual System",
      },
      {
        titleZh: "产品应用",
        titleEn: "Product Application",
        descriptionZh: "护眼手册、海报、贴纸、打卡产品、眼镜布、镜盒与展示效果图。",
        descriptionEn: "Eye-care manuals, posters, stickers, check-in products, lens cloths, glasses cases, and display mockups.",
        imageSlot: "application",
        placeholderEn: "Product Application",
      },
    ],
    background: {
      titleZh: "设计背景",
      titleEn: "Background",
      items: ["项目以儿童护眼科普传播为核心，面向医院活动、校园宣教与亲子互动场景，降低健康信息的距离感。"],
    },
    brief: {
      titleZh: "项目简述",
      titleEn: "Brief",
      items: ["以儿童护眼传播为核心，建立角色 IP 与亲和的视觉表达，降低健康科普的距离感。"],
    },
    designIdea: {
      titleZh: "设计想法",
      titleEn: "Design Idea",
      items: ["用角色表情、明亮色彩和文创载体，把护眼信息转译成儿童愿意接近的视觉内容。"],
    },
    projectType: {
      titleZh: "项目类型",
      titleEn: "Project Type",
      items: ["IP 设计 / 儿童科普视觉 / 文创设计"],
    },
    goals: {
      titleZh: "设计目标",
      titleEn: "Goals",
      items: ["目标一：让健康信息更亲和。", "目标二：建立可用于活动和物料的 IP 视觉资产。"],
    },
    process: {
      titleZh: "设计过程",
      titleEn: "Process",
      items: ["梳理传播关键词。", "探索角色造型与表情。", "延展图标、海报和文创应用。"],
    },
    applications: {
      titleZh: "应用展示",
      titleEn: "Applications",
      items: ["海报与科普图文。", "贴纸、徽章、文具等文创延展。"],
    },
    conclusion: {
      titleZh: "项目总结",
      titleEn: "Summary",
      items: ["本项目将护眼知识转化为角色 IP、图文物料与文创载体，增强儿童参与感与传播记忆点。"],
    },
  },
  {
    slug: "brand-visual-identity-design",
    order: "Project 03",
    title: {
      zh: "品牌视觉识别设计",
      en: "Brand / Visual Identity Design",
    },
    summary: {
      zh: "为品牌建立基础视觉识别系统，包含标识、字体、颜色和应用规范。",
      en: "A visual identity framework including logo, typography, color, and applications.",
    },
    year: "2026",
    category: {
      zh: "品牌设计 / 视觉识别",
      en: "Brand Design / Visual Identity",
    },
    tools: ["Illustrator", "Photoshop", "Figma"],
    keywords: ["品牌识别", "基础规范", "应用系统"],
    imageSlots: {
      cover: {
        label: "PROJECT VISUAL",
        src: `${projectImageBase}/branding/cover.jpg`,
        alt: "品牌视觉识别设计封面图",
        placeholder: "作品内容整理中",
      },
      projectName: {
        label: "PROJECT NAME",
        src: `${projectImageBase}/branding/cover.jpg`,
        alt: "品牌视觉识别设计项目名称图片",
        placeholder: "作品内容整理中",
      },
      moodboard: {
        label: "MOODBOARD",
        src: `${projectImageBase}/branding/moodboard.jpg`,
        alt: "品牌视觉识别设计灵感板图片",
        placeholder: "作品内容整理中",
      },
      design: {
        label: "VISUAL DESIGN",
        src: `${projectImageBase}/branding/process-01.jpg`,
        alt: "品牌视觉设计图片",
        placeholder: "作品内容整理中",
      },
      application: {
        label: "BRAND APPLICATION",
        src: `${projectImageBase}/branding/final-01.jpg`,
        alt: "品牌视觉识别应用图片",
        placeholder: "作品内容整理中",
      },
    },
    coverImage: `${projectImageBase}/branding/cover.jpg`,
    detailImages: [
      {
        src: `${projectImageBase}/branding/moodboard.jpg`,
        alt: "品牌视觉识别灵感板",
        captionZh: "灵感板",
        captionEn: "Moodboard",
        role: "moodboard",
      },
      {
        src: `${projectImageBase}/branding/process-01.jpg`,
        alt: "品牌视觉识别设计过程一",
        captionZh: "设计过程 01",
        captionEn: "Process 01",
        role: "process",
      },
      {
        src: `${projectImageBase}/branding/process-02.jpg`,
        alt: "品牌视觉识别设计过程二",
        captionZh: "设计过程 02",
        captionEn: "Process 02",
        role: "process",
      },
      {
        src: `${projectImageBase}/branding/final-01.jpg`,
        alt: "品牌视觉识别关键视觉一",
        captionZh: "关键视觉 01",
        captionEn: "Final 01",
        role: "final",
      },
      {
        src: `${projectImageBase}/branding/final-02.jpg`,
        alt: "品牌视觉识别应用展示二",
        captionZh: "应用展示 02",
        captionEn: "Final 02",
        role: "final",
      },
    ],
    infoPoints: [
      {
        titleZh: "项目背景",
        titleEn: "Background",
        descriptionZh: "为品牌建立基础识别系统，解决视觉表达分散、应用不统一和传播记忆点不足的问题。",
        descriptionEn: "A foundational identity system for clearer recognition, consistency, and communication.",
      },
      {
        titleZh: "设计方向",
        titleEn: "Design Direction",
        descriptionZh: "围绕品牌定位、视觉调性、标志语言、色彩系统与传播方向，形成统一可延展的识别规范。",
        descriptionEn: "Brand positioning, visual tone, logo language, color system, and communication direction.",
        emphasis: true,
      },
      {
        titleZh: "应用类别",
        titleEn: "Application Category",
        descriptionZh: "Logo、标准字、品牌色、辅助图形、包装、海报、社交媒体物料等。",
        descriptionEn: "Logo, logotype, brand colors, supporting graphics, packaging, posters, and social media assets.",
      },
    ],
    workChapters: [
      {
        titleZh: "灵感板",
        titleEn: "Moodboard",
        descriptionZh: "品牌调研、竞品分析、视觉关键词、色彩参考、字体参考与应用场景参考。",
        descriptionEn: "Brand research, competitor analysis, visual keywords, color references, typography, and application scenarios.",
        imageSlot: "moodboard",
        placeholderEn: "Research Notes",
      },
      {
        titleZh: "视觉设计",
        titleEn: "Visual Design",
        descriptionZh: "Logo 设计、字体设计、辅助图形、色彩系统、版式规范与品牌延展。",
        descriptionEn: "Logo design, typography, supporting graphics, color system, layout rules, and brand extensions.",
        imageSlot: "design",
        placeholderEn: "Visual System",
      },
      {
        titleZh: "品牌应用",
        titleEn: "Brand Application",
        descriptionZh: "名片、包装、海报、社交媒体、宣传物料与场景效果图。",
        descriptionEn: "Business cards, packaging, posters, social media, promotional materials, and scene mockups.",
        imageSlot: "application",
        placeholderEn: "Brand Application",
      },
    ],
    background: {
      titleZh: "设计背景",
      titleEn: "Background",
      items: ["项目围绕品牌基础识别搭建展开，梳理定位、受众、视觉调性与多场景应用中的一致性问题。"],
    },
    brief: {
      titleZh: "项目简述",
      titleEn: "Brief",
      items: ["为品牌建立可识别、可延展的基础视觉系统，让标识、色彩、字体和应用物料保持一致。"],
    },
    designIdea: {
      titleZh: "设计想法",
      titleEn: "Design Idea",
      items: ["通过清晰的识别符号和统一的版式规则，帮助品牌在不同媒介中保持稳定表达。"],
    },
    projectType: {
      titleZh: "项目类型",
      titleEn: "Project Type",
      items: ["品牌设计 / 视觉识别 / 应用规范"],
    },
    goals: {
      titleZh: "设计目标",
      titleEn: "Goals",
      items: ["目标一：建立统一的品牌识别。", "目标二：保证线上线下应用的一致性。"],
    },
    process: {
      titleZh: "设计过程",
      titleEn: "Process",
      items: ["提炼品牌关键词。", "探索标识、字体和色彩方向。", "制作基础应用模板。"],
    },
    applications: {
      titleZh: "应用展示",
      titleEn: "Applications",
      items: ["名片、信纸、包装等基础物料。", "社交媒体和线上展示模板。"],
    },
    conclusion: {
      titleZh: "项目总结",
      titleEn: "Summary",
      items: ["本项目完成标志、色彩、字体与应用方向的初步系统整理，让品牌在不同媒介中保持稳定表达。"],
    },
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
