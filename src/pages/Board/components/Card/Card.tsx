import React from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import s from './card.module.scss';

export function Card({ title }: ICard): JSX.Element {
  return (
    <div className={s.card}>
      <h3 className={s.card_title}>{title}</h3>
    </div>
  );
}
