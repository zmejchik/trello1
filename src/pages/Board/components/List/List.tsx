import React from 'react';
import { FaSquarePlus } from 'react-icons/fa6';
import s from './list.module.scss';
import Button from '../Button/Button';
import { Card } from '../Card/Card';
import { IList } from '../../../../common/interfaces/IList';

function List({ title, cards }: IList): JSX.Element {
  return (
    <div className={s.list}>
      <h2 className={s.list_title}>{title}</h2>
      <div className={s.list_body}>
        {cards.map(({ id, title: cardTitle }) => (
          <Card key={id} id={id} title={cardTitle} />
        ))}
      </div>
      <Button icon={<FaSquarePlus />} caption="Створити картку" />
    </div>
  );
}

export default List;
