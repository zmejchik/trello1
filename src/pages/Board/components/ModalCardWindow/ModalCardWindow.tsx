import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchDataFailure,
  fetchDataStart,
  fetchDataSuccess,
  setCardId,
  setListId,
  setListTitle,
  setBoardId,
  visibleModalForCard,
  setDescription,
} from '../../../../redux/dataSlice';
import s from './ModalCardWindow.module.scss';
import { RootState } from '../../../../redux/store';
import api from '../../../../api/request';
import { findListIdByCardId } from '../../../../utils/findListIdByCardId';
import CardModal from './components/ActionModal/CardModal';
import { deleteCard } from '../../../../utils/deleteCard';
import { ICard } from '../../../../common/interfaces/ICard';

interface Card {
  id: number;
  title: string;
  description: string;
  position: number;
  users: [];
  custom: {
    deadline: number;
  };
  created_at: number;
}
interface List {
  id: number;
  title: string;
  position: number;
  cards: Card[];
}

interface Board {
  title: string;
  custom: {
    background: string;
  };
  users: {
    id: number;
    username: string;
  }[];
  lists: List[];
}

function ModalCardWindow(): JSX.Element {
  const { boardId, cardId } = useParams<{ boardId: string; cardId: string }>();
  const [isVisibleModalWindow, setVisibleModalWindow] = useState(false);
  const [dataBoard, setDataBoard] = useState<Board | null>(null);
  const [typeCardModal, setTypeCardModal] = useState('copy');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (boardId && cardId) {
      dispatch(setCardId(cardId));
      dispatch(fetchDataStart());
      api
        .get(`/board/${boardId}`)
        .then((response) => {
          const data: Board = response.data || response;
          setDataBoard(data);
          // find the listId by the cardId
          const listId = findListIdByCardId(data, +cardId);
          dispatch(setListId(listId ? listId.toString() : ''));
          const list: List | undefined = data.lists.find((listItem) => listItem.id === listId);
          if (list) {
            // find cards array
            const { cards } = list;
            dispatch(fetchDataSuccess(cards as unknown as ICard[]));
            const listTitle = list.title;
            dispatch(setListTitle(listTitle));
          }
          dispatch(fetchDataSuccess(response.data));
          dispatch(setBoardId(boardId));
        })
        .catch((error) => {
          dispatch(fetchDataFailure(error.message));
        });
    }
  }, [boardId, cardId, dispatch]);

  const data = useSelector((state: RootState) =>
    state.data.cards.find((card) => card.id.toString() === state.data.cardId)
  );

  const listName = useSelector((state: RootState) => state.data.list_name);

  function handleCardModalWindow(type: string): void {
    setTypeCardModal(type);
    if (type === 'delete' && cardId !== undefined && boardId !== undefined) {
      deleteCard(+cardId, boardId).then(() => {
        dispatch(visibleModalForCard());
        navigate(`/board/${boardId}`);
      });
    } else {
      setVisibleModalWindow(true);
    }
  }

  function handleDescription(event: ChangeEvent<HTMLTextAreaElement>): void {
    if (cardId !== undefined) {
      dispatch(setDescription({ cardId: +cardId, description: event.target.value }));
    }
  }

  return (
    <div className={s.overlay}>
      <div className={s.wrapper}>
        <div className={s.infopart}>
          <h2>Назва картки {data?.title}</h2>
          <p>
            В списку <u>{listName}</u>
          </p>
          <h3>УЧАСНИКИ</h3>
          <div className={s.users}>
            <div className={s.user}>1</div>
            <div className={s.user}>2</div>
            <div className={s.user}>3</div>
            <div className={s.user}>+</div>
            <button type="button">Приєднатись</button>
          </div>
          <div>
            <h2>Опис</h2>
            <textarea maxLength={5000} defaultValue={data?.description} onChange={handleDescription} />
          </div>
        </div>
        <div className={s.operations}>
          <div
            onClick={(): void => {
              dispatch(visibleModalForCard());
              navigate(`/board/${boardId}`);
            }}
          >
            X
          </div>
          <h2>Дії над карткою</h2>
          <button type="button" onClick={(): void => handleCardModalWindow('copy')}>
            Копіювати
          </button>
          <button type="button" onClick={(): void => handleCardModalWindow('move')}>
            Перемістити
          </button>
          <button type="button" onClick={(): void => handleCardModalWindow('delete')}>
            Видалити
          </button>
        </div>
      </div>
      {isVisibleModalWindow && (
        <CardModal
          type={typeCardModal}
          boardId={boardId || ''}
          listId={
            dataBoard?.lists.find((list) => list.cards.some((card) => card.id.toString() === cardId))?.id.toString() ||
            ''
          }
          cardTitle={data?.title || ''}
          onClose={(): void => setVisibleModalWindow(false)}
          cardData={data}
        />
      )}
    </div>
  );
}

export default ModalCardWindow;
