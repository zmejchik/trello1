import React, { useEffect, useState } from 'react';
import { FaSquarePlus } from 'react-icons/fa6';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import Button from './components/Button/Button';
import List from './components/List/List';
import s from './board.module.scss';
import api from '../../api/request';
import { IList } from '../../common/interfaces/IList';
import { Modal } from '../../common/components/Modal';

export function Board(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [boardTitle, setTitle] = useState('Моя тестова дошка');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lists, setLists] = useState<IList[]>([
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
  const [value, setValue] = useState('');

  const { boardId } = useParams();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const data: { lists: IList[] } = await api.get(`/board/${boardId}`);
        setLists(data.lists);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching boards:', error);
      }
    };

    fetchData();
  }, []);

  const [isModal, setModal] = useState(false);

  const createList = async (title: string): Promise<void> => {
    try {
      await api.post(`/board/${boardId}/list`, {
        title,
        position: lists.length ? lists.length + 1 : 1,
      });
      setModal(false);
      const data: { lists: IList[] } = await api.get(`/board/${boardId}/`);
      setLists(data.lists);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching boards:', error);
    }
  };

  const onClose = (): void => setModal(!isModal);
  return (
    <div>
      <header className={s.board_header}>
        <Button icon={<MdKeyboardDoubleArrowLeft />} caption="Додому" className={s.board_button_back} to="/" />
        <h1>
          {boardTitle} With id {boardId}
        </h1>
      </header>
      <div className={s.board_body}>
        {lists.map(({ id, title: listTitle, cards }) => (
          <List key={id} id={id} title={listTitle} cards={cards} />
        ))}
        <Button
          icon={<FaSquarePlus />}
          caption="Створити список"
          className={s.board_button}
          onClick={(): void => setModal(true)}
        />
      </div>
      <Modal
        visible={isModal}
        title="Введіть назву нового списку"
        inputValue={value}
        setValue={setValue}
        footer={<button onClick={(): Promise<void> => createList(value)}>Створити</button>}
        onClose={onClose}
      />
    </div>
  );
}
