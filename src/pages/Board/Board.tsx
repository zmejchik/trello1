import React, { useState } from 'react';
import List from './components/List/List';

export function Board(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [title, setTitle] = useState('Моя тестова дошка');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lists, setLists] = useState([
    {
      id: 1,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
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
    <>
      <header>
        <h1>{title}</h1>
      </header>
      <div>
        {lists.map((list) => (
          <List key={list.id} title={list.title} cards={list.cards} />
        ))}
      </div>
    </>
  );
}
