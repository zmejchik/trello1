import React, { createContext, useEffect, useState } from 'react';
import { FaSquarePlus } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import { CreateBoard } from '../../common/components/CreateBoardLogic/CreateBoard';
import { IBoard } from '../../common/interfaces/IBoard';
import Button from '../../common/components/Button/Button';
import s from './Home.module.scss';
import { BoardPreview } from './components/Board/BoardPrewiew';
import { fetchBoards } from '../../utils/fetchBoards';
import { toggleModal } from '../../utils/modalHandlers';
import { deleteBoard } from '../../utils/deleteBoard';
import { useLogOut } from '../../utils/logOut';

export const BackgroundContext = createContext('#00000050');
export function Home(): JSX.Element {
  const [homeTitle] = useState('Мої дошки');
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [isModal, setModal] = useState(false);
  const [progresBar, setProgresBar] = useState(0);
  const { logOut } = useLogOut();

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
          <div className={s.board_wrapper} key={id}>
            <Link to={`/board/${id}`} key={id}>
              <BoardPreview key={id} title={title} style={custom} />
            </Link>
            <div>
              <RiDeleteBin6Line
                className={s.iconDelete}
                onClick={async (event): Promise<void> => {
                  event.stopPropagation();
                  if (id) {
                    await deleteBoard(id.toString());
                    window.location.reload();
                  }
                }}
              />
            </div>
          </div>
        ))}
        <Button
          icon={<FaSquarePlus />}
          caption="Створити дошку"
          className={s.board_button}
          onClick={(): void => setModal(true)}
        />
      </div>
      <CreateBoard isModal={isModal} onClose={onClose} setBoards={setBoards} />
      <button type="button" className={s.buttonLogOut} onClick={logOut}>
        LogOut
      </button>
    </div>
  );
}
