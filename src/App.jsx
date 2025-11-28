import React, { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Lenis from 'lenis';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LiquidEther from './components/LiquidEther/LiquidEther';
import Home from './sections/Home';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import ProjectDetail from './sections/Projects/ProjectDetail';
import Career from './sections/Career';
import Contact from './sections/Contact';
import './styles/global.scss';

// Lenis 인스턴스를 전역적으로 접근할 수 있도록 export
export const lenisRef = { current: null };

function AppContent() {
  const location = useLocation();
  const prevLocationRef = useRef(location.pathname);

  useEffect(() => {
    // Lenis 스무스 스크롤 초기화
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    window.lenisInstance = lenis; // 전역 접근을 위한 임시 방법

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const prevPath = prevLocationRef.current;
    const currentPath = location.pathname;
    
    // 프로젝트 상세 페이지로 진입할 때: 진입 전 스크롤 위치 저장 후 즉시 최상단으로 이동
    if (!prevPath.startsWith('/projects/') && currentPath.startsWith('/projects/')) {
      // 진입 전 스크롤 위치 저장
      const getScrollPosition = () => {
        if (window.lenisInstance && window.lenisInstance.scroll !== undefined) {
          return window.lenisInstance.scroll;
        }
        return window.pageYOffset || document.documentElement.scrollTop || window.scrollY;
      };
      
      const scrollY = getScrollPosition();
      const projectId = currentPath.split('/projects/')[1];
      if (projectId) {
        sessionStorage.setItem(`projectScroll_${projectId}`, scrollY.toString());
        sessionStorage.setItem('fromProjectDetail', 'true');
      }
      
      // 즉시 최상단으로 이동 (애니메이션 없이)
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
    
    // 프로젝트 상세 페이지에서 나올 때 저장된 스크롤 위치로 복원
    if (prevPath.startsWith('/projects/') && !currentPath.startsWith('/projects/')) {
      const projectId = prevPath.split('/projects/')[1];
      if (projectId && (currentPath === '/projects' || currentPath === '/')) {
        const savedScroll = sessionStorage.getItem(`projectScroll_${projectId}`);
        
        if (savedScroll) {
          const scrollPosition = parseInt(savedScroll, 10);
          
          // Projects 컴포넌트가 렌더링될 때까지 기다린 후 스크롤
          setTimeout(() => {
            const lenisInstance = window.lenisInstance;
            if (lenisInstance) {
              lenisInstance.scrollTo(scrollPosition, {
                immediate: false,
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              });
            } else {
              window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
              });
            }
          }, 400);
        }
      }
    }

    // 다른 페이지로 이동한 경우 상단으로 스크롤
    if (prevPath !== currentPath) {
      // 프로젝트 상세 페이지로 이동하는 경우는 위에서 처리
      if (!currentPath.startsWith('/projects/')) {
        setTimeout(() => {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: false });
          } else {
            window.scrollTo(0, 0);
          }
        }, 100);
      }
    }

    prevLocationRef.current = currentPath;
  }, [location.pathname]);

  return (
    <div className="app">
      <div className="app__background">
        <LiquidEther
          colors={['#E63946', '#FF6B7A', '#FF9FA8']}
          mouseForce={15}
          cursorSize={120}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.4}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.4}
          autoIntensity={1.8}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      <Nav />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <>
            <Home />
            <Skills />
            <Projects />
            <Career />
            <Contact />
            <Footer />
          </>
        } />
        <Route path="/skills" element={<><Skills /><Footer /></>} />
        <Route path="/projects" element={<><Projects /><Footer /></>} />
        <Route path="/projects/:id" element={<><ProjectDetail /><Footer /></>} />
        <Route path="/career" element={<><Career /><Footer /></>} />
        <Route path="/contact" element={<><Contact /><Footer /></>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <RecoilRoot>
      <AppContent />
    </RecoilRoot>
  );
}

export default App;
