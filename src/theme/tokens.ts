export const color = {
  navy950: "#071526",
  navy900: "#0B1F3A",
  navy800: "#123056",
  navy700: "#1A4A86",
  navy600: "#2160A8",
  navy50: "#E8F0FA",
  saffron600: "#C45E00",
  saffron500: "#E06C00",
  saffron50: "#FFF4E8",
  green700: "#0B6B3A",
  green600: "#12804A",
  green50: "#E8F6EE",
  indiaSaffron: "#FF9933",
  indiaGreen: "#138808",
  text: "#1A2332",
  muted: "#5C6B7A",
  border: "#D5DCE3",
  surface: "#F4F7FA",
  white: "#FFFFFF",
  danger: "#B42318",
  danger50: "#FEECEC",
  warning: "#B54708",
  warning50: "#FEF4E6",
  info: "#175CD3",
  info50: "#E8F1FC",
} as const;

export const space = {
  4: "4px",
  8: "8px",
  12: "12px",
  16: "16px",
  20: "20px",
  24: "24px",
  32: "32px",
  40: "40px",
  48: "48px",
  64: "64px",
  80: "80px",
  96: "96px",
} as const;

export const radius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  full: "9999px",
} as const;

export const shadow = {
  sm: "0 1px 2px rgba(11, 31, 58, 0.08)",
  md: "0 8px 24px rgba(11, 31, 58, 0.10)",
  lg: "0 16px 40px rgba(11, 31, 58, 0.14)",
} as const;

export const breakpoint = {
  mobile: 390,
  tablet: 768,
  tabletLg: 1024,
  desktop: 1280,
  desktopWide: 1440,
} as const;

export const zIndex = {
  skip: 100,
  header: 50,
  overlay: 60,
  modal: 70,
  toast: 80,
} as const;

export const transition = {
  fast: "150ms ease",
  base: "200ms ease",
} as const;

export const layout = {
  container: "1200px",
  containerWide: "1320px",
  headerIdentity: "88px",
  nav: "48px",
  utility: "36px",
} as const;
