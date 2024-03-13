import React from 'react';
import s from './boardPrewiew.module.scss';

interface IBoardPreview {
  title: string;
  style: object;
}
export function BoardPreview({ title, style }: IBoardPreview): JSX.Element {
  return (
    <div className={s.board} style={style}>
      <header className={s.board_header}>
        <h2>{title}</h2>
      </header>
    </div>
  );
}
