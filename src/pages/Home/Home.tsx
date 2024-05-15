import React, { useEffect, useState } from 'react';
import { FaSquarePlus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../api/request';
import { CreateBoard } from '../../common/components/CreateBoardLogic/CreateBoard';
import { ProgresBar } from '../../common/components/ProgressBar/ProgresBar';
import { IBoard } from '../../common/interfaces/IBoard';
import Button from '../Board/components/Button/Button';
import s from './Home.module.scss';
import { BoardPreview } from './components/Board/BoardPrewiew';

export function Home(): JSX.Element {
  const [homeTitle] = useState('Мої дошки');
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [isModal, setModal] = useState(false);
  const [progresBar, setProgresBar] = useState(0);
  const onClose = (): void => setModal(!isModal);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const data: { boards: IBoard[] } = await api.get(`/board`, {
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            if (total !== undefined) {
              const calculatedProgress = Math.round((loaded / total) * 100);
              setProgresBar(calculatedProgress);
            }
          },
          onDownloadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            if (total !== undefined) {
              const calculatedProgress = Math.round((loaded / total) * 100);
              setProgresBar(calculatedProgress);
            }
          },
        });
        setBoards(data.boards);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Ой...',
          text: 'Помилка завантаження дошок',
          footer: error instanceof Error ? error.message : String(error),
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {progresBar >= 0 && <ProgresBar progress={progresBar} />}
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
      <CreateBoard isModal={isModal} onClose={onClose} setBoards={setBoards} />
    </div>
  );
}
