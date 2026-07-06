"use client";

import * as THREE from "three";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Box3D — 阶段 4（Panel 真实面材质贴图）：天地盖礼盒白模 + 开盖动画 + 拖拽查看
 *
 * 本轮变更：
 *   - 关闭所有 floating TexturePlane
 *   - 改用 Panel BoxGeometry 的 material array 直接贴图
 *   - 每个 Panel 的 6 个面分别分配贴图或模型底色
 *   - 保持天地盖中空结构
 *   - 不新增任何漂浮 plane
 */

// ── 常量 ────────────────────────────────────────────────
const AUTO_ROTATE_SPEED = 0.003;
const WALL_THICKNESS = 0.045;

const LIFT_AMOUNT = 1.2;
const LID_OPEN_ROT_X = -0.35;
const EASE_FACTOR = 0.08;

const MODEL_SCALE = 0.65;

// 拖拽灵敏度
const DRAG_SENSITIVITY_X = 0.005;
const DRAG_SENSITIVITY_Y = 0.005;

// 点击判定阈值
const PRESS_CLICK_MAX_DURATION = 1000;
const DRAG_THRESHOLD = 4;

// Idle reset
const IDLE_RESET_DELAY = 8000;
const IDLE_RETURN_SPEED = 0.06;

// ── 开关 ────────────────────────────────────────────────
const USE_PANEL_MATERIAL_TEXTURES = true;
const ENABLE_FLOATING_TEXTURE_PLANES = false;

// 模型底色
const BASE_BOX_COLOR = "#E7D8C7";
const LID_BOX_COLOR = "#F6F1E8";

// 贴图相关事件
const BOX3D_OPEN_EVENT = "box3d:open-change";
const BOX3D_MARQUEE_INTERACT_EVENT = "box3d:marquee-interaction";

// 镜像开关（需要时开启）
const MIRROR_BASE_LEFT_OUTSIDE = true;
const MIRROR_BASE_RIGHT_OUTSIDE = true;

// ── 贴图路径映射 ────────────────────────────────────────
const BASE_TEX = {
  frontOutside: "/images/abczoo/box/faces/base-front-outside.webp",
  backOutside: "/images/abczoo/box/faces/base-back-outside.webp",
  leftOutside: "/images/abczoo/box/faces/base-left-outside.webp",
  rightOutside: "/images/abczoo/box/faces/base-right-outside.webp",
  bottomOutside: "/images/abczoo/box/faces/base-bottom-outside.webp",
  frontInside: "/images/abczoo/box/faces/base-front-inside.webp",
  backInside: "/images/abczoo/box/faces/base-back-inside.webp",
  leftInside: "/images/abczoo/box/faces/base-left-inside.webp",
  rightInside: "/images/abczoo/box/faces/base-right-inside.webp",
  bottomInside: "/images/abczoo/box/faces/base-bottom-inside.webp",
  frontThickness: "/images/abczoo/box/faces/base-front-thickness.webp",
  backThickness: "/images/abczoo/box/faces/base-back-thickness.webp",
  leftThickness: "/images/abczoo/box/faces/base-left-thickness.webp",
  rightThickness: "/images/abczoo/box/faces/base-right-thickness.webp",
};

const LID_TEX = {
  topOutside: "/images/abczoo/box/faces/lid-top-outside.webp",
  topInside: "/images/abczoo/box/faces/lid-top-inside.webp",
  frontOutside: "/images/abczoo/box/faces/lid-front-outside.webp",
  backOutside: "/images/abczoo/box/faces/lid-back-outside.webp",
  leftOutside: "/images/abczoo/box/faces/lid-left-outside.webp",
  rightOutside: "/images/abczoo/box/faces/lid-right-outside.webp",
  frontInside: "/images/abczoo/box/faces/lid-front-inside.webp",
  backInside: "/images/abczoo/box/faces/lid-back-inside.webp",
  leftInside: "/images/abczoo/box/faces/lid-left-inside.webp",
  rightInside: "/images/abczoo/box/faces/lid-right-inside.webp",
  frontThickness: "/images/abczoo/box/faces/lid-front-thickness.webp",
  backThickness: "/images/abczoo/box/faces/lid-back-thickness.webp",
  leftThickness: "/images/abczoo/box/faces/lid-left-thickness.webp",
  rightThickness: "/images/abczoo/box/faces/lid-right-thickness.webp",
};

// ── 工具函数：创建带变换的 texture ──────────────────────
function createTransformedTexture(
  texture: THREE.Texture,
  options?: { mirrorX?: boolean; mirrorY?: boolean; rotate90?: boolean }
): THREE.Texture {
  if (!options || (!(options.mirrorX || options.mirrorY || options.rotate90))) return texture;

  const img = texture.image as HTMLImageElement | HTMLCanvasElement | null;
  if (!img || !("width" in img) || !("height" in img)) return texture;
  const w = img.width as number;
  const h = img.height as number;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return texture;

  ctx.clearRect(0, 0, w, h);
  ctx.save();

  // 旋转
  if (options.rotate90) {
    ctx.translate(w / 2, h / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -w / 2, -h / 2);
  } else {
    ctx.drawImage(img, 0, 0);
  }

  // 镜像
  if (options.mirrorX || options.mirrorY) {
    ctx.restore();
    ctx.save();
    ctx.translate(options.mirrorX ? w : 0, options.mirrorY ? h : 0);
    ctx.scale(options.mirrorX ? -1 : 1, options.mirrorY ? -1 : 1);
    ctx.drawImage(canvas, 0, 0);
  }

  ctx.restore();

  const newTexture = new THREE.CanvasTexture(canvas);
  newTexture.wrapS = THREE.ClampToEdgeWrapping;
  newTexture.wrapT = THREE.ClampToEdgeWrapping;
  newTexture.repeat.set(1, 1);
  newTexture.offset.set(0, 0);
  newTexture.center.set(0.5, 0.5);
  newTexture.colorSpace = THREE.SRGBColorSpace;
  newTexture.needsUpdate = true;
  return newTexture;
}

// ── 工具函数：创建贴图材质 ──────────────────────────────
function createTextureMaterial(
  texture: THREE.Texture,
  options?: { mirrorX?: boolean; mirrorY?: boolean; rotate90?: boolean }
): THREE.MeshBasicMaterial {
  const transformed = createTransformedTexture(texture, options);
  return new THREE.MeshBasicMaterial({
    map: transformed,
    transparent: false,
    opacity: 1,
    depthWrite: true,
    depthTest: true,
    toneMapped: false,
    side: THREE.FrontSide,
  });
}

// ── 工具函数：创建纯色材质 ──────────────────────────────
function createSolidMaterial(color: string): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: false,
    depthWrite: true,
    depthTest: true,
    toneMapped: false,
    side: THREE.FrontSide,
  });
}

function emitBoxOpenChange(open: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(BOX3D_OPEN_EVENT, { detail: { open } })
  );
}

// 默认展示角度
const DEFAULT_ROTATION_X = 0;
const DEFAULT_ROTATION_Y = 0;

// ── 下盒外部尺寸 ────────────────────────────────────────
const BW = 2.5;
const BD = 4.0;
const BH = 1.0;

// ── 上盖外部尺寸 ────────────────────────────────────────
const LW = 2.60;
const LD = 4.10;
const LH = 0.25;

// ── 天盖包裹深度 ────────────────────────────────────────
const LID_OVERLAP = 0.10;

// ── 天盖结构 ────────────────────────────────────────────
const lidSkirtHeight = 0.25;
const lidTotalH = lidSkirtHeight + WALL_THICKNESS;

// ── 闭合时 lidGroup.position.y ──────────────────────────
const lidTopH = WALL_THICKNESS;
const lidBottomLocalY = lidTopH / 2;
const LID_CLOSED_GROUP_Y = BH - LID_OVERLAP - lidBottomLocalY;

// ── 辅助函数：带 material array 的 Panel ──────────────────
function Panel({
  w, h, d, x, y, z,
  materials,
  castShadow = true,
}: {
  w: number; h: number; d: number;
  x: number; y: number; z: number;
  materials: THREE.Material[];
  castShadow?: boolean;
}) {
  return (
    <mesh
      position={[x, y, z]}
      geometry={new THREE.BoxGeometry(w, h, d)}
      material={materials}
      castShadow={castShadow}
      receiveShadow
    />
  );
}

// ── 旧 TexturePlane 组件（已禁用，保留不删除） ──────────
function _DisabledTexturePlane(_props: any) {
  return null;
}

export function Box3D({ variant = "page" }: { variant?: "page" | "inline" }) {
  // ── 状态 ──────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [animProgress, setAnimProgress] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  // ── 引用 ──────────────────────────────────────────────
  const groupRef = useRef<THREE.Group>(null);
  const lidGroupRef = useRef<THREE.Group>(null);

  // ── 拖拽状态 ──────────────────────────────────────────
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const pointerDownTime = useRef(0);
  const hasDragged = useRef(false);
  const idleResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── 归位状态 ──────────────────────────────────────────
  const isReturningToDefault = useRef(false);

  // ── 跑马灯 hover 保护 ─────────────────────────────────
  const marqueeHovering = useRef(false);

  // ── 当前旋转角度 ──────────────────────────────────────
  const currentRotation = useRef({ x: DEFAULT_ROTATION_X, y: DEFAULT_ROTATION_Y });

  // ── 重置 idle 计时器 ──────────────────────────────────
  const resetIdleTimer = useCallback(() => {
    if (idleResetTimer.current) {
      clearTimeout(idleResetTimer.current);
    }
    isReturningToDefault.current = false;
    idleResetTimer.current = setTimeout(() => {
      if (marqueeHovering.current) return;
      setIsOpen(false);
      emitBoxOpenChange(false);
      isReturningToDefault.current = true;
    }, IDLE_RESET_DELAY);
  }, []);

  // ── 统一旋转管理 ──────────────────────────────────────
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (isReturningToDefault.current) {
      const dx = DEFAULT_ROTATION_X - currentRotation.current.x;
      const dy = DEFAULT_ROTATION_Y - currentRotation.current.y;

      currentRotation.current.x += dx * IDLE_RETURN_SPEED;
      currentRotation.current.y += dy * IDLE_RETURN_SPEED;

      groupRef.current.rotation.x = currentRotation.current.x;
      groupRef.current.rotation.y = currentRotation.current.y;

      if (
        Math.abs(currentRotation.current.x - DEFAULT_ROTATION_X) < 0.005 &&
        Math.abs(currentRotation.current.y - DEFAULT_ROTATION_Y) < 0.005
      ) {
        currentRotation.current.x = DEFAULT_ROTATION_X;
        currentRotation.current.y = DEFAULT_ROTATION_Y;
        isReturningToDefault.current = false;
      }

      return;
    }

    if (isDragging.current) {
      groupRef.current.rotation.x = currentRotation.current.x;
      groupRef.current.rotation.y = currentRotation.current.y;
      return;
    }

    currentRotation.current.y += AUTO_ROTATE_SPEED * delta * 60;
    groupRef.current.rotation.x = currentRotation.current.x;
    groupRef.current.rotation.y = currentRotation.current.y;
  });

  // ── 动画插值（开盖） ──────────────────────────────────
  useFrame(() => {
    const target = isOpen ? 1 : 0;
    setAnimProgress((prev) => {
      const diff = target - prev;
      if (Math.abs(diff) < 0.001) return prev;
      return prev + diff * EASE_FACTOR;
    });
  });

  // ── 监听跑马灯 hover 事件 ─────────────────────────────
  useEffect(() => {
    function onMarqueeInteraction(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail.active) {
        marqueeHovering.current = true;
      } else {
        marqueeHovering.current = false;
        resetIdleTimer();
      }
    }
    window.addEventListener(BOX3D_MARQUEE_INTERACT_EVENT, onMarqueeInteraction);
    return () =>
      window.removeEventListener(BOX3D_MARQUEE_INTERACT_EVENT, onMarqueeInteraction);
  }, [resetIdleTimer]);

  // ── 点击处理（开盖/关盖） ─────────────────────────────
  const handleClick = useCallback(() => {
    const elapsed = Date.now() - pointerDownTime.current;
    if (elapsed >= PRESS_CLICK_MAX_DURATION || hasDragged.current) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (next) emitBoxOpenChange(true);
      return next;
    });
    resetIdleTimer();
  }, [resetIdleTimer]);

  // ── 拖拽开始 ──────────────────────────────────────────
  const handlePointerDown = useCallback((_e: any) => {
    const event = _e.nativeEvent as PointerEvent;
    pointerDownTime.current = Date.now();
    isDragging.current = true;
    hasDragged.current = false;
    lastPointer.current = { x: event.clientX, y: event.clientY };
    resetIdleTimer();
  }, [resetIdleTimer]);

  // ── 拖拽中 ────────────────────────────────────────────
  const handlePointerMove = useCallback((_e: any) => {
    if (!isDragging.current || !groupRef.current) return;
    const event = _e.nativeEvent as PointerEvent;
    const dx = event.clientX - lastPointer.current.x;
    const dy = event.clientY - lastPointer.current.y;

    if (Math.sqrt(dx * dx + dy * dy) >= DRAG_THRESHOLD) {
      hasDragged.current = true;
    }

    currentRotation.current.x -= dy * DRAG_SENSITIVITY_X;
    currentRotation.current.y += dx * DRAG_SENSITIVITY_Y;

    groupRef.current.rotation.x = currentRotation.current.x;
    groupRef.current.rotation.y = currentRotation.current.y;

    lastPointer.current = { x: event.clientX, y: event.clientY };
  }, []);

  // ── 拖拽结束 ──────────────────────────────────────────
  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // ── 贴图加载（optional） ──────────────────────────────
  const loadTex = useCallback((src: string) => {
    return new Promise<THREE.Texture | null>((resolve) => {
      try {
        const loader = new THREE.TextureLoader();
        loader.load(
          src,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            console.info("Texture loaded:", src);
            resolve(tex);
          },
          undefined,
          () => {
            console.warn("Texture failed:", src);
            resolve(null);
          }
        );
      } catch {
        resolve(null);
      }
    });
  }, []);

  // 异步加载所有贴图
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  const [allTextures, setAllTextures] = useState<Record<string, THREE.Texture | null>>({});

  useEffect(() => {
    if (texturesLoaded) return;
    const allSrcs = [
      ...Object.values(BASE_TEX),
      ...Object.values(LID_TEX),
    ];
    Promise.all(allSrcs.map((src) => loadTex(src))).then((results) => {
      const map: Record<string, THREE.Texture | null> = {};
      allSrcs.forEach((src, i) => { map[src] = results[i]; });
      setAllTextures(map);
      setTexturesLoaded(true);
    });
  }, [loadTex, texturesLoaded]);

  // 获取贴图材质（带镜像缓存）
  const getMat = useCallback((tex: THREE.Texture | null, mirrorX: boolean): THREE.Material | null => {
    if (!tex) return null;
    if (!mirrorX) {
      return createTextureMaterial(tex);
    }
    // 镜像：用 key 缓存
    const key = tex.uuid + "_mx";
    if ((tex as any)._mirroredMat) return (tex as any)._mirroredMat;
    const mat = createTextureMaterial(tex, { mirrorX: true });
    (tex as any)._mirroredMat = mat;
    return mat;
  }, []);

  // 纯色材质缓存
  const baseMatCache = useMemo(() => createSolidMaterial(BASE_BOX_COLOR), []);
  const lidMatCache = useMemo(() => createSolidMaterial(LID_BOX_COLOR), []);

  // 下盒尺寸
  const floorH = WALL_THICKNESS;
  const sideWallH = BH - floorH;

  // 盒盖尺寸
  const lidSideH = lidSkirtHeight;
  const lidTopCenterY = lidSideH + lidTopH / 2;

  const currentLidGroupY = LID_CLOSED_GROUP_Y + animProgress * LIFT_AMOUNT;

  // ── 辅助：获取贴图材质或回退底色 ──────────────────────
  const texOrBase = useCallback((src: string, mirrorX: boolean = false): THREE.Material => {
    const tex = allTextures[src];
    if (!tex) return baseMatCache;
    const mat = getMat(tex, mirrorX);
    return mat || baseMatCache;
  }, [allTextures, baseMatCache, getMat]);

  // ── 辅助：获取贴图材质或回退 lid 底色 ──────────────────
  const texOrLid = useCallback((src: string, mirrorX: boolean = false): THREE.Material => {
    const tex = allTextures[src];
    if (!tex) return lidMatCache;
    const mat = getMat(tex, mirrorX);
    return mat || lidMatCache;
  }, [allTextures, lidMatCache, getMat]);

  // ── 等待贴图加载完成后再渲染盒子 ──────────────────────
  if (!texturesLoaded) {
    return (
      <group ref={groupRef} scale={MODEL_SCALE} position={[0, -0.3, 0]}>
        {/* 加载时显示一个简单立方体占位 */}
        <mesh geometry={new THREE.BoxGeometry(2.5, 1, 4)}>
          <meshBasicMaterial color={new THREE.Color(BASE_BOX_COLOR)} />
        </mesh>
        <mesh
          geometry={new THREE.BoxGeometry(5, 5, 5)}
          position={[0, 1, 0]}
          visible={false}
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerOut={handlePointerUp}
        />
      </group>
    );
  }

  // ═══════════════════════════════════════════════════════
  // 地盒 5 个 Panel
  // ═══════════════════════════════════════════════════════

  // B1: 底板 [BW, floorH, BD]
  const baseBottomMats = [
    baseMatCache,  // +X right
    baseMatCache,  // -X left
    texOrBase(BASE_TEX.bottomInside),  // +Y top (内底面)
    texOrBase(BASE_TEX.bottomOutside), // -Y bottom (外底面)
    baseMatCache,  // +Z front
    baseMatCache,  // -Z back
  ];

  // B2: 前壁 [BW, sideWallH, WT] 位于 z = BD/2 - WT/2
  const baseFrontWallMats = [
    baseMatCache,  // +X right
    baseMatCache,  // -X left
    texOrBase(BASE_TEX.frontThickness), // +Y top (口沿厚度)
    baseMatCache,  // -Y bottom
    texOrBase(BASE_TEX.frontOutside),  // +Z front (外侧)
    texOrBase(BASE_TEX.frontInside),   // -Z back (内侧)
  ];

  // B3: 后壁 [BW, sideWallH, WT] 位于 z = -BD/2 + WT/2
  const baseBackWallMats = [
    baseMatCache,  // +X right
    baseMatCache,  // -X left
    texOrBase(BASE_TEX.backThickness), // +Y top
    baseMatCache,  // -Y bottom
    texOrBase(BASE_TEX.backInside),    // +Z front (内侧)
    texOrBase(BASE_TEX.backOutside),   // -Z back (外侧)
  ];

  // B4: 左壁 [WT, sideWallH, BD] 位于 x = -BW/2 + WT/2
  const baseLeftWallMats = [
    texOrBase(BASE_TEX.leftInside),    // +X right (内侧)
    texOrBase(BASE_TEX.leftOutside),   // -X left (外侧)
    texOrBase(BASE_TEX.leftThickness), // +Y top
    baseMatCache,  // -Y bottom
    baseMatCache,  // +Z front
    baseMatCache,  // -Z back
  ];

  // B5: 右壁 [WT, sideWallH, BD] 位于 x = BW/2 - WT/2
  const baseRightWallMats = [
    texOrBase(BASE_TEX.rightOutside),  // +X right (外侧)
    texOrBase(BASE_TEX.rightInside),   // -X left (内侧)
    texOrBase(BASE_TEX.rightThickness),// +Y top
    baseMatCache,  // -Y bottom
    baseMatCache,  // +Z front
    baseMatCache,  // -Z back
  ];

  // ═══════════════════════════════════════════════════════
  // 盒盖 5 个 Panel
  // ═══════════════════════════════════════════════════════

  // L1: 顶板 [LW, lidTopH, LD]
  const lidTopMats = [
    lidMatCache,   // +X right
    lidMatCache,   // -X left
    texOrLid(LID_TEX.topOutside),  // +Y top (外顶面)
    texOrLid(LID_TEX.topInside),   // -Y bottom (内顶面)
    lidMatCache,   // +Z front
    lidMatCache,   // -Z back
  ];

  // L2: 前裙 [LW, lidSideH, WT] 位于 z = LD/2 - WT/2
  const lidFrontSkirtMats = [
    lidMatCache,   // +X right
    lidMatCache,   // -X left
    lidMatCache,   // +Y top
    texOrLid(LID_TEX.frontThickness),// -Y bottom (裙边底部)
    texOrLid(LID_TEX.frontOutside),  // +Z front (外侧)
    texOrLid(LID_TEX.frontInside),   // -Z back (内侧)
  ];

  // L3: 后裙 [LW, lidSideH, WT] 位于 z = -LD/2 + WT/2
  const lidBackSkirtMats = [
    lidMatCache,   // +X right
    lidMatCache,   // -X left
    lidMatCache,   // +Y top
    texOrLid(LID_TEX.backThickness), // -Y bottom
    texOrLid(LID_TEX.backInside),    // +Z front (内侧)
    texOrLid(LID_TEX.backOutside),   // -Z back (外侧)
  ];

  // L4: 左裙 [WT, lidSideH, LD] 位于 x = -LW/2 + WT/2
  const lidLeftSkirtMats = [
    texOrLid(LID_TEX.leftInside),    // +X right (内侧)
    texOrLid(LID_TEX.leftOutside),   // -X left (外侧)
    lidMatCache,   // +Y top
    lidMatCache,   // -Y bottom
    lidMatCache,   // +Z front
    lidMatCache,   // -Z back
  ];

  // L5: 右裙 [WT, lidSideH, LD] 位于 x = LW/2 - WT/2
  const lidRightSkirtMats = [
    texOrLid(LID_TEX.rightOutside),  // +X right (外侧)
    texOrLid(LID_TEX.rightInside),   // -X left (内侧)
    lidMatCache,   // +Y top
    lidMatCache,   // -Y bottom
    lidMatCache,   // +Z front
    lidMatCache,   // -Z back
  ];

  return (
    <group ref={groupRef} scale={MODEL_SCALE} position={[0, -0.3, 0]}>
      {/* ===== 下盒（固定不动） ===== */}
      <group>
        <Panel
          w={BW} h={floorH} d={BD}
          x={0} y={floorH / 2} z={0}
          materials={baseBottomMats}
        />
        <Panel
          w={BW} h={sideWallH} d={WALL_THICKNESS}
          x={0} y={floorH + sideWallH / 2} z={BD / 2 - WALL_THICKNESS / 2}
          materials={baseFrontWallMats}
        />
        <Panel
          w={BW} h={sideWallH} d={WALL_THICKNESS}
          x={0} y={floorH + sideWallH / 2} z={-BD / 2 + WALL_THICKNESS / 2}
          materials={baseBackWallMats}
        />
        <Panel
          w={WALL_THICKNESS} h={sideWallH} d={BD}
          x={-BW / 2 + WALL_THICKNESS / 2} y={floorH + sideWallH / 2} z={0}
          materials={baseLeftWallMats}
        />
        <Panel
          w={WALL_THICKNESS} h={sideWallH} d={BD}
          x={BW / 2 - WALL_THICKNESS / 2} y={floorH + sideWallH / 2} z={0}
          materials={baseRightWallMats}
        />
      </group>

      {/* ===== 上盖（随动画移动） ===== */}
      <group
        ref={lidGroupRef}
        position={[0, currentLidGroupY, 0]}
        rotation={[LID_OPEN_ROT_X * animProgress, 0, 0]}
      >
        <Panel
          w={LW} h={lidTopH} d={LD}
          x={0} y={lidTopCenterY} z={0}
          materials={lidTopMats}
        />
        <Panel
          w={LW} h={lidSideH} d={WALL_THICKNESS}
          x={0} y={lidTopH / 2 + lidSideH / 2} z={LD / 2 - WALL_THICKNESS / 2}
          materials={lidFrontSkirtMats}
        />
        <Panel
          w={LW} h={lidSideH} d={WALL_THICKNESS}
          x={0} y={lidTopH / 2 + lidSideH / 2} z={-LD / 2 + WALL_THICKNESS / 2}
          materials={lidBackSkirtMats}
        />
        <Panel
          w={WALL_THICKNESS} h={lidSideH} d={LD}
          x={-LW / 2 + WALL_THICKNESS / 2} y={lidTopH / 2 + lidSideH / 2} z={0}
          materials={lidLeftSkirtMats}
        />
        <Panel
          w={WALL_THICKNESS} h={lidSideH} d={LD}
          x={LW / 2 - WALL_THICKNESS / 2} y={lidTopH / 2 + lidSideH / 2} z={0}
          materials={lidRightSkirtMats}
        />
      </group>

      {/* ===== 地面接收阴影 ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial transparent opacity={0.15} />
      </mesh>

      {/* ===== 点击热区 ===== */}
      <mesh
        geometry={new THREE.BoxGeometry(5, 5, 5)}
        position={[0, 1, 0]}
        visible={false}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        onPointerOver={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      />
    </group>
  );
}
