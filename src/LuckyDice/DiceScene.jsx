// DiceScene.jsx
import { Canvas } from "@react-three/fiber";
import Dice3D from "./Dice3D";

export default function DiceScene({ values, rolling }) {
  return (
    <div className="flex items-center justify-center gap-6">
      {/* left dice */}
      <div className="relative w-35 h-35 rounded-full bg-black border-4 border-[#10b981] flex items-center justify-center">
        <Canvas
          style={{ width: "140%", height: "140%" }}
          shadows
          camera={{ position: [0, 2.3, 5.8], fov: 32 }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <group scale={0.8}>
            <Dice3D value={values[0]} rolling={rolling} />
          </group>
        </Canvas>
      </div>

      {/* right dice */}
      <div className="relative w-35 h-35 rounded-full bg-black border-4 border-[#10b981] flex items-center justify-center">
        <Canvas
          style={{ width: "140%", height: "140%" }}
          shadows
          camera={{ position: [0, 2.3, 5.8], fov: 32 }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <group scale={0.8}>
            <Dice3D value={values[1]} rolling={rolling} />
          </group>
        </Canvas>
      </div>
    </div>
  );
}
