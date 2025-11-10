import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Nav.module.scss';

const Nav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/skills', label: 'Skills' },
    { path: '/projects', label: 'Projects' },
    { path: '/career', label: 'Career' },
    { path: '/contact', label: 'Contact' },
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

