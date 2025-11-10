import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import Button from '../../components/Button';
import styles from './Contact.module.scss';

const Contact = () => {
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

  return (
    <section className={styles.contact} id="contact">
      <div className={styles.contact__container}>
        <h2 className={styles.contact__title}>
          Contact
        </h2>
        
        <div className={styles.contact__formWrapper}>
          <form className={styles.contact__form} onSubmit={handleSubmit}>
            <div className={styles.contact__field}>
              <label htmlFor="name" className={styles.contact__label}>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.contact__input}
                required
              />
            </div>
            
            <div className={styles.contact__field}>
              <label htmlFor="email" className={styles.contact__label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.contact__input}
                required
              />
            </div>
            
            <div className={styles.contact__field}>
              <label htmlFor="message" className={styles.contact__label}>Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={styles.contact__textarea}
                rows="5"
                required
              />
            </div>
            
            <Button type="submit" variant="primary" className={styles.contact__button}>
              Send Message
            </Button>
          </form>
        </div>
        
        <p className={styles.contact__footer}>
          감사합니다. 함께 성장하고 싶습니다.
        </p>
      </div>
    </section>
  );
};

export default Contact;

