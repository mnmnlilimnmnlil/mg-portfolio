import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Nav.module.scss';

const Nav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '홈' },
    { path: '/skills', label: '기술' },
    { path: '/projects', label: '프로젝트' },
    { path: '/career', label: '경험' },
    { path: '/contact', label: '연락처' },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.nav__container}>
        <div className={styles.nav__links}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.nav__link} ${
                location.pathname === item.path ? styles.nav__linkActive : ''
              }`}
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

