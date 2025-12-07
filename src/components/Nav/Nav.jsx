import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../Logo';
import styles from './Nav.module.scss';

const Nav = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/skills', label: '기술' },
    { path: '/projects', label: '프로젝트' },
    { path: '/career', label: '경험' },
    { path: '/contact', label: '연락처' },
  ];

  // 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  // 경로 변경 시 메뉴 닫기
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={styles.nav}>
      <div className={styles.nav__container}>
        <Logo size={32} animated={true} />
        <button
          className={styles.nav__menuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴 열기/닫기"
        >
          <span className={`${styles.nav__menuIcon} ${isMenuOpen ? styles.nav__menuIconOpen : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <div className={`${styles.nav__links} ${isMenuOpen ? styles.nav__linksOpen : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.nav__link} ${
                location.pathname === item.path ? styles.nav__linkActive : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Nav;

