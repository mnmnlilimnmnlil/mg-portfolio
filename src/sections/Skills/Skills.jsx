import React from 'react';
import styles from './Skills.module.scss';

const Skills = () => {
  const skills = [
    { name: 'React', image: '/skills/react.svg' },
    { name: 'JavaScript', image: '/skills/javascript.svg' },
    { name: 'HTML', image: '/skills/html.svg' },
    { name: 'CSS', image: '/skills/css.svg' },
    { name: 'Git', image: '/skills/git.svg' },
    { name: 'GitHub', image: '/skills/github.svg' },
  ];

  return (
    <section className={styles.skills} id="skills">
      <div className={styles.skills__container}>
        <h2 className={styles.skills__title}>
          Skills
        </h2>
        
        <div className={styles.skills__grid}>
          {skills.map((skill) => (
            <div key={skill.name} className={styles.skills__item}>
              <div className={styles.skills__imageWrapper}>
                <img 
                  src={skill.image} 
                  alt={skill.name}
                  className={styles.skills__image}
                  onError={(e) => {
                    // 이미지 로드 실패 시 대체 텍스트 표시
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className={styles.skills__fallback}>{skill.name}</span>
              </div>
              <p className={styles.skills__name}>{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

