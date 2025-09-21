import React from 'react';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const handleResumeDownload = () => {
    console.log('이력서 다운로드');
  };

  const handleGithubVisit = () => {
    window.open('https://github.com/mnmnlilimnmnlil', '_blank');
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.homePage__container}>
        <div className={styles.homePage__introSection}>
          <h1 className={styles.homePage__title}>
            안녕하세요<br />
            프론트엔드 개발자 박민규입니다.
          </h1>
          
          <div className={styles.homePage__description}>
            <p className={styles.homePage__descriptionText}>
              React를 기반으로 사용자 경험을 중시하는 웹 애플리케이션을 개발하고 있습니다.
            </p>
            <p className={styles.homePage__descriptionText}>
              "가치관 한줄정도 적을 곳입니다."
            </p>
          </div>
          
          <div className={styles.homePage__actionButtons}>
            <button className={`${styles.btn} ${styles.btn__primary}`} onClick={handleResumeDownload}>
              이력서 다운로드
            </button>
            <button className={`${styles.btn} ${styles.btn__secondary}`} onClick={handleGithubVisit}>
              GitHub 방문하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;