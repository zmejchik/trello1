import React, { useEffect, useState } from 'react';
import { FaSquarePlus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { BoardPreview } from './components/Board/BoardPrewiew';
import s from './Home.module.scss';
import Button from '../Board/components/Button/Button';
import api from '../../api/request';
import { IBoard } from '../../common/interfaces/IBoard';
import { CreateBoard } from '../../common/components/CreateBoardLogic/CreateBoard';

export function Home(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [homeTitle, setTitle] = useState('Мої дошки');
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [isModal, setModal] = useState(false);
  const [progres, setProgres] = useState(0);
  const onClose = (): void => setModal(!isModal);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const data: { boards: IBoard[] } = await api.get(`/board`, {
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            if (total !== undefined) {
              const calculatedProgress = Math.round((loaded / total) * 100);
              setProgres(calculatedProgress);
            }
          },
          onDownloadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            if (total !== undefined) {
              const calculatedProgress = Math.round((loaded / total) * 100);
              setProgres(calculatedProgress);
            }
          },
        });
        setBoards(data.boards);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching boards:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {progres >= 0 && (
        <div className={s.progress_bar}>
          <div className={s.progress} style={{ width: `${progres}%` }}>
            {}
          </div>
        </div>
      )}

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
