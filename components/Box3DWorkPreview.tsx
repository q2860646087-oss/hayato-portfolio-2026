"use client";

import { Canvas } from "@react-three/fiber";
import { Box3D } from "@/components/Box3D";
import { PackagingCardMarquee } from "@/components/PackagingCardMarquee";

/**
 * Box3DWorkPreview — 首页 Work 区域 3D 白模内联预览
 *
 * 用于在首页第一个项目容器中嵌入 3D 包装盒白模。
 * 不修改 Box3D 组件本身，仅通过 Canvas 容器控制尺寸。
 */
export function Box3DWorkPreview() {
  return (
    <div
      className="mx-auto w-full"
      style={{ marginTop: 24, marginBottom: 24, width: "min(1200px, calc(100vw - 160px))", maxWidth: "1200px" }}
    >
      <div
        style={{
          width: "100%",
          height: 580,
          display: "block",
        }}
      >
        <Canvas
          shadows="soft"
          gl={{ toneMappingExposure: 1.12 }}
          camera={{
            fov: 45,
            near: 0.1,
            far: 100,
            position: [3, 2.5, 4],
          }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 5]} intensity={1.0} castShadow />
          <directionalLight position={[-3, 4, -2]} intensity={0.4} />
          <Box3D variant="inline" />
        </Canvas>
      </div>
      <PackagingCardMarquee />
    </div>
  );
}
