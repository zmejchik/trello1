import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { ICard } from '../../../../common/interfaces/ICard';
import s from './card.module.scss';
import { deleteCard } from '../../../../utils/deleteCard';

import { fetchDataSuccess, setListTitle, setCardId, setListId, visibleModalForCard } from '../../../../redux/dataSlice';
import store from '../../../../redux/store';

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
  const [isEditingNameCard, setIsEditingNameCard] = useState(false);
  const [cardName, setCardName] = useState(cardTitle);
  const { boardId } = useParams<{ boardId: string }>();
  const inputRef = useRef<HTMLInputElement>(null);

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
          console.log('click');
          dispatch(visibleModalForCard());
          dispatch(fetchDataSuccess(cards));
          dispatch(setCardId(cardId.toString()));
          dispatch(setListId(list_id.toString()));
          dispatch(setListTitle(list_title));
          console.log(console.log(store.getState()));
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
