import React, { useEffect, useState } from 'react';
import { FaSquarePlus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { BoardPreview } from './components/Board/BoardPrewiew';
import s from './Home.module.scss';
import Button from '../Board/components/Button/Button';
import api from '../../api/request';
import { IBoard } from '../../common/interfaces/IBoard';
import { Modal } from '../../common/components/Modal';

export function Home(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [homeTitle, setTitle] = useState('Мої дошки');
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [value, setValue] = useState('');
  const [isModal, setModal] = useState(false);
  const onClose = (): void => setModal(!isModal);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const data: { boards: IBoard[] } = await api.get(`/board`);
        setBoards(data.boards);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching boards:', error);
      }
    };

    fetchData();
  }, []);

  const isValidBoardName = (title: string): boolean => {
    if (title === '') return false;
    const pattern = /^[a-zA-Zа-яА-Я0-9\s.-_]+$/;
    return pattern.test(title);
  };

  const generateRandomColor = (): string => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const createBoard = async (title: string, custom: object): Promise<void> => {
    if (isValidBoardName(title)) {
      try {
        await api.post(`/board`, {
          title,
          custom,
        });
        setModal(false);
        const data: { boards: IBoard[] } = await api.get(`/board`);
        setBoards(data.boards);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching boards:', error);
      }
    } else {
      // eslint-disable-next-line no-alert
      alert('Incorect name board');
    }
  };

  return (
    <div>
      <header className={s.header}>
        <h1>{homeTitle}</h1>
      </header>
      <div className={s.home_body}>
        {boards.map(({ id, title, custom }) => (
          <Link to={`/board/${id}`} key={id}>
            <BoardPreview key={id} title={title} style={custom} />
          </Link>
        ))}
        <Button
          icon={<FaSquarePlus />}
          caption="Створити дошку"
          className={s.board_button}
          onClick={(): void => setModal(true)}
        />
      </div>
      <Modal
        visible={isModal}
        title="Введіть назву нової дошки"
        inputValue={value}
        setValue={setValue}
        footer={
          <button onClick={(): Promise<void> => createBoard(value, { background: generateRandomColor() })}>
            Створити
          </button>
        }
        onClose={onClose}
      />
    </div>
  );
}
