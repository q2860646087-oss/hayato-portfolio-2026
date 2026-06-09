export const themeConfig = {
  colors: {
    background: "#fef2e3",
    text: "#292f83",
    muted: "color-mix(in srgb, #292f83 68%, transparent)",
    accent: "#f1cd42",
    border: "color-mix(in srgb, #292f83 14%, transparent)",
    card: "#fef2e3",
    grid: "color-mix(in srgb, #292f83 8%, transparent)",
    primary: "#292f83",
    highlight: "#f1cd42",
    tape: "#f1cd42",
    softBlue: "#f1cd42",
    buttonBackground: "#f1cd42",
    buttonText: "#292f83",
    buttonHover: "#f1cd42",
    workBackground: "#fef2e3",
    workBlue: "#292f83",
    workYellow: "#f1cd42",
    workGrid: "color-mix(in srgb, #292f83 8%, transparent)",
  },
  borders: {
    thin: "0px",
    medium: "0px",
    radius: "50px",
    smallRadius: "50px",
  },
  grid: {
    size: "40px",
    lineWidth: "1px",
  },
  layout: {
    pageWidth: "90vw",
    pageMaxWidth: "1680px",
    mobileGutter: "1rem",
  },
  shadow: "none",
  fonts: {
    chineseHeading:
      '"ZCOOL KuaiLe", "Noto Sans SC", "Microsoft YaHei UI", "Microsoft YaHei", "PingFang SC", sans-serif',
    chinese:
      '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", "Heiti SC", sans-serif',
    english: '"Inter", "Arial", sans-serif',
    heading: 'var(--font-zh-heading), var(--font-zh), var(--font-en)',
    body: 'var(--font-zh), var(--font-en)',
    weights: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      heading: "800",
    },
  },
};

export function createThemeCss() {
  const { borders, colors, fonts, grid, layout, shadow } = themeConfig;

  return `
    :root {
      --color-background: ${colors.background};
      --color-text: ${colors.text};
      --color-muted: ${colors.muted};
      --color-accent: ${colors.accent};
      --color-border: ${colors.border};
      --color-card: ${colors.card};
      --color-grid: ${colors.grid};
      --color-primary: ${colors.primary};
      --color-highlight: ${colors.highlight};
      --color-tape: ${colors.tape};
      --color-soft-blue: ${colors.softBlue};
      --color-button-background: ${colors.buttonBackground};
      --color-button-text: ${colors.buttonText};
      --color-button-hover: ${colors.buttonHover};
      --color-work-background: ${colors.workBackground};
      --color-work-blue: ${colors.workBlue};
      --color-work-yellow: ${colors.workYellow};
      --color-work-grid: ${colors.workGrid};
      --border-thin: ${borders.thin};
      --border-medium: ${borders.medium};
      --radius: ${borders.radius};
      --radius-small: ${borders.smallRadius};
      --grid-size: ${grid.size};
      --grid-line-width: ${grid.lineWidth};
      --page-width: ${layout.pageWidth};
      --page-max-width: ${layout.pageMaxWidth};
      --mobile-gutter: ${layout.mobileGutter};
      --shadow-paper: ${shadow};
      --font-zh-heading: ${fonts.chineseHeading};
      --font-zh: ${fonts.chinese};
      --font-en: ${fonts.english};
      --font-heading: ${fonts.heading};
      --font-body: ${fonts.body};
      --font-weight-regular: ${fonts.weights.regular};
      --font-weight-medium: ${fonts.weights.medium};
      --font-weight-semibold: ${fonts.weights.semibold};
      --font-weight-bold: ${fonts.weights.bold};
      --font-weight-heading: ${fonts.weights.heading};
    }
  `;
}
