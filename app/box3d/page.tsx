"use client";

import { Canvas } from "@react-three/fiber";
import { Box3D } from "@/components/Box3D";

export default function Box3DPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: "#FFF9F1" }}>
      <Canvas
        shadows="soft"
        gl={{ toneMappingExposure: 1.12 }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [3, 2.5, 4],
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.0}
          castShadow
        />
        <directionalLight
          position={[-3, 4, -2]}
          intensity={0.4}
        />
        <Box3D />
      </Canvas>
    </div>
  );
}
