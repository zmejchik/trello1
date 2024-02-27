import React from 'react';
import { IButton } from '../../../../common/interfaces/IButton';
import './button.scss';

export function Button({ icon, caption, className, ...props }: IButton): JSX.Element {
  return (
    <button {...props} type="button" className={`custom-button ${className}`}>
      {icon && icon}
      {caption}
    </button>
  );
}
