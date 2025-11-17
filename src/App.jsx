import React, { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Lenis from 'lenis';
import Nav from './components/Nav';
import Footer from './components/Footer';
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
    
    // 프로젝트 상세 페이지에서 나올 때 프로젝트 ID 저장
    if (prevPath.startsWith('/projects/') && !currentPath.startsWith('/projects/')) {
      const projectId = prevPath.split('/projects/')[1];
      if (projectId) {
        sessionStorage.setItem('scrollToProject', projectId);
      }
    }

    // 프로젝트 목록 페이지나 홈 페이지로 돌아온 경우는 Projects 컴포넌트에서 처리
    if ((currentPath === '/projects' || currentPath === '/') && sessionStorage.getItem('scrollToProject')) {
      prevLocationRef.current = currentPath;
      return;
    }

    // 다른 페이지로 이동한 경우 상단으로 스크롤
    if (prevPath !== currentPath) {
      setTimeout(() => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: false });
        } else {
          window.scrollTo(0, 0);
        }
      }, 100);
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
