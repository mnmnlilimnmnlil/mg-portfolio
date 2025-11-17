import React from 'react';
import { useLocation } from 'react-router-dom';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import styles from './Career.module.scss';

const Career = () => {
  const location = useLocation();
  const isStandalonePage = location.pathname === '/career';

  // 경험 데이터 (공모전 수상, 활동 등)
  const experiences = [
    {
      type: '수상',
      title: '공모전 수상 예시',
      organization: '주최 기관',
      date: '2024.01',
      description: '수상 내용 및 설명',
    },
    // 추가 경험 항목들...
  ];

  const [containerRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className={`${styles.career} ${isStandalonePage ? styles.careerStandalone : ''}`} id="career">
      <div 
        ref={containerRef}
        className={`${styles.career__container} ${isVisible ? styles.career__containerVisible : ''}`}
      >
        <h2 className={styles.career__title}>
          <span className={styles.career__titleHighlight}>경험</span>
        </h2>
        <p className={styles.career__description}>
          경험한 활동들을 소개합니다.
        </p>
        
        {experiences.length > 0 ? (
          <div className={styles.career__list}>
            {experiences.map((exp, index) => (
              <div key={index} className={styles.career__item}>
                <div className={styles.career__itemHeader}>
                  <span className={styles.career__itemType}>{exp.type}</span>
                  <span className={styles.career__itemDate}>{exp.date}</span>
                </div>
                <h3 className={styles.career__itemTitle}>{exp.title}</h3>
                <p className={styles.career__itemOrganization}>{exp.organization}</p>
                {exp.description && (
                  <p className={styles.career__itemDescription}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.career__info}>
            <p className={styles.career__placeholder}>
              공모전 수상, 활동 경험 등을 추가해주세요.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Career;

