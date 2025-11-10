import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Lenis from 'lenis';
import Nav from './components/Nav';
import Home from './sections/Home';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import ProjectDetail from './sections/Projects/ProjectDetail';
import Career from './sections/Career';
import Contact from './sections/Contact';
import './styles/global.scss';

function App() {
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

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <RecoilRoot>
      <div className="app">
        <Nav />
        <Routes>
          <Route path="/" element={
            <>
              <Home />
              <Skills />
              <Projects />
              <Career />
              <Contact />
            </>
          } />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/career" element={<Career />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </RecoilRoot>
  );
}

export default App;
