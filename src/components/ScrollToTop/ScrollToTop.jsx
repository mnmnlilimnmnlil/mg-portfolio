import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ScrollToTop.module.scss';

const ScrollToTop = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const isHomePage = location.pathname === '/';
  const isProjectDetailPage = location.pathname.startsWith('/projects/');

  useEffect(() => {
    let rafId = null;
    
    const handleScroll = () => {
      let scrollTop = 0;
      if (window.lenisInstance && window.lenisInstance.scroll !== undefined) {
        scrollTop = window.lenisInstance.scroll;
      } else {
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      }
      setIsVisible(scrollTop > 300);
      
      // Lenis를 사용하는 경우 계속 체크
      if (window.lenisInstance) {
        rafId = requestAnimationFrame(handleScroll);
      }
    };

    // Lenis를 사용하는 경우 requestAnimationFrame으로 체크
    if (window.lenisInstance) {
      rafId = requestAnimationFrame(handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }

    // 초기 체크
    handleScroll();

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (!window.lenisInstance) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (window.lenisInstance) {
      window.lenisInstance.scrollTo(0, {
        immediate: false,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if ((!isHomePage && !isProjectDetailPage) || !isVisible) {
    return null;
  }

  return (
    <button 
      className={styles.scrollToTop}
      onClick={scrollToTop}
      aria-label="최상단으로 이동"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 위쪽 화살표 - > 모양을 위로 향하게 */}
        <line
          x1="50"
          y1="30"
          x2="30"
          y2="50"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className={styles.arrowLine1}
        />
        <line
          x1="50"
          y1="30"
          x2="70"
          y2="50"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className={styles.arrowLine2}
        />
      </svg>
    </button>
  );
};

export default ScrollToTop;

