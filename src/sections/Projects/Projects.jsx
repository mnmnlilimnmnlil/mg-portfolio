import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import styles from './Projects.module.scss';

// 프로젝트 비디오 import
import projectVideo01 from '../../assets/video/projectVideo01.mp4';
import projectVideo02 from '../../assets/video/projectVideo02.mp4';
import projectVideo03 from '../../assets/video/projectVideo03.mp4';
import projectVideo04 from '../../assets/video/projectVideo04.mp4';
import projectVideo05 from '../../assets/video/projectVideo05.mp4';

const Projects = () => {
  const location = useLocation();
  const isStandalonePage = location.pathname === '/projects';
  // sessionStorage에서 이전 상태 불러오기
  const [showAll, setShowAll] = useState(() => {
    const saved = sessionStorage.getItem('projectsShowAll');
    return saved === 'true';
  });
  const projectRefs = useRef({});
  const videoRefs = useRef({});
  const moreButtonRef = useRef(null);
  const isInitialMount = useRef(true);
  const prevShowAllRef = useRef(showAll);
  
  const allProjects = [
    {
      id: 1,
      title: '차세대 교정 업무 시스템 "OK"',
      description: `교도관의 업무를 돕는 차세대 교정업무 시스템. React 기반의 현대적인 아키텍처와 성능 최적화, GPT API를 활용한 챗봇을 구현했습니다.`,
      tech: ['React', 'javascript', 'SCSS', 'Express', 'Axios', 'OpenAI API', 'GSAP' ],
      video: projectVideo01,
      link: 'https://mnmnlilimnmnlil.github.io/OK',
      period: '2025.08 ~ 2025.12',
    },
    {
      id: 2,
      title: '유기견 입양 플랫폼 "잇다"',
      description: `유기견과 사람을 따뜻하게 잇는 공간. React를 활용한 유기견 입양 및 후원 플랫폼을 구현했습니다.`,
      tech: ['React', 'JavaScript', 'React Router DOM', 'CSS', 'localStorage'],
      video: projectVideo02,
      link: 'https://mnmnlilimnmnlil.github.io/itda/',
      period: '2025.03 ~ 2025.06',
    },
    {
      id: 3,
      title: '경조사 키오스크 서비스 "JO;IN"',
      description: `Vanilla JavaScript 기반으로 경조사 키오스크 서비스 JO;IN의 인터랙션을 웹으로 구현했습니다.`,
      tech: ['Vanilla JavaScript', 'HTML', 'CSS', 'Intersection Observer API'],
      video: projectVideo03,
      link: 'https://mnmnlilimnmnlil.github.io/Join',
      period: '2025.03 ~ 2025.06',
    },
    {
      id: 4,
      title: '청년 취업 현실 게임 "No Exit"',
      description: `Vanilla JavaScript 기반으로 청년 취업 현실을 은유적으로 표현한 미로형 시리어스 게임을 구현했습니다.`,
      tech: ['Vanilla JavaScript', 'HTML', 'CSS'],
      video: projectVideo04,
      link: '#',
      period: '2025.03 ~ 2025.06',
    },
    {
      id: 5,
      title: '감정 탐구 웹사이트 "감정이란"',
      description: `처음으로 HTML/CSS 기반으로 5가지 감정(행복, 슬픔, 불안, 분노, 혐오)을 탐구하는 웹사이트를 구현했습니다.`,
      tech: ['HTML', 'CSS'],
      video: projectVideo05,
      link: '#',
      period: '2024.11 ~ 2024.12',
    },
  ];

  const displayedProjects = showAll ? allProjects : allProjects.slice(0, 3);
  const hasMore = allProjects.length > 3;
  const [containerRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  // showAll 상태 변경 시 sessionStorage에 저장
  useEffect(() => {
    sessionStorage.setItem('projectsShowAll', showAll.toString());
  }, [showAll]);

  // 접기 버튼 클릭 시 (showAll이 false로 변경될 때) "더 둘러보기" 버튼이 화면 하단에 보이도록 즉시 이동
  useEffect(() => {
    // 초기 마운트가 아니고, showAll이 true에서 false로 변경된 경우에만 실행
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevShowAllRef.current = showAll;
      return;
    }

    if (!showAll && prevShowAllRef.current === true) {
      // showAll이 true에서 false로 변경된 경우만 실행 (접기 버튼 클릭)
      // 레이아웃 변경이 완료된 후 스크롤 위치 재계산
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const moreButtonElement = moreButtonRef.current;
          if (moreButtonElement) {
            const rect = moreButtonElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const elementBottom = rect.bottom + scrollTop;
            const viewportHeight = window.innerHeight;
            // 버튼의 하단이 화면 하단에 오도록 계산
            const targetPosition = elementBottom - viewportHeight + 40; // 하단 여백 40px
            
            const lenisInstance = window.lenisInstance;
            if (lenisInstance) {
              lenisInstance.scrollTo(targetPosition, {
                immediate: true,
              });
            } else {
              window.scrollTo({
                top: targetPosition,
                behavior: 'auto'
              });
            }
          }
        });
      });
    }
    
    prevShowAllRef.current = showAll;
  }, [showAll]);

  // 초기 마운트 처리
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, []);

  return (
    <section className={`${styles.projects} ${isStandalonePage ? styles.projectsStandalone : ''}`} id="projects">
      <div 
        ref={containerRef}
        className={`${styles.projects__container} ${isVisible ? styles.projects__containerVisible : ''}`}
      >
        <h2 className={styles.projects__title}>
          <span className={styles.projects__titleHighlight}>프로젝트</span>
        </h2>
        <p className={styles.projects__description}>
          제작한 프로젝트들을 소개합니다.
        </p>
        
        <div className={styles.projects__grid}>
          {displayedProjects.map((project) => (
            <div 
              key={project.id} 
              className={styles.projects__card}
              ref={(el) => {
                if (el) {
                  projectRefs.current[project.id] = el;
                }
              }}
              onMouseEnter={() => {
                if (project.video && videoRefs.current[project.id]) {
                  videoRefs.current[project.id].play();
                }
              }}
              onMouseLeave={() => {
                if (project.video && videoRefs.current[project.id]) {
                  videoRefs.current[project.id].pause();
                  videoRefs.current[project.id].currentTime = 0;
                }
              }}
            >
              <div className={styles.projects__cardLink}>
                <Link to={`/projects/${project.id}`} className={styles.projects__cardContent}>
                  <div className={styles.projects__image}>
                    {project.video ? (
                      <video 
                        ref={(el) => {
                          if (el) {
                            videoRefs.current[project.id] = el;
                          }
                        }}
                        src={project.video} 
                        className={styles.projects__imageImg}
                        loop
                        muted
                        playsInline
                      />
                    ) : project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className={styles.projects__imageImg}
                      />
                    ) : null}
                  </div>
                  <div className={styles.projects__content}>
                    <div className={styles.projects__cardTitleWrapper}>
                      <h3 className={styles.projects__cardTitle}>
                        {project.title}
                      </h3>
                      {project.period && (
                        <span className={styles.projects__cardPeriod}>
                          개발기간 {project.period}
                        </span>
                      )}
                    </div>
                    <p className={styles.projects__cardDescription}>{project.description}</p>
                    <div className={styles.projects__tech}>
                      {project.tech.map((tech) => (
                        <span key={tech} className={styles.projects__techTag}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
                <div className={styles.projects__links}>
                  <Link to={`/projects/${project.id}`}>
                    <Button variant="tertiary" className={styles.projects__link}>
                      자세히 보기
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div ref={moreButtonRef} className={styles.projects__more}>
            <Button
              variant="secondary"
              onClick={() => setShowAll(!showAll)}
              className={styles.projects__moreButton}
            >
              {showAll ? '접기' : '더 둘러보기'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;

