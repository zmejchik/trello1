import React from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import './card.scss';

export function Card({ title }: ICard): JSX.Element {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
    </div>
  );
}
