import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CommonNav.module.scss';

const CommonNav = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.nav__container}>
        <div className={styles.nav__links}>
          <Link to="/" className={styles.nav__link}>소개</Link>
          <Link to="/portfolio" className={styles.nav__link}>포트폴리오</Link>
          <Link to="/contact" className={styles.nav__link}>연락처</Link>
        </div>
      </div>
    </nav>
  );
};

export default CommonNav;
