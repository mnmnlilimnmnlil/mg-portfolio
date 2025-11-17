import React from 'react';
import styles from './Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <p className={styles.footer__text}>
          © {currentYear} 박민규. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

