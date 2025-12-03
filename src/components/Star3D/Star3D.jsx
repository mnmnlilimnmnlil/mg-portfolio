import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Star3D = ({ position = [0, 0, 0], rotationSpeed = 0.003 }) => {
  const groupRef = useRef();

  // 초기 사선 각도 설정 (왼쪽 위를 약간 쳐다보게)
  React.useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.PI / -5; // 약간 위로 기울임
      groupRef.current.rotation.y = Math.PI / -8; // 약간 왼쪽으로 회전 (약 -15도)
    }
  }, []);

  // 바람개비 회전 애니메이션 (Z축 중심) + 펄스 + 글로우 효과
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += rotationSpeed;
      
      // 펄스 효과 - 전체 크기가 커졌다 작아졌다 반복
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.03; // 10% 크기 변화
      groupRef.current.scale.set(pulse, pulse, pulse);
      
      // 글로우 효과 - emissiveIntensity가 변하며 빛이 깜빡임
      const glow = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.3; // 0.3 ~ 0.9 사이 변화
      // group의 모든 mesh children을 순회하며 material 업데이트
      groupRef.current.children.forEach((child) => {
        if (child.type === 'Mesh' && child.material) {
          child.material.emissiveIntensity = glow;
        }
      });
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
          emissive="#7F1A22"
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
    );
  }

  return (
    <group ref={groupRef} position={position}>
      {/* 왼쪽 위에서 도형을 비추는 조명 */}
      <pointLight position={[-3, 3, 4]} intensity={2} color="#F7A0A7" />
      <directionalLight position={[-3, 3, 4]} intensity={1.5} color="#F7A0A7" />
      {blocks}
    </group>
  );
};

export default Star3D;

