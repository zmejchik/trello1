import React, { useState } from 'react';
import { FaSquarePlus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { Board } from './components/Board/BoardPrewiew';
import s from './Home.module.scss';
import Button from '../Board/components/Button/Button';

export function Home(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [homeTitle, setTitle] = useState('Мої дошки');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [boards, setBords] = useState([
    { id: 1, title: 'покупки', custom: { background: 'red' } },
    { id: 2, title: 'підготовка до весілля', custom: { background: 'green' } },
    { id: 3, title: 'розробка інтернет-магазину', custom: { background: 'blue' } },
    { id: 4, title: 'курс по просуванню у соцмережах', custom: { background: 'grey' } },
  ]);
  return (
    <div>
      <header className={s.header}>
        <h1>{homeTitle}</h1>
      </header>
      <div className={s.home_body}>
        {boards.map(({ id, title, custom }) => (
          <Link to={`/board/${id}`} key={id}>
            <Board key={id} title={title} style={custom} />
          </Link>
        ))}
        <Button icon={<FaSquarePlus />} caption="Створити дошку" className={s.board_button} />
      </div>
    </div>
  );
}
