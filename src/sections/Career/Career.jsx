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
      id: 1,
      type: '연합 PT',
      title: '1학년 2학기 퍼블리싱\n우수작품 연합PT',
      organization: '작품명 : 감정이란',
      date: '2024.12',
      description: '개인프로젝트 ',
    },
    {
      id: 2,
      type: '연합 PT',
      title: '2학년 1학기 콘텐츠디자인 우수작품 연합PT',
      organization: '작품명 : JO;IN',
      date: '2025.06',
      description: '3인 팀프로젝트 ',
    },
    {
      id: 3,
      type: '공모전',
      title: '커뮤니케이션디자인\n국제 공모전 우수상',
      organization: '작품명 : JO;IN',
      date: '2025.07',
      description: '3인 팀프로젝트 ',
    },
    {
      id: 4,
      type: '공모전',
      title: '대한민국디자인전람회 특선',
      organization: '작품명 : Jo;IN',
      date: '2025.08',
      description: '3인 팀프로젝트 ',
    },
    {
      id: 5,
      type: '프로젝트',
      title: '학과 졸업작품 최우수상',
      organization: '작품명 : OK',
      date: '2025.12',
      description: '6인 팀프로젝트 ',
    },
    {
      id: 6,
      type: '연합 PT',
      title: '2학년 2학기 캡스톤디자인 우수작품 연합PT',
      organization: '작품명 : OK',
      date: '2025.12',
      description: '6인 팀프로젝트 ',
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
          결과로 증명한
        </p>
        
        {experiences.length > 0 ? (
          <div className={styles.career__list}>
            {experiences.map((exp, index) => (
              <div key={index} className={styles.career__item}>
                <span className={styles.career__itemType}>{exp.type}</span>
                <span className={styles.career__itemDate}>{exp.date}</span>
                <h3 className={styles.career__itemTitle}>{exp.title}</h3>
                <p className={styles.career__itemOrganization}>{exp.organization}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.career__info}>
            <p className={styles.career__placeholder}>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Career;

