import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Button from '../../components/Button';
import styles from './ProjectDetail.module.scss';

// 프로젝트 이미지 import
import project1_1 from '../../assets/project/project1_1.png';
import project1_2 from '../../assets/project/project1_2.png';
import project1_3 from '../../assets/project/project1_3.png';
import project1_4 from '../../assets/project/project1_4.png';
import project1_5 from '../../assets/project/project1_5.png';
import project1_6 from '../../assets/project/project1_6.png';
import project1_7 from '../../assets/project/project1_7.png';
import project1_8 from '../../assets/project/project1_8.png';
import project1_9 from '../../assets/project/project1_9.png';

// 프로젝트 2 이미지 import
import project2_1 from '../../assets/project/project2_1.png';
import project2_2 from '../../assets/project/project2_2.png';
import project2_3 from '../../assets/project/project2_3.png';
import project2_4 from '../../assets/project/project2_4.png';
import project2_5 from '../../assets/project/project2_5.png';
import project2_6 from '../../assets/project/project2_6.png';
import project2_7 from '../../assets/project/project2_7.png';
import project2_8 from '../../assets/project/project2_8.png';
import project2_9 from '../../assets/project/project2_9.png';

// 프로젝트 3 이미지 import
import project3_1 from '../../assets/project/project3_1.png';
import project3_2 from '../../assets/project/project3_2.png';
import project3_3 from '../../assets/project/project3_3.png';
import project3_4 from '../../assets/project/project3_4.png';
import project3_5 from '../../assets/project/project3_5.png';
import project3_6 from '../../assets/project/project3_6.png';
import project3_7 from '../../assets/project/project3_7.png';
import project3_8 from '../../assets/project/project3_8.png';
import project3_9 from '../../assets/project/project3_9.png';

// 프로젝트 4 이미지 import
import project4_1 from '../../assets/project/project4_1.png';
import project4_2 from '../../assets/project/project4_2.png';
import project4_3 from '../../assets/project/project4_3.png';
import project4_4 from '../../assets/project/project4_4.png';
import project4_5 from '../../assets/project/project4_5.png';
import project4_6 from '../../assets/project/project4_6.png';

// 프로젝트 5 이미지 import
import project5_1 from '../../assets/project/project5_1.png';
import project5_2 from '../../assets/project/project5_2.png';
import project5_3 from '../../assets/project/project5_3.png';
import project5_4 from '../../assets/project/project5_4.png';
import project5_5 from '../../assets/project/project5_5.png';
import project5_6 from '../../assets/project/project5_6.png';

// 마크다운을 파싱하여 코드 블록과 텍스트를 분리하는 함수
const parseMarkdownWithCode = (text) => {
  if (!text) return [];

  const parts = [];
  let remainingText = text;
  let codeBlockIndex = 0;

  // 코드 블록을 찾아서 분리
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  let lastIndex = 0;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // 코드 블록 이전의 텍스트 추가
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      if (beforeText.trim()) {
        parts.push({ type: 'text', content: beforeText });
      }
    }

    // 코드 블록 추가
    const lang = match[1] || 'javascript';
    const code = match[2].trim();
    parts.push({ type: 'code', lang, code, id: `code-${codeBlockIndex++}` });

    lastIndex = match.index + match[0].length;
  }

  // 마지막 남은 텍스트 추가
  if (lastIndex < text.length) {
    const afterText = text.substring(lastIndex);
    if (afterText.trim()) {
      parts.push({ type: 'text', content: afterText });
    }
  }

  return parts.length > 0 ? parts : [{ type: 'text', content: text }];
};

// 마크다운을 HTML로 변환하는 유틸리티 함수
const parseMarkdown = (text) => {
  if (!text) return '';

  let html = text;

  // 코드 블록을 먼저 처리 (다른 마크다운이 파싱되지 않도록)
  const codeBlocks = [];
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const id = `code-${codeBlocks.length}`;
    codeBlocks.push({ id, lang: lang || '', code });
    return `__CODE_BLOCK_${id}__`;
  });

  // 인라인 코드 처리 (코드 블록이 아닌 경우만)
  html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');

  // 헤더 처리
  html = html.replace(/^### (.*?)$/gm, '<h4>$1</h4>');
  html = html.replace(/^## (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^# (.*?)$/gm, '<h2>$1</h2>');

  // 볼드 처리
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 줄 단위로 분리하여 처리
  const lines = html.split('\n');
  const processedLines = [];
  let inList = false;
  let listType = null;
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      const listTag = listType === 'ol' ? 'ol' : 'ul';
      processedLines.push(`<${listTag}>${listItems.join('')}</${listTag}>`);
      listItems = [];
    }
    inList = false;
    listType = null;
  };

  lines.forEach((line) => {
    const ulMatch = line.match(/^\- (.*)$/);
    const olMatch = line.match(/^\d+\. (.*)$/);

    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(`<li>${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(`<li>${olMatch[1]}</li>`);
    } else {
      flushList();
      if (line.trim()) {
        processedLines.push(line);
      } else {
        processedLines.push('<br />');
      }
    }
  });

  flushList();
  html = processedLines.join('\n');

  // 코드 블록 복원
  codeBlocks.forEach(({ id, lang, code }) => {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    html = html.replace(
      `__CODE_BLOCK_${id}__`,
      `<pre><code class="language-${lang}">${escapedCode}</code></pre>`
    );
  });

  // 줄바꿈 처리 (이미 처리된 리스트와 헤더는 제외)
  html = html.replace(/\n(?!<[hul])/g, '<br />');

  // 빈 줄 정리 (연속된 <br />를 하나로)
  html = html.replace(/(<br \/>\s*){3,}/g, '<br /><br />');

  return html;
};

const ProjectDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);

  // 프로젝트 데이터
  const projects = {
    '1': {
      id: '1',
      title: '차세대 교정 업무 시스템 "OK"',
      description: `교도관의 업무를 돕는 차세대 교정업무 시스템 OK 제작.

React를 활용한 인터랙티브한 사용자 경험과 현대적인 프론트엔드 아키텍처를 구현했습니다.`,
      tech: ['React', 'javascript', 'SCSS', 'Express', 'Axios', 'OpenAI API', 'GSAP'],
      images: [
        project1_1,
        project1_2,
        project1_3,
        project1_4,
        project1_5,
        project1_6,
        project1_7,
        project1_8,
        project1_9,
      ],
      link: 'https://mnmnlilimnmnlil.github.io/OK',
      github: '#',
      period: '2025.08 ~ 2025.12',
      role: '프론트엔드 팀장 (아키텍처 설계, 공통 CSS, 반응형 작업 담당)',
      introduction: `## 프로젝트 개요

**계원예술대학교 디지털미디어디자인과 졸업작품 프로젝트**

- **팀 구성**: 디자이너 4명 + 개발자 2명 (총 6명)
- **개발 기간**: 2025.08 ~ 2025.12
- **성과**: 졸업작품 최우수상 수상, 학과 연합 PT 참여 선정

## 역할: 개발 협업 방식 구조화, 아키텍처 설계 및 구현

- 전체 프로젝트 아키텍처 설계 (컴포넌트 구조, 스타일 시스템, 커스텀 훅)
- Main, SystemBefore, SmartWatch, OKe, Intro 페이지 개발
- 공통 컴포넌트 및 전역 스타일 시스템 구축

## 기술 스택

- **React**, **Vite**, **React Router DOM**
- **Sass/SCSS**, **CSS Modules**
- **Framer Motion**, **GSAP**
- **Express**, **Axios**, **OpenAI API**

## 주요 화면 및 기능

- **Main 페이지**: 스크롤 진행률에 따른 비디오 스케일 변화와 섹션 축소 효과
- **SystemBefore 페이지**: GSAP ScrollTrigger를 활용한 수평 스크롤 섹션
- **SmartWatch 페이지**: Framer Motion을 활용한 드래그 가능한 워치 캐러셀
- **Kiosk/Tablet 페이지**: 터치/마우스 통합 드래그 기반 대시보드 슬라이더
- **OKe 페이지**: OpenAI API를 활용한 AI 챗봇 인터페이스`,
      codeReview: `## 핵심 구현 사항

### 1) Intersection Observer 커스텀 훅

모든 페이지에서 광범위하게 사용되는 스크롤 기반 애니메이션 훅. 뷰포트에 보이는 요소만 애니메이션하여 불필요한 렌더링을 방지하고 성능을 최적화했습니다.

**구현 포인트:**
- \`triggerOnce\` 옵션으로 한 번만 트리거하거나 재진입 시마다 재생 가능
- 메모리 누수 방지를 위한 cleanup 로직
- 재사용 가능한 훅으로 여러 섹션에 적용

\`\`\`javascript
// src/hooks/useIntersectionObserver.js
export const useIntersectionObserver = (options = {}) => {
  const { threshold = 0.1, triggerOnce = false } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, hasIntersected]);

  return {
    ref,
    isIntersecting: triggerOnce ? hasIntersected : isIntersecting,
    hasIntersected
  };
};
\`\`\`

**실제 사용 예시:**

\`\`\`jsx
// Tablet 페이지에서 사용
const { ref: heroTextRef, isIntersecting: isHeroTextVisible } = useIntersectionObserver({
  threshold: 0.3,
  triggerOnce: true  // 한 번만 애니메이션 실행
});

// 재진입 시마다 애니메이션 재생
const { ref: videoRef, isIntersecting: isVideoVisible } = useIntersectionObserver({
  threshold: 0.25,
  triggerOnce: false  // 스크롤로 다시 보일 때마다 재생
});

return (
  <div ref={heroTextRef} className={isHeroTextVisible ? styles.animateIn : ''}>
    <h1>히어로 섹션</h1>
  </div>
);
\`\`\`

### 2) 드래그 기반 슬라이더 (터치/마우스 통합)

Kiosk, Tablet 페이지에서 사용되는 대시보드/비디오 슬라이더. 모바일과 데스크톱 모두에서 자연스러운 드래그 경험을 제공합니다.

**구현 포인트:**
- 터치와 마우스 이벤트를 통합 처리
- 드래그 중에는 transition 비활성화, 종료 시 활성화하여 부드러운 전환
- 임계값 기반 슬라이드 변경으로 의도치 않은 전환 방지

\`\`\`javascript
// src/pages/Kiosk/index.jsx
const JOINT_THRESHOLD = 0.18;  // 18% 이상 드래그해야 슬라이드 변경

const beginDrag = (clientX) => {
  const container = jointRef.current || jointTrackRef.current?.parentElement;
  jointWidth.current = container ? container.clientWidth : window.innerWidth;
  jointStartX.current = clientX;
  setJointDragX(0);
  setJointDragging(true);
};

const moveDrag = (clientX) => {
  if (jointStartX.current == null) return;
  setJointDragX(clientX - jointStartX.current);
};

const endDrag = () => {
  const movedRatio = Math.abs(jointDragX) / (jointWidth.current || 1);
  if (movedRatio > JOINT_THRESHOLD) {
    setJointIndex((prev) => {
      const next = jointDragX < 0 ? prev + 1 : prev - 1;
      return clamp(next, 0, dashboards.length - 1);
    });
  }
  jointStartX.current = null;
  setJointDragX(0);
  setJointDragging(false);
};

// 터치/마우스 이벤트 통합 처리
<div
  onTouchStart={(e) => {
    if (!e.touches || e.touches.length !== 1) return;
    beginDrag(e.touches[0].clientX);
  }}
  onTouchMove={(e) => {
    if (!e.touches || e.touches.length !== 1) return;
    moveDrag(e.touches[0].clientX);
  }}
  onTouchEnd={endDrag}
  onMouseDown={(e) => {
    e.preventDefault();
    beginDrag(e.clientX);
  }}
  onMouseMove={(e) => {
    if (jointDragging) moveDrag(e.clientX);
  }}
  onMouseUp={endDrag}
  onMouseLeave={() => jointDragging && endDrag()}
>
  <div
    ref={jointTrackRef}
    style={{
      transform: \`translateX(calc(\${-jointIndex * 100}% + \${jointDragX}px))\`,
      transition: jointDragging ? 'none' : 'transform 400ms ease',
    }}
  >
    {dashboards.map((src, i) => (
      <div key={i} className={styles.JointSlide}>
        <img src={src} alt={\`Dashboard\${i + 1}\`} draggable={false} />
      </div>
    ))}
  </div>
</div>
\`\`\`

**Tablet 페이지의 비디오 슬라이더 (성능 최적화):**

\`\`\`javascript
// 현재 슬라이드 비디오만 재생
const videoRefs = useRef([]);

useEffect(() => {
  videoRefs.current.forEach((v, i) => {
    if (!v) return;
    if (i === scdIndex) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;  // 다른 비디오는 처음으로 리셋
    }
  });
}, [scdIndex]);
\`\`\`

### 3) Main 페이지 스크롤 인터랙션

스크롤 진행률에 따른 비디오 스케일 변화와 섹션 축소 효과. \`requestAnimationFrame\`을 활용하여 스크롤 이벤트를 최적화했습니다.

**구현 포인트:**
- \`requestAnimationFrame\`으로 스크롤 이벤트 최적화
- 각 섹션마다 다른 반응 지점 설정
- 스크롤에 따라 비디오가 점진적으로 확대되며 섹션들이 축소되는 인터랙티브한 효과

\`\`\`javascript
// src/pages/Main/index.jsx
const [scrollProgress, setScrollProgress] = useState(0);
const [collapsedSections, setCollapsedSections] = useState(new Set());

useEffect(() => {
  let ticking = false;
  
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const rect = videoRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 비디오 스케일 계산 (0.3에서 1.0으로)
        const videoStart = windowHeight * 0.8;
        const videoEnd = 0;
        const totalDistance = videoStart - videoEnd;
        const currentDistance = videoStart - rect.top;
        const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));
        setScrollProgress(progress);

        // 섹션별 축소 로직 (각 섹션마다 다른 스크롤 지점)
        const newCollapsedSections = new Set();
        const currentScroll = window.scrollY;
        
        if (currentScroll > windowHeight * 1) newCollapsedSections.add(0);
        if (currentScroll > windowHeight * 1.4) newCollapsedSections.add(1);
        if (currentScroll > windowHeight * 1.8) newCollapsedSections.add(2);
        
        setCollapsedSections(newCollapsedSections);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // 초기 실행
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// 스크롤 진행률에 따른 스케일과 위치 계산
const scale = 0.3 + (scrollProgress * 0.7);
const translateY = (1 - scrollProgress) * 50;

<video
  style={{
    transform: \`scale(\${scale}) translateY(\${translateY}%)\`,
    transition: 'none'
  }}
/>
\`\`\`

### 4) GSAP ScrollTrigger (SystemBefore 페이지)

수평 스크롤 섹션 구현. 섹션을 고정(pin)하고 내부 요소만 수평 이동하여 스크롤로 탐색할 수 있게 했습니다.

**구현 포인트:**
- 섹션을 고정(pin)하고 내부 요소만 수평 이동
- 리사이즈 대응 및 cleanup 처리로 메모리 누수 방지
- 복잡한 설정과 cleanup 로직 구현

\`\`\`javascript
// src/pages/SystemBefore/index.jsx
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

useLayoutEffect(() => {
  const section = digitalizationSectionRef.current;
  const wrapper = infoBoxesWrapperRef.current;
  if (!section || !wrapper) return;

  const calcDistance = () => {
    const containerWidth = wrapper.scrollWidth;
    const viewportWidth = window.innerWidth;
    const padding = parseFloat(getComputedStyle(wrapper).paddingLeft || '0') + 
                    parseFloat(getComputedStyle(wrapper).paddingRight || '0');
    return -(containerWidth - viewportWidth - padding);
  };

  const calcScrollDistance = () => {
    const containerWidth = wrapper.scrollWidth;
    const viewportWidth = window.innerWidth;
    const padding = parseFloat(getComputedStyle(wrapper).paddingLeft || '0') + 
                    parseFloat(getComputedStyle(wrapper).paddingRight || '0');
    return Math.abs(containerWidth - viewportWidth - padding);
  };

  const ctx = gsap.context(() => {
    const scrollDistance = calcScrollDistance();
    
    gsap.to(wrapper, {
      x: calcDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: \`+=\${scrollDistance}\`,
        scrub: true,  // 스크롤과 동기화
        pin: true,    // 섹션 고정
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  }, section);

  const handleResize = () => ScrollTrigger.refresh();
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    ScrollTrigger.getAll().forEach(t => t.kill(true));
    ctx.revert();
    document.querySelectorAll(".pin-spacer").forEach(el => el.remove());
    gsap.set("html, body", { clearProps: "overflow" });
    gsap.set(wrapper, { clearProps: "transform" });
  };
}, [location.pathname]);
\`\`\`

### 5) Framer Motion 캐러셀 (SmartWatch 페이지)

드래그 가능한 워치 캐러셀과 텍스트 동기화. 드래그 속도와 거리를 모두 고려한 자연스러운 캐러셀을 구현했습니다.

**구현 포인트:**
- Framer Motion의 물리 기반 애니메이션 활용
- 워치와 텍스트 순서 분리 관리 (워치: 역순 [3,2,1,0], 텍스트: 정순 [0,1,2,3])
- 드래그 속도와 거리 기반 슬라이드 변경

\`\`\`javascript
// src/pages/SmartWatch/index.jsx
import { motion, useMotionValue } from 'framer-motion';

function CarouselSection({ items }) {
  const [offset, setOffset] = useState(0);
  const x = useMotionValue(0);
  const DRAG_BUFFER = 50;
  const VELOCITY_THRESHOLD = 500;

  const go = useCallback((dir) => 
    setOffset(i => (i + (dir > 0 ? 1 : -1) + items.length) % items.length), 
    [items.length]
  );

  const handleDragEnd = useCallback((_, info) => {
    const dragOffset = info.offset.x;
    const velocity = info.velocity.x;
    if (dragOffset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      go(1); // 오른쪽으로
    } else if (dragOffset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      go(-1); // 왼쪽으로
    }
    x.set(0);
  }, [go, x]);

  // 워치 순서: 역순 [3,2,1,0], 텍스트 순서: 정순 [0,1,2,3]
  const baseWatchOrder = [3, 2, 1, 0];
  const rotatedWatch = useMemo(() => {
    const arr = [...baseWatchOrder];
    const k = ((offset % items.length) + items.length) % items.length;
    return arr.slice(k).concat(arr.slice(0, k));
  }, [offset, items.length]);

  return (
    <motion.ul
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      style={{ x }}
      onDragEnd={handleDragEnd}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 150, damping: 50 }}
    >
      {rotatedWatch.slice(0, 3).map((idx, i) => (
        <li key={idx} className={i === 2 ? styles.isMain : styles.isMid}>
          <video src={items[idx].video} autoPlay muted loop playsInline />
        </li>
      ))}
    </motion.ul>
  );
}
\`\`\`

### 6) 모듈화된 SCSS 스타일 시스템

재사용 가능한 믹스인과 변수를 활용한 일관된 디자인 시스템. \`@use\`와 \`@forward\`를 활용하여 모듈 시스템을 구축했습니다.

**구현 포인트:**
- \`@use\`와 \`@forward\`로 모듈화
- SCSS 변수와 CSS 변수 혼용 (SCSS: 컴파일 시점, CSS: 런타임 변경 가능)
- CSS Modules로 컴포넌트별 스타일 격리

\`\`\`scss
// styles/mixins.scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin mobile {
  @media (max-width: 768px) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: 769px) and (max-width: 1024px) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: 1025px) {
    @content;
  }
}
\`\`\`

\`\`\`scss
// styles/main.scss
@use './color';
@use './font';
@use './mixins';
@forward './color';
@forward './font';
@forward './mixins';

:root {
  --site-margin: 100px;  // CSS 변수 (런타임 변경 가능)
  --site-gutter: 20px;
}

body {
  margin: 0 var(--site-margin);
  background-color: color.$color-dark;  // SCSS 변수
  font-family: font.$font-pretendard;
}
\`\`\`

**사용 예시:**

\`\`\`scss
// 각 페이지의 style.module.scss
@use '../../styles/main' as *;

.heroSection {
  background: $color-dark;        // color.scss 변수
  font-family: $font-pretendard;  // font.scss 변수
  margin: 0 var(--site-margin);   // CSS 변수
  
  @include flex-center;           // mixins.scss 믹스인
  
  @include mobile {
    padding: 2rem;
  }
}
\`\`\`

### 7) AI 챗봇 컴포넌트

React 상태 관리와 API 연동을 통한 점진적 UI 확장. 사용자가 첫 메시지를 보낼 때까지 컴팩트한 UI를 유지하고, 마크다운을 HTML로 변환하여 렌더링합니다.

**구현 포인트:**
- 점진적 UI 확장 (첫 메시지 전송 시 인터페이스 확장)
- 에러 핸들링과 로딩 상태 관리
- 마크다운을 HTML로 변환하여 렌더링
- 메시지 추가 시 자동 스크롤

\`\`\`javascript
// src/components/Chat.jsx
const [messages, setMessages] = useState([]);
const [isExpanded, setIsExpanded] = useState(false);

// 메시지 변경 시 자동 스크롤
useEffect(() => {
  if (messagesContainerRef.current && isExpanded) {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }
}, [messages, isLoading, isExpanded]);

const sendMessage = async () => {
  if (!inputMessage.trim() || isLoading) return;

  // 첫 메시지 전송 시 인터페이스 확장
  if (!isExpanded) {
    setIsExpanded(true);
  }

  const userMessage = { role: 'user', content: inputMessage };
  const newMessages = [...messages, userMessage];
  setMessages(newMessages);
  setInputMessage('');
  setIsLoading(true);

  const systemPrompt = {
    role: 'system',
    content: '교도관 업무 지원 AI 비서 OK-E입니다.'
  };

  try {
    const response = await axios.post('https://ok-production-92f2.up.railway.app/api/ok-e', {
      messages: [systemPrompt, ...newMessages],
      model: 'gpt-4o',
      temperature: 0.7
    });

    const assistantMessage = { 
      role: 'assistant', 
      content: response.data.message.content 
    };
    setMessages(prev => [...prev, assistantMessage]);
  } catch (error) {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '서버에 연결할 수 없습니다.'
    }]);
  } finally {
    setIsLoading(false);
  }
};

// 마크다운 렌더링 함수
const formatText = (text) => {
  return text
    .replace(/\\\`\\\`\\\`([\\s\\S]*?)\\\`\\\`\\\`/g, '<pre><code>$1</code></pre>')
    .replace(/\\\`([^\\\`]+)\\\`/g, '<code>$1</code>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
    .replace(/\\n/g, '<br>');
};
\`\`\`

## 트러블슈팅 및 개선 경험

### GSAP ScrollTrigger 메모리 누수 및 리사이즈 이슈
- **문제**: 페이지 전환 시 ScrollTrigger 인스턴스가 정리되지 않아 메모리 누수 발생, 리사이즈 시 레이아웃 깨짐
- **해결**: \`useLayoutEffect\`의 cleanup 함수에서 모든 ScrollTrigger 인스턴스를 \`kill(true)\`로 제거하고, \`pin-spacer\` 요소를 수동으로 제거하여 완전한 정리 구현

### 드래그 슬라이더 터치/마우스 이벤트 충돌
- **문제**: 터치와 마우스 이벤트가 동시에 발생하여 드래그가 중복 처리되거나 부자연스러운 동작 발생
- **해결**: \`isMainTabAnimating\`, \`isFlowTabAnimating\` 플래그로 애니메이션 중 입력 차단, 터치 이벤트에서 \`e.touches.length !== 1\` 체크로 멀티터치 방지

### SCSS 모듈 시스템 구축
- **문제**: 전역 스타일과 컴포넌트 스타일이 충돌하고, 반응형 코드가 중복됨
- **해결**: \`@use\`와 \`@forward\`를 활용한 모듈화된 SCSS 구조 구축, 믹스인으로 반응형 코드 재사용성 향상

### AI 챗봇 API 에러 핸들링
- **문제**: 네트워크 오류나 API 실패 시 사용자에게 명확한 피드백 부족
- **해결**: try-catch 블록으로 에러를 포착하고, 사용자 친화적인 에러 메시지를 표시하여 UX 개선

## 얻은 점

- 대규모 프로젝트에서 아키텍처 설계의 중요성을 경험
- 팀 협업을 통한 컴포넌트 구조와 스타일 시스템 표준화의 필요성 이해
- GSAP, Framer Motion 등 애니메이션 라이브러리 활용 경험
- 졸업작품 최우수상 수상을 통해 프로젝트 완성도와 실현 가능성 검증`
    },
    '2': {
      id: '2',
      title: '유기견 입양 플랫폼 "잇다"',
      description: `유기견과 사람을 따뜻하게 잇는 공간. React를 활용한 유기견 입양 및 후원 플랫폼을 구현했습니다.`,
      tech: ['React', 'JavaScript', 'React Router DOM', 'CSS', 'localStorage'],
      images: [
        project2_1,
        project2_2,
        project2_3,
        project2_4,
        project2_5,
        project2_6,
        project2_7,
        project2_8,
        project2_9,
      ],
      link: 'https://mnmnlilimnmnlil.github.io/itda/',
      period: '2025.03 ~ 2025.06',
      role: '프론트엔드 개발 (전체 페이지 개발, 상태 관리, 라우팅 설계)',
      introduction: `## 프로젝트 개요

**유기견 입양 및 후원 플랫폼**

- **개발 기간**: 2025.03 ~ 2025.06
- **목적**: 유기견과 입양을 원하는 사람들을 연결하고, 후원을 통해 보호소를 지원하는 플랫폼
- **성과**: 리액트 프로그래밍 성적 A+

## 역할: 웹 개발

- 전체 페이지 구조 설계 및 개발 (8개 페이지)
- Context API를 활용한 전역 상태 관리 (FavoritesContext)
- React Router HashRouter를 통한 SPA 라우팅 구현
- localStorage를 활용한 즐겨찾기 데이터 영구 저장

## 기술 스택

- **React**, **React Router DOM**
- **CSS Modules**, **CSS Variables**
- **localStorage API**
- **GitHub Pages 배포**

## 주요 화면 및 기능

- **홈페이지**: 프로젝트 소개 및 주요 기능 안내
- **아이들 만나기**: 다중 필터링 및 정렬 시스템을 통한 강아지 검색
- **상세 페이지**: 동적 라우팅을 활용한 강아지 상세 정보 및 입양 신청 모달
- **담아둔 친구들**: localStorage 연동 즐겨찾기 페이지
- **함께 나누기**: 카테고리별 필터링 및 가격순 정렬 상품 페이지`,
      codeReview: `## 핵심 구현 사항

### 1) FavoritesContext - 전역 상태 관리 및 localStorage 연동

사용자가 관심있는 강아지를 즐겨찾기로 저장하고, 브라우저를 닫아도 데이터가 유지되도록 구현했습니다.

**구현 포인트:**
- Context API를 활용한 전역 상태 관리
- localStorage와 동기화하여 데이터 영구 저장
- 중복 추가 방지 로직
- 컴포넌트 언마운트 시 자동 저장

\`\`\`javascript
// src/contexts/FavoritesContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // 컴포넌트 마운트 시 localStorage에서 데이터 로드
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
      }
    }
  }, []);

  // favorites 상태 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id) => {
    return favorites.some((dog) => dog.id === id);
  };

  const addToFavorites = (dog) => {
    if (!isFavorite(dog.id)) {
      setFavorites((prev) => [...prev, dog]);
    }
  };

  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((dog) => dog.id !== id));
  };

  const value = {
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
\`\`\`

**사용 예시:**

\`\`\`jsx
// src/pages/DogsPage.js
import { useFavorites } from "../contexts/FavoritesContext";

export default function DogsPage() {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleFavoriteToggle = (dog) => {
    if (isFavorite(dog.id)) {
      removeFromFavorites(dog.id);
    } else {
      addToFavorites(dog);
    }
  };

  return (
    <div>
      {dogs.map((dog) => (
        <button
          className={\`favorite-btn \${isFavorite(dog.id) ? "active" : ""}\`}
          onClick={() => handleFavoriteToggle(dog)}
        >
          {isFavorite(dog.id) ? "♥" : "♡"}
        </button>
      ))}
    </div>
  );
}
\`\`\`

### 2) 다중 필터링 및 정렬 시스템 (DogsPage)

지역, 크기, 나이, 성별 등 여러 조건을 동시에 필터링하고, 정렬 옵션을 제공하는 시스템을 구현했습니다.

**구현 포인트:**
- 여러 필터 조건을 객체로 관리하여 확장성 확보
- 나이 필터링 시 문자열 파싱 및 범위 체크
- 필터와 정렬을 분리하여 독립적으로 동작
- 필터 초기화 기능 제공

\`\`\`javascript
// src/pages/DogsPage.js
export default function DogsPage() {
  const [filters, setFilters] = useState({
    location: "all",
    size: "all",
    age: "all",
    gender: "all",
  });
  const [sortBy, setSortBy] = useState("latest");

  // 필터링 로직
  const filteredDogs = dogs.filter((dog) => {
    // 지역 필터 (부분 일치)
    if (filters.location !== "all" && !dog.location.includes(filters.location)) {
      return false;
    }
    
    // 크기 필터 (정확 일치)
    if (filters.size !== "all" && dog.size !== filters.size) {
      return false;
    }
    
    // 성별 필터 (정확 일치)
    if (filters.gender !== "all" && dog.gender !== filters.gender) {
      return false;
    }
    
    // 나이 필터 (범위 체크)
    if (filters.age !== "all") {
      const dogAge = Number.parseInt(dog.age.replace("살", ""));
      
      if (filters.age === "1살 미만" && dogAge >= 1) return false;
      if (filters.age === "1-3살" && (dogAge < 1 || dogAge > 3)) return false;
      if (filters.age === "4-6살" && (dogAge < 4 || dogAge > 6)) return false;
      if (filters.age === "7살 이상" && dogAge < 7) return false;
    }
    
    return true;
  });

  // 정렬 로직
  const sortedDogs = [...filteredDogs].sort((a, b) => {
    if (sortBy === "latest") {
      // isNew가 true인 항목을 우선 표시
      return b.isNew - a.isNew;
    } else if (sortBy === "name") {
      // 이름순 정렬 (한글 정렬)
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // 필터 초기화
  const resetFilters = () => {
    setFilters({
      location: "all",
      size: "all",
      age: "all",
      gender: "all",
    });
  };

  return (
    <div>
      {/* 필터 UI */}
      <select
        value={filters.location}
        onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
      >
        {locationOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* 정렬 버튼 */}
      <button onClick={() => setSortBy("latest")}>최신순</button>
      <button onClick={() => setSortBy("name")}>이름순</button>
      <button onClick={resetFilters}>필터 초기화</button>
      
      {/* 결과 표시 */}
      <p>총 {sortedDogs.length}마리</p>
    </div>
  );
}
\`\`\`

### 3) HashRouter를 활용한 SPA 라우팅

GitHub Pages 배포를 위해 HashRouter를 사용하여 클라이언트 사이드 라우팅을 구현했습니다.

**구현 포인트:**
- HashRouter를 사용하여 GitHub Pages 호환성 확보
- 동적 라우팅 (/:id)을 통한 상세 페이지 구현
- Navigation 컴포넌트에서 현재 경로 감지 및 활성 상태 표시

\`\`\`javascript
// src/App.js
import { HashRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import DogsPage from "./pages/DogsPage";
import DogDetailPage from "./pages/DogDetailPage";
import StorePage from "./pages/StorePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import StoriesPage from "./pages/StoriesPage";
import VolunteerPage from "./pages/VolunteerPage";
import FavoritesPage from "./pages/FavoritesPage";

function App() {
  return (
    <FavoritesProvider>
      <HashRouter>
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dogs" element={<DogsPage />} />
            <Route path="/dogs/:id" element={<DogDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/:id" element={<ProductDetailPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/volunteer" element={<VolunteerPage />} />
          </Routes>
        </main>
        <Footer />
      </HashRouter>
    </FavoritesProvider>
  );
}
\`\`\`

**Navigation에서 HashRouter 경로 처리:**

\`\`\`javascript
// src/components/Navigation.js
import { useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();
  
  // HashRouter 대응: hash에서 현재 경로 추출
  const currentPath = location.hash.replace("#", "") || "/";

  return (
    <nav>
      <Link
        to="/dogs"
        className={\`nav-link \${currentPath === "/dogs" ? "active" : ""}\`}
      >
        아이들 만나기
      </Link>
    </nav>
  );
}
\`\`\`

### 4) 반응형 네비게이션 및 모바일 메뉴

데스크톱과 모바일 환경 모두에서 사용하기 편한 반응형 네비게이션을 구현했습니다.

**구현 포인트:**
- 모바일에서 햄버거 메뉴로 전환
- 메뉴 열릴 때 스크롤 방지
- 즐겨찾기 개수를 배지로 표시
- 현재 페이지 활성 상태 표시

\`\`\`javascript
// src/components/Navigation.js
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { favorites } = useFavorites();

  // HashRouter 대응: hash에서 현재 경로 추출
  const currentPath = location.hash.replace("#", "") || "/";

  // 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <img
            src={\`\${process.env.PUBLIC_URL}/images/logo1.png\`}
            alt="잇다 로고"
          />
        </Link>
        
        {/* 데스크톱 메뉴 */}
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={\`nav-link \${currentPath === item.href ? "active" : ""}\`}
            >
              {item.label}
              {currentPath === item.href && (
                <div className="active-indicator"></div>
              )}
            </Link>
          ))}
          <Link to="/favorites" className="favorites-link">
            ♥ 담아둔 친구들
            {favorites.length > 0 && (
              <span className="favorites-badge">{favorites.length}</span>
            )}
          </Link>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* 모바일 메뉴 */}
        {isOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={\`mobile-nav-link \${currentPath === item.href ? "active" : ""}\`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/favorites"
                className="mobile-favorites-link"
                onClick={() => setIsOpen(false)}
              >
                ♥ 담아둔 친구들 {favorites.length > 0 && \`(\${favorites.length})\`}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
\`\`\`

### 5) 동적 라우팅 및 상세 페이지 (DogDetailPage)

URL 파라미터를 활용하여 각 강아지의 상세 정보를 표시하는 동적 라우팅을 구현했습니다.

**구현 포인트:**
- useParams 훅을 통한 URL 파라미터 추출
- 존재하지 않는 ID에 대한 에러 처리
- 입양 신청 모달 폼 구현
- 즐겨찾기 토글 기능

\`\`\`javascript
// src/pages/DogDetailPage.js
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext";
import CustomSelect from "../components/CustomSelect";

const dogDetails = {
  1: { id: 1, name: "초코", age: "2살", /* ... */ },
  2: { id: 2, name: "바둑이", age: "3살", /* ... */ },
  // ...
};

export default function DogDetailPage() {
  const { id } = useParams();
  const dog = dogDetails[Number.parseInt(id)];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    experience: "",
    message: "",
  });

  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // 존재하지 않는 강아지 처리
  if (!dog) {
    return (
      <div className="detail-page">
        <div className="empty-state">
          <div className="empty-icon">🐕</div>
          <h1>아이를 찾을 수 없어요</h1>
        </div>
      </div>
    );
  }

  const handleFavoriteToggle = () => {
    if (isFavorite(dog.id)) {
      removeFromFavorites(dog.id);
    } else {
      addToFavorites(dog);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    alert("입양 신청이 완료되었습니다.");
    setFormData({ name: "", phone: "", email: "", experience: "", message: "" });
  };

  return (
    <div className="detail-page">
      <div className="detail-grid">
        {/* 이미지 섹션 */}
        <div className="image-section">
          <img src={dog.imageUrl} alt={dog.name} />
          <button
            className={\`favorite-btn \${isFavorite(dog.id) ? "active" : ""}\`}
            onClick={handleFavoriteToggle}
          >
            {isFavorite(dog.id) ? "♥" : "♡"}
          </button>
        </div>

        {/* 정보 섹션 */}
        <div className="detail-card">
          <h1>{dog.name}</h1>
          <div className="detail-info">
            {dog.age} • {dog.breed} • {dog.gender}
          </div>
          
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              입양 신청하기
            </button>
          </div>
        </div>
      </div>

      {/* 입양 신청 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="modal-content">
            <h2>입양 신청서</h2>
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                placeholder="이름"
                required
              />
              <CustomSelect
                value={formData.experience}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, experience: value }))}
                options={experienceOptions}
              />
              <button type="submit">신청하기</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
\`\`\`

### 6) 카테고리 필터링 및 정렬 (StorePage)

상품을 카테고리별로 필터링하고 가격순으로 정렬하는 기능을 구현했습니다.

**구현 포인트:**
- 카테고리 버튼을 통한 필터링
- 가격순 정렬 (낮은순/높은순)
- 후원금 계산 및 표시 (구매 금액의 10%)

\`\`\`javascript
// src/pages/StorePage.js
export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortBy, setSortBy] = useState("latest");
  const categories = ["전체", "사료", "간식", "장난감", "침구", "산책용품", "미용용품"];

  // 카테고리 필터링
  const filteredProducts = selectedCategory === "전체" 
    ? products 
    : products.filter((product) => product.category === selectedCategory);

  // 정렬
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "price-asc") {
      return a.price - b.price;
    } else if (sortBy === "price-desc") {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="store-page">
      <div className="store-header">
        <h1>함께 나누기</h1>
        <p>구매 금액의 <strong>10%</strong>가 유기견 보호소에 후원됩니다</p>
      </div>

      {/* 카테고리 필터 */}
      <div className="filter-section">
        {categories.map((category) => (
          <button
            key={category}
            className={\`filter-button \${selectedCategory === category ? 'active' : ''}\`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 정렬 버튼 */}
      <div className="sort-buttons">
        <button onClick={() => setSortBy("latest")}>최신순</button>
        <button onClick={() => setSortBy("price-asc")}>가격낮은순</button>
        <button onClick={() => setSortBy("price-desc")}>가격높은순</button>
      </div>

      {/* 상품 그리드 */}
      <div className="products-grid">
        {sortedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <div className="product-price">
              <span>₩{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="price-original">₩{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <div className="donation-info">
              💝 후원금 ₩{Math.round(product.price * 0.1).toLocaleString()} (10%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

### 7) CustomSelect 컴포넌트

재사용 가능한 커스텀 셀렉트 컴포넌트를 구현하여 일관된 UI를 제공했습니다.

**구현 포인트:**
- 외부 클릭 시 자동 닫힘 (추가 구현 가능)
- 키보드 접근성 고려
- CSS Modules를 활용한 스타일링

\`\`\`javascript
// src/components/CustomSelect.js
import { useState } from "react";
import styles from "./CustomSelect.module.css";

export default function CustomSelect({ value, onValueChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.selectContainer}>
      <button
        type="button"
        className={styles.selectButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {options.find((option) => option.value === value)?.label || placeholder}
        </span>
        <span className={\`\${styles.arrow} \${isOpen ? styles.arrowOpen : ""}\`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={styles.option}
              onClick={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
\`\`\`

## 트러블슈팅 및 개선 경험

### localStorage 동기화 타이밍 이슈
- **문제**: 컴포넌트 마운트 시 localStorage에서 데이터를 읽기 전에 상태가 초기화되어 빈 배열로 시작되는 문제
- **해결**: \`useEffect\`를 두 개로 분리하여 마운트 시 로드와 상태 변경 시 저장을 독립적으로 처리, try-catch로 JSON 파싱 에러 처리

### HashRouter 경로 감지 문제
- **문제**: HashRouter 사용 시 \`location.pathname\`이 항상 "/"로 반환되어 현재 경로를 정확히 감지하지 못함
- **해결**: \`location.hash.replace("#", "")\`를 사용하여 실제 해시 경로를 추출하고, 빈 문자열일 경우 "/"로 기본값 설정

### 모바일 메뉴 스크롤 방지
- **문제**: 모바일 메뉴가 열릴 때 배경 스크롤이 가능하여 사용자 경험 저하
- **해결**: 메뉴 열림 상태에 따라 \`document.body.style.overflow\`를 제어하고, cleanup 함수에서 항상 원래 상태로 복원

### 나이 필터링 문자열 파싱
- **문제**: "2살", "3살" 같은 문자열을 숫자로 변환하여 범위 체크가 복잡함
- **해결**: \`Number.parseInt(dog.age.replace("살", ""))\`로 숫자 추출 후 범위별 조건문으로 명확하게 처리

### 동적 라우팅 에러 처리
- **문제**: 존재하지 않는 강아지 ID로 접근 시 에러 발생
- **해결**: \`dogDetails[Number.parseInt(id)]\`로 조회 후 null 체크하여 빈 상태(empty state) UI를 표시하여 사용자 친화적인 에러 처리

## 얻은 점

- Context API를 활용한 전역 상태 관리와 localStorage 연동 경험
- HashRouter를 통한 GitHub Pages 배포 호환성 확보
- 다중 필터링 및 정렬 시스템 설계 경험
- 리액트 프로그래밍 성적 A+를 통해 React 기초 실력 검증`
    },
    '3': {
      id: '3',
      title: '경조사 키오스크 서비스 "JO;IN"',
      description: `웹 개발 참여한 3인(디자인 2명 프로그래밍 1명) 팀 프로젝트입니다. Vanilla JavaScript 기반으로 경조사 키오스크 서비스 JO;IN의 인터랙션을 웹으로 구현했습니다.`,
      tech: ['Vanilla JavaScript', 'HTML', 'CSS', 'Intersection Observer API'],
      images: [
        project3_1,
        project3_2,
        project3_3,
        project3_4,
        project3_5,
        project3_6,
        project3_7,
        project3_8,
        project3_9,
      ],
      link: 'https://mnmnlilimnmnlil.github.io/Join',
      github: '#',
      period: '2025.03 ~ 2025.06',
      role: '웹 개발 전담, 기획/디자인 피드백 참여',
      introduction: `## 프로젝트 개요

**경조사 키오스크 서비스 웹사이트**

- **팀 구성**: 디자이너 2명 + 개발자 1명 (총 3명)
- **개발 기간**: 2025
- **성과**: 
  - 국제 커뮤니케이션 공모전: 우수상
  - 대한민국디자인전람회: 특선
  - 학과 연합 PT: 최우수작 발표 선정

## 역할: 웹 개발 전담

- 전체 웹사이트 1인 개발 (Vanilla JavaScript 기반)
- 탭 전환, 단계 안내(Flow), 스크롤 인터랙션 공통 구조 설계

## 기술 스택

- **Vanilla JavaScript**
- **HTML**, **CSS**
- **Intersection Observer API**
- **Lazy Loading**

## 주요 화면 및 기능

- **시작/메인**: 메뉴 클릭 → 부드러운 페이지 전환(페이드 아웃)
- **행사 소개 탭**: 메인 이미지 + 설명 3개 탭 전환
- **프로세스 안내**: 단계 인디케이터 클릭 → 이미지/설명 동기화 전환
- **스크롤 인터랙션**: 구간 진입 시 페이드인
- **이미지 최적화**: Lazy Loading을 통한 초기 로딩 시간 단축`,
      codeReview: `## 핵심 구현 사항

### 1) 페이지 전환 + 초기화 파이프라인

페이지 전환 시 페이드아웃 효과를 적용하고, 페이지 로드 시 모든 인터랙션을 초기화하는 파이프라인을 구현했습니다.

**구현 포인트:**
- 페이드아웃 후 페이지 이동으로 자연스러운 전환
- 리소스 로드 후 인터랙션 초기화로 초기 플리커 방지
- 스크롤 복원 비활성화로 일관된 사용자 경험

\`\`\`javascript
// 페이지 전환 효과
function smoothNav(url) {
  document.body.classList.add("fade-out")
  setTimeout(() => {
    window.location.href = url
  }, 500)
}

// 페이지 로드 시 초기화
window.addEventListener("load", () => {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual"
  }
  window.scrollTo(0, 0)

  document.body.classList.remove("fade-out")

  document.querySelectorAll(".instant-fade").forEach((el) => {
    el.classList.add("visible")
  })

  initLazyLoading()
  initScrollAnimations()
  initMainTabFunctionality()
  initFlowTabFunctionality()

  document.documentElement.style.scrollBehavior = "smooth"
})
\`\`\`

**의도**: 즉시 라우팅 대신 페이드아웃 후 이동해 전환이 자연스럽습니다.

**설계**: 리소스 로드 뒤에만 인터랙션을 붙여 초기 플리커를 줄입니다.

### 2) 이미지 지연 로딩 (Lazy Loading)

화면에 보이는 시점에만 이미지를 로드하여 초기 로딩 시간을 단축했습니다.

**구현 포인트:**
- Intersection Observer API 활용
- 이미지 로드 후 관찰 해제로 성능 최적화
- data-src 속성을 통한 지연 로딩

\`\`\`javascript
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
}
\`\`\`

**의도**: 화면에 보이는 시점에만 이미지를 로드해 초기 로딩을 가볍게 합니다.

**HTML 예시**: \`<img data-src="./gif/wedding-1.webp" alt="축의금 보내기" class="tab-image" />\`

### 3) 스크롤 인터섹션 애니메이션

스크롤 구간 진입 시 콘텐츠가 부드럽게 페이드인되도록 구현했습니다.

**구현 포인트:**
- Intersection Observer로 뷰포트 진입 감지
- 한 번 나타난 요소는 관찰 해제로 성능 부담 감소
- threshold와 rootMargin으로 트리거 시점 조절

\`\`\`javascript
function initScrollAnimations() {
  const scrollElements = document.querySelectorAll(".fade-box.scroll-hidden")
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.4,
      rootMargin: "0px 0px -5% 0px",
    }
  )

  scrollElements.forEach((el) => observer.observe(el))
}
\`\`\`

**의도**: 구간별로 콘텐츠가 부드럽게 등장해 가독성과 집중도를 높입니다.

**포인트**: 한 번 나타난 요소는 관찰을 해제해 성능 부담을 줄입니다.

### 4) 행사 소개 탭 전환(이미지+설명)

탭 클릭 시 이미지와 설명이 동시에 전환되도록 구현했습니다.

**구현 포인트:**
- 이미지와 텍스트 동시 전환으로 맥락 유지
- 애니메이션 중 중복 클릭 방지로 상태 꼬임 예방
- 페이드아웃/페이드인 애니메이션으로 부드러운 전환

\`\`\`javascript
function initMainTabFunctionality() {
  const tabRows = document.querySelectorAll(".tab-option-row")
  const mainImages = document.querySelectorAll(".main-image")
  const descriptions = document.querySelectorAll(".description-content")

  if (tabRows.length > 0) tabRows[0].classList.add("active")
  if (mainImages.length > 0) mainImages[0].classList.add("active")
  if (descriptions.length > 0) descriptions[0].classList.add("active")

  let isMainTabAnimating = false

  tabRows.forEach((row) => {
    row.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()

      const tabId = this.getAttribute("data-tab")
      if (!tabId || this.classList.contains("active") || isMainTabAnimating) return

      isMainTabAnimating = true

      tabRows.forEach((tab) => tab.classList.remove("active"))
      this.classList.add("active")

      const currentActiveImage = document.querySelector(".main-image.active")
      const currentActiveDesc = document.querySelector(".description-content.active")
      const targetImage = document.getElementById(\`main-image-\${tabId}\`)
      const targetDesc = document.getElementById(\`description-\${tabId}\`)

      let animationsCompleted = 0
      const totalAnimations = 2

      function onAnimationComplete() {
        animationsCompleted++
        if (animationsCompleted >= totalAnimations) {
          isMainTabAnimating = false
        }
      }

      if (currentActiveImage && targetImage) {
        currentActiveImage.classList.add("fade-out")
        setTimeout(() => {
          currentActiveImage.classList.remove("active", "fade-out")
          targetImage.classList.add("active", "fade-in")
          setTimeout(() => {
            targetImage.classList.remove("fade-in")
            onAnimationComplete()
          }, 300)
        }, 150)
      } else {
        onAnimationComplete()
      }

      if (currentActiveDesc && targetDesc) {
        currentActiveDesc.classList.add("fade-out")
        setTimeout(() => {
          currentActiveDesc.classList.remove("active", "fade-out")
          targetDesc.classList.add("active", "fade-in")
          setTimeout(() => {
            targetDesc.classList.remove("fade-in")
            onAnimationComplete()
          }, 300)
        }, 150)
      } else {
        onAnimationComplete()
      }
    })
  })
}
\`\`\`

**의도**: 비주얼(이미지)과 텍스트(설명)가 동시에 전환되어 맥락을 잃지 않습니다.

**안정성**: 애니메이션 중 중복 클릭을 막아 상태 꼬임을 예방합니다.

### 5) 프로세스 단계(Flow) 전환

단계별 안내를 직관적으로 탐색할 수 있도록 인디케이터-이미지-설명을 동기화했습니다.

**구현 포인트:**
- 인디케이터 클릭 시 이미지와 설명 동시 전환
- 탭 전환과 동일한 패턴으로 일관성 유지
- 애니메이션 완료 후 다음 동작 허용

\`\`\`javascript
function initFlowTabFunctionality() {
  const indicators = document.querySelectorAll(".indicator")
  let isFlowTabAnimating = false

  indicators.forEach((indicator) => {
    indicator.addEventListener("click", function () {
      const flowId = this.getAttribute("data-flow")
      if (this.classList.contains("active") || isFlowTabAnimating) return

      isFlowTabAnimating = true

      const currentActiveImage = document.querySelector(".flow-image.active")
      const currentActiveDesc = document.querySelector(".flow-description.active")
      const targetImage = document.getElementById(\`flow-image-\${flowId}\`)
      const targetDesc = document.getElementById(\`flow-desc-\${flowId}\`)

      indicators.forEach((ind) => ind.classList.remove("active"))
      this.classList.add("active")

      let animationsCompleted = 0
      const totalAnimations = 2

      function onAnimationComplete() {
        animationsCompleted++
        if (animationsCompleted >= totalAnimations) {
          isFlowTabAnimating = false
        }
      }

      if (currentActiveImage && targetImage) {
        currentActiveImage.classList.add("fade-out")
        setTimeout(() => {
          currentActiveImage.classList.remove("active", "fade-out")
          targetImage.classList.add("active", "fade-in")
          setTimeout(() => {
            targetImage.classList.remove("fade-in")
            onAnimationComplete()
          }, 300)
        }, 150)
      } else {
        onAnimationComplete()
      }

      if (currentActiveDesc && targetDesc) {
        currentActiveDesc.classList.add("fade-out")
        setTimeout(() => {
          currentActiveDesc.classList.remove("active", "fade-out")
          targetDesc.classList.add("active", "fade-in")
          setTimeout(() => {
            targetDesc.classList.remove("fade-in")
            onAnimationComplete()
          }, 300)
        }, 150)
      } else {
        onAnimationComplete()
      }
    })
  })
}
\`\`\`

**의도**: 단계별 안내를 직관적으로 탐색하도록 인디케이터-이미지-설명을 동기화합니다.

**포인트**: 전환 논리를 탭과 동일 패턴으로 유지해 일관성을 확보했습니다.

### 6) 스크롤 탑 버튼

긴 페이지에서 빠르게 최상단으로 복귀할 수 있는 기능을 구현했습니다.

**구현 포인트:**
- 네이티브 스무스 스크롤로 자연스러운 이동감 제공
- 간단한 클릭 이벤트로 구현

\`\`\`javascript
document.getElementById('scrollTopBtn').onclick = function() {
  window.scrollTo({top:0, behavior:'smooth'});
};
\`\`\`

**의도**: 긴 페이지에서도 빠르게 최상단으로 복귀합니다.

**접근성**: 네이티브 스무스 스크롤로 자연스러운 이동감을 제공합니다.

## 트러블슈팅 및 개선 경험

### 이미지 최적화
- **문제**: GIF 요구가 많아 초기 로딩이 느려짐
- **해결**: WebP 전환 + Lazy Loading 적용으로 초기 로딩 시간 단축, 스크롤 구간 네트워크 비용 감소

### 반응형 보강
- **문제**: 발표 환경(노트북/HDMI) 중심으로 그리드 재배치 필요
- **해결**: 다양한 해상도에서도 UI 깨짐 없는 안정 동작

### 인터랙션 안정성
- **문제**: 애니메이션 중 중복 클릭으로 인한 레이스 컨디션
- **해결**: 애니메이션 중 입력 차단/관찰 해제로 레이스 및 중복 처리 방지

## 얻은 점

- 기획→디자인→개발 전 과정을 팀원들과 협업해보는 좋은 경험
- 성능(로딩/전환)과 사용성(명확한 내비게이션) 사이의 균형을 설계로 해결
- 공모전 수상을 통해 결과물의 완성도와 실현 가능성을 검증`
    },
    '4': {
      id: '4',
      title: '청년 취업 현실 게임 "No Exit"',
      description: `Vanilla JavaScript 기반으로 청년 취업 현실을 은유적으로 표현한 미로 탐색 게임을 구현했습니다.`,
      tech: ['Vanilla JavaScript', 'HTML', 'CSS'],
      images: [
        project4_1,
        project4_2,
        project4_3,
        project4_4,
        project4_5,
        project4_6,
      ],
      link: 'https://mnmnlilimnmnlil.github.io/noexit/',
      github: '#',
      period: '2025.03 ~ 2025.06',
      role: '기획, 디자인, 개발 전담',
      introduction: `## 프로젝트 개요

**청년 취업 현실 게임 "No Exit"**

- **개발 기간**: 2025.03 ~ 2025.06
- **목적**: 청년 취업 현실을 은유적으로 표현한 시리어스 게임 제작
- **성과**: 자바스크립트 과목 A+

## 역할: 기획, 디자인, 개발 전담

- 전체 게임 기획 및 디자인
- Vanilla JavaScript 기반 게임 로직 구현
- 캐릭터 시스템, 아이템 시스템, 이벤트 시스템 설계

## 기술 스택

- **Vanilla JavaScript**
- **HTML**, **CSS**
- **Canvas API** (미로 렌더링)

## 주요 화면 및 기능

- **시작 화면**: 게임 타이틀, 글리치 효과, 게임 시작 버튼
- **튜토리얼 화면**: 게임 방법, 조작법, 시스템 설명
- **캐릭터 선택**: 6가지 배경별 캐릭터 (평범한 집안, 금수저, 흙수저, 장애인 가족, 다문화 가정, 한부모 가정)
- **게임 화면**: 20x20 미로, 정신력/시간 게이지, 아이템 수집, 이벤트 발생
- **게임 오버**: 성공/실패 결과, 통계 표시, 재도전 옵션`,
      codeReview: `## 핵심 구현 사항

### 1) 게임 상태 관리 시스템

여러 타이머와 복잡한 게임 상태를 통합 관리하는 시스템을 구현했습니다.

**구현 포인트:**
- gameState 객체로 모든 게임 상태 통합 관리
- 여러 타이머 동시 관리 (gameTimer, breathTimer, respawnTimer, eventTimer)
- 타이머 충돌 방지를 위한 clearAllTimers() 함수
- 캐릭터 특성과 게임 상태의 복잡한 상호작용 처리

\`\`\`javascript
const gameState = {
  currentScreen: "start",
  selectedCharacter: null,
  playerPos: { x: 1, y: 1 },
  oxygen: BASE_BREATH,
  timeRemaining: GAME_TIME,
  itemsCollected: 0,
  moveCount: 0,
  gameOver: false,
  cells: [],
  items: [],
  gameTimer: null,
  respawnTimer: null,
  breathTimer: null,
  eventTimer: null,
  visionRange: 1,
  isOxygenLocked: false,
  // ... 기타 상태들
};

function clearAllTimers() {
  if (gameState.gameTimer) clearInterval(gameState.gameTimer);
  if (gameState.respawnTimer) clearInterval(gameState.respawnTimer);
  if (gameState.breathTimer) clearInterval(gameState.breathTimer);
  if (gameState.eventTimer) clearInterval(gameState.eventTimer);
}
\`\`\`

**의도**: 복잡한 게임 상태를 하나의 객체로 관리하여 디버깅과 유지보수를 용이하게 했습니다.

**안정성**: 타이머 정리 함수로 메모리 누수와 타이머 충돌을 방지했습니다.

### 2) 랜덤 이벤트 시스템

확률 기반 랜덤 이벤트 시스템을 구현하여 게임의 재미와 예측 불가능성을 높였습니다.

**구현 포인트:**
- 확률 기반 발생 (Math.random()과 probability 값)
- 쿨다운 시스템으로 30초 간격 이벤트 발생 제한
- 캐릭터별 특수 이벤트 (다문화 가정 전용 '문화 교류' 이벤트)
- 이벤트 효과와 메시지 시스템

\`\`\`javascript
const RANDOM_EVENTS = [
  {
    id: "lucky_break",
    name: "행운의 기회",
    probability: 0.05,
    message: "🍀 갑작스런 행운이 찾아왔다!\\n'추천서를 써주겠다'는 연락이 왔다.",
    effect: (traits) => {
      gameState.oxygen = Math.min(BASE_BREATH * traits.breathMod, gameState.oxygen + 40);
      gameState.visionRange = Math.max(gameState.visionRange, 2.5);
      showSpecialEffect("🌟 행운의 별이 빛난다! 🌟", "success");
      setTimeout(() => {
        gameState.visionRange = traits.visionRange;
        drawMap();
      }, 15000);
    },
  },
  // ... 기타 이벤트들
];

function triggerRandomEvent() {
  if (gameState.gameOver || gameState.isEventCooldown) return;
  
  const random = Math.random();
  const availableEvents = RANDOM_EVENTS.filter(event => random < event.probability);
  
  if (availableEvents.length > 0) {
    const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
    event.effect(CHARACTER_TRAITS[gameState.selectedCharacter]);
    showMessage(event.message, "event");
    gameState.isEventCooldown = true;
    setTimeout(() => {
      gameState.isEventCooldown = false;
    }, 30000);
  }
}
\`\`\`

**의도**: 확률 기반 이벤트로 게임의 예측 불가능성과 재미를 높였습니다.

**포인트**: 쿨다운 시스템으로 이벤트가 과도하게 발생하는 것을 방지했습니다.

### 3) 아이템 시스템

캐릭터별로 다른 반응과 효과를 가지는 아이템 시스템을 구현했습니다.

**구현 포인트:**
- 캐릭터별 아이템 반응 (각 캐릭터마다 다른 메시지와 효과)
- 확률 기반 생성 (rarity 값으로 아이템 등장 확률 조절)
- 복합 효과 (정신력 회복 + 시간 감소 등 여러 상태 동시 변경)

\`\`\`javascript
const itemTypes = [
  {
    type: "soju",
    text: "소주",
    rarity: 0.3,
    effectMessage: "소주 한 병을 마셨다...\\n잠시나마 현실을 잊을 수 있었어.\\n+정신력 회복 +25\\n-시간 -60초",
    characterMessages: {
      1: "소주 한 잔에 시름을 잊는다...",
      2: "아니 뭔 소주.. 양주,와인,샴페인을 먹어야지",
      3: "요즘은 소주도 비싸잖아..",
      // ... 캐릭터별 메시지
    },
    effect: (traits) => {
      gameState.oxygen = Math.min(BASE_BREATH * traits.breathMod, gameState.oxygen + 25 * traits.itemBoost);
      gameState.timeRemaining = Math.max(0, gameState.timeRemaining - 60);
      updateTimeDisplay();
    },
  },
  // ... 기타 아이템들
];

function collectItem(item) {
  const traits = CHARACTER_TRAITS[gameState.selectedCharacter];
  const characterMessage = item.characterMessages[gameState.selectedCharacter] || item.effectMessage;
  
  showMessage(characterMessage, "success");
  item.effect(traits);
  playSFX("item");
}
\`\`\`

**의도**: 캐릭터별로 다른 아이템 반응으로 게임의 다양성과 몰입도를 높였습니다.

**포인트**: rarity 값으로 아이템 등장 확률을 조절하여 게임 밸런스를 조정했습니다.

### 4) 캐릭터 시스템

6가지 배경별 캐릭터의 능력치와 특수 능력을 차별화하여 구현했습니다.

**구현 포인트:**
- 능력치 차별화 (breathMod, visionRange, moveSpeed 등)
- 특수 능력 (금수저 특권, 문화적 회복력 등)
- 캐릭터별 메시지 (벽 충돌 시 각 배경에 맞는 현실적 메시지)

\`\`\`javascript
const CHARACTER_TRAITS = {
  2: { // 금수저 집안
    name: "금수저 집안",
    icon: "./images/golden-character.png",
    class: "golden",
    breathMod: 1.2, // 부유한 환경으로 인한 여유로운 호흡
    visionRange: 1.5, // 최고의 교육으로 넓은 시야
    moveSpeed: 1.2, // 최상의 조건으로 빠른 이동
    itemChance: 1.5, // 부유한 환경으로 높은 아이템 획득 확률
    itemBoost: 1.5, // 최상의 조건으로 강한 아이템 효과
    wallDamage: 0.5, // 벽 충돌 데미지 감소
    specialAbility: "goldPrivilege", // 금수저 특권
    wallMessages: [
      "💼 '아버지 지인에게 연락해볼까?'",
      "🎓 '해외 유학을 고려해볼까?'",
      // ... 캐릭터별 벽 충돌 메시지
    ],
  },
  // ... 기타 캐릭터들
};

function activateGoldPrivilege() {
  gameState.goldPrivilegeActive = true;
  gameState.oxygen = Math.min(BASE_BREATH * CHARACTER_TRAITS[2].breathMod, gameState.oxygen + 30);
  showSpecialEffect("✨ 금수저 특권 발동! ✨", "golden");
  setTimeout(() => {
    gameState.goldPrivilegeActive = false;
  }, 10000);
}
\`\`\`

**의도**: 각 캐릭터의 배경에 맞는 능력치와 특수 능력으로 게임플레이를 차별화했습니다.

**포인트**: 캐릭터별 메시지로 사회적 메시지를 자연스럽게 전달했습니다.

### 5) 플레이어 이동 및 충돌 처리

캐릭터별 이동 제한과 특수 능력 발동을 포함한 이동 시스템을 구현했습니다.

**구현 포인트:**
- 캐릭터별 이동 제한 (장애인 캐릭터는 확률적으로 이동 실패)
- 아이템 획득 로직 (findIndex로 현재 위치 아이템 검색 및 효과 적용)
- 특수 능력 발동 (벽 충돌 시 캐릭터별 특수 능력 확률적 발동)

\`\`\`javascript
function movePlayer(dx, dy) {
  if (gameState.gameOver) return;
  
  const traits = CHARACTER_TRAITS[gameState.selectedCharacter];
  const currentTime = Date.now();
  
  // 장애인 캐릭터 이동 제한
  if (gameState.selectedCharacter === 4 && Math.random() > traits.moveSpeed) {
    showMessage("움직이기 어렵다... 다시 시도해보자.", "warning");
    return;
  }
  
  const newX = gameState.playerPos.x + dx;
  const newY = gameState.playerPos.y + dy;
  
  if (gameMap[newY][newX] === TILE_TYPES.PATH) {
    // 이동 성공 처리
    gameState.playerPos = { x: newX, y: newY };
    gameState.moveCount++;
    
    // 아이템 획득 체크
    const itemIndex = gameState.items.findIndex(item => 
      item.x === gameState.playerPos.x && item.y === gameState.playerPos.y
    );
    
    if (itemIndex !== -1) {
      const item = gameState.items[itemIndex];
      gameState.itemsCollected++;
      showMessage(item.effectMessage, "success");
      item.effect(traits);
      gameState.items.splice(itemIndex, 1);
    }
    
    // 출구 도달 체크
    if (gameState.playerPos.x === realExit[0] && gameState.playerPos.y === realExit[1]) {
      endGame(true);
    }
  } else {
    // 벽 충돌 처리
    const wallMessages = traits.wallMessages || wallMessages;
    const randomMessage = wallMessages[Math.floor(Math.random() * wallMessages.length)];
    showMessage(randomMessage, "danger");
    
    // 특수 능력 발동 체크
    if (gameState.selectedCharacter === 2 && !gameState.goldPrivilegeActive && Math.random() < 0.1) {
      activateGoldPrivilege();
    }
  }
}
\`\`\`

**의도**: 캐릭터별 이동 제한과 특수 능력으로 게임의 다양성과 전략성을 높였습니다.

**안정성**: 이동 전 유효성 검사로 게임 상태 오류를 방지했습니다.

### 6) 미로 렌더링 시스템

동적 DOM 생성과 시야 시스템을 포함한 미로 렌더링 시스템을 구현했습니다.

**구현 포인트:**
- 동적 DOM 생성 (20x20 셀을 동적으로 생성하여 메모리 효율성 확보)
- 시야 시스템 (거리 계산으로 플레이어 주변만 보이도록 제한)
- 캐릭터별 스타일 (traits.class로 캐릭터별 시각적 차별화)

\`\`\`javascript
function drawMap() {
  if (!gameContainer) return;
  
  // 셀 초기화
  if (gameState.cells.length === 0) {
    for (let y = 0; y < MAZE_SIZE; y++) {
      gameState.cells[y] = [];
      for (let x = 0; x < MAZE_SIZE; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        gameContainer.appendChild(cell);
        gameState.cells[y][x] = cell;
      }
    }
  }
  
  const traits = CHARACTER_TRAITS[gameState.selectedCharacter];
  
  for (let y = 0; y < MAZE_SIZE; y++) {
    for (let x = 0; x < MAZE_SIZE; x++) {
      const cell = gameState.cells[y][x];
      cell.className = "cell";
      cell.innerHTML = "";
      
      // 벽 렌더링
      if (gameMap[y][x] === TILE_TYPES.WALL) cell.classList.add("wall");
      
      // 플레이어 렌더링
      if (x === gameState.playerPos.x && y === gameState.playerPos.y) {
        cell.classList.add("player", traits.class);
        const img = document.createElement("img");
        img.src = traits.icon;
        img.alt = traits.name;
        img.classList.add("player-image");
        cell.appendChild(img);
      }
      
      // 시야 범위 적용
      const distance = Math.sqrt(
        Math.pow(x - gameState.playerPos.x, 2) + Math.pow(y - gameState.playerPos.y, 2)
      );
      if (distance <= gameState.visionRange) {
        cell.classList.add("visible");
      } else {
        cell.classList.add("invisible");
      }
    }
  }
}
\`\`\`

**의도**: 시야 시스템으로 게임의 난이도와 몰입도를 높였습니다.

**포인트**: 동적 DOM 생성으로 메모리 효율성을 확보했습니다.

## 트러블슈팅 및 개선 경험

### 복잡한 게임 상태 관리
- **문제**: 여러 타이머와 게임 상태가 분산되어 관리가 어려움
- **해결**: gameState 객체로 모든 상태를 통합 관리하고, clearAllTimers() 함수로 안전한 타이머 정리 구현

### 타이머 충돌 문제
- **문제**: 여러 타이머가 동시에 실행되면서 충돌 발생
- **해결**: clearAllTimers() 함수로 모든 타이머를 안전하게 정리하고, 타이머 시작 전 기존 타이머 제거

### 캐릭터별 특성 차별화
- **문제**: 6가지 캐릭터의 능력치와 특수 능력을 체계적으로 관리하기 어려움
- **해결**: CHARACTER_TRAITS 객체로 캐릭터별 능력치, 특수 능력, 메시지를 체계적으로 관리

### 사운드 시스템 구현
- **문제**: 여러 사운드 파일을 개별적으로 관리하기 어려움
- **해결**: SOUNDS 객체로 효과음/배경음악을 통합 관리하고, 에러 처리를 통해 안정성 확보

## 얻은 점

- Vanilla JavaScript의 DOM 조작, 이벤트 처리, 타이머 관리, 상태 관리 등 다양한 기능을 구현해볼 수 있었음
- ChatGPT를 전략적으로 코드 보조 도구로 활용하며 효율적 구현 방법 습득 및 AI 프롬프트 구체화 방법 습득
- 사회적 메시지가 담긴 의미있는 작품 제작 경험
- 자바스크립트 과목 A+를 통해 JavaScript 기초 실력 검증`
    },
    '5': {
      id: '5',
      title: '감정 탐구 웹사이트 "감정이란"',
      description: `처음으로 혼자 기획, 디자인, 개발을 모두 맡아 진행한 개인 프로젝트입니다. HTML/CSS 기반으로 5가지 감정(행복, 슬픔, 불안, 분노, 혐오)을 탐구하는 웹사이트를 구현했습니다.`,
      tech: ['HTML', 'CSS'],
      images: [
        project5_1,
        project5_2,
        project5_3,
        project5_4,
        project5_5,
        project5_6,
      ],
      link: 'https://mnmnlilimnmnlil.github.io/emotion/',
      github: '#',
      period: '2024.11 ~ 2024.12',
      role: '기획, 디자인, 개발 전담',
      introduction: `## 프로젝트 개요

**감정 탐구 웹사이트 "감정이란"**

- **개발 기간**: 2024.11 ~ 2024.12
- **목적**: 5가지 감정(행복, 슬픔, 불안, 분노, 혐오)을 탐구하고, 각 감정이 나에게 미치는 영향과 그것을 성장으로 만드는 방법을 나누기 위한 웹사이트
- **성과**: HTML/CSS 강의 A+, 학과 연합 PT 참여 선정

## 역할: 기획, 디자인, 개발 전담

- 전체 웹사이트 기획 및 디자인
- HTML/CSS 기반 반응형 웹사이트 구현
- 5가지 감정별 페이지 디자인 및 개발

## 기술 스택

- **HTML**
- **CSS**
- **반응형 디자인**

## 주요 화면 및 기능

- **메인 페이지**: 감정 소개 및 5가지 감정 카드 뷰
- **감정별 상세 페이지**: 각 감정(행복, 슬픔, 불안, 분노, 혐오)의 반응, 다루는 법, 개인적 경험
- **고정 네비게이션**: 스크롤 시에도 항상 상단에 고정
- **반응형 디자인**: 데스크톱, 태블릿, 모바일 환경 대응
- **인터랙티브 요소**: hover 효과, marquee 애니메이션, 이미지 필터 효과`,
      codeReview: `## 핵심 구현 사항

### 1) 반응형 레이아웃 시스템

다양한 화면 크기에 대응하는 반응형 레이아웃을 구현했습니다.

**구현 포인트:**
- 미디어 쿼리를 활용한 화면 크기별 레이아웃 조정
- float 기반 레이아웃에서 flex로 전환하는 반응형 구조
- 모바일 환경에서 이미지와 텍스트 영역 재배치

\`\`\`css
@media screen and (max-width: 1200px) {
  #section_1 #main_img {
    width: 100%;
  }
  
  #section_2 #happy_box #img_box {
    width: 100%;
  }
  
  #section_2 #happy_box #about_text {
    width: 100%;
    height: 40%;
  }
}

@media screen and (max-width: 600px) {
  #section_2 {
    height: 950vh;
  }
  
  #section_2 #about_box #about_text ul li:nth-child(1) {
    font-size: 20px;
  }
}
\`\`\`

**의도**: 다양한 디바이스에서 일관된 사용자 경험을 제공하기 위해 반응형 디자인을 구현했습니다.

**포인트**: 화면 크기별로 레이아웃을 재구성하여 가독성과 사용성을 확보했습니다.

### 2) 감정별 색상 테마 시스템

각 감정마다 고유한 색상 테마를 적용하여 시각적 차별화를 구현했습니다.

**구현 포인트:**
- 행복: rgb(255, 215, 0) - 노란색
- 슬픔: rgb(25, 158, 201) - 파란색
- 불안: rgb(255, 83, 15) - 주황색
- 분노: rgb(214, 33, 16) - 빨간색
- 혐오: rgb(160, 215, 69) - 초록색
- hover 시 배경색 변경으로 인터랙티브한 효과

\`\`\`css
#section_2 #happy_box:hover {
  background-color: rgb(255, 215, 0);
  transition: all 0.3s;
  color: white;
}

#section_2 #sad_box:hover {
  background-color: rgb(25, 158, 201);
  transition: all 0.3s;
  color: white;
}

#section_2 #anger_box:hover {
  background-color: rgb(214, 33, 16);
  transition: all 0.3s;
  color: white;
}
\`\`\`

**의도**: 각 감정의 특성을 색상으로 시각화하여 사용자가 직관적으로 이해할 수 있도록 했습니다.

**포인트**: hover 효과로 감정별 색상이 자연스럽게 전환되도록 구현했습니다.

### 3) 이미지 필터 효과

hover 시 이미지에 grayscale 필터를 적용하여 인터랙티브한 효과를 구현했습니다.

**구현 포인트:**
- 기본 상태: grayscale(100%)로 흑백 처리
- hover 상태: grayscale(0%)로 컬러 전환
- transition으로 부드러운 전환 효과

\`\`\`css
#section_2 #happy_box #img_box {
  filter: grayscale(100%);
  transition: all 0.3s;
}

#section_2 #happy_box #img_box:hover {
  filter: grayscale(0%);
  transition: all 0.3s;
}
\`\`\`

**의도**: 이미지에 hover 효과를 적용하여 사용자의 관심을 유도하고 인터랙티브한 경험을 제공했습니다.

**포인트**: transition을 활용하여 자연스러운 색상 전환 효과를 구현했습니다.

### 4) 고정 네비게이션

스크롤 시에도 항상 상단에 고정되는 네비게이션을 구현했습니다.

**구현 포인트:**
- position: fixed로 고정 위치 설정
- z-index로 다른 요소 위에 표시
- 각 메뉴 항목 hover 시 감정별 색상으로 변경

\`\`\`css
nav {
  width: 100%;
  height: 80px;
  background: white;
  position: fixed;
  z-index: 9999;
  border-bottom: 1px solid rgb(201, 201, 201);
}

header ul li:nth-child(5) a:hover {
  color: rgb(255, 215, 0); /* 행복 */
  font-weight: 800;
}

header ul li:nth-child(4) a:hover {
  color: rgb(25, 158, 201); /* 슬픔 */
  font-weight: 800;
}
\`\`\`

**의도**: 사용자가 언제든지 다른 페이지로 이동할 수 있도록 항상 접근 가능한 네비게이션을 제공했습니다.

**포인트**: 각 메뉴 항목에 감정별 색상을 적용하여 일관된 디자인 시스템을 구축했습니다.

### 5) Marquee 애니메이션

감정 관련 한자와 한글을 스크롤하는 marquee 애니메이션을 구현했습니다.

**구현 포인트:**
- marquee 태그를 활용한 텍스트 스크롤
- direction 속성으로 좌우 스크롤 방향 제어
- 반복되는 텍스트로 연속적인 애니메이션 효과

\`\`\`html
<marquee direction="left">
  행복 幸福 슬픔 悲傷 두려움 恐怖 분노 憤怒 사랑 愛 행복 幸福 슬픔 悲傷
  두려움 恐怖 분노 憤怒 사랑 愛...
</marquee>

<marquee direction="right">
  행복 幸福 슬픔 悲傷 두려움 恐怖 분노 憤怒 사랑 愛...
</marquee>
\`\`\`

**의도**: 감정의 흐름을 시각적으로 표현하고, 페이지의 동적인 느낌을 주기 위해 marquee 애니메이션을 적용했습니다.

**포인트**: 좌우 방향으로 다른 텍스트를 스크롤하여 시각적 흥미를 높였습니다.

### 6) 섹션별 레이아웃 구조

각 감정 페이지마다 일관된 레이아웃 구조를 적용했습니다.

**구현 포인트:**
- 섹션 1: 이미지와 텍스트 박스의 50:50 분할 레이아웃
- 섹션 2: 카드 형태의 반응 그리드 레이아웃
- 섹션 3: 이미지와 3단 컬럼 텍스트 레이아웃
- 섹션 4: 원형 이미지와 텍스트의 좌우 분할 레이아웃

\`\`\`css
#section_1 #happy_1 {
  width: 50%;
  float: left;
  height: 100%;
}

#section_1 #happy_1_text_box {
  width: 50%;
  height: 100%;
  background: rgb(214, 33, 16);
  float: left;
  position: relative;
}

#section2 ul {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
\`\`\`

**의도**: 각 섹션마다 적절한 레이아웃을 적용하여 정보의 가독성과 시각적 흐름을 확보했습니다.

**포인트**: float와 flex를 적절히 조합하여 다양한 레이아웃을 구현했습니다.

## 트러블슈팅 및 개선 경험

### 반응형 레이아웃 구현
- **문제**: float 기반 레이아웃이 모바일 환경에서 깨지는 현상
- **해결**: 미디어 쿼리를 활용하여 화면 크기별로 레이아웃을 재구성하고, 모바일에서는 이미지와 텍스트를 세로로 배치

### 이미지와 텍스트 정렬
- **문제**: float를 사용한 레이아웃에서 요소들이 예상대로 정렬되지 않음
- **해결**: clear 속성과 적절한 margin 설정으로 요소들의 정렬 문제 해결

### hover 효과 일관성
- **문제**: 각 감정 박스의 hover 효과가 일관되지 않음
- **해결**: 동일한 transition 속성과 색상 변경 로직을 적용하여 일관된 사용자 경험 제공

### 모바일 네비게이션
- **문제**: 모바일 환경에서 네비게이션 메뉴가 화면을 가리는 문제
- **해결**: 고정 네비게이션의 높이를 고려하여 섹션 상단에 적절한 여백 추가

## 얻은 점

- HTML/CSS 기초를 탄탄히 다질 수 있는 좋은 기회
- 반응형 디자인 구현을 통해 다양한 디바이스 환경을 고려한 개발 경험
- float와 flex를 활용한 레이아웃 구현 방법 습득
- CSS transition과 filter를 활용한 인터랙티브 효과 구현 경험
- HTML/CSS 강의 A+를 통해 웹 개발 기초 실력 검증
- 학과 연합 PT 참여 선정을 통해 프로젝트 완성도와 발표 능력 검증`
    }
  };

  const project = projects[id] || {
    id: id,
    title: 'Project Title',
    description: '프로젝트 상세 설명이 들어갈 곳입니다.',
    tech: ['React', 'TypeScript', 'SCSS'],
    images: [
      '/project-image-1.jpg',
      '/project-image-2.jpg',
      '/project-image-3.jpg',
    ],
    link: '#',
    github: '#',
    introduction: '프로젝트 소개가 들어갈 곳입니다.',
    codeReview: '코드 리뷰 내용이 들어갈 곳입니다.',
  };

  return (
    <section className={styles.projectDetail}>
      <div className={styles.projectDetail__container}>
        <div className={styles.projectDetail__header}>
          <h1 className={styles.projectDetail__title}>
            <span className={styles.projectDetail__titleHighlight}>{project.title}</span>
          </h1>
          <div className={styles.projectDetail__tech}>
            {project.tech.map((tech) => (
              <span key={tech} className={styles.projectDetail__techTag}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.projectDetail__links}>
          <Button
            variant="tertiary"
            href={project.link}
            target="_blank"
            className={styles.projectDetail__link}
          >
            <FaExternalLinkAlt /> 사이트 방문
          </Button>
        </div>

        <div className={styles.projectDetail__content}>
          <div className={styles.projectDetail__section}>
            <div 
              className={styles.projectDetail__introduction}
              dangerouslySetInnerHTML={{ 
                __html: project.introduction 
                  ? parseMarkdown(project.introduction)
                  : project.description.replace(/\n/g, '<br />')
              }}
            />
          </div>

          <div className={styles.projectDetail__section}>
            <h2 className={styles.projectDetail__sectionTitle}>
              포트폴리오 이미지
            </h2>
            <div className={styles.projectDetail__images}>
              {project.images.map((image, index) => (
                <div 
                  key={index} 
                  className={styles.projectDetail__imageWrapper}
                  onClick={() => setSelectedImage(image)}
                >
                  <img 
                    src={image} 
                    alt={`${project.title} 이미지 ${index + 1}`}
                    className={styles.projectDetail__image}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
            
            {selectedImage && (
              <div 
                className={styles.projectDetail__imageModal}
                onClick={() => setSelectedImage(null)}
              >
                <FaTimes 
                  className={styles.projectDetail__imageModalClose}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                />
                <img 
                  src={selectedImage} 
                  alt="확대 이미지"
                  className={styles.projectDetail__imageModalContent}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>

          <div className={styles.projectDetail__section}>
            <div className={styles.projectDetail__codeReview}>
              {project.codeReview ? (
                parseMarkdownWithCode(project.codeReview).map((part, index) => {
                  if (part.type === 'code') {
                    return (
                      <div key={part.id || index} className={styles.projectDetail__codeBlock}>
                        <SyntaxHighlighter
                          language={part.lang}
                          style={vscDarkPlus}
                          showLineNumbers
                          customStyle={{
                            margin: 0,
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                          }}
                        >
                          {part.code}
                        </SyntaxHighlighter>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={index}
                        dangerouslySetInnerHTML={{
                          __html: parseMarkdown(part.content)
                        }}
                      />
                    );
                  }
                })
              ) : (
                <div>코드 리뷰 내용이 들어갈 곳입니다.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail;

