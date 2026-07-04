"use client";

import { useCallback, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// ── 尺寸常量 ──────────────────────────────────────────────
// 盒盖顶面比例 500:800 → width=2.5, depth=4.0
const BOX_W = 2.5;
const BOX_D = 4.0;
const BOX_H = 1.0; // 下盒高度
const LID_H = 0.25; // 上盖高度
// 上盖比下盒略大（从外部套住）
const LID_W = BOX_W + 0.2;
const LID_D = BOX_D + 0.2;

// 白色展示卡
const CARD_W = BOX_W - 0.4;
const CARD_D = BOX_D - 0.4;
const CARD_H = 0.6;

// 动画参数
const LIFT_DISTANCE = 1.8;
const CARD_LIFT = 1.2;
const CARD_ROTATE = 45; // 度

// ── 材质 ──────────────────────────────────────────────────
const whiteMat = new THREE.MeshStandardMaterial({
  color: "#f5f5f0",
  roughness: 0.85,
  metalness: 0.0,
});

const cardMat = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  roughness: 0.6,
  metalness: 0.0,
});

// ── 盒子组件 ───────────────────────────────────────────────
function LidBox({ isOpen, duration = 0.4 }: { isOpen: boolean; duration?: number }) {
  const lidGroupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!lidGroupRef.current || !cardRef.current) return;

    const targetY = isOpen ? LIFT_DISTANCE : 0;
    const currentY = lidGroupRef.current.position.y;
    lidGroupRef.current.position.y += (targetY - currentY) * delta / duration;

    const cardTargetY = isOpen ? CARD_LIFT : 0;
    const cardCurrentY = cardRef.current.position.y;
    cardRef.current.position.y += (cardTargetY - cardCurrentY) * delta / duration;

    const cardTargetRot = isOpen ? THREE.MathUtils.degToRad(CARD_ROTATE) : 0;
    const cardCurrentRot = cardRef.current.rotation.y;
    cardRef.current.rotation.y += (cardTargetRot - cardCurrentRot) * delta / duration;
  });

  return (
    <group ref={lidGroupRef}>
      {/* 下盒 */}
      <RoundedBox
        args={[BOX_W, BOX_H, BOX_D]}
        radius={0.04}
        smoothness={4}
        material={whiteMat}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[BOX_W, BOX_H, BOX_D]} />
          <meshStandardMaterial color="#f0f0ea" roughness={0.85} metalness={0} />
        </mesh>
      </RoundedBox>

      {/* 上盖（整体上下移动） */}
      <group position={[0, BOX_H + LID_H / 2, 0]}>
        <RoundedBox
          args={[LID_W, LID_H, LID_D]}
          radius={0.04}
          smoothness={4}
          material={whiteMat}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[LID_W, LID_H, LID_D]} />
            <meshStandardMaterial color="#ecece6" roughness={0.85} metalness={0} />
          </mesh>
        </RoundedBox>
      </group>

      {/* 白色展示卡 */}
      <group ref={cardRef} position={[0, BOX_H / 2 + CARD_H / 2, 0]}>
        <RoundedBox
          args={[CARD_W, CARD_H, CARD_D]}
          radius={0.02}
          smoothness={3}
        >
          <mesh castShadow>
            <boxGeometry args={[CARD_W, CARD_H, CARD_D]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0} />
          </mesh>
        </RoundedBox>
      </group>
    </group>
  );
}

// ── 灯光场景 ───────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.4}
      />
      <hemisphereLight
        args={["#f5f0e8", "#d8d0c0", 0.3]}
      />
    </>
  );
}

// ── 地面阴影 ───────────────────────────────────────────────
function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.12} />
      </mesh>
    </group>
  );
}

// ── 主组件 ─────────────────────────────────────────────────
export function InteractiveLidBoxWhiteModel({ isOpen, onToggle }: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="w-full cursor-pointer select-none"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-label="点击开关包装盒白模"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <Canvas
        shadows
        camera={{ position: [5, 4, 5], fov: 40 }}
        style={{ height: "100%", borderRadius: 8 }}
      >
        <Scene />
        <Ground />
        <LidBox isOpen={isOpen} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate={!isOpen}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

// ── 带状态管理的包装组件 ───────────────────────────────────
export function InteractiveLidBoxWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return <InteractiveLidBoxWhiteModel isOpen={isOpen} onToggle={toggle} />;
}
