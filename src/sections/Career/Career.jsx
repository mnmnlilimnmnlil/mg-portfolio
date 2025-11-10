import React from 'react';
import styles from './Career.module.scss';

const Career = () => {
  return (
    <section className={styles.career} id="career">
      <div className={styles.career__container}>
        <h2 className={styles.career__title}>
          Education
        </h2>
        
        <div className={styles.career__info}>
          <p className={styles.career__placeholder}>
            교육 정보 정도 넣을 곳?
          </p>
        </div>
      </div>
    </section>
  );
};

export default Career;

