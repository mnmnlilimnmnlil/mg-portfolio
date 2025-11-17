import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import styles from './Skills.module.scss';

// 스킬 이미지 import
import html5Image from '../../assets/skills/HTML5.svg';
import sassImage from '../../assets/skills/Sass.svg';
import javascriptImage from '../../assets/skills/JavaScript.svg';
import reactImage from '../../assets/skills/React.svg';
import nodejsImage from '../../assets/skills/Node.js.svg';
import mongodbImage from '../../assets/skills/MongoDB.svg';
import gitImage from '../../assets/skills/Git.svg';
import githubImage from '../../assets/skills/GitHub.svg';
import npmImage from '../../assets/skills/NPM.svg';
import cursorImage from '../../assets/skills/cursor.png';
import figmaImage from '../../assets/skills/Figma.svg';
import adobeImage from '../../assets/skills/adobe.png';

const Skills = () => {
  const location = useLocation();
  const isStandalonePage = location.pathname === '/skills';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tooltip, setTooltip] = useState({ show: false, name: '', description: '', x: 0, y: 0 });
  
  const skillsByCategory = {
    frontend: {
      title: '프론트엔드',
      skills: [
        { 
          id: 'html5',
          name: 'HTML5', 
          image: html5Image,
          description: '의도에 맞는 시맨틱 태그 활용 웹 표준을 준수\n\nCDN을 통한 외부 라이브러리 import 최적화된 구조 설계'
        },
        { 
          id: 'css3',
          name: 'CSS3 / SCSS', 
          image: sassImage,
          description: '레이아웃 구성, 반응형 디자인, 애니메이션, CSS 변수 및 믹스인\n\nScss를 통한 구조적 스타일 관리 재사용성 높은 코드 작성'
        },
        { 
          id: 'javascript',
          name: 'Vanilla JavaScript (ES6+)', 
          image: javascriptImage,
          description: 'DOM 조작, 이벤트 제어, 비동기 처리(Promise/ async-await)\n\nIntersectionObserver를 활용한 스크롤 위치에 따른 인터렉션 애니메이션'
        },
        { 
          id: 'react',
          name: 'React', 
          image: reactImage,
          description: 'React Hooks(useState, useEffect, useContext 등) 기반의 상태 관리 및 컴포넌트 구조 설계\n\nContext API와 LocalStorage를 이용한 전역 상태 영속화 구현\n\nHashRouter 기반 SPA/MPA 구조 설계 및 정적 배포'
        },
      ]
    },
    backend: {
      title: '백엔드',
      skills: [
        { 
          id: 'nodejs',
          name: 'Node.js', 
          image: nodejsImage,
          description: 'Express 기반 서버 기초 구축 가능\n\n라우팅, 미들웨어 등록 및 단순 Rest API 작성'
        },
        { 
          id: 'mongodb',
          name: 'MongoDB', 
          image: mongodbImage,
          description: '데이터베이스 설계 및 Mongoose 연동 학습 중'
        },
      ]
    },
    environment: {
      title: '환경 및 배포',
      skills: [
        { 
          id: 'git',
          name: 'Git', 
          image: gitImage,
          description: '버전 관리 시스템\n\n로컬 저장소 관리, 커밋, 브랜치, 머지 등 기본 명령어 활용'
        },
        { 
          id: 'github',
          name: 'GitHub', 
          image: githubImage,
          description: '팀 프로젝트 진행시 버전 관리 및 협업 구조 세팅\n\nmain / develop / feature 브랜치 전략 수립 및 충돌 해결\n\n배포 자동화 및 협업 문서화'
        },
        { 
          id: 'npm',
          name: 'npm', 
          image: npmImage,
          description: '모듈 관리 및 프로젝트 관리\n\n패키지 설치, 스크립트 실행, 의존성 관리 등 기본운용'
        },
        { 
          id: 'cursor-ai',
          name: 'Cursor AI / Gemini CLI', 
          image: cursorImage,
          description: 'AI 코딩 어시스턴트를 활용한 폴더 구조 최적화, 반복 로직 자동화 에러 디버깅\n\n코드 실행 의도를 명확하게 프롬포트 작성'
        },
      ]
    },
    design: {
      title: '디자인',
      skills: [
        { 
          id: 'figma',
          name: 'Figma / Adobe XD', 
          image: figmaImage,
          description: 'UI/UX 설계 및 프로토타이핑\n\n디자이너와 협업 및 실제 인터렉션 구현 중심의 워크플로우 이해'
        },
        { 
          id: 'adobe',
          name: 'Adobe Creative Suite', 
          image: adobeImage,
          description: 'Adobe Photoshop / Illustrator / After Effects / Premiere Pro / 3D max\n\n시각적 표현 웹 및 인터렉션 기반 콘텐츠 제작에서 강점 보유'
        },
      ]
    },
  };

  const categoryTabs = [
    { key: 'all', title: '모두' },
    ...Object.entries(skillsByCategory).map(([key, category]) => ({
      key,
      title: category.title
    }))
  ];

  const getDisplayedSkills = () => {
    if (selectedCategory === 'all') {
      return Object.values(skillsByCategory).flatMap(category => category.skills);
    }
    return skillsByCategory[selectedCategory]?.skills || [];
  };

  const displayedSkills = getDisplayedSkills();
  const [containerRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const handleMouseEnter = (e, name, description) => {
    setTooltip({ show: true, name: name, description: description, x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (tooltip.show) {
      setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, name: '', description: '', x: 0, y: 0 });
  };

  return (
    <section 
      className={`${styles.skills} ${isStandalonePage ? styles.skillsStandalone : ''}`} 
      id="skills"
      onMouseMove={handleMouseMove}
    >
      <div 
        ref={containerRef}
        className={`${styles.skills__container} ${isVisible ? styles.skills__containerVisible : ''}`}
      >
        <h2 className={styles.skills__title}>
          <span className={styles.skills__titleHighlight}>기술</span>
        </h2>
        <p className={styles.skills__description}>
          사용할 수 있는 기술들을 소개합니다.
        </p>
        
        <div className={styles.skills__tabs}>
          {categoryTabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.skills__tab} ${selectedCategory === tab.key ? styles.skills__tabActive : ''}`}
              onClick={() => setSelectedCategory(tab.key)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <div className={styles.skills__grid}>
          {displayedSkills.map((skill) => (
            <div 
              key={skill.id} 
              className={styles.skills__itemWrapper}
              onMouseEnter={(e) => handleMouseEnter(e, skill.name, skill.description)}
              onMouseLeave={handleMouseLeave}
            >
              <div className={styles.skills__item}>
                <div className={styles.skills__imageWrapper}>
                  {skill.image ? (
                    <img 
                      src={skill.image} 
                      alt={skill.name}
                      className={`${styles.skills__image} ${skill.id === 'github' ? styles.skills__imageGitHub : ''}`}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) {
                          fallback.style.display = 'block';
                        }
                      }}
                    />
                  ) : null}
                  <span className={styles.skills__fallback} style={{ display: skill.image ? 'none' : 'block' }}>
                    {skill.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {tooltip.show && (
        <div 
          className={styles.skills__tooltip}
          style={{
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y + 15}px`,
          }}
        >
          <div className={styles.skills__tooltipName}>{tooltip.name}</div>
          <div className={styles.skills__tooltipDescription}>{tooltip.description}</div>
        </div>
      )}
    </section>
  );
};

export default Skills;

