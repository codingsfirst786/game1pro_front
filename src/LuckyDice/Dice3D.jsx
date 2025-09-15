// Dice3D.jsx
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";

// Dice face rotations
const FACE_ROTATIONS = {
  1: new THREE.Euler(Math.PI / 2, 0, 0),
  2: new THREE.Euler(-Math.PI / 2, 0, 0),
  3: new THREE.Euler(0, 0, 0),
  4: new THREE.Euler(0, Math.PI, 0),
  5: new THREE.Euler(0, -Math.PI / 2, 0),
  6: new THREE.Euler(0, Math.PI / 2, 0),
};

// Pips positions (realistic)
const PIP_POSITIONS = [
  [[0, 0]], // 1
  [
    [-0.25, 0.25],
    [0.25, -0.25],
  ], // 2
  [
    [-0.25, 0.25],
    [0, 0],
    [0.25, -0.25],
  ], // 3
  [
    [-0.25, 0.25],
    [0.25, 0.25],
    [-0.25, -0.25],
    [0.25, -0.25],
  ], // 4
  [
    [-0.25, 0.25],
    [0.25, 0.25],
    [0, 0],
    [-0.25, -0.25],
    [0.25, -0.25],
  ], // 5
  [
    [-0.25, 0.25],
    [0.25, 0.25],
    [-0.25, 0],
    [0.25, 0],
    [-0.25, -0.25],
    [0.25, -0.25],
  ], // 6
];

const HALF = 0.7;
const PIP_INSET = 0.04; // slightly deeper
const FACE_DIRS = {
  1: new THREE.Vector3(0, HALF, 0),
  2: new THREE.Vector3(0, -HALF, 0),
  3: new THREE.Vector3(0, 0, HALF),
  4: new THREE.Vector3(0, 0, -HALF),
  5: new THREE.Vector3(HALF, 0, 0),
  6: new THREE.Vector3(-HALF, 0, 0),
};
const FACE_ROTS = {
  1: new THREE.Euler(-Math.PI / 2, 0, 0),
  2: new THREE.Euler(Math.PI / 2, 0, 0),
  3: new THREE.Euler(0, 0, 0),
  4: new THREE.Euler(0, Math.PI, 0),
  5: new THREE.Euler(0, -Math.PI / 2, 0),
  6: new THREE.Euler(0, Math.PI / 2, 0),
};

export default function Dice3D({ value = 1, rolling }) {
  const mesh = useRef();
  const [target, setTarget] = useState(new THREE.Quaternion());
  const [spin, setSpin] = useState(new THREE.Vector3());
  const [spinTime, setSpinTime] = useState(0);

  useEffect(() => {
    const euler = FACE_ROTATIONS[value] || FACE_ROTATIONS[1];
    const finalQuat = new THREE.Quaternion().setFromEuler(euler);

    if (rolling) {
      setSpin(
        new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        )
      );
      setSpinTime(2.5);

      setTimeout(() => {
        setSpinTime(0);
        setTarget(finalQuat);
      }, 2500);
    } else {
      mesh.current?.quaternion.copy(finalQuat);
      setTarget(finalQuat);
    }
  }, [value, rolling]);

  useFrame((_, delta) => {
    if (!mesh.current) return;

    if (spinTime > 0) {
      mesh.current.rotation.x += spin.x * delta;
      mesh.current.rotation.y += spin.y * delta;
      mesh.current.rotation.z += spin.z * delta;
      setSpinTime((t) => t - delta);
    } else {
      const dist = mesh.current.quaternion.angleTo(target);
      if (dist < 0.01) mesh.current.quaternion.copy(target);
      else mesh.current.quaternion.slerp(target, 0.12);
    }
  });

  const pips = useMemo(() => {
    const groups = [];
    for (let f = 1; f <= 6; f++) {
      PIP_POSITIONS[f - 1].forEach(([x, y], i) => {
        groups.push(
          <group
            key={`face-${f}-pip-${i}`}
            position={FACE_DIRS[f]}
            rotation={FACE_ROTS[f]}
          >
            <mesh position={[x, y, -PIP_INSET]}>
              <sphereGeometry args={[0.1, 32, 32]} /> {/* bigger & heavier */}
              <meshStandardMaterial color="black" />
            </mesh>
          </group>
        );
      });
    }
    return groups;
  }, []);

  return (
    <group ref={mesh}>
      <RoundedBox args={[1.4, 1.4, 1.4]} radius={0.18} smoothness={12}>
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.35}
          metalness={0.05}
          clearcoat={0.25}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>
      {pips}
    </group>
  );
}
