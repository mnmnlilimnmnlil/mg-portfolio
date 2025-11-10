import React from 'react';
import { FaGithub, FaFileDownload } from 'react-icons/fa';
import Button from '../../components/Button';
import styles from './Home.module.scss';

const Home = () => {
  const handleResumeDownload = () => {
    // 이력서 다운로드 로직
    console.log('이력서 다운로드');
  };

  const handleGithubVisit = () => {
    window.open('https://github.com/mnmnlilimnmnlil', '_blank');
  };

  return (
    <section className={styles.home} id="home">
      <div className={styles.home__container}>
        <div className={styles.home__content}>
          <h1 className={styles.home__title}>
            안녕하세요,<br />
            결국 해내는 개발자 박민규입니다.
          </h1>
          
          <div className={styles.home__description}>
            <p className={styles.home__descriptionText}>
              문제를 끝까지 해결하며, 팀과 함께 최선의 답을 찾아가는 걸 중요하게 생각합니다. 현재 프론트엔드 전반을 이해하고 있으며,<br />서버와 클라이언트의 상호작용까지 확장해 풀스택 역량을 갖춘 개발자로 성장하고 싶습니다.
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
              variant="secondary"
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

