import React from 'react';
import { useParams } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';
import Button from '../../components/Button';
import styles from './ProjectDetail.module.scss';

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

  // 프로젝트 데이터
  const projects = {
    '1': {
      id: '1',
      title: '차세대 교정 업무 시스템 OK',
      description: `교도관의 업무를 돕는 차세대 교정업무 시스템 OK 제작.

React를 활용한 인터랙티브한 사용자 경험과 현대적인 프론트엔드 아키텍처를 구현했습니다.`,
      tech: ['React', 'Vite', 'React Router DOM', 'Sass/SCSS', 'react-bit', 'Framer Motion', 'GSAP', 'Express', 'Axios'],
      images: [
        '/project-image-1.jpg',
        '/project-image-2.jpg',
        '/project-image-3.jpg',
      ],
      link: 'https://mnmnlilimnmnlil.github.io/OK',
      github: '#',
      period: '2025.08 ~ 2025.11',
      role: '프론트엔드 팀장 (아키텍처 설계, 공통 CSS, 반응형 작업 담당)',
      introduction: `## 프로젝트 개요

**OK**는 교정시설의 효율적인 관리를 위한 통합 시스템으로, 태블릿, 스마트워치, 키오스크 등 다양한 디바이스를 응용한 프로젝트입니다.

- **개발 기간**: 2025.08 ~ 2025.11
- **팀 구성**: 개발자 2명 (개발 팀장 역할)
- **역할**: 프론트엔드 팀장으로 전체 아키텍처 설계, 공통 CSS 시스템 구축, 반응형 믹스인 정의, 프로젝트 구조 설계 및 대부분의 핵심 기능 구현 담당
- **협업**: 다른 개발자는 설계된 구조 안에서 키오스크 페이지, 디자인 가이드 페이지, 태블릿 페이지 제작에 참여
- **주요 성과**: 
  - React 기반의 현대적인 컴포넌트 아키텍처 구축
  - 성능 최적화를 위한 커스텀 훅 및 최적화 기법 적용
  - react-bit을 활용한 배경 효과 구현
  - 반응형 디자인 및 접근성 고려

## 기술 스택

- **React**, **Vite**, **React Router DOM**
- **Sass/SCSS**, **CSS Modules**
- **react-bit**, **Framer Motion**, **GSAP**
- **Express**, **Axios**, **OpenAI API**`,
      codeReview: `## 핵심 구현 사항

### 1. Intersection Observer 기반 스크롤 애니메이션

스크롤 성능을 최적화하기 위해 커스텀 훅을 구현했습니다.

\`\`\`javascript
import { useEffect, useRef, useState } from 'react';

/**
 * Intersection Observer를 사용한 섹션 감지 훅
 * @param {Object} options - Intersection Observer 옵션
 * @param {number} options.threshold - 교차점 임계값 (0-1)
 * @param {string} options.rootMargin - 루트 마진
 * @param {boolean} options.triggerOnce - 한 번만 트리거할지 여부
 * @returns {Object} { ref, isIntersecting, hasIntersected }
 */
export const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = false
  } = options;

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
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, hasIntersected]);

  return {
    ref,
    isIntersecting: triggerOnce ? hasIntersected : isIntersecting,
    hasIntersected
  };
};
\`\`\`

**구현 포인트:**
- 메모리 누수 방지를 위한 cleanup 로직
- \`triggerOnce\` 옵션으로 불필요한 재렌더링 방지
- 재사용 가능한 훅으로 여러 섹션에 적용

**사용 예시:**
\`\`\`jsx
const { ref, isIntersecting } = useIntersectionObserver({
  threshold: 0.3,
  triggerOnce: true
});

<div ref={ref} className={isIntersecting ? styles.animateIn : ''}>
  {/* 컨텐츠 */}
</div>
\`\`\`

### 2. 드래그 기반 슬라이더 구현

터치와 마우스 이벤트를 모두 지원하는 드래그 슬라이더를 구현했습니다.

**구현 포인트:**
- **터치/마우스 이벤트 통합**: 모바일과 데스크톱 모두 지원
- **임계값 기반 슬라이드**: 일정 거리 이상 드래그해야 슬라이드 변경
- **부드러운 애니메이션**: 드래그 중에는 transition 비활성화, 종료 시 활성화
- **경계 처리**: 첫 번째/마지막 슬라이드에서 멈춤

### 3. 모듈화된 스타일 시스템

SCSS 모듈과 믹스인을 활용한 일관된 디자인 시스템을 구축했습니다. 공통 CSS, 반응형 믹스인, 디자인 시스템을 모두 직접 정의하여 프로젝트 전반에 일관된 스타일을 적용하고, 다른 개발자가 쉽게 사용할 수 있도록 구조화했습니다.

\`\`\`scss
// styles/mixins.scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
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

**장점:**
- 재사용 가능한 스타일 패턴
- 반응형 디자인 일관성 유지
- 유지보수 용이성

### 4. react-bit 기반 배경 효과

react-bit 라이브러리를 활용한 배경 효과를 구현했습니다.

**구현 포인트:**
- **경량 라이브러리 활용**: WebGL 대신 react-bit으로 번들 크기 최적화
- **성능 최적화**: React 컴포넌트 기반으로 관리 용이
- **반응형 대응**: 다양한 화면 크기에 자동 대응

### 5. AI 챗봇 컴포넌트

React 상태 관리와 API 연동을 통한 챗봇 인터페이스를 구현했습니다.

**구현 포인트:**
- **점진적 UI 확장**: 첫 메시지 전송 시 인터페이스 확장
- **에러 핸들링**: 네트워크 오류 시 사용자 친화적 메시지 표시
- **로딩 상태 관리**: 중복 요청 방지 및 UX 개선
- **마크다운 렌더링**: AI 응답의 마크다운을 HTML로 변환

## 디자인 시스템

### 컬러 팔레트
- **메인 블루**: #0015ff
- **오렌지**: #ff4d00
- **다크 그레이**: #171717
- **라이트 그레이**: #f7f7f7

### 타이포그래피
- **기본 폰트**: Pretendard (한글 최적화)
- **제목 폰트**: Gotham (영문 제목용)

### 반응형 브레이크포인트
- **Mobile**: 768px 이하
- **Tablet**: 769px ~ 1024px
- **Desktop**: 1025px 이상`
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
                <div key={index} className={styles.projectDetail__imageWrapper}>
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
          </div>

          <div className={styles.projectDetail__section}>
            <div 
              className={styles.projectDetail__codeReview}
              dangerouslySetInnerHTML={{ 
                __html: project.codeReview
                  ? parseMarkdown(project.codeReview)
                  : '코드 리뷰 내용이 들어갈 곳입니다.'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail;

