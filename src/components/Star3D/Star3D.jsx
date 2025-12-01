import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Star3D = ({ position = [0, 0, 0], rotationSpeed = 0.003 }) => {
  const groupRef = useRef();

  // 초기 사선 각도 설정 (정면에서 아주 살짝 눕히기)
  React.useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.PI / -5; // 약 10도 기울임
    }
  }, []);

  // 바람개비 회전 애니메이션 (Z축 중심)
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += rotationSpeed;
    }
  });

  // 곱셈 연산자 * 모양 - 8방향 블록 생성
  // 중심에서 바깥으로 뻗어나가는 형태
  const blocks = [];
  const innerRadius = 0; // 중심에서 시작 (구멍 없음)
  const outerRadius = 1.7; // 끝나는 거리 (조금 더 길게)
  const blockWidth = 0.35; // 더 도톰하게
  const blockHeight = 0.35; // 더 도톰하게

  for (let i = 0; i < 8; i++) {
    const angle = (i * 360) / 8;
    const radian = (angle * Math.PI) / 180;
    const cos = Math.cos(radian);
    const sin = Math.sin(radian);
    
    // 중심에서 바깥으로 뻗어나가는 박스
    const centerX = (outerRadius / 2) * cos;
    const centerY = (outerRadius / 2) * sin;
    const blockLength = outerRadius;

    blocks.push(
      <mesh
        key={i}
        position={[centerX, centerY, 0]}
        rotation={[0, 0, radian]}
      >
        <boxGeometry args={[blockLength, blockWidth, blockHeight]} />
        <meshStandardMaterial
          color="#E63946"
          emissive="#E63946"
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
    );
  }

  return (
    <group ref={groupRef} position={position}>
      {blocks}
    </group>
  );
};

export default Star3D;

