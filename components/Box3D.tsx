"use client";

import * as THREE from "three";
import { useRef, useState, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Box3D — 阶段 2（idle reset 修正）：天地盖礼盒白模 + 开盖动画 + 拖拽查看
 *
 * 本轮修正：
 *   - idle reset 不仅关闭盒盖，还要把角度平滑归位到默认展示角度
 *   - 归位期间暂停自动旋转，归位完成后从默认角度继续旋转
 *   - 明确区分当前角度和默认角度
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

// ── 实验：盒盖顶面贴图测试 ──────────────────────────────
const ENABLE_LID_TOP_TEXTURE_TEST = true;
const LID_TOP_TEXTURE_SRC = "/images/abczoo/box/faces/天盖顶面（外）.webp";
const BOX3D_OPEN_EVENT = "box3d:open-change";
const BOX3D_MARQUEE_INTERACT_EVENT = "box3d:marquee-interaction";

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

  // ── 实验：盒盖顶面贴图 ────────────────────────────────
  const [lidTopTexture, setLidTopTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!ENABLE_LID_TOP_TEXTURE_TEST) return;
    const loader = new THREE.TextureLoader();
    loader.load(
      LID_TOP_TEXTURE_SRC,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setLidTopTexture(tex);
      },
      undefined,
      () => {
        // 加载失败 → texture=null，不渲染贴图 plane
        setLidTopTexture(null);
      }
    );
  }, []);

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
      // 3 秒无操作：闭盒 + 启动归位
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
    setAnimProgress((prev) => prev + (target - prev) * EASE_FACTOR);
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
    color: new THREE.Color("#FFF7E8"),
    roughness: 0.9,
    metalness: 0.0,
  });

  const boxMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#EFE3D0"),
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
      </group>

      {/* ===== 上盖（随动画移动） ===== */}
      <group
        ref={lidGroupRef}
        position={[0, currentLidGroupY, 0]}
        rotation={[LID_OPEN_ROT_X * animProgress, 0, 0]}
      >
        <Panel
          w={LW}
          h={lidTopH}
          d={LD}
          x={0}
          y={lidTopCenterY}
          z={0}
          mat={lidMat}
        />

        {/* ── 实验：盒盖顶面贴图 overlay ── */}
        {ENABLE_LID_TOP_TEXTURE_TEST && lidTopTexture && (
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, lidTopCenterY + lidTopH / 2 + 0.006, 0]}
          >
            <planeGeometry args={[LW - 0.04, LD - 0.04]} />
            <meshBasicMaterial
              map={lidTopTexture}
              transparent
              side={THREE.DoubleSide}
              toneMapped={false}
              polygonOffset
              polygonOffsetFactor={-1}
            />
          </mesh>
        )}

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
