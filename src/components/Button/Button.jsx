import React from 'react';
import styles from './Button.module.scss';

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  href, 
  target,
  className = '',
  ...props 
}) => {
  const buttonClass = `${styles.button} ${styles[`button__${variant}`]} ${className}`.trim();

  if (href) {
    return (
      <a 
        href={href} 
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={buttonClass}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button 
      className={buttonClass}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

