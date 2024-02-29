import React from 'react';
import { Link } from 'react-router-dom';
import { IButton } from '../../../../common/interfaces/IButton';
import './button.scss';

function Button({ icon, caption, className, to }: IButton): JSX.Element {
  // Если есть ссылка, то используем компонент Link, иначе обычный button
  if (to) {
    return (
      <Link to={to}>
        <button type="button" className={`custom-button ${className}`}>
          {icon && icon}
          {caption}
        </button>
      </Link>
    );
  }

  return (
    <button type="button" className={`custom-button ${className}`}>
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
};

export default Button;
