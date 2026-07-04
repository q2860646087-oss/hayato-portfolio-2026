export type FreeCanvasBaseElement = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex: number;
  rotate: number;
  opacity: number;
  className?: string;
};

export type FreeCanvasTextElement = FreeCanvasBaseElement & {
  type: "text";
  text: string;
  fontSize: number;
  lineHeight: number;
  fontWeight?: number | string;
  fontFamily?: "body" | "heading" | "en";
  color?: string;
  align?: "left" | "center" | "right";
  letterSpacing?: string;
  uppercase?: boolean;
};

export type FreeCanvasImageElement = FreeCanvasBaseElement & {
  type: "image";
  src?: string;
  alt: string;
  fit?: "cover" | "contain";
  borderRadius?: number;
};

export type FreeCanvasBoxElement = FreeCanvasBaseElement & {
  type: "box";
  background?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
};

export type FreeCanvasCustom3DElement = FreeCanvasBaseElement & {
  type: "custom-3d-packaging";
};

export type FreeCanvasElement = FreeCanvasTextElement | FreeCanvasImageElement | FreeCanvasBoxElement | FreeCanvasCustom3DElement;

export type FreeCanvasPage = {
  canvasWidth: number;
  canvasHeight: number;
  elements: FreeCanvasElement[];
};
