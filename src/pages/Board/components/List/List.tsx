import React from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import './list.scss';
import { Card } from '../Card/Card';

interface ListProps {
  title: string;
  cards: ICard[];
}

/* // eslint-disable-next-line @typescript-eslint/no-unused-vars
const List: React.FC<ListProps> = ({ title, cards }) => (
  <div>
    <h2>{title}</h2>
  </div>
);

export default List; */

export function List({ title, cards }: ListProps): JSX.Element {
  return (
    <div>
      <h2>{title}</h2>
      <div>
        {cards.map((card) => (
          <Card key={card.id} id={card.id} title={card.title} />
        ))}
      </div>
      <button>Створити картку</button>
    </div>
  );
}
