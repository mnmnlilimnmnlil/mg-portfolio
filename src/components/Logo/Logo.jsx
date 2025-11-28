import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Logo.module.scss';

const Logo = ({ size = 40, animated = true }) => {
  // 중심점
  const centerX = 50;
  const centerY = 50;
  const radius = 35;
  
  // * 모양을 위한 8개 방향의 선
  const lines = [
    { angle: 0 },      // 오른쪽
    { angle: 45 },     // 오른쪽 위 대각선
    { angle: 90 },     // 위
    { angle: 135 },    // 왼쪽 위 대각선
    { angle: 180 },    // 왼쪽
    { angle: 225 },    // 왼쪽 아래 대각선
    { angle: 270 },    // 아래
    { angle: 315 },    // 오른쪽 아래 대각선
  ];

  const getLineCoords = (angle) => {
    const radian = (angle * Math.PI) / 180;
    const x = centerX + radius * Math.cos(radian);
    const y = centerY + radius * Math.sin(radian);
    return { x, y };
  };

  return (
    <Link to="/" className={styles.logo}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={animated ? styles.logo__animated : ''}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glowStrong">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* 터지는 효과 - 중앙에서 터지는 작은 채워진 원들 */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12;
          const radian = (angle * Math.PI) / 180;
          const distance = 30; // 터지는 거리
          const x = distance * Math.cos(radian);
          const y = distance * Math.sin(radian);
          return (
            <circle
              key={`burst-${i}`}
              cx="50"
              cy="50"
              r="2"
              className={styles[`logo__burst${i + 1}`]}
              fill="currentColor"
              filter="url(#glowStrong)"
              style={{
                '--tx': `${x}`,
                '--ty': `${y}`,
              }}
            />
          );
        })}
        {/* 곱셈 연산자 * 모양 - 중심에서 8방향으로 뻗어나가는 선 */}
        {lines.map((line, index) => {
          const { x, y } = getLineCoords(line.angle);
          return (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className={styles[`logo__line${index + 1}`]}
            />
          );
        })}
      </svg>
    </Link>
  );
};

export default Logo;

