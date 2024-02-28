import React, { useState } from 'react';
import { FaSquarePlus } from 'react-icons/fa6';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';

import { Button } from '../Button/Button';
import List from '../List/List';
import './board.scss';

export function Board(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [boardTitle, setTitle] = useState('Моя тестова дошка');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lists, setLists] = useState([
    {
      id: 1,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
        { id: 4, title: 'зварити собаку' },
      ],
    },
    {
      id: 2,
      title: 'В процесі',
      cards: [{ id: 4, title: 'подивитися серіал' }],
    },
    {
      id: 3,
      title: 'Зроблено',
      cards: [
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакой' },
      ],
    },
  ]);
  return (
    <div>
      <header className="board-header">
        <Button icon={<MdKeyboardDoubleArrowLeft />} caption="Додому" className="board-button-back" />
        <h1>{boardTitle}</h1>
      </header>
      <div className="board-body">
        {lists.map(({ id, title: listTitle, cards }) => (
          <List key={id} title={listTitle} cards={cards} />
        ))}
        <Button icon={<FaSquarePlus />} caption="Створити список" className="board-button" />
      </div>
    </div>
  );
}
