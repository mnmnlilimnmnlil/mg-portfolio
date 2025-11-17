import React from 'react';
import { useParams } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Button from '../../components/Button';
import styles from './ProjectDetail.module.scss';

const ProjectDetail = () => {
  const { id } = useParams();

  // 임시 데이터 (나중에 실제 데이터로 교체)
  const project = {
    id: id,
    title: 'Project Title',
    description: '프로젝트 상세 설명이 들어갈 곳입니다.',
    tech: ['React', 'TypeScript', 'SCSS'],
    images: [
      '/project-image-1.jpg',
      '/project-image-2.jpg',
      '/project-image-3.jpg',
    ],
    link: '#',
    github: '#',
    codeReview: '코드 리뷰 내용이 들어갈 곳입니다.',
  };

  return (
    <section className={styles.projectDetail}>
      <div className={styles.projectDetail__container}>
        <div className={styles.projectDetail__header}>
          <h1 className={styles.projectDetail__title}>
            <span className={styles.projectDetail__titleHighlight}>{project.title}</span>
          </h1>
          <div className={styles.projectDetail__tech}>
            {project.tech.map((tech) => (
              <span key={tech} className={styles.projectDetail__techTag}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.projectDetail__links}>
          <Button
            variant="tertiary"
            href={project.link}
            target="_blank"
            className={styles.projectDetail__link}
          >
            <FaExternalLinkAlt /> 사이트 방문
          </Button>
          <Button
            variant="tertiary"
            href={project.github}
            target="_blank"
            className={styles.projectDetail__link}
          >
            <FaGithub /> GitHub
          </Button>
        </div>

        <div className={styles.projectDetail__content}>
          <div className={styles.projectDetail__section}>
            <h2 className={styles.projectDetail__sectionTitle}>
              프로젝트 소개
            </h2>
            <p className={styles.projectDetail__description}>
              {project.description}
            </p>
          </div>

          <div className={styles.projectDetail__section}>
            <h2 className={styles.projectDetail__sectionTitle}>
              포트폴리오 이미지
            </h2>
            <div className={styles.projectDetail__images}>
              {project.images.map((image, index) => (
                <div key={index} className={styles.projectDetail__imageWrapper}>
                  <img 
                    src={image} 
                    alt={`${project.title} 이미지 ${index + 1}`}
                    className={styles.projectDetail__image}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.projectDetail__section}>
            <h2 className={styles.projectDetail__sectionTitle}>
              코드 리뷰
            </h2>
            <div className={styles.projectDetail__codeReview}>
              <pre className={styles.projectDetail__codeText}>
                {project.codeReview}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail;

