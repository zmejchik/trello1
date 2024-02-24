import React from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import './list.scss';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';

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
    <div className="list">
      <h2 className="list-title">{title}</h2>
      <div className="list-body">
        {cards.map((card) => (
          <Card key={card.id} id={card.id} title={card.title} />
        ))}
      </div>
      <div className="list-button">
        <Button urlDestination="#" caption="Створити картку" />
      </div>
    </div>
  );
}
