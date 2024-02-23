import React from 'react';
import { ICard } from '../../../../common/interfaces/ICard';

export function Card({ title }: ICard): JSX.Element {
  return (
    <div>
      <h3>{title}</h3>
    </div>
  );
}
