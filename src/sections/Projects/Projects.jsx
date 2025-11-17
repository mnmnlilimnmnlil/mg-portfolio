import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import styles from './Projects.module.scss';

// 프로젝트 이미지 import
import project1Image from '../../assets/project/project1.png';

const Projects = () => {
  const location = useLocation();
  const isStandalonePage = location.pathname === '/projects';
  // sessionStorage에서 이전 상태 불러오기
  const [showAll, setShowAll] = useState(() => {
    const saved = sessionStorage.getItem('projectsShowAll');
    return saved === 'true';
  });
  const projectRefs = useRef({});
  const moreButtonRef = useRef(null);
  const isInitialMount = useRef(true);
  const prevShowAllRef = useRef(showAll);
  
  const allProjects = [
    {
      id: 1,
      title: 'Project 1',
      description: '프로젝트 설명입니다.',
      tech: ['React', 'TypeScript', 'SCSS'],
      image: project1Image,
      link: '#',
      github: '#',
    },
    {
      id: 2,
      title: 'Project 2',
      description: '프로젝트 설명입니다.',
      tech: ['React', 'Node.js'],
      image: '/project2.jpg',
      link: '#',
      github: '#',
    },
    {
      id: 3,
      title: 'Project 3',
      description: '프로젝트 설명입니다.',
      tech: ['React', 'CSS'],
      image: '/project3.jpg',
      link: '#',
      github: '#',
    },
    {
      id: 4,
      title: 'Project 4',
      description: '프로젝트 설명입니다.',
      tech: ['JavaScript', 'HTML'],
      image: '/project4.jpg',
      link: '#',
      github: '#',
    },
    {
      id: 5,
      title: 'Project 5',
      description: '프로젝트 설명입니다.',
      tech: ['React', 'TypeScript'],
      image: '/project5.jpg',
      link: '#',
      github: '#',
    },
    {
      id: 6,
      title: 'Project 6',
      description: '프로젝트 설명입니다.',
      tech: ['Vue.js', 'SCSS'],
      image: '/project6.jpg',
      link: '#',
      github: '#',
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

  useEffect(() => {
    // 초기 마운트 시 sessionStorage 정리
    if (isInitialMount.current) {
      const scrollToProjectId = sessionStorage.getItem('scrollToProject');
      const fromProjectDetail = sessionStorage.getItem('fromProjectDetail');
      
      // 초기 로드 시 남아있는 값 정리 (프로젝트 상세 페이지에서 온 것이 아닌 경우)
      if (scrollToProjectId && fromProjectDetail !== 'true') {
        sessionStorage.removeItem('scrollToProject');
        sessionStorage.removeItem('fromProjectDetail');
      }
      
      isInitialMount.current = false;
      return;
    }

    // 프로젝트 상세 페이지에서 돌아온 경우에만 해당 프로젝트로 스크롤
    const scrollToProjectId = sessionStorage.getItem('scrollToProject');
    const fromProjectDetail = sessionStorage.getItem('fromProjectDetail') === 'true';
    
    if (scrollToProjectId && fromProjectDetail) {
      sessionStorage.removeItem('scrollToProject');
      sessionStorage.removeItem('fromProjectDetail');
      
      setTimeout(() => {
        const projectElement = projectRefs.current[scrollToProjectId];
        if (projectElement) {
          const rect = projectElement.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          // 카드 박스의 상단으로 딱 떨어지도록 스크롤
          const elementTop = rect.top + scrollTop;
          const navHeight = 80;
          const offset = navHeight + 20;
          const targetPosition = elementTop - offset;
          
          // Lenis 인스턴스 사용 (전역에서 접근)
          const lenisInstance = window.lenisInstance;
          if (lenisInstance) {
            // Lenis의 scrollTo 사용 - 사용자 스크롤과 충돌하지 않음
            lenisInstance.scrollTo(targetPosition, {
              immediate: false,
              duration: 1.2,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          } else {
            // Lenis가 없을 경우 기본 스크롤 사용
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      }, 400);
    }
  }, [location.pathname]);

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
            >
              <div className={styles.projects__cardLink}>
                <Link to={`/projects/${project.id}`} className={styles.projects__cardContent}>
                  <div className={styles.projects__image}>
                    {project.image && (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className={styles.projects__imageImg}
                      />
                    )}
                  </div>
                  <div className={styles.projects__content}>
                    <h3 className={styles.projects__cardTitle}>
                      {project.title}
                    </h3>
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

