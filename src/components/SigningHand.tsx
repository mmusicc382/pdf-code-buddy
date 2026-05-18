import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { FingerBend, HandPose } from "@/lib/signPoses";
import { REST } from "@/lib/signPoses";

type FingerProps = {
  bend: FingerBend;
  position: [number, number, number];
  rotationZ?: number;
  segments?: [number, number, number]; // lengths of 3 segments
  radius?: number;
};

function Finger({ bend, position, rotationZ = 0, segments = [0.35, 0.3, 0.25], radius = 0.07 }: FingerProps) {
  const [a, b, c] = bend;
  const [s1, s2, s3] = segments;
  return (
    <group position={position} rotation={[0, 0, rotationZ]}>
      <group rotation={[-a, 0, 0]}>
        <mesh position={[0, s1 / 2, 0]} castShadow>
          <capsuleGeometry args={[radius, s1, 6, 12]} />
          <meshStandardMaterial color="#f0c9a4" roughness={0.55} />
        </mesh>
        <group position={[0, s1, 0]} rotation={[-b, 0, 0]}>
          <mesh position={[0, s2 / 2, 0]} castShadow>
            <capsuleGeometry args={[radius * 0.92, s2, 6, 12]} />
            <meshStandardMaterial color="#ecbf98" roughness={0.55} />
          </mesh>
          <group position={[0, s2, 0]} rotation={[-c, 0, 0]}>
            <mesh position={[0, s3 / 2, 0]} castShadow>
              <capsuleGeometry args={[radius * 0.82, s3, 6, 12]} />
              <meshStandardMaterial color="#e8b990" roughness={0.55} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

type AnimatedHandProps = {
  target: HandPose;
};

function lerpArr3(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function lerpFinger(a: FingerBend, b: FingerBend, t: number): FingerBend {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function AnimatedHand({ target }: AnimatedHandProps) {
  const group = useRef<THREE.Group>(null);
  const current = useRef<HandPose>({ ...REST });

  useFrame((_, delta) => {
    const t = Math.min(1, delta * 6);
    const c = current.current;
    c.position = lerpArr3(c.position, target.position, t);
    c.rotation = lerpArr3(c.rotation, target.rotation, t);
    c.thumb = lerpFinger(c.thumb, target.thumb, t);
    c.index = lerpFinger(c.index, target.index, t);
    c.middle = lerpFinger(c.middle, target.middle, t);
    c.ring = lerpFinger(c.ring, target.ring, t);
    c.pinky = lerpFinger(c.pinky, target.pinky, t);
    c.spread = (c.spread ?? 0) + ((target.spread ?? 0) - (c.spread ?? 0)) * t;
    if (group.current) {
      group.current.position.set(...c.position);
      group.current.rotation.set(...c.rotation);
    }
  });

  const pose = current.current;
  const spread = pose.spread ?? 0;

  return (
    <group ref={group}>
      {/* Palm */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.9, 0.22]} />
        <meshStandardMaterial color="#eebf95" roughness={0.6} />
      </mesh>
      {/* Wrist */}
      <mesh position={[0, -0.65, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.5, 16]} />
        <meshStandardMaterial color="#d9a378" roughness={0.7} />
      </mesh>

      {/* Fingers across the top of the palm */}
      <Finger bend={pose.index}  position={[-0.24, 0.45, 0]} rotationZ={-spread} />
      <Finger bend={pose.middle} position={[-0.08, 0.46, 0]} rotationZ={-spread * 0.3} />
      <Finger bend={pose.ring}   position={[ 0.08, 0.45, 0]} rotationZ={ spread * 0.3} />
      <Finger bend={pose.pinky}  position={[ 0.24, 0.42, 0]} rotationZ={ spread} segments={[0.28, 0.24, 0.2]} radius={0.06} />

      {/* Thumb on the side */}
      <group position={[-0.34, -0.05, 0.05]} rotation={[0, 0, 1.0]}>
        <Finger bend={pose.thumb} position={[0, 0, 0]} segments={[0.3, 0.25, 0.2]} radius={0.085} />
      </group>
    </group>
  );
}

export default function SigningHand({ pose }: { pose: HandPose }) {
  const target = useMemo(() => pose, [pose]);
  return (
    <Canvas shadows camera={{ position: [0, 0.5, 3.2], fov: 40 }} dpr={[1, 2]}>
      <color attach="background" args={["#1B2A6B"]} />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[3, 4, 3]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#FF8A3D" />
      <AnimatedHand target={target} />
      <ContactShadows position={[0, -1.1, 0]} opacity={0.55} blur={2.4} scale={6} />
      <Environment preset="city" />
      <OrbitControls enablePan={false} minDistance={2.2} maxDistance={5} target={[0, 0, 0]} />
    </Canvas>
  );
}
