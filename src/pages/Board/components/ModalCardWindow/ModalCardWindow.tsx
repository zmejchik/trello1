import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchDataFailure,
  fetchDataStart,
  fetchDataSuccess,
  setCardId,
  setListId,
  setListTitle,
  visibleModalForCard,
} from '../../../../redux/dataSlice';
import s from './ModalCardWindow.module.scss';
import { RootState } from '../../../../redux/store';
import api from '../../../../api/request';
import { findListIdByCardId } from '../../../../utils/findListIdByCardId';

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
          // find the listId by the cardId
          const listId = findListIdByCardId(data, +cardId);
          dispatch(setListId(listId ? listId.toString() : ''));
          const list: List | undefined = data.lists.find((listItem) => listItem.id === listId);
          if (list) {
            // find cards array
            const { cards } = list;
            dispatch(fetchDataSuccess(cards));
            const listTitle = list.title;
            dispatch(setListTitle(listTitle));
          }
          dispatch(fetchDataSuccess(response.data));
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
            <textarea maxLength={5000} defaultValue={data?.description} />
          </div>
        </div>
        <div className={s.operations}>
          <div
            onClick={(): void => {
              dispatch(visibleModalForCard());
              navigate(-1);
            }}
          >
            X
          </div>
          <h2>Дії над карткою</h2>
          <button type="button">Копіювати</button>
          <button type="button">Перемістити</button>
          <button type="button">Архівувати</button>
        </div>
      </div>
    </div>
  );
}

export default ModalCardWindow;
