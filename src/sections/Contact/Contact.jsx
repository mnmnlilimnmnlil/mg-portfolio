import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Button from '../../components/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import styles from './Contact.module.scss';

const Contact = () => {
  const location = useLocation();
  const isStandalonePage = location.pathname === '/contact';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // EmailJS 연동
    // TODO: EmailJS 서비스 ID, 템플릿 ID, Public Key 설정 필요
    try {
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        'YOUR_PUBLIC_KEY'
      );
      
      alert('메시지가 성공적으로 전송되었습니다!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [containerRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className={`${styles.contact} ${isStandalonePage ? styles.contactStandalone : ''}`} id="contact">
      <div 
        ref={containerRef}
        className={`${styles.contact__container} ${isVisible ? styles.contact__containerVisible : ''}`}
      >
        <h2 className={styles.contact__title}>
          <span className={styles.contact__titleHighlight}>연락처</span>
        </h2>
        
        <div className={styles.contact__info}>
          <a href="tel:01084821244" className={styles.contact__infoItem}>
            <span className={styles.contact__infoLabel}>연락처</span>
            <span className={styles.contact__infoValue}>010 8482 1244</span>
          </a>
          <a href="mailto:dbullssg123@naver.com" className={styles.contact__infoItem}>
            <span className={styles.contact__infoLabel}>이메일</span>
            <span className={styles.contact__infoValue}>dbullssg123@naver.com</span>
          </a>
        </div>
        
        <div className={styles.contact__formWrapper}>
          <form className={styles.contact__form} onSubmit={handleSubmit}>
            <div className={styles.contact__field}>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.contact__input}
                placeholder="이름"
                required
              />
            </div>
            
            <div className={styles.contact__field}>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.contact__input}
                placeholder="이메일"
                required
              />
            </div>
            
            <div className={styles.contact__field}>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={styles.contact__textarea}
                placeholder="메시지"
                rows="5"
                required
              />
            </div>
            
            <Button type="submit" variant="primary" className={styles.contact__button}>
              보내기
            </Button>
          </form>
        </div>
        
        <p className={styles.contact__footer}>
          결국 해내는 개발자 박민규 입니다 감사합니다.
        </p>
      </div>
    </section>
  );
};

export default Contact;

