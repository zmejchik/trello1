import React from 'react';
import { Link } from 'react-router-dom';
import { IButton } from '../../../../common/interfaces/IButton';
import s from './button.module.scss';

function Button({ icon, caption, className, to, onClick }: IButton): JSX.Element {
  if (to) {
    return (
      <Link to={to}>
        <button type="button" className={`${s.custom_button} ${className}`}>
          {icon && icon}
          {caption}
        </button>
      </Link>
    );
  }

  return (
    <button type="button" className={`${s.custom_button} ${className}`} onClick={onClick}>
      {icon && icon}
      {caption}
    </button>
  );
}

Button.defaultProps = {
  icon: null,
  className: '',
  to: '',
  caption: '',
  onClick: (): void => {},
};

export default Button;
