"use client";

import * as THREE from "three";
import { useRef, useState, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Box3DStable — 阶段 1：纯色空心天地盖礼盒（可点击开合）
 *
 * 架构：
 *   - baseGroup：地盒（固定不动）
 *   - lidGroup：天盖（开合动画）
 *   - 每个板子 = BoxGeometry Panel + 纯色 material array
 *   - 不使用任何 floating plane / TexturePlane
 *   - 不使用 GSAP
 *   - 开合动画用 useFrame + THREE.MathUtils.damp
 */

// ── 常量 ────────────────────────────────────────────────
const MODEL_SCALE = 0.65;
const LIFT_AMOUNT = 1.15;
const LID_OPEN_ROT_X = -0.65;
const EASE_SPEED = 4;

// 颜色
const BASE_COLOR = "#E7D8C7";
const LID_COLOR = "#F6F1E8";

// 事件名
const BOX3D_OPEN_EVENT = "box3d:open-change";

function emitBoxOpenChange(open: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(BOX3D_OPEN_EVENT, { detail: { open } })
  );
}

// ── 材质缓存（模块级，避免重复创建） ──────────────────────
const solidMaterialsCache = new Map<string, THREE.MeshBasicMaterial>();

function getSolidMaterial(color: string): THREE.MeshBasicMaterial {
  if (!solidMaterialsCache.has(color)) {
    solidMaterialsCache.set(
      color,
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: false,
        depthWrite: true,
        depthTest: true,
        toneMapped: false,
        side: THREE.FrontSide,
      })
    );
  }
  return solidMaterialsCache.get(color)!;
}

// ── 尺寸 ────────────────────────────────────────────────
// 地盒
const BW = 2.6;
const BD = 4.1;
const FLOOR_H = 0.08;
const WALL_H = 0.65;
const WALL_T = 0.06;

// 天盖
const LW = 2.75;
const LD = 4.25;
const LID_TOP_H = 0.08;
const LID_SKIRT_H = 0.55;
const LID_T = 0.06;

// 闭合时 lidGroup 的 position.y
const LID_CLOSED_GROUP_Y = WALL_H - 0.02;

// ── 辅助：Panel（BoxGeometry + material array） ──────────
function Panel({
  w, h, d, x, y, z,
  materials,
}: {
  w: number; h: number; d: number;
  x: number; y: number; z: number;
  materials: THREE.Material[];
}) {
  return (
    <mesh
      position={[x, y, z]}
      geometry={new THREE.BoxGeometry(w, h, d)}
      material={materials}
    />
  );
}

// ── 材质数组构建器 ──────────────────────────────────────
function makeMats(
  px: THREE.Material, nx: THREE.Material,
  py: THREE.Material, ny: THREE.Material,
  pz: THREE.Material, nz: THREE.Material,
): THREE.Material[] {
  return [px, nx, py, ny, pz, nz]; // +X, -X, +Y, -Y, +Z, -Z
}

// ── 主组件 ──────────────────────────────────────────────
export function Box3DStable() {
  const [open, setOpen] = useState(false);
  const openProgressRef = useRef(0);
  const groupRef = useRef<THREE.Group>(null);
  const lidGroupRef = useRef<THREE.Group>(null);

  // ── 点击处理 ──────────────────────────────────────
  const handleClick = useCallback(() => {
    setOpen((prev) => {
      const nextOpen = !prev;
      emitBoxOpenChange(nextOpen);
      return nextOpen;
    });
  }, []);

  // ── 开合动画 ──────────────────────────────────────
  useFrame((_, delta) => {
    if (!groupRef.current || !lidGroupRef.current) return;

    const target = open ? 1 : 0;
    openProgressRef.current = THREE.MathUtils.damp(
      openProgressRef.current,
      target,
      EASE_SPEED,
      delta
    );

    const p = openProgressRef.current;
    lidGroupRef.current.position.y = LID_CLOSED_GROUP_Y + p * LIFT_AMOUNT;
    lidGroupRef.current.rotation.x = -p * LID_OPEN_ROT_X;
  });

  // ── 纯色材质 ──────────────────────────────────────
  const baseMat = getSolidMaterial(BASE_COLOR);
  const lidMat = getSolidMaterial(LID_COLOR);

  // ── 地盒 5 个 Panel ───────────────────────────────
  // B1: 底板 [BW, FLOOR_H, BD]
  const baseBottomMats = makeMats(
    baseMat, baseMat, baseMat, baseMat, baseMat, baseMat
  );

  // B2: 前壁 [BW, WALL_H, WALL_T]
  const baseFrontWallMats = makeMats(
    baseMat, baseMat, baseMat, baseMat, baseMat, baseMat
  );

  // B3: 后壁 [BW, WALL_H, WALL_T]
  const baseBackWallMats = makeMats(
    baseMat, baseMat, baseMat, baseMat, baseMat, baseMat
  );

  // B4: 左壁 [WALL_T, WALL_H, BD]
  const baseLeftWallMats = makeMats(
    baseMat, baseMat, baseMat, baseMat, baseMat, baseMat
  );

  // B5: 右壁 [WALL_T, WALL_H, BD]
  const baseRightWallMats = makeMats(
    baseMat, baseMat, baseMat, baseMat, baseMat, baseMat
  );

  // ── 天盖 5 个 Panel ───────────────────────────────
  // L1: 顶板 [LW, LID_TOP_H, LD]
  const lidTopMats = makeMats(
    lidMat, lidMat, lidMat, lidMat, lidMat, lidMat
  );

  // L2: 前裙 [LW, LID_SKIRT_H, LID_T]
  const lidFrontSkirtMats = makeMats(
    lidMat, lidMat, lidMat, lidMat, lidMat, lidMat
  );

  // L3: 后裙 [LW, LID_SKIRT_H, LID_T]
  const lidBackSkirtMats = makeMats(
    lidMat, lidMat, lidMat, lidMat, lidMat, lidMat
  );

  // L4: 左裙 [LID_T, LID_SKIRT_H, LD]
  const lidLeftSkirtMats = makeMats(
    lidMat, lidMat, lidMat, lidMat, lidMat, lidMat
  );

  // L5: 右裙 [LID_T, LID_SKIRT_H, LD]
  const lidRightSkirtMats = makeMats(
    lidMat, lidMat, lidMat, lidMat, lidMat, lidMat
  );

  return (
    <group ref={groupRef} scale={MODEL_SCALE} position={[0, -0.3, 0]}>
      {/* ===== 地盒（固定不动） ===== */}
      <group>
        <Panel
          w={BW} h={FLOOR_H} d={BD}
          x={0} y={FLOOR_H / 2} z={0}
          materials={baseBottomMats}
        />
        <Panel
          w={BW} h={WALL_H} d={WALL_T}
          x={0} y={FLOOR_H + WALL_H / 2} z={BD / 2 - WALL_T / 2}
          materials={baseFrontWallMats}
        />
        <Panel
          w={BW} h={WALL_H} d={WALL_T}
          x={0} y={FLOOR_H + WALL_H / 2} z={-BD / 2 + WALL_T / 2}
          materials={baseBackWallMats}
        />
        <Panel
          w={WALL_T} h={WALL_H} d={BD}
          x={-BW / 2 + WALL_T / 2} y={FLOOR_H + WALL_H / 2} z={0}
          materials={baseLeftWallMats}
        />
        <Panel
          w={WALL_T} h={WALL_H} d={BD}
          x={BW / 2 - WALL_T / 2} y={FLOOR_H + WALL_H / 2} z={0}
          materials={baseRightWallMats}
        />
      </group>

      {/* ===== 天盖（开合动画） ===== */}
      <group ref={lidGroupRef} position={[0, LID_CLOSED_GROUP_Y, 0]}>
        <Panel
          w={LW} h={LID_TOP_H} d={LD}
          x={0} y={LID_TOP_H / 2 + LID_SKIRT_H} z={0}
          materials={lidTopMats}
        />
        <Panel
          w={LW} h={LID_SKIRT_H} d={LID_T}
          x={0} y={LID_TOP_H / 2 + LID_SKIRT_H / 2} z={LD / 2 - LID_T / 2}
          materials={lidFrontSkirtMats}
        />
        <Panel
          w={LW} h={LID_SKIRT_H} d={LID_T}
          x={0} y={LID_TOP_H / 2 + LID_SKIRT_H / 2} z={-LD / 2 + LID_T / 2}
          materials={lidBackSkirtMats}
        />
        <Panel
          w={LID_T} h={LID_SKIRT_H} d={LD}
          x={-LW / 2 + LID_T / 2} y={LID_TOP_H / 2 + LID_SKIRT_H / 2} z={0}
          materials={lidLeftSkirtMats}
        />
        <Panel
          w={LID_T} h={LID_SKIRT_H} d={LD}
          x={LW / 2 - LID_T / 2} y={LID_TOP_H / 2 + LID_SKIRT_H / 2} z={0}
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
      />
    </group>
  );
}
