import React from 'react';
import { IButton } from '../../../../common/interfaces/IButton';
import './button.scss';

export function Button({ urlDestination, caption }: IButton): JSX.Element {
  return (
    <div>
      <a href={urlDestination} className="button">
        {caption}
      </a>
    </div>
  );
}
