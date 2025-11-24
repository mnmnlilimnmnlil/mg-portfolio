import React from 'react';
import { FaGithub, FaFileDownload } from 'react-icons/fa';
import Button from '../../components/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import styles from './Home.module.scss';
// 이력서 import
import resumeFile from '../../assets/resume/박민규_이력서_자기소개서.pdf';

const Home = () => {
  const [contentRef, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  const handleResumeDownload = () => {
    // 이력서 다운로드 로직
    const link = document.createElement('a');
    link.href = resumeFile;
    link.download = '박민규_이력서_자기소개서.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGithubVisit = () => {
    window.open('https://github.com/mnmnlilimnmnlil', '_blank');
  };

  return (
    <section className={styles.home} id="home">
      <div className={styles.home__container}>
        <div 
          ref={contentRef}
          className={`${styles.home__content} ${isVisible ? styles.home__contentVisible : ''}`}
        >
          <h1 className={styles.home__title}>
            안녕하세요,<br />
            <span className={styles.home__titleHighlight}>결국 해내는 개발자</span>{' '}
            <span className={styles.home__titleName}>박민규</span>입니다.
          </h1>
          
          <div className={styles.home__description}>
            <p className={styles.home__descriptionText}>
              문제를 끝까지 해결하며, 팀과함께 최선의 답을 찾아가는 걸 중요하게 생각합니다. 현재 프론트 엔드 전반을 이해하고 있습니다.<br />서버와 클라이언트의 상호작용까지 확장해 풀스택 역량을 갖춘 개발자로 성장하고 싶습니다.
            </p>
          </div>
          
          <div className={styles.home__actions}>
            <Button
              variant="primary"
              onClick={handleResumeDownload}
              className={styles.home__button}
            >
              <FaFileDownload /> 이력서 다운로드
            </Button>
            <Button
              variant="tertiary"
              onClick={handleGithubVisit}
              className={styles.home__button}
            >
              <FaGithub /> GitHub 방문하기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;

