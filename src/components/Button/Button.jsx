import React from 'react';
import styles from './Button.module.scss';

const Button = ({ 
  children, 
  variant = 'primary', // 'primary' | 'secondary' | 'tertiary'
  onClick, 
  href, 
  target,
  className = '',
  ...props 
}) => {
  // outline을 tertiary로 매핑 (하위 호환성)
  const mappedVariant = variant === 'outline' ? 'tertiary' : variant;
  const buttonClass = `${styles.button} ${styles[`button__${mappedVariant}`]} ${className}`.trim();

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

