import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Star3D from '../Star3D/Star3D';
import Particles from './Particles';
import styles from './Hero3D.module.scss';

const Hero3D = () => {
  return (
    <div className={styles.hero3D}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* 조명 */}
          <ambientLight intensity={0.8} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#E63946" />
          <pointLight position={[-5, -5, 5]} intensity={0.8} color="#F7A0A7" />
          <directionalLight position={[0, 5, 0]} intensity={1}  color="#F7A0A7"/>
          
          {/* 정면 조명 - 카메라 방향에서 비춤 */}
          <directionalLight position={[0, 0, 6]} intensity={0.8} color="#F7A0A7" />
          <pointLight position={[0, 0, 5]} intensity={1}color="#F7A0A7" />
          
          {/* 추가 조명들 */}
          {/* 왼쪽 위에서 - 도형이 보는 방향에 맞춰 강화 (초기 로딩 시 도형이 잘 보이도록) */}
          <directionalLight position={[-4, 4, 8]} intensity={2} color="#F7A0A7" />
          <pointLight position={[-4, 4, 8]} intensity={2.5} color="#F7A0A7" />
          
          {/* 오른쪽 아래에서 */}
          <directionalLight position={[3, -3, 4]} intensity={0.7} color="#F7A0A7"/>
          <pointLight position={[3, -3, 4]} intensity={1} color="#F7A0A7"/>
          {/* 오른쪽 위에서 */}
          <directionalLight position={[-3, -3, 4]} intensity={0.7} color="#F7A0A7"/>
          <pointLight position={[-3, -3, 4]} intensity={1} color="#F7A0A7"/>
          
          {/* 뒤쪽 조명 */}
          <directionalLight position={[0, 0, -6]} intensity={0.6} color="#F7A0A7" />
          <pointLight position={[0, 0, -5]} intensity={0.9} color="#F7A0A7" />
          
          {/* 배경 파티클 */}
          <Particles count={80} />
          
          {/* 3D 곱셈 연산자 */}
          <Star3D rotationSpeed={0.008} />
          
          {/* 카메라 컨트롤 - 360도 회전 가능, 줌 비활성화 */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            minDistance={4}
            maxDistance={10}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Hero3D;

