import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import styles from './Projects.module.scss';

const Projects = () => {
  const [showAll, setShowAll] = useState(false);
  
  const allProjects = [
    {
      id: 1,
      title: 'Project 1',
      description: '프로젝트 설명입니다.',
      tech: ['React', 'TypeScript', 'SCSS'],
      image: '/project1.jpg',
      link: '#',
      github: '#',
    },
    {
      id: 2,
      title: 'Project 2',
      description: '프로젝트 설명입니다.',
      tech: ['React', 'Node.js'],
      image: '/project2.jpg',
      link: '#',
      github: '#',
    },
    {
      id: 3,
      title: 'Project 3',
      description: '프로젝트 설명입니다.',
      tech: ['React', 'CSS'],
      image: '/project3.jpg',
      link: '#',
      github: '#',
    },
    {
      id: 4,
      title: 'Project 4',
      description: '프로젝트 설명입니다.',
      tech: ['JavaScript', 'HTML'],
      image: '/project4.jpg',
      link: '#',
      github: '#',
    },
  ];

  const displayedProjects = showAll ? allProjects : allProjects.slice(0, 3);
  const hasMore = allProjects.length > 3;

  return (
    <section className={styles.projects} id="projects">
      <div className={styles.projects__container}>
        <h2 className={styles.projects__title}>
          Projects
        </h2>
        
        <div className={styles.projects__grid}>
          {displayedProjects.map((project) => (
            <div key={project.id} className={styles.projects__card}>
              <Link to={`/projects/${project.id}`} className={styles.projects__cardLink}>
                <div className={styles.projects__image}>
                  {/* 이미지 영역 */}
                </div>
                <div className={styles.projects__content}>
                  <h3 className={styles.projects__cardTitle}>{project.title}</h3>
                  <p className={styles.projects__cardDescription}>{project.description}</p>
                  <div className={styles.projects__tech}>
                    {project.tech.map((tech) => (
                      <span key={tech} className={styles.projects__techTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className={styles.projects__links}>
                    <span className={styles.projects__link}>자세히 보기</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className={styles.projects__more}>
            <Button
              variant="secondary"
              onClick={() => setShowAll(!showAll)}
              className={styles.projects__moreButton}
            >
              {showAll ? '접기' : '더 둘러보기'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;

