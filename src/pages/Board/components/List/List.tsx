import React, { useEffect, useState } from 'react';
import { FaSquarePlus } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';
import s from './list.module.scss';
import Button from '../Button/Button';
import api from '../../../../api/request';
import { Card } from '../Card/Card';
import { IList } from '../../../../common/interfaces/IList';
import { Modal } from '../../../../common/components/Modal';
import { ICard } from '../../../../common/interfaces/ICard';

function List({ id, title, cards }: IList): JSX.Element {
  const [value, setValue] = useState('');
  const [isModal, setModal] = useState(false);
  const [lists, setLists] = useState<IList[]>([]);
  const onClose = (): void => setModal(!isModal);
  const { boardId } = useParams();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const data: { lists: IList[] } = await api.get(`/board/${boardId}`);
        setLists(data.lists);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching cards:', error);
      }
    };

    fetchData();
  }, []);

  const createCard = async ({ title }: { title: string }): Promise<void> => {
    try {
      await api.post(`/board/${boardId}/card/`, {
        title,
        list_id: id,
        position: cards.length ? cards.length + 1 : 1,
        description: 'washing process',
        custom: {
          deadline: '2022-08-31 12:00',
        },
      });
      setModal(false);
      const data: { lists: IList[] } = await api.get(`/board/${boardId}`);
      setLists(data.lists);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching boards:', error);
    }
  };

  return (
    <>
      <div className={s.list}>
        <h2 className={s.list_title}>{title}</h2>
        <div className={s.list_body}>
          {cards.map(({ id, title: cardTitle }) => (
            <Card key={id} id={id} title={cardTitle} />
          ))}
        </div>
        <Button icon={<FaSquarePlus />} caption="Створити картку" onClick={(): void => setModal(true)} />
      </div>
      <Modal
        visible={isModal}
        title="Введіть назву нового списку"
        inputValue={value}
        setValue={setValue}
        footer={<button onClick={(): Promise<void> => createCard({ title: value })}>Створити</button>}
        onClose={onClose}
      />
    </>
  );
}

export default List;
