import type { Project, ProjectImage, ProjectSection } from "@/data/projects";
import type {
  FreeCanvasBoxElement,
  FreeCanvasElement,
  FreeCanvasImageElement,
  FreeCanvasPage,
  FreeCanvasTextElement,
} from "@/types/freeCanvas";

const canvasWidth = 1440;
const baseCanvasHeight = 3200;
const bottomPadding = 350;
const blue = "var(--color-work-blue)";
const yellow = "var(--color-work-yellow)";
const paper = "var(--color-work-background)";
const grid = "var(--color-work-grid)";

export function createProjectCanvas(project: Project): FreeCanvasPage {
  const moodboard = getImageByRole(project.detailImages, "moodboard", 0);
  const processOne = getImageByRole(project.detailImages, "process", 0);
  const processTwo = getImageByRole(project.detailImages, "process", 1);
  const finalOne = getImageByRole(project.detailImages, "final", 0);
  const finalTwo = getImageByRole(project.detailImages, "final", 1);

  const elements = [
      box("paper", 0, 0, 1440, 3200, 0, {
        background: paper,
      }),
      box("grid-block-a", 72, 720, 1296, 210, 1, {
        background: yellow,
        borderColor: blue,
        borderWidth: 2,
        borderRadius: 0,
        opacity: 0.96,
      }),
      box("grid-block-b", 82, 1888, 1276, 250, 1, {
        background: "color-mix(in srgb, var(--color-work-yellow) 58%, transparent)",
        borderColor: blue,
        borderWidth: 2,
        borderRadius: 0,
        rotate: -1.2,
        opacity: 0.9,
      }),
      text("order", project.order, 96, 116, 190, 44, 5, {
        backgroundClass: "free-canvas-label",
        fontFamily: "en",
        fontSize: 18,
        fontWeight: 800,
        lineHeight: 44,
        letterSpacing: "0.14em",
        uppercase: true,
      }),
      text("title-zh", project.title.zh, 96, 184, 760, 210, 5, {
        fontFamily: "heading",
        fontSize: 82,
        fontWeight: 900,
        lineHeight: 96,
      }),
      text("title-en", project.title.en, 100, 420, 700, 52, 5, {
        fontFamily: "en",
        fontSize: 22,
        fontWeight: 700,
        lineHeight: 32,
        letterSpacing: "0.08em",
        uppercase: true,
      }),
      text("summary-zh", project.summary.zh, 100, 502, 610, 110, 5, {
        fontSize: 30,
        fontWeight: 600,
        lineHeight: 42,
      }),
      text("summary-en", project.summary.en, 100, 636, 650, 72, 5, {
        fontFamily: "en",
        fontSize: 17,
        lineHeight: 28,
        opacity: 0.76,
      }),
      image("cover", undefined, "项目图像整理中", 820, 150, 520, 520, 4, {
        rotate: 2,
        borderRadius: 0,
      }),
      text("year-label", "YEAR", 116, 756, 160, 30, 6, smallLabel()),
      text("year", project.year, 116, 794, 160, 50, 6, {
        fontFamily: "en",
        fontSize: 31,
        fontWeight: 900,
        lineHeight: 42,
      }),
      text("category-label", "CATEGORY", 350, 756, 210, 30, 6, smallLabel()),
      text("category", project.category.zh, 350, 796, 300, 62, 6, {
        fontSize: 25,
        fontWeight: 700,
        lineHeight: 34,
      }),
      text("tools-label", "TOOLS", 716, 756, 170, 30, 6, smallLabel()),
      text("tools", project.tools.join(" / "), 716, 798, 300, 50, 6, {
        fontFamily: "en",
        fontSize: 22,
        fontWeight: 700,
        lineHeight: 31,
      }),
      text("keywords-label", "KEYWORDS", 1060, 756, 190, 30, 6, smallLabel()),
      text("keywords", project.keywords.join(" / "), 1060, 798, 260, 76, 6, {
        fontSize: 21,
        fontWeight: 700,
        lineHeight: 31,
      }),
      text("background-title", sectionTitle(project.background), 96, 1030, 430, 84, 5, sectionTitleStyle()),
      text("background-copy", sectionBody(project.background), 100, 1130, 560, 210, 5, paragraphStyle()),
      image("moodboard", undefined, "灵感板整理区", 760, 980, 520, 390, 3, {
        rotate: -2.2,
      }),
      text("moodboard-caption", "MOODBOARD", 760, 1392, 270, 36, 5, smallLabel()),
      image("process-one", undefined, "设计过程整理区", 96, 1430, 560, 420, 3, {
        rotate: 1.6,
      }),
      text("process-title", sectionTitle(project.process), 760, 1504, 430, 84, 5, sectionTitleStyle()),
      text("process-copy", sectionBody(project.process), 764, 1608, 520, 230, 5, paragraphStyle()),
      text("goals-title", sectionTitle(project.goals), 116, 1932, 370, 74, 5, sectionTitleStyle(42)),
      text("goals-copy", sectionBody(project.goals), 116, 2026, 520, 92, 5, paragraphStyle(26)),
      image("process-two", undefined, "视觉系统展示区", 760, 1870, 520, 390, 4, {
        rotate: -1.8,
      }),
      image("final-one", undefined, "产品应用展示区", 96, 2292, 560, 420, 3, {
        rotate: -1,
      }),
      image("final-two", undefined, "最终视觉展示区", 760, 2380, 520, 390, 4, {
        rotate: 1.4,
      }),
      text("application-title", sectionTitle(project.applications), 96, 2790, 410, 82, 5, sectionTitleStyle(42)),
      text("application-copy", sectionBody(project.applications), 100, 2888, 510, 160, 5, paragraphStyle(26)),
      text("conclusion-title", sectionTitle(project.conclusion), 760, 2804, 410, 82, 5, sectionTitleStyle(42)),
      text("conclusion-copy", sectionBody(project.conclusion), 764, 2902, 500, 160, 5, paragraphStyle(26)),
      text("canvas-mark", "1440 x 3200 PX CANVAS", 1038, 3100, 300, 34, 5, {
        fontFamily: "en",
        fontSize: 16,
        fontWeight: 800,
        lineHeight: 28,
        letterSpacing: "0.12em",
        opacity: 0.7,
        uppercase: true,
      }),
    ];

  // 自动计算画布高度：取固定高度与内容底部+padding 的较大值
  const maxBottom = Math.max(...elements.map((el) => el.y + el.h));
  const autoHeight = maxBottom + bottomPadding;

  return {
    canvasWidth,
    canvasHeight: Math.max(baseCanvasHeight, autoHeight),
    elements,
  };
}

function getImageByRole(images: ProjectImage[], role: NonNullable<ProjectImage["role"]>, index: number) {
  return images.filter((image) => image.role === role)[index];
}

function sectionTitle(section: ProjectSection) {
  return `${section.titleZh}\n${section.titleEn}`;
}

function sectionBody(section: ProjectSection) {
  return section.items.join("\n");
}

function text(
  id: string,
  content: string,
  x: number,
  y: number,
  w: number,
  h: number,
  zIndex: number,
  options: Partial<Omit<FreeCanvasTextElement, "id" | "type" | "text" | "x" | "y" | "w" | "h" | "zIndex">> & {
    backgroundClass?: string;
  } = {},
): FreeCanvasTextElement {
  const { backgroundClass, ...textOptions } = options;

  return {
    id,
    type: "text",
    text: content,
    x,
    y,
    w,
    h,
    zIndex,
    rotate: 0,
    opacity: 1,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 500,
    fontFamily: "body",
    color: blue,
    className: backgroundClass,
    ...textOptions,
  };
}

function image(
  id: string,
  src: string | undefined,
  alt: string,
  x: number,
  y: number,
  w: number,
  h: number,
  zIndex: number,
  options: Partial<Omit<FreeCanvasImageElement, "id" | "type" | "src" | "alt" | "x" | "y" | "w" | "h" | "zIndex">> = {},
): FreeCanvasImageElement {
  return {
    id,
    type: "image",
    src,
    alt,
    x,
    y,
    w,
    h,
    zIndex,
    rotate: 0,
    opacity: 1,
    fit: "cover",
    borderRadius: 0,
    ...options,
  };
}

function box(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  zIndex: number,
  options: Partial<Omit<FreeCanvasBoxElement, "id" | "type" | "x" | "y" | "w" | "h" | "zIndex">> = {},
): FreeCanvasBoxElement {
  return {
    id,
    type: "box",
    x,
    y,
    w,
    h,
    zIndex,
    rotate: 0,
    opacity: 1,
    background: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px), ${paper}`,
    borderColor: blue,
    borderWidth: 0,
    borderRadius: 0,
    ...options,
  };
}

function smallLabel(): Partial<FreeCanvasTextElement> {
  return {
    fontFamily: "en",
    fontSize: 16,
    fontWeight: 900,
    lineHeight: 24,
    letterSpacing: "0.16em",
    uppercase: true,
    opacity: 0.72,
  };
}

function sectionTitleStyle(fontSize = 48): Partial<FreeCanvasTextElement> {
  return {
    fontFamily: "heading",
    fontSize,
    fontWeight: 900,
    lineHeight: fontSize + 12,
  };
}

function paragraphStyle(fontSize = 27): Partial<FreeCanvasTextElement> {
  return {
    fontSize,
    fontWeight: 500,
    lineHeight: fontSize + 14,
  };
}
