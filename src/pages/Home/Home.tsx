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

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const data: { boards: IBoard[] } = await api.get(`/board`);
        setBoards(data.boards);
      } catch (error) {
        console.error('Error fetching boards:', error);
      }
    };

    fetchData();
  }, []);

  const [isModal, setModal] = useState(false);

  const createBoard = async (title: string, custom: object): Promise<void> => {
    try {
      await api.post(`/board`, {
        title,
        custom,
      });
      setModal(false);
      const data: { boards: IBoard[] } = await api.get(`/board`);
      setBoards(data.boards);
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  const onClose = (): void => setModal(!isModal);

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
        footer={<button onClick={(): Promise<void> => createBoard(value, { background: 'white' })}>Створити</button>}
        onClose={onClose}
      />
    </div>
  );
}
