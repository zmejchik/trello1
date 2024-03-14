import React, { ReactNode, useEffect, useState } from 'react';
import { FaSquarePlus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { BoardPreview } from './components/Board/BoardPrewiew';
import s from './Home.module.scss';
import Button from '../Board/components/Button/Button';
import api from '../../api/request';
import { IBoard } from '../../common/interfaces/IBoard';

interface ModalProps {
  visible: boolean;
  title: string;
  value1: string;
  footer: ReactNode | string;
  onClose: () => void;
  setValue1: (event: string) => void;
}

function Modal({ visible = false, title = '', value1, setValue1, footer = '', onClose }: ModalProps): JSX.Element | null {

  if (!visible) return null;

  return (
    <div className={s.modal} onClick={onClose}>
      <div className={s.modal_dialog} onClick={(e): void => e.stopPropagation()}>
        <div className={s.modal_header}>
          <h3 className={s.modal_title}>{title}</h3>
          <span className={s.modal_close} onClick={onClose}>
            &times;
          </span>
        </div>
        <div className={s.modal_body}>
          <div className={s.modal_content}>
            <input value={value1} onChange={(event) => setValue1(event.target.value)} />
          </div>
        </div>
        {footer && <div className={s.modal_footer}>{footer}</div>}
      </div>
    </div>
  );
}

export function Home(): JSX.Element {
  const [homeTitle, setTitle] = useState('Мої дошки');
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [value1, setValue1] = useState("");

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
          onClick={() => setModal(true)}
        />
      </div>
      <Modal
        visible={isModal}
        title="Введіть назву нової дошки"
        value1={value1}
        setValue1={setValue1}
        footer={<button onClick={() => createBoard(value1, { background: 'white' })}>Створити</button>}
        onClose={onClose}
      />
    </div>
  );
}
