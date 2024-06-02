import React, { useEffect, useState } from 'react';
import { FaSquarePlus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import { CreateBoard } from '../../common/components/CreateBoardLogic/CreateBoard';
import { IBoard } from '../../common/interfaces/IBoard';
import Button from '../../common/components/Button/Button';
import s from './Home.module.scss';
import { BoardPreview } from './components/Board/BoardPrewiew';
import { fetchBoards } from '../../utils/fetchBoards';
import { toggleModal } from '../../utils/modalHandlers';

export function Home(): JSX.Element {
  const [homeTitle] = useState('Мої дошки');
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [isModal, setModal] = useState(false);
  const [progresBar, setProgresBar] = useState(0);

  const onClose = (): void => toggleModal(isModal, setModal);

  useEffect(() => {
    fetchBoards(setBoards, setProgresBar);
  }, []);

  return (
    <div>
      <LinearProgress
        variant="determinate"
        value={progresBar}
        sx={{
          height: 20,
        }}
      />
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
