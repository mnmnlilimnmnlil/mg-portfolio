import React from 'react';
import styles from './ScrollIndicator.module.scss';

const ScrollIndicator = () => {
  return (
    <div className={styles.scrollIndicator}>
      <div className={styles.scrollIndicator__mouse}>
        <div className={styles.scrollIndicator__wheel}></div>
      </div>
      <div className={styles.scrollIndicator__arrow}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 2L8 14M8 14L12 10M8 14L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

export default ScrollIndicator;

