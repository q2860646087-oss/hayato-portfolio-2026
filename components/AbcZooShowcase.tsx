import type { CSSProperties, ReactNode } from "react";
import localFont from "next/font/local";
import { AbcZooLogoSystemMotion } from "@/components/AbcZooLogoSystemMotion";
import { Box3DWorkPreview } from "@/components/Box3DWorkPreview";
import { Reveal } from "@/components/Reveal";
import layoutData from "@/public/images/abczoo/showcase/layout.json";
import { assetPath } from "@/lib/assetPath";

const fredoka = localFont({
  src: "../public/fonts/abczoo/fredoka-variable.woff2",
  variable: "--font-abczoo-fredoka",
  weight: "300 700",
  display: "swap",
});

const nunitoExtraLight = localFont({
  src: "../public/fonts/abczoo/nunito-extralight.woff2",
  variable: "--font-abczoo-nunito",
  weight: "200",
  display: "swap",
});

const smileySans = localFont({
  src: "../public/fonts/abczoo/smiley-sans-oblique.woff2",
  variable: "--font-abczoo-smiley",
  weight: "400",
  display: "swap",
});

const notoSansSc = localFont({
  src: "../public/fonts/abczoo/noto-sans-sc-1.woff2",
  variable: "--font-abczoo-noto",
  weight: "100 900",
  display: "swap",
});

type LayoutAsset = {
  file: string;
  role: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type LayoutPage = {
  id: string;
  width: number;
  height: number;
  background?: { file: string };
  assets: LayoutAsset[];
};

type EditorialMediaAsset = {
  file: string;
  alt: string;
  x: number;
  top: number;
  width: number;
  height: number;
};

type EditorialMediaPage = {
  width: number;
  height: number;
  assets: EditorialMediaAsset[];
};

type PageDimensions = Pick<LayoutPage, "width" | "height">;

const pages = layoutData.pages as unknown as LayoutPage[];

const keywordPage: LayoutPage = { id: "keywords", width: 1920, height: 924.953, assets: [] };
const logoSystemPage: LayoutPage = {
  id: "logo-system",
  width: 1920,
  height: 1433.53,
  assets: [],
};

const editorialMediaPages: Record<number, EditorialMediaPage> = {
  8: {
    width: 1920,
    height: 708.5,
    assets: [
      {
        file: "page-08-01.webp",
        alt: "T 恤领口与 ABC ZOO 领标特写",
        x: 0,
        top: 0,
        width: 1920,
        height: 708.5,
      },
    ],
  },
  14: {
    width: 1920,
    height: 1691.3,
    assets: [
      {
        file: "page-14-01.webp",
        alt: "三名儿童穿 ABC ZOO 睡衣的合照",
        x: 432.4,
        top: 76.9,
        width: 1054.4,
        height: 1581.5,
      },
    ],
  },
  15: {
    width: 1920,
    height: 1688,
    assets: [
      {
        file: "page-15-01.webp",
        alt: "穿绿色鳄鱼睡衣的小男孩",
        x: 429.8,
        top: 59.2,
        width: 1057,
        height: 1585.5,
      },
    ],
  },
  16: {
    width: 1920,
    height: 713,
    assets: [
      {
        file: "page-16-01.webp",
        alt: "ABC ZOO 包装盒、手提袋与吊牌组合",
        x: 0,
        top: 4.5,
        width: 1920,
        height: 708.5,
      },
    ],
  },
  18: {
    width: 1920,
    height: 2255,
    assets: [
      {
        file: "page-18-01.webp",
        alt: "ABC ZOO 礼盒包装展示",
        x: 583.8,
        top: 1389.9,
        width: 623.1,
        height: 778.6,
      },
      {
        file: "page-18-02.webp",
        alt: "ABC ZOO 手提袋包装展示",
        x: 467.3,
        top: 625,
        width: 581.6,
        height: 726.8,
      },
      {
        file: "page-18-03.webp",
        alt: "ABC ZOO 吊牌正反面展示",
        x: 1123.6,
        top: 734.4,
        width: 508,
        height: 508.1,
      },
      {
        file: "page-18-04.webp",
        alt: "ABC ZOO 服装礼盒俯视展示",
        x: 506.4,
        top: 52.2,
        width: 940.3,
        height: 529.2,
      },
    ],
  },
  19: {
    width: 1920,
    height: 1284,
    assets: [
      {
        file: "page-19-01.webp",
        alt: "ABC ZOO 四双袜子礼盒",
        x: 482.6,
        top: 12.5,
        width: 944.5,
        height: 1259.3,
      },
    ],
  },
  20: {
    width: 1920,
    height: 2998,
    assets: [
      {
        file: "page-20-01.webp",
        alt: "ABC ZOO 儿童服装礼盒展示一",
        x: 482.6,
        top: 1521.7,
        width: 944.5,
        height: 708.4,
      },
      {
        file: "page-20-02.webp",
        alt: "ABC ZOO 儿童服装礼盒展示二",
        x: 482.6,
        top: 782.7,
        width: 944.5,
        height: 708.4,
      },
      {
        file: "page-20-03.webp",
        alt: "ABC ZOO 儿童服装礼盒展示三",
        x: 482.6,
        top: 2260.7,
        width: 944.5,
        height: 708.4,
      },
      {
        file: "page-20-04.webp",
        alt: "ABC ZOO 儿童服装礼盒展示四",
        x: 482.6,
        top: 43.7,
        width: 944.5,
        height: 708.4,
      },
    ],
  },
};

const moodKeywords = [
  ["童趣", 122.58, 372.73, 52, 0.94, 1.08, 0.42, 0.94, 4.8, -1.1],
  ["启蒙", 1729.33, 50.35, 48, 0.95, 1.06, 0.48, 0.92, 5.6, -3.7],
  ["亲和", 544.06, 606.41, 52, 0.93, 1.09, 0.38, 0.95, 4.1, -2.3],
  ["柔和", 177.93, 697.29, 48, 0.96, 1.05, 0.56, 0.9, 6.2, -4.9],
  ["动物感", 1633.42, 644.61, 50, 0.92, 1.1, 0.4, 0.96, 3.9, -0.8],
  ["字母感", 630.53, 723.83, 50, 0.95, 1.07, 0.5, 0.93, 5.1, -3.1],
  ["温和", 1490.34, 523.24, 50, 0.94, 1.08, 0.46, 0.91, 6.4, -5.4],
  ["系统化", 1682.62, 395, 50, 0.93, 1.09, 0.4, 0.95, 4.5, -2.7],
  ["Systematic", 1000.67, 523.24, 30, 0.95, 1.06, 0.55, 0.9, 5.8, -1.9],
  ["Playful", 721.02, 523.24, 32, 0.93, 1.08, 0.42, 0.96, 4.2, -4.2],
  ["Educational", 1221.93, 695.76, 28, 0.96, 1.05, 0.58, 0.9, 6.1, -0.6],
  ["Friendly", 240.85, 466.93, 30, 0.94, 1.09, 0.44, 0.94, 3.8, -2.8],
  ["Soft", 1248.89, 425.12, 32, 0.95, 1.06, 0.52, 0.9, 5.3, -3.5],
  ["Animal", 877.05, 341.41, 32, 0.92, 1.1, 0.38, 0.95, 4.6, -1.5],
  ["Alphabet", 60.44, 806.75, 30, 0.96, 1.04, 0.6, 0.88, 6.5, -4.6],
  ["Warm", 837.12, 643.17, 32, 0.94, 1.07, 0.45, 0.94, 4.9, -2.1],
] as const;

const characterColumns = {
  left: [
    { letter: "B", name: "Bear", description: "小熊吃的肚皮鼓鼓", sketch: "sketch-b-bear.svg" },
    { letter: "D", name: "Dog", description: "喜欢追咬自己尾巴的小狗", sketch: "sketch-d-dog.svg" },
    { letter: "E", name: "Elephant", description: "坐着生气的小象", sketch: "sketch-e-elephant.svg" },
    { letter: "G", name: "Giraffe", description: "脖子很灵活的长颈鹿", sketch: "sketch-g-giraffe.svg" },
  ],
  right: [
    { letter: "Q", name: "Quail", description: "鹌鹑缩的圆鼓鼓", sketch: "sketch-q-quail.svg" },
    { letter: "T", name: "Tiger", description: "被抱起来的小老虎", sketch: "sketch-t-tiger.svg" },
    { letter: "U", name: "Unicorn", description: "小独角兽的七彩鬃毛", sketch: "sketch-u-unicorn.svg" },
    { letter: "Y", name: "Yak", description: "超大角小牦牛", sketch: "sketch-y-yak.svg" },
  ],
} as const;

const craftRows = [
  {
    item: "儿童睡衣",
    material: "提花罗纹针织面料",
    texture: "细密纵向罗纹、柔软、有弹性，布面有真实纱线起伏和轻微厚度",
    process: "图案通过提花织入面料，不是浮在表面的贴图或普通印花",
  },
  {
    item: "睡衣领口、袖口、裤脚",
    material: "罗纹针织",
    texture: "比主体面料略厚，有清晰的弹力坑条",
    process: "纯色收口，强化成衣结构",
  },
  {
    item: "儿童袜子",
    material: "棉麻混纺针织面料",
    texture: "能看到细小棉麻纱线、轻微天然颗粒和透气织纹，温暖但不粗糙",
    process: "图案以针织提花或织入式效果呈现，不做平面贴花",
  },
  {
    item: "袜口",
    material: "罗纹针织",
    texture: "较密的弹力罗纹，柔软包裹脚踝，不勒脚",
    process: "袜口颜色与角色主题色统一",
  },
  {
    item: "袜头与袜跟",
    material: "加密针织区域",
    texture: "比袜身更厚、更紧密，能看出耐磨结构",
    process: "纯色拼接或同色系强化",
  },
  {
    item: "儿童T恤",
    material: "新疆长绒棉",
    texture: "细腻、柔软、平滑但保留棉纤维纹理，布料自然垂坠",
    process: "数码直喷 DTG，油墨渗入棉纤维，不能有塑料胶膜感",
  },
  {
    item: "领标",
    material: "柔软棉质织标",
    texture: "适合儿童贴肤使用，柔软、不硬挺、不反光",
    process: "领标文字与图案柔和印刷",
  },
  {
    item: "缝纫线",
    material: "哑光棉线",
    texture: "颜色与衣服接近",
    process: "针脚细密、整齐",
  },
  {
    item: "领口包边",
    material: "弹力罗纹棉",
    texture: "比T恤主体略厚",
    process: "能看到真实织纹和车线",
  },
  {
    item: "包装盒",
    material: "高密度灰板\n裱纸结构\n\n封装纸环\n极薄半透明雪梨纸",
    texture: "哑光纸张的温润感、灰板的挺括度，以及轻微压凸文字带来的触觉层次。\n\n哑光薄纸腰封,环绕折叠衣服,不完全遮住面料和图案",
    process: "ABC ZOO主标题：轻微压凸\n\n极薄半透明雪梨纸",
  },
  {
    item: "吊牌",
    material: "厚磅棉感纸卡",
    texture: "边缘圆角、纸张厚实、低反光",
    process: "正反面哑光彩印,穿孔圆形打孔,天然棉绳,二维码、条形码区域平面印刷,品牌标题轻微压凸",
  },
  {
    item: "手提袋",
    material: "厚磅哑光特种纸",
    texture: "挺括、低反光，有轻微纸纹",
    process: "袋底与折边加厚纸板结构,正面图案,高精度哑光彩印,品牌文字平印",
  },
] as const;

function percent(value: number, total: number) {
  return `${((value / total) * 100).toFixed(5)}%`;
}

function viewportUnit(value: number) {
  return `${(value / 19.2).toFixed(5)}vw`;
}

function position(page: PageDimensions, x: number, y: number, width?: number, height?: number): CSSProperties {
  return {
    left: percent(x, page.width),
    top: percent(y, page.height),
    ...(width === undefined ? null : { width: percent(width, page.width) }),
    ...(height === undefined ? null : { height: percent(height, page.height) }),
  };
}

function textPosition(
  page: LayoutPage,
  x: number,
  y: number,
  size: number,
  options: { width?: number; lineHeight?: number; tracking?: number; textAlign?: CSSProperties["textAlign"] } = {},
): CSSProperties {
  return {
    ...position(page, x, y, options.width),
    fontSize: viewportUnit(size),
    lineHeight: options.lineHeight === undefined ? 1 : viewportUnit(options.lineHeight),
    letterSpacing: options.tracking === undefined ? 0 : viewportUnit(options.tracking),
    textAlign: options.textAlign,
  };
}

function keywordStyle(
  page: LayoutPage,
  x: number,
  y: number,
  size: number,
  scaleMin: number,
  scaleMax: number,
  opacityMin: number,
  opacityMax: number,
  duration: number,
  delay: number,
): CSSProperties {
  return {
    ...textPosition(page, x, y, size),
    "--keyword-scale-min": scaleMin,
    "--keyword-scale-max": scaleMax,
    "--keyword-opacity-min": opacityMin,
    "--keyword-opacity-max": opacityMax,
    "--keyword-duration": `${duration}s`,
    "--keyword-delay": `${delay}s`,
  } as CSSProperties;
}

function PageFrame({
  page,
  pageNumber,
  children,
  reveal = true,
  showBackground = true,
}: {
  page: LayoutPage;
  pageNumber: number;
  children: ReactNode;
  reveal?: boolean;
  showBackground?: boolean;
}) {
  const frame = (
    <section
      aria-label={`ABC ZOO 作品展示第 ${pageNumber} 页`}
      className={`abczoo-layout-page abczoo-layout-page--${page.id}`}
      data-pdf-page={pageNumber}
      style={{ "--abczoo-page-ratio": `${page.width} / ${page.height}` } as CSSProperties}
    >
      {showBackground && page.background ? (
        <img
          aria-hidden="true"
          alt=""
          className="abczoo-layout-background"
          draggable={false}
          src={assetPath(page.background.file)}
        />
      ) : null}
      {children}
    </section>
  );

  return reveal ? <Reveal className={`abczoo-page-reveal abczoo-page-reveal--${page.id}`}>{frame}</Reveal> : frame;
}

function PositionedAsset({ asset, page, alt }: { asset: LayoutAsset; page: LayoutPage; alt: string }) {
  return (
    <img
      alt={alt}
      className="abczoo-layout-asset"
      draggable={false}
      loading="lazy"
      src={assetPath(asset.file)}
      style={position(page, asset.x, asset.y, asset.width, asset.height)}
    />
  );
}

function LetterAnimal({ asset, page }: { asset: LayoutAsset; page: LayoutPage }) {
  return (
    <img
      alt={`${asset.role.replace("letter-", "")} animal letter`}
      className="abczoo-layout-asset abczoo-layout-letter"
      draggable={false}
      loading="lazy"
      src={assetPath(asset.file)}
      style={position(page, asset.x, asset.y, asset.width, asset.height)}
    />
  );
}

function PawMark({ page }: { page: LayoutPage }) {
  return (
    <img
      aria-hidden="true"
      alt=""
      className="abczoo-layout-paw"
      draggable={false}
      src={assetPath("/images/abczoo/showcase/main-paw.webp")}
      style={position(page, 916.63, 930.43, 85.94, 74.65)}
    />
  );
}

function EditorialMediaPage({ pageNumber }: { pageNumber: number }) {
  const page = editorialMediaPages[pageNumber];
  return (
    <Reveal className="abczoo-editorial-media-reveal">
      <section
        className="abczoo-editorial-media-page"
        data-pdf-page={pageNumber}
        aria-label={`ABC ZOO 作品展示第 ${pageNumber} 页`}
        style={{ "--abczoo-media-ratio": `${page.width} / ${page.height}` } as CSSProperties}
      >
        {page.assets.map((asset) => (
          <img
            alt={asset.alt}
            className="abczoo-editorial-media-asset"
            draggable={false}
            key={asset.file}
            loading="lazy"
            src={assetPath(`/images/abczoo/final/extracted/${asset.file}`)}
            style={position(page, asset.x, asset.top, asset.width, asset.height)}
          />
        ))}
      </section>
    </Reveal>
  );
}

function TransparentArtworkPage({ pageNumber, alt, ratio }: { pageNumber: 6 | 11 | 13; alt: string; ratio: string }) {
  const pageLabel = String(pageNumber).padStart(2, "0");

  return (
    <Reveal className="abczoo-transparent-artwork-reveal">
      <section
        className="abczoo-transparent-artwork-page"
        data-pdf-page={pageNumber}
        aria-label={`ABC ZOO 作品展示第 ${pageNumber} 页`}
        style={{ "--abczoo-artwork-ratio": ratio } as CSSProperties}
      >
        <img
          alt={alt}
          className="abczoo-transparent-artwork-image"
          draggable={false}
          loading="lazy"
          src={assetPath(`/images/abczoo/final/extracted/page-${pageLabel}-transparent.webp`)}
        />
      </section>
    </Reveal>
  );
}

function TextTransitionPage({
  pageNumber,
  id,
  height,
  titleEn,
  titleZh,
  children,
}: {
  pageNumber: number;
  id: string;
  height: number;
  titleEn: string;
  titleZh: string;
  children: ReactNode;
}) {
  return (
    <Reveal className="abczoo-copy-page-reveal">
      <section
        aria-label={`ABC ZOO 作品展示第 ${pageNumber} 页`}
        className={`abczoo-copy-page abczoo-copy-page--${id}`}
        data-pdf-page={pageNumber}
        style={{ "--abczoo-copy-ratio": `1920 / ${height}` } as CSSProperties}
      >
        <h2 className="abczoo-copy-title abczoo-layout-text--fredoka">{titleEn}</h2>
        <p className="abczoo-copy-title-zh abczoo-layout-text--smiley">{titleZh}</p>
        <div className="abczoo-copy-body abczoo-layout-text--noto">{children}</div>
      </section>
    </Reveal>
  );
}

function CharacterDetailPage() {
  return (
    <Reveal className="abczoo-character-detail-reveal">
      <section className="abczoo-character-detail" data-pdf-page="10" aria-label="ABC ZOO 字母动物角色系统详细展示">
        <div className="abczoo-character-columns">
          {(Object.keys(characterColumns) as Array<keyof typeof characterColumns>).map((columnName) => (
            <div className={`abczoo-character-column abczoo-character-column--${columnName}`} key={columnName}>
              {characterColumns[columnName].map((character) => (
                <article className="abczoo-character-row" key={character.letter}>
                  <img
                    alt={`${character.letter} / ${character.name} 彩色字母动物角色`}
                    className="abczoo-character-letter"
                    draggable={false}
                    loading="lazy"
                    src={assetPath(`/images/abczoo/showcase/letter-${character.letter.toLowerCase()}.svg`)}
                  />
                  <div className="abczoo-character-copy">
                    <h3 className="abczoo-layout-text--nunito">{character.name}</h3>
                    <p className="abczoo-layout-text--noto">{character.description}</p>
                  </div>
                  <img
                    alt={`${character.name} 手绘草图`}
                    className="abczoo-character-sketch"
                    draggable={false}
                    loading="lazy"
                    src={assetPath(`/images/abczoo/final/svg/${character.sketch}`)}
                  />
                </article>
              ))}
            </div>
          ))}
        </div>
        <img
          alt="其余 18 个彩色字母动物角色集合"
          className="abczoo-character-collection"
          draggable={false}
          loading="lazy"
          src={assetPath("/images/abczoo/final/svg/collection-other-18.svg")}
        />
      </section>
    </Reveal>
  );
}

function CraftSpecPage() {
  const photos = [
    ["craft-photo-pajamas.svg", "三名儿童睡衣工艺照片"],
    ["craft-photo-socks.svg", "儿童袜子工艺照片"],
    ["craft-photo-neck-label.svg", "T 恤领标工艺细节照片"],
    ["craft-photo-packaging.svg", "包装盒、手提袋和吊牌工艺照片"],
  ] as const;

  return (
    <Reveal className="abczoo-craft-spec-reveal">
      <section className="abczoo-craft-spec" data-pdf-page="22" aria-label="ABC ZOO 工艺与材质表格">
        <div className="abczoo-craft-photos">
          {photos.map(([file, alt]) => (
            <img alt={alt} draggable={false} loading="lazy" src={assetPath(`/images/abczoo/final/svg/${file}`)} key={file} />
          ))}
        </div>
        <div className="abczoo-craft-table">
          <div className="abczoo-craft-head" aria-hidden="true">
            <span />
            <span>核心材质</span>
            <span>表面质感</span>
            <span>图案工艺</span>
          </div>
          <div className="abczoo-craft-rows">
            {craftRows.map((row) => (
              <article className="abczoo-craft-row" key={row.item}>
                <h3>{row.item}</h3>
                <div data-label="核心材质">{row.material}</div>
                <div data-label="表面质感">{row.texture}</div>
                <div data-label="图案工艺">{row.process}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

export function AbcZooShowcase() {
  const [cover, overview, background, audience] = pages;

  return (
    <section
      aria-label="ABC ZOO 项目视觉展示"
      className={`${fredoka.variable} ${nunitoExtraLight.variable} ${smileySans.variable} ${notoSansSc.variable} abczoo-pdf-showcase`}
    >
      <PageFrame page={cover} pageNumber={1}>
        <p className="abczoo-layout-text abczoo-layout-text--noto" style={textPosition(cover, 101.67, 45.28, 14)}>
          © 2026 陈子昂、曾浩晟。团队设计作品集。
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--noto" style={textPosition(cover, 101.67, 78.88, 14)}>
          Portfolio shell for selected design works.
        </p>
        <p
          className="abczoo-layout-text abczoo-layout-text--smiley"
          style={textPosition(cover, 1566.61, 42.13, 21.54, { tracking: 2.15 })}
        >
          儿童服装图案 IP 视觉系统设计
        </p>
        <h2
          className="abczoo-layout-text abczoo-layout-text--fredoka abczoo-layout-cover-title"
          style={textPosition(cover, 779.99, 97.87, 80.63)}
        >
          ABC ZOO
        </h2>
        <p
          className="abczoo-layout-text abczoo-layout-text--nunito"
          style={textPosition(cover, 783.28, 200.92, 28.2, { tracking: 2.82 })}
        >
          Animal Letter Collection
        </p>
        {cover.assets.map((asset) => (
          <LetterAnimal asset={asset} key={asset.role} page={cover} />
        ))}
        <PawMark page={cover} />
        <p
          className="abczoo-layout-text abczoo-layout-text--nunito"
          style={textPosition(cover, 838.99, 1023.26, 17, { tracking: 1.2 })}
        >
          Made for little adventures
        </p>
      </PageFrame>

      <PageFrame page={overview} pageNumber={2}>
        <h2
          className="abczoo-layout-text abczoo-layout-text--fredoka abczoo-layout-section-title"
          style={textPosition(overview, 256.26, 81.2, 48, { tracking: 4.8 })}
        >
          What is ABC ZOO?
        </h2>
        <p
          className="abczoo-layout-text abczoo-layout-text--smiley abczoo-layout-section-title-zh"
          style={textPosition(overview, 256.26, 153.06, 48, { tracking: 4.8 })}
        >
          项目概述
        </p>
        <p
          className="abczoo-layout-text abczoo-layout-text--noto abczoo-layout-body"
          style={textPosition(overview, 256.26, 264.97, 21, { width: 843, lineHeight: 30.8, tracking: 2.52 })}
        >
          ABC ZOO 是一套面向学龄前儿童的字母动物视觉系统。项目以 26 个英文字母为基
          <br />
          础，将动物特征、表情情绪与字母结构结合，形成一组具有识别性和延展性的儿童图
          <br />
          形角色。系统进一步延展为 Pattern 满印、服装图案、包装物料与品牌展示，探索儿
          <br />
          童服饰产品中图形教育性、趣味性与品牌系统化表达的结合。
        </p>
        <span className="abczoo-layout-rule" style={position(overview, 259.33, 438.41, 840.55)} />
        <span className="abczoo-layout-rule" style={position(overview, 259.33, 486.66, 840.55)} />
        <span className="abczoo-layout-rule" style={position(overview, 259.33, 534.91, 840.55)} />

        <p className="abczoo-layout-text abczoo-layout-text--noto" style={textPosition(overview, 258.78, 420.45, 16.73)}>
          项目类型
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--noto" style={textPosition(overview, 763.66, 420.46, 17, { tracking: 1.7 })}>
          儿童服饰视觉系统 / 图案设计 / 包装延展
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--noto" style={textPosition(overview, 258.78, 468.45, 16.73)}>
          使用工具
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--nunito" style={textPosition(overview, 892.42, 455.34, 17, { tracking: 1.7 })}>
          Photoshop | Illustrator
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--noto" style={textPosition(overview, 258.78, 516.32, 16.73)}>
          项目周期
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--noto" style={textPosition(overview, 1072.24, 516.34, 17)}>
          4周
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--noto" style={textPosition(overview, 258.78, 564.53, 16.73)}>
          完成时间
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--nunito" style={textPosition(overview, 1025.29, 551.43, 17, { tracking: 1.7 })}>
          2026.03
        </p>
        <PositionedAsset alt="穿着 ABC ZOO 服装的儿童" asset={overview.assets[0]} page={overview} />
        <p className="abczoo-layout-text abczoo-layout-text--noto abczoo-layout-ai-note" style={textPosition(overview, 1388.18, 635.25, 10)}>
          人物形象为 AI 生成
        </p>
      </PageFrame>

      <PageFrame page={background} pageNumber={3} showBackground={false}>
        <div className="abczoo-layout-panel" style={position(background, 379.16, 246.76, 1161.68, 494.38)} />
        <h2
          className="abczoo-layout-text abczoo-layout-text--fredoka abczoo-layout-section-title"
          style={textPosition(background, 256.26, 70.97, 48, { tracking: 4.8 })}
        >
          Project Background
        </h2>
        <p
          className="abczoo-layout-text abczoo-layout-text--smiley abczoo-layout-section-title-zh"
          style={textPosition(background, 256.26, 142.83, 48, { tracking: 4.8 })}
        >
          项目背景
        </p>
        <p
          className="abczoo-layout-text abczoo-layout-text--nunito"
          style={textPosition(background, 1167.32, 154.42, 17, { tracking: 2 })}
        >
          From learning letters to wearing stories.
        </p>
        {background.assets.map((asset, index) => (
          <PositionedAsset alt={`ABC ZOO 社交媒体应用展示 ${index + 1}`} asset={asset} key={asset.role} page={background} />
        ))}
        <p className="abczoo-layout-text abczoo-layout-text--nunito" style={textPosition(background, 474.05, 663.31, 17, { tracking: 1.7 })}>
          Letter Learning
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--noto abczoo-layout-label-zh" style={textPosition(background, 510.58, 701.17, 16, { tracking: 1.6 })}>
          字母启蒙
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--nunito" style={textPosition(background, 869.71, 686.55, 17, { tracking: 1.7 })}>
          Animal Recognition
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--noto abczoo-layout-label-zh" style={textPosition(background, 925.6, 724.41, 16, { tracking: 1.6 })}>
          动物认知
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--nunito" style={textPosition(background, 1292.03, 663.31, 17, { tracking: 1.7 })}>
          Apparel Extension
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--noto abczoo-layout-label-zh" style={textPosition(background, 1342.56, 701.17, 16, { tracking: 1.6 })}>
          服饰延展
        </p>
        <p
          className="abczoo-layout-text abczoo-layout-text--noto abczoo-layout-body"
          style={textPosition(background, 389.51, 836.02, 22, { width: 1147.08, lineHeight: 30.8, tracking: 2.64 })}
        >
          在儿童服饰产品中，图案不仅承担装饰功能，也可以成为儿童认识世界的一种视觉媒介。学龄前儿童正处于字
          <br />
          母启蒙、动物认知、色彩感知与情绪表达的成长阶段，因此本项目希望将英文字母与动物角色结合，建立一套
          <br />
          兼具趣味性、教育性与产品延展性的儿童视觉系统。
        </p>
      </PageFrame>

      <PageFrame page={audience} pageNumber={4} showBackground={false}>
        <svg aria-hidden="true" className="abczoo-layout-wave" preserveAspectRatio="none" viewBox="0 0 1920 1164.09">
          <path d="M 1920 1083.51 L 952.18 1014.01 L 0 1083.51 L 0 697.91 C 316 742 640 790 962.07 822.67 C 1280 790 1600 742 1920 697.91 Z" />
        </svg>
        <h2
          className="abczoo-layout-text abczoo-layout-text--fredoka abczoo-layout-section-title"
          style={textPosition(audience, 256.26, 70.97, 48, { tracking: 4.8 })}
        >
          Target Audience
        </h2>
        <p
          className="abczoo-layout-text abczoo-layout-text--smiley abczoo-layout-section-title-zh"
          style={textPosition(audience, 256.26, 142.83, 48, { tracking: 4.8 })}
        >
          目标用户
        </p>
        <p
          className="abczoo-layout-text abczoo-layout-text--noto abczoo-layout-body"
          style={textPosition(audience, 253.72, 256.65, 22, { width: 816, lineHeight: 30.8, tracking: 2.64 })}
        >
          ABC ZOO 面向 3-6 岁学龄前儿童及其家庭场景展开设计，
          <br />
          通过柔和、友好、可识别的视觉语言，连接儿童、家长与儿童服饰品牌的需求。
        </p>
        {audience.assets.map((asset, index) => (
          <PositionedAsset alt={`ABC ZOO 目标用户展示 ${index + 1}`} asset={asset} key={asset.role} page={audience} />
        ))}
        <p className="abczoo-layout-text abczoo-layout-text--nunito" style={textPosition(audience, 407.93, 902.18, 20, { tracking: 3.2 })}>
          Children
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--noto abczoo-layout-audience-name" style={textPosition(audience, 402.29, 942.38, 20, { tracking: 2 })}>
          3-6 岁儿童
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--noto abczoo-layout-audience-note" style={textPosition(audience, 300.22, 979.4, 16, { tracking: 1.6 })}>
          处于字母启蒙、动物认知与色彩感知阶段。
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--nunito" style={textPosition(audience, 917.64, 922.03, 20, { tracking: 3.2 })}>
          Parents
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--noto abczoo-layout-audience-name" style={textPosition(audience, 919.06, 962.23, 20, { tracking: 2 })}>
          年轻家长
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--noto abczoo-layout-audience-note" style={textPosition(audience, 813.23, 999.28, 16, { tracking: 1.6 })}>
          关注童装审美、趣味性与教育启发价值。
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--nunito" style={textPosition(audience, 1432.42, 902.18, 20, { tracking: 3.2 })}>
          Brand
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--noto abczoo-layout-audience-name" style={textPosition(audience, 1401.36, 942.38, 20, { tracking: 2 })}>
          儿童服饰品牌
        </p>
        <p className="abczoo-layout-text abczoo-layout-text--noto abczoo-layout-audience-note" style={textPosition(audience, 1294.62, 979.36, 16, { tracking: 1.6 })}>
          需要系列化、可延展、可落地的图案视觉系统。
        </p>
      </PageFrame>

      <PageFrame page={keywordPage} pageNumber={5} reveal={false} showBackground={false}>
        <h2 className="abczoo-layout-text abczoo-layout-text--fredoka abczoo-layout-section-title" style={textPosition(keywordPage, 256.26, 60, 48, { tracking: 4.8 })}>
          Keywords &amp; Moodboard
        </h2>
        <p className="abczoo-layout-text abczoo-layout-text--smiley abczoo-layout-section-title-zh" style={textPosition(keywordPage, 256.26, 132, 48, { tracking: 4.8 })}>
          关键词与情绪板
        </p>
        {moodKeywords.map(([text, x, y, size, scaleMin, scaleMax, opacityMin, opacityMax, duration, delay]) => (
          <span
            className="abczoo-mood-keyword"
            key={text}
            style={keywordStyle(keywordPage, x, y, size, scaleMin, scaleMax, opacityMin, opacityMax, duration, delay)}
          >
            {text}
          </span>
        ))}
      </PageFrame>

      <TransparentArtworkPage pageNumber={6} alt="ABC ZOO 服装、图案与包装应用情绪板" ratio="1920 / 1434" />

      <AbcZooLogoSystemMotion>
        <PageFrame page={logoSystemPage} pageNumber={7} reveal={false} showBackground={false}>
          <div className="logo-system-inner">
            <header className="logo-system-heading">
              <h2
                className="abczoo-layout-text abczoo-layout-text--fredoka abczoo-layout-section-title"
                style={{ fontSize: viewportUnit(48), lineHeight: 1, letterSpacing: viewportUnit(4.8) }}
              >
                Logo &amp; Naming System
              </h2>
              <p
                className="abczoo-layout-text abczoo-layout-text--smiley abczoo-layout-section-title-zh"
                style={{ fontSize: viewportUnit(48), lineHeight: 1, letterSpacing: viewportUnit(4.8) }}
              >
                名称与标识系统
              </p>
            </header>

            <div className="logo-system-grid">
            <div className="logo-system-left-motion">
              <div className="logo-system-left-layout">
                <h3 className="abczoo-layout-text--fredoka abczoo-logo-name">ABC ZOO</h3>
                <p className="abczoo-layout-text--nunito abczoo-logo-subtitle">Animal Letter Collection</p>
                <p className="abczoo-layout-text--noto abczoo-logo-body">
                  “ABC ZOO”由“ABC”与“ZOO”组合而成，前者代表字母启蒙与基础认知，后者代表动物世界与角色想象。项目副标题“Animal Letter Collection”用于补充说明系列属性，使品牌名称既具备儿童友好感，也能够清晰传达字母动物视觉系统的核心概念。
                </p>
              </div>
            </div>

            <div className="logo-system-right-motion">
              <div className="logo-system-right-layout">
                <div className="abczoo-logo-system-list">
                  <section><h3>ABC ZOO</h3><p>主项目名称，用于封面、主视觉、包装正面与网页展示</p></section>
                  <section><h3>Animal Letter Collection</h3><p>英文副标题，用于说明系列内容，强化字母与动物角色的关系</p></section>
                  <section><h3>儿童服装图案 IP 视觉系统设计</h3><p>中文项目说明，用于作品集、项目介绍与毕业设计语境</p></section>
                  <section><h3>Fredoka</h3><p>用于英文主标题，圆润、亲和，适合儿童品牌气质</p></section>
                  <section><h3>Nunito</h3><p>用于英文辅助信息、小标签与说明文字</p></section>
                  <section><h3>得意黑 / Smiley Sans</h3><p>用于中文标题，具有趣味感和视觉识别度</p></section>
                  <section><h3>思源黑体 / Noto Sans SC</h3><p>用于中文正文说明，保证信息阅读的稳定性</p></section>
                </div>
              </div>
            </div>
            </div>
          </div>
        </PageFrame>
      </AbcZooLogoSystemMotion>

      <EditorialMediaPage pageNumber={8} />

      <TextTransitionPage pageNumber={9} id="character-system" height={456} titleEn="Character System" titleZh="字母动物角色系统">
        <p>
          字母动物角色系统是 ABC ZOO 的核心视觉内容。项目以 26 个英文字母
          <br />
          为基础，在保留字母基本结构和可读性的前提下，将动物特征、表情与身体
          <br />
          部件融合进字母形态中，形成一组各具识别点的儿童图形角色。
        </p>
      </TextTransitionPage>

      <CharacterDetailPage />
      <TransparentArtworkPage pageNumber={11} alt="ABC ZOO 包装、吊牌与 Pattern 拼贴" ratio="1920 / 1685" />

      <TextTransitionPage pageNumber={12} id="apparel-application" height={502} titleEn="Apparel Application" titleZh="服装应用">
        <p>
          服装应用以儿童日常穿着场景为核心，将字母动物角色系统延展到 T 恤、
          <br />
          袜子与睡衣等品类中。不同产品根据穿着位置和工艺特点选择不同图案形
          <br />
          式，使角色既能作为主视觉印花，也能作为局部刺绣或满印图案出现。
        </p>
      </TextTransitionPage>

      <TransparentArtworkPage pageNumber={13} alt="ABC ZOO 袜子与粉色独角兽 T 恤应用" ratio="1920 / 2432" />

      <div className="abczoo-box3d-insert" aria-label="ABC ZOO 互动包装展示">
        <Box3DWorkPreview />
      </div>

      <EditorialMediaPage pageNumber={14} />
      <EditorialMediaPage pageNumber={15} />
      <EditorialMediaPage pageNumber={16} />

      <TextTransitionPage pageNumber={17} id="packaging-application" height={456} titleEn="Packaging Application" titleZh="包装应用">
        <p>
          包装系统延续 ABC ZOO 的柔和儿童品牌气质，将 Logo、Pattern、角色
          <br />
          图形与纸张材质结合，形成适用于服装礼盒、手提袋、吊牌与贴纸的包装延
          <br />
          展。包装设计强调温和、干净和系列感，使产品从购买、赠送到拆封过程都
          <br />
          保持统一的品牌体验。
        </p>
      </TextTransitionPage>

      <EditorialMediaPage pageNumber={18} />
      <EditorialMediaPage pageNumber={19} />
      <EditorialMediaPage pageNumber={20} />

      <TextTransitionPage pageNumber={21} id="craft-description" height={373} titleEn="Craft Description" titleZh="工艺说明">
        <p>
          为了适应不同产品材质和使用场景，ABC ZOO 在服装与包装应用中设置
          <br />
          了多种工艺方案。大面积角色图案适合印花表现，局部标识和小图形适合
          <br />
          刺绣，重点角色可通过贴布绣增强触感，包装 Logo 则可使用压凸工艺提
          <br />
          升纸品质感。
        </p>
      </TextTransitionPage>

      <CraftSpecPage />
    </section>
  );
}
