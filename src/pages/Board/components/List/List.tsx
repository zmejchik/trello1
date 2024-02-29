import React from 'react';
import { FaSquarePlus } from 'react-icons/fa6';
import './list.scss';
import Button from '../Button/Button';
import { Card } from '../Card/Card';
import { IListProps } from '../../../../common/interfaces/IList';

function List({ title, cards }: IListProps): JSX.Element {
  return (
    <div className="list">
      <h2 className="list-title">{title}</h2>
      <div className="list-body">
        {cards.map(({ id, title: cardTitle }) => (
          <Card key={id} id={id} title={cardTitle} />
        ))}
      </div>
      <Button icon={<FaSquarePlus />} caption="Створити картку" />
    </div>
  );
}

export default List;
