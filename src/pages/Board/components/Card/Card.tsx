import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { ICard } from '../../../../common/interfaces/ICard';
import s from './card.module.scss';
import { deleteCard } from '../../../../utils/deleteCard';

import { fetchDataSuccess, setListTitle, setCardId, setListId, visibleModalForCard } from '../../../../redux/dataSlice';

interface CardProps extends ICard {
  classSlot: string;
  cards: ICard[];
  list_title: string;
  onDragStart: (event: React.DragEvent<HTMLElement>, id: number) => void;
  onDragEnter: (event: React.DragEvent<HTMLElement>, id: number) => void;
}

export function Card({
  id: cardId,
  title: cardTitle,
  list_id,
  list_title,
  updateCardList,
  classSlot,
  onDragStart,
  onDragEnter,
  cards,
}: CardProps): JSX.Element {
  const [isEditingNameCard] = useState(false);
  const [cardName] = useState(cardTitle);
  const { boardId } = useParams<{ boardId: string }>();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (isEditingNameCard) {
      inputRef.current?.focus();
    }
  }, [isEditingNameCard]);

  const dispatch = useDispatch();

  return (
    <div className={s.wrapperCard}>
      <div
        id={cardId.toString()}
        className={`${s.card} ${s[classSlot]}`}
        draggable="true"
        onClick={(): void => {
          dispatch(visibleModalForCard());
          dispatch(fetchDataSuccess(cards));
          dispatch(setCardId(cardId.toString()));
          if (list_id) {
            dispatch(setListId(list_id.toString()));
          } else {
            dispatch(setListId('-1'));
          }
          dispatch(setListTitle(list_title));
          navigate(`/board/${boardId}/card/${cardId}`);
        }}
        onDragStart={(event: React.DragEvent<HTMLElement>): void => onDragStart(event, cardId)}
        onDragEnter={(event: React.DragEvent<HTMLElement>): void => onDragEnter(event, cardId)}
      >
        <h3 className={s.card_title}>{cardName}</h3>
      </div>
      <RiDeleteBin6Line
        className={s.iconDelete}
        onClick={(): Promise<void> => (boardId ? deleteCard(cardId, boardId, updateCardList) : Promise.resolve())}
      />
    </div>
  );
}
