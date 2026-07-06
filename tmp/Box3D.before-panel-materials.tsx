"use client";

import * as THREE from "three";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Box3D — 阶段 3（外部 10 面贴图）：天地盖礼盒白模 + 开盖动画 + 拖拽查看 + 外部贴图
 *
 * 本轮变更：
 *   - 新增 optional texture loader（10 张外部贴图）
 *   - 新增材质工具函数 createTextureMaterial
 *   - 模型本体颜色调整为 BASE_BOX_COLOR / LID_BOX_COLOR
 *   - 盒盖外部 5 面贴在 lidGroup 内
 *   - 下盒外部 5 面贴在下盒固定 group 内
 *   - 不添加内侧、厚度条、封口面
 *   - 保持中空结构
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

// ── 贴图相关常量 ────────────────────────────────────────
const BOX3D_OPEN_EVENT = "box3d:open-change";
const BOX3D_MARQUEE_INTERACT_EVENT = "box3d:marquee-interaction";

const PLANE_SURFACE_EPSILON = 0.002;
const SEAM_OVERLAP = 0.006;
const VERTICAL_FACE_OVERLAP = 0.018;
const BASE_VERTICAL_FACE_OVERLAP = 0.012;

const BASE_BOX_COLOR = "#E7D8C7";
const LID_BOX_COLOR = "#F6F1E8";

const DEBUG_OUTER_FACE_COVERAGE = false;

// 外部贴图路径映射
const LID_OUTSIDE_TEXTURES = {
  top: "/images/abczoo/box/faces/lid-top-outside.webp",
  front: "/images/abczoo/box/faces/lid-front-outside.webp",
  back: "/images/abczoo/box/faces/lid-back-outside.webp",
  left: "/images/abczoo/box/faces/lid-left-outside.webp",
  right: "/images/abczoo/box/faces/lid-right-outside.webp",
};

const BASE_OUTSIDE_TEXTURES = {
  front: "/images/abczoo/box/faces/base-front-outside.webp",
  back: "/images/abczoo/box/faces/base-back-outside.webp",
  left: "/images/abczoo/box/faces/base-left-outside.webp",
  right: "/images/abczoo/box/faces/base-right-outside.webp",
  bottom: "/images/abczoo/box/faces/base-bottom-outside.webp",
};

// 厚度条贴图路径映射
const LID_THICKNESS_TEXTURES = {
  front: "/images/abczoo/box/faces/lid-front-thickness.webp",
  back: "/images/abczoo/box/faces/lid-back-thickness.webp",
  left: "/images/abczoo/box/faces/lid-left-thickness.webp",
  right: "/images/abczoo/box/faces/lid-right-thickness.webp",
};

const BASE_THICKNESS_TEXTURES = {
  front: "/images/abczoo/box/faces/base-front-thickness.webp",
  back: "/images/abczoo/box/faces/base-back-thickness.webp",
  left: "/images/abczoo/box/faces/base-left-thickness.webp",
  right: "/images/abczoo/box/faces/base-right-thickness.webp",
};

// 内侧贴图路径映射
const LID_INSIDE_TEXTURES = {
  front: "/images/abczoo/box/faces/lid-front-inside.webp",
  back: "/images/abczoo/box/faces/lid-back-inside.webp",
  left: "/images/abczoo/box/faces/lid-left-inside.webp",
  right: "/images/abczoo/box/faces/lid-right-inside.webp",
};

const BASE_INSIDE_TEXTURES = {
  front: "/images/abczoo/box/faces/base-front-inside.webp",
  back: "/images/abczoo/box/faces/base-back-inside.webp",
  left: "/images/abczoo/box/faces/base-left-inside.webp",
  right: "/images/abczoo/box/faces/base-right-inside.webp",
};

// 镜像开关（本阶段暂不使用）
const MIRROR_BASE_BACK_OUTSIDE = false;
const MIRROR_BASE_LEFT_OUTSIDE = false;
const MIRROR_BASE_RIGHT_OUTSIDE = false;

// ── 工具函数：创建变换后的 texture ──────────────────────
function createTransformedTexture(
  texture: THREE.Texture,
  options?: { mirrorX?: boolean; rotate90?: boolean }
): THREE.Texture {
  if (!options || (!options.mirrorX && !options.rotate90)) return texture;

  const canvas = document.createElement("canvas");
  const img = texture.image as HTMLImageElement | HTMLCanvasElement | null;
  if (!img || !("width" in img) || !("height" in img)) return texture;
  const w = img.width as number;
  const h = img.height as number;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return texture;

  ctx.clearRect(0, 0, w, h);

  if (options.rotate90) {
    ctx.translate(w / 2, h / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -w / 2, -h / 2);
  } else {
    ctx.drawImage(img, 0, 0);
  }

  if (options.mirrorX) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return texture;
    tempCtx.translate(w, 0);
    tempCtx.scale(-1, 1);
    tempCtx.drawImage(canvas, 0, 0);

    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(tempCanvas, 0, 0);
  }

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
  options?: { mirrorX?: boolean; rotate90?: boolean }
): THREE.MeshBasicMaterial {
  const transformed = createTransformedTexture(texture, options);
  return new THREE.MeshBasicMaterial({
    map: transformed,
    transparent: false,
    opacity: 1,
    depthWrite: true,
    depthTest: true,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
}

function emitBoxOpenChange(open: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(BOX3D_OPEN_EVENT, { detail: { open } })
  );
}

// 默认展示角度（页面刚加载时盒子平放的角度）
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

// ── 辅助函数：薄板 ──────────────────────────────────────
function Panel({
  w, h, d, x, y, z, mat, castShadow = true,
}: {
  w: number; h: number; d: number;
  x: number; y: number; z: number;
  mat: THREE.Material;
  castShadow?: boolean;
}) {
  return (
    <mesh
      position={[x, y, z]}
      geometry={new THREE.BoxGeometry(w, h, d)}
      material={mat}
      castShadow={castShadow}
      receiveShadow
    />
  );
}

// ── 辅助函数：贴图 plane ────────────────────────────────
function TexturePlane({
  args,
  position,
  rotation,
  textureSrc,
  mirrorX,
  debugColor,
}: {
  args: [number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
  textureSrc: string;
  mirrorX?: boolean;
  debugColor?: string;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      textureSrc,
      (tex) => {
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.repeat.set(1, 1);
        tex.offset.set(0, 0);
        tex.center.set(0.5, 0.5);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        console.info("Texture loaded:", textureSrc);
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.warn("Texture failed to load:", textureSrc, err);
      }
    );
  }, [textureSrc]);

  const transformedTexture = useMemo(() => {
    if (!texture) return null;
    return createTransformedTexture(texture, mirrorX ? { mirrorX: true } : undefined);
  }, [texture, mirrorX]);

  const mat = useMemo(() => {
    if (debugColor) {
      return new THREE.MeshBasicMaterial({
        color: new THREE.Color(debugColor),
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: true,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
        toneMapped: false,
      });
    }

    if (!transformedTexture) return null;

    return createTextureMaterial(transformedTexture);
  }, [debugColor, transformedTexture]);

  useEffect(() => {
    return () => {
      mat?.dispose();
    };
  }, [mat]);

  if (!mat) return null;

  return (
    <mesh position={position} rotation={rotation ?? [0, 0, 0]}>
      <planeGeometry args={args} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
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

  // ── 当前旋转角度（独立跟踪，用于归位插值） ────────────
  const currentRotation = useRef({ x: DEFAULT_ROTATION_X, y: DEFAULT_ROTATION_Y });

  // ── 重置 idle 计时器 ──────────────────────────────────
  const resetIdleTimer = useCallback(() => {
    if (idleResetTimer.current) {
      clearTimeout(idleResetTimer.current);
    }
    // 清除归位标志（用户有新操作，不再归位）
    isReturningToDefault.current = false;
    idleResetTimer.current = setTimeout(() => {
      // 跑马灯上仍有鼠标 → 不自动复位，等鼠标离开后再计
      if (marqueeHovering.current) return;
      // 8 秒无操作：闭盒 + 启动归位
      setIsOpen(false);
      emitBoxOpenChange(false);
      isReturningToDefault.current = true;
    }, IDLE_RESET_DELAY);
  }, []);

  // ── 统一旋转管理（自动旋转 + 拖拽 + 归位） ────────────
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // ── 归位模式：暂停自动旋转，平滑回到默认角度 ──────
    if (isReturningToDefault.current) {
      const dx = DEFAULT_ROTATION_X - currentRotation.current.x;
      const dy = DEFAULT_ROTATION_Y - currentRotation.current.y;

      currentRotation.current.x += dx * IDLE_RETURN_SPEED;
      currentRotation.current.y += dy * IDLE_RETURN_SPEED;

      groupRef.current.rotation.x = currentRotation.current.x;
      groupRef.current.rotation.y = currentRotation.current.y;

      // 足够接近默认角度时锁定
      if (
        Math.abs(currentRotation.current.x - DEFAULT_ROTATION_X) < 0.005 &&
        Math.abs(currentRotation.current.y - DEFAULT_ROTATION_Y) < 0.005
      ) {
        currentRotation.current.x = DEFAULT_ROTATION_X;
        currentRotation.current.y = DEFAULT_ROTATION_Y;
        isReturningToDefault.current = false;
      }

      return; // 归位期间不执行自动旋转
    }

    // ── 拖拽中：应用拖拽角度，不自动旋转 ──────────────
    if (isDragging.current) {
      groupRef.current.rotation.x = currentRotation.current.x;
      groupRef.current.rotation.y = currentRotation.current.y;
      return;
    }

    // ── 空闲自动旋转：从当前角度继续累加 ──────────────
    currentRotation.current.y += AUTO_ROTATE_SPEED * delta * 60;
    groupRef.current.rotation.x = currentRotation.current.x;
    groupRef.current.rotation.y = currentRotation.current.y;
  });

  // ── 动画插值（开盖） ──────────────────────────────────
  useFrame(() => {
    const target = isOpen ? 1 : 0;
    setAnimProgress((prev) => {
      const diff = target - prev;
      if (Math.abs(diff) < 0.001) return prev; // 趋近稳定，停止 setState
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

    // 更新跟踪角度（用于归位参考）
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

  // ── 材质 ──────────────────────────────────────────────
  const lidMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(LID_BOX_COLOR),
    roughness: 0.9,
    metalness: 0.0,
  });

  const boxMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(BASE_BOX_COLOR),
    roughness: 0.85,
    metalness: 0.0,
  });

  // ═══════════════════════════════════════════════════════
  // 下盒：5 块面板
  // ═══════════════════════════════════════════════════════
  const floorH = WALL_THICKNESS;
  const sideWallH = BH - floorH;

  // ═══════════════════════════════════════════════════════
  // 上盖：5 块面板
  // ═══════════════════════════════════════════════════════
  const lidSideH = lidSkirtHeight;
  const lidTopCenterY = lidSideH + lidTopH / 2;

  const currentLidGroupY = LID_CLOSED_GROUP_Y + animProgress * LIFT_AMOUNT;

  return (
    <group ref={groupRef} scale={MODEL_SCALE} position={[0, -0.3, 0]}>
      {/* ===== 下盒（固定不动） ===== */}
      <group>
        {/* 下盒本体 5 面板 */}
        <Panel
          w={BW}
          h={floorH}
          d={BD}
          x={0}
          y={floorH / 2}
          z={0}
          mat={boxMat}
        />

        <Panel
          w={BW}
          h={sideWallH}
          d={WALL_THICKNESS}
          x={0}
          y={floorH + sideWallH / 2}
          z={BD / 2 - WALL_THICKNESS / 2}
          mat={boxMat}
        />

        <Panel
          w={BW}
          h={sideWallH}
          d={WALL_THICKNESS}
          x={0}
          y={floorH + sideWallH / 2}
          z={-BD / 2 + WALL_THICKNESS / 2}
          mat={boxMat}
        />

        <Panel
          w={WALL_THICKNESS}
          h={sideWallH}
          d={BD}
          x={-BW / 2 + WALL_THICKNESS / 2}
          y={floorH + sideWallH / 2}
          z={0}
          mat={boxMat}
        />

        <Panel
          w={WALL_THICKNESS}
          h={sideWallH}
          d={BD}
          x={BW / 2 - WALL_THICKNESS / 2}
          y={floorH + sideWallH / 2}
          z={0}
          mat={boxMat}
        />

        {/* ── 下盒外部 5 面贴图 ── */}
        {/* 前面：法线 +Z，world z = BD/2 */}
        <TexturePlane
          args={[BW, BH + BASE_VERTICAL_FACE_OVERLAP * 2]}
          position={[
            0,
            (BH + BASE_VERTICAL_FACE_OVERLAP * 2) / 2,
            BD / 2 + PLANE_SURFACE_EPSILON,
          ]}
          textureSrc={BASE_OUTSIDE_TEXTURES.front}
        />

        {/* 后面：法线 -Z，world z = -BD/2 */}
        <TexturePlane
          args={[BW, BH + BASE_VERTICAL_FACE_OVERLAP * 2]}
          position={[
            0,
            (BH + BASE_VERTICAL_FACE_OVERLAP * 2) / 2,
            -BD / 2 - PLANE_SURFACE_EPSILON,
          ]}
          rotation={[0, Math.PI, 0]}
          textureSrc={BASE_OUTSIDE_TEXTURES.back}
        />

        {/* 左面：法线 -X，world x = -BW/2 */}
        <TexturePlane
          args={[BD, BH + BASE_VERTICAL_FACE_OVERLAP * 2]}
          position={[
            -BW / 2 - PLANE_SURFACE_EPSILON,
            (BH + BASE_VERTICAL_FACE_OVERLAP * 2) / 2,
            0,
          ]}
          rotation={[0, Math.PI / 2, 0]}
          textureSrc={BASE_OUTSIDE_TEXTURES.right}
          mirrorX
        />

        {/* 右面：法线 +X，world x = BW/2 */}
        <TexturePlane
          args={[BD, BH + BASE_VERTICAL_FACE_OVERLAP * 2]}
          position={[
            BW / 2 + PLANE_SURFACE_EPSILON,
            (BH + BASE_VERTICAL_FACE_OVERLAP * 2) / 2,
            0,
          ]}
          rotation={[0, -Math.PI / 2, 0]}
          textureSrc={BASE_OUTSIDE_TEXTURES.left}
          mirrorX
        />

        {/* 底面外侧：法线 -Y，world y = 0（朝下） */}
        <TexturePlane
          args={[BW, BD]}
          position={[0, -PLANE_SURFACE_EPSILON, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          textureSrc={BASE_OUTSIDE_TEXTURES.bottom}
        />

        {/* ── 下盒顶部口沿厚度条（8 条中的 4 条） ── */}
        {/* 前面：长边沿 X，贴在前侧壁上沿外侧 */}
        <TexturePlane
          args={[BW + SEAM_OVERLAP * 2, WALL_THICKNESS]}
          position={[
            0,
            BH + WALL_THICKNESS / 2,
            BD / 2 + PLANE_SURFACE_EPSILON,
          ]}
          textureSrc={BASE_THICKNESS_TEXTURES.front}
        />

        {/* 后面：长边沿 X，贴在后侧壁上沿外侧 */}
        <TexturePlane
          args={[BW + SEAM_OVERLAP * 2, WALL_THICKNESS]}
          position={[
            0,
            BH + WALL_THICKNESS / 2,
            -BD / 2 - PLANE_SURFACE_EPSILON,
          ]}
          rotation={[0, Math.PI, 0]}
          textureSrc={BASE_THICKNESS_TEXTURES.back}
        />

        {/* 左面：长边沿 Z，贴在左侧壁上沿外侧 */}
        <TexturePlane
          args={[BD + SEAM_OVERLAP * 2, WALL_THICKNESS]}
          position={[
            -BW / 2 - PLANE_SURFACE_EPSILON,
            BH + WALL_THICKNESS / 2,
            0,
          ]}
          rotation={[0, Math.PI / 2, 0]}
          textureSrc={BASE_THICKNESS_TEXTURES.left}
        />

        {/* 右面：长边沿 Z，贴在右侧壁上沿外侧 */}
        <TexturePlane
          args={[BD + SEAM_OVERLAP * 2, WALL_THICKNESS]}
          position={[
            BW / 2 + PLANE_SURFACE_EPSILON,
            BH + WALL_THICKNESS / 2,
            0,
          ]}
          rotation={[0, -Math.PI / 2, 0]}
          textureSrc={BASE_THICKNESS_TEXTURES.right}
        />

        {/* ── 地盒内侧四个侧壁（贴在盒腔内壁上） ── */}
        {/* 前面：法线 -Z，贴在前侧壁内表面 */}
        <TexturePlane
          args={[BW, sideWallH + VERTICAL_FACE_OVERLAP * 2]}
          position={[
            0,
            floorH + sideWallH / 2,
            BD / 2 - WALL_THICKNESS - PLANE_SURFACE_EPSILON,
          ]}
          rotation={[0, Math.PI, 0]}
          textureSrc={BASE_INSIDE_TEXTURES.front}
        />

        {/* 后面：法线 +Z，贴在后侧壁内表面 */}
        <TexturePlane
          args={[BW, sideWallH + VERTICAL_FACE_OVERLAP * 2]}
          position={[
            0,
            floorH + sideWallH / 2,
            -BD / 2 + WALL_THICKNESS + PLANE_SURFACE_EPSILON,
          ]}
          textureSrc={BASE_INSIDE_TEXTURES.back}
        />

        {/* 左面：法线 +X，贴在左侧壁内表面 */}
        <TexturePlane
          args={[BD, sideWallH + VERTICAL_FACE_OVERLAP * 2]}
          position={[
            -BW / 2 + WALL_THICKNESS + PLANE_SURFACE_EPSILON,
            floorH + sideWallH / 2,
            0,
          ]}
          rotation={[0, -Math.PI / 2, 0]}
          textureSrc={BASE_INSIDE_TEXTURES.left}
        />

        {/* 右面：法线 -X，贴在右侧壁内表面 */}
        <TexturePlane
          args={[BD, sideWallH + VERTICAL_FACE_OVERLAP * 2]}
          position={[
            BW / 2 - WALL_THICKNESS - PLANE_SURFACE_EPSILON,
            floorH + sideWallH / 2,
            0,
          ]}
          rotation={[0, Math.PI / 2, 0]}
          textureSrc={BASE_INSIDE_TEXTURES.right}
        />

        {/* ── 地盒内底面（贴在底板内侧上表面） ── */}
        <TexturePlane
          args={[BW - WALL_THICKNESS * 2, BD - WALL_THICKNESS * 2]}
          position={[0, floorH + PLANE_SURFACE_EPSILON, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          textureSrc="/images/abczoo/box/faces/base-bottom-inside.webp"
        />
      </group>

      {/* ===== 上盖（随动画移动） ===== */}
      <group
        ref={lidGroupRef}
        position={[0, currentLidGroupY, 0]}
        rotation={[LID_OPEN_ROT_X * animProgress, 0, 0]}
      >
        {/* 盒盖本体 5 面板 */}
        <Panel
          w={LW}
          h={lidTopH}
          d={LD}
          x={0}
          y={lidTopCenterY}
          z={0}
          mat={lidMat}
        />

        <Panel
          w={LW}
          h={lidSideH}
          d={WALL_THICKNESS}
          x={0}
          y={lidTopH / 2 + lidSideH / 2}
          z={LD / 2 - WALL_THICKNESS / 2}
          mat={lidMat}
        />

        <Panel
          w={LW}
          h={lidSideH}
          d={WALL_THICKNESS}
          x={0}
          y={lidTopH / 2 + lidSideH / 2}
          z={-LD / 2 + WALL_THICKNESS / 2}
          mat={lidMat}
        />

        <Panel
          w={WALL_THICKNESS}
          h={lidSideH}
          d={LD}
          x={-LW / 2 + WALL_THICKNESS / 2}
          y={lidTopH / 2 + lidSideH / 2}
          z={0}
          mat={lidMat}
        />

        <Panel
          w={WALL_THICKNESS}
          h={lidSideH}
          d={LD}
          x={LW / 2 - WALL_THICKNESS / 2}
          y={lidTopH / 2 + lidSideH / 2}
          z={0}
          mat={lidMat}
        />

        {/* ── 盒盖外部 5 面贴图（全部在 lidGroup 内） ── */}
        {/* 顶面：法线 +Y，局部 y = lidTopCenterY */}
        <TexturePlane
          args={[LW, LD]}
          position={[0, lidTopCenterY + lidTopH / 2 + PLANE_SURFACE_EPSILON, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          textureSrc={LID_OUTSIDE_TEXTURES.top}
        />

        {/* 前面：法线 +Z，局部 z = LD/2 */}
        <TexturePlane
          args={[LW, lidSideH + VERTICAL_FACE_OVERLAP * 2]}
          position={[
            0,
            lidTopH / 2 + lidSideH / 2,
            LD / 2 + PLANE_SURFACE_EPSILON,
          ]}
          textureSrc={LID_OUTSIDE_TEXTURES.front}
        />

        {/* 后面：法线 -Z，局部 z = -LD/2 */}
        <TexturePlane
          args={[LW, lidSideH + VERTICAL_FACE_OVERLAP * 2]}
          position={[
            0,
            lidTopH / 2 + lidSideH / 2,
            -LD / 2 - PLANE_SURFACE_EPSILON,
          ]}
          rotation={[0, Math.PI, 0]}
          textureSrc={LID_OUTSIDE_TEXTURES.back}
        />

        {/* 左面：法线 -X，局部 x = -LW/2 */}
        <TexturePlane
          args={[LD, lidSideH + VERTICAL_FACE_OVERLAP * 2]}
          position={[
            -LW / 2 - PLANE_SURFACE_EPSILON,
            lidTopH / 2 + lidSideH / 2,
            0,
          ]}
          rotation={[0, Math.PI / 2, 0]}
          textureSrc={LID_OUTSIDE_TEXTURES.left}
        />

        {/* 右面：法线 +X，局部 x = LW/2 */}
        <TexturePlane
          args={[LD, lidSideH + VERTICAL_FACE_OVERLAP * 2]}
          position={[
            LW / 2 + PLANE_SURFACE_EPSILON,
            lidTopH / 2 + lidSideH / 2,
            0,
          ]}
          rotation={[0, -Math.PI / 2, 0]}
          textureSrc={LID_OUTSIDE_TEXTURES.right}
        />

        {/* ── 盒盖内侧四个裙边（贴在裙边内表面） ── */}
        {/* 前面：法线 -Z，贴在裙边前侧内壁 */}
        <TexturePlane
          args={[LW, lidSideH + VERTICAL_FACE_OVERLAP * 2]}
          position={[
            0,
            lidTopH / 2 + lidSideH / 2,
            LD / 2 - WALL_THICKNESS - PLANE_SURFACE_EPSILON,
          ]}
          rotation={[0, Math.PI, 0]}
          textureSrc={LID_INSIDE_TEXTURES.front}
        />

        {/* 后面：法线 +Z，贴在裙边后侧内壁 */}
        <TexturePlane
          args={[LW, lidSideH + VERTICAL_FACE_OVERLAP * 2]}
          position={[
            0,
            lidTopH / 2 + lidSideH / 2,
            -LD / 2 + WALL_THICKNESS + PLANE_SURFACE_EPSILON,
          ]}
          textureSrc={LID_INSIDE_TEXTURES.back}
        />

        {/* 左面：法线 +X，贴在裙边左侧内壁 */}
        <TexturePlane
          args={[LD, lidSideH + VERTICAL_FACE_OVERLAP * 2]}
          position={[
            -LW / 2 + WALL_THICKNESS + PLANE_SURFACE_EPSILON,
            lidTopH / 2 + lidSideH / 2,
            0,
          ]}
          rotation={[0, -Math.PI / 2, 0]}
          textureSrc={LID_INSIDE_TEXTURES.left}
        />

        {/* 右面：法线 -X，贴在裙边右侧内壁 */}
        <TexturePlane
          args={[LD, lidSideH + VERTICAL_FACE_OVERLAP * 2]}
          position={[
            LW / 2 - WALL_THICKNESS - PLANE_SURFACE_EPSILON,
            lidTopH / 2 + lidSideH / 2,
            0,
          ]}
          rotation={[0, Math.PI / 2, 0]}
          textureSrc={LID_INSIDE_TEXTURES.right}
        />

        {/* ── 盒盖内顶面（贴在顶板内侧底面） ── */}
        <TexturePlane
          args={[LW - WALL_THICKNESS * 2, LD - WALL_THICKNESS * 2]}
          position={[0, lidTopCenterY - lidTopH / 2 - PLANE_SURFACE_EPSILON, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          textureSrc="/images/abczoo/box/faces/lid-top-inside.webp"
        />

        {/* ── 盒盖裙边底部口沿厚度条（4 条） ── */}
        {/* 前面：长边沿 X，贴在裙边底部外侧 */}
        <TexturePlane
          args={[LW + SEAM_OVERLAP * 2, WALL_THICKNESS]}
          position={[
            0,
            lidTopH / 2 + WALL_THICKNESS / 2,
            LD / 2 + PLANE_SURFACE_EPSILON,
          ]}
          textureSrc={LID_THICKNESS_TEXTURES.front}
        />

        {/* 后面：长边沿 X，贴在裙边底部外侧 */}
        <TexturePlane
          args={[LW + SEAM_OVERLAP * 2, WALL_THICKNESS]}
          position={[
            0,
            lidTopH / 2 + WALL_THICKNESS / 2,
            -LD / 2 - PLANE_SURFACE_EPSILON,
          ]}
          rotation={[0, Math.PI, 0]}
          textureSrc={LID_THICKNESS_TEXTURES.back}
        />

        {/* 左面：长边沿 Z，贴在裙边底部外侧 */}
        <TexturePlane
          args={[LD + SEAM_OVERLAP * 2, WALL_THICKNESS]}
          position={[
            -LW / 2 - PLANE_SURFACE_EPSILON,
            lidTopH / 2 + WALL_THICKNESS / 2,
            0,
          ]}
          rotation={[0, Math.PI / 2, 0]}
          textureSrc={LID_THICKNESS_TEXTURES.left}
        />

        {/* 右面：长边沿 Z，贴在裙边底部外侧 */}
        <TexturePlane
          args={[LD + SEAM_OVERLAP * 2, WALL_THICKNESS]}
          position={[
            LW / 2 + PLANE_SURFACE_EPSILON,
            lidTopH / 2 + WALL_THICKNESS / 2,
            0,
          ]}
          rotation={[0, -Math.PI / 2, 0]}
          textureSrc={LID_THICKNESS_TEXTURES.right}
        />
      </group>

      {/* ===== 地面接收阴影 ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial transparent opacity={0.15} />
      </mesh>

      {/* ===== 点击热区（同时捕获拖拽和点击） ===== */}
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
