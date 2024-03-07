import React from 'react';
import s from './boardPrewiew.module.scss';

interface IBoard {
  title: string;
  style: object;
}
export function Board({ title, style }: IBoard): JSX.Element {
  return (
    <div className={s.board} style={style}>
      <header className={s.board_header}>
        <h2>{title}</h2>
      </header>
    </div>
  );
}
