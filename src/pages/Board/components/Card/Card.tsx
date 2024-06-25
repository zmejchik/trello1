import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaClipboard } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { ICard } from '../../../../common/interfaces/ICard';
import s from './card.module.scss';
import { editNameCard } from '../../../../utils/editNameCard';
import { deleteCard } from '../../../../utils/deleteCard';

interface CardProps extends ICard {
  classSlot: string;
  onDragStart: (event: React.DragEvent<HTMLElement>, id: number) => void;
  onDragEnter: (event: React.DragEvent<HTMLElement>, id: number) => void;
}

export function Card({
  id: cardId,
  title: cardTitle,
  list_id,
  updateCardList,
  classSlot,
  onDragStart,
  onDragEnter,
}: CardProps): JSX.Element {
  const [isEditingNameCard, setIsEditingNameCard] = useState(false);
  const [inputValueNameCard, setInputValueNameCard] = useState(cardTitle);
  const [cardName, setCardName] = useState(cardTitle);
  const { boardId } = useParams<{ boardId: string }>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingNameCard) {
      inputRef.current?.focus();
    }
  }, [isEditingNameCard]);

  return (
    <div className={s.wrapperCard}>
      <div
        id={cardId.toString()}
        className={`${s.card} ${s[classSlot]}`}
        draggable="true"
        onClick={(): void => setIsEditingNameCard(true)}
        onDragStart={(event: React.DragEvent<HTMLElement>): void => onDragStart(event, cardId)}
        onDragEnter={(event: React.DragEvent<HTMLElement>): void => onDragEnter(event, cardId)}
      >
        {isEditingNameCard ? (
          <h2 className={s.listH2}>
            <FaClipboard className={s.cardIcon} />
            <input
              className={s.card_inputForEditionNameCard}
              value={inputValueNameCard}
              onChange={(event): void => setInputValueNameCard(event.target.value)}
              onBlur={(): void => {
                if (boardId && list_id) {
                  editNameCard(inputValueNameCard, cardId, boardId, list_id, setIsEditingNameCard, setCardName);
                }
              }}
              onKeyDown={(ev): void => {
                if (ev.key === 'Enter') {
                  if (boardId && list_id) {
                    editNameCard(inputValueNameCard, cardId, boardId, list_id, setIsEditingNameCard, setCardName);
                  }
                }
              }}
              ref={inputRef}
            />
          </h2>
        ) : (
          <h3 className={s.card_title}>{cardName}</h3>
        )}
      </div>
      <RiDeleteBin6Line
        className={s.iconDelete}
        onClick={(): Promise<void> => (boardId ? deleteCard(cardId, boardId, updateCardList) : Promise.resolve())}
      />
    </div>
  );
}
