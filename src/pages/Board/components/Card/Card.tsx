import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { FaClipboard } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { ICard } from '../../../../common/interfaces/ICard';
import s from './card.module.scss';
import { isValidBoardName as isValidCardName } from '../../../../common/components/CreateBoardLogic/CreateBoard';
import api from '../../../../api/request';

export function Card({ id: cardId, title: cardTitle, list_id, updateCardList }: ICard): JSX.Element {
  const [isEditingNameCard, setIsEditingNameCard] = useState(false);
  const [inputValueNameCard, setInputValueNameCard] = useState(cardTitle);
  const [cardName, setCardName] = useState(cardTitle);
  const { boardId } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Executes the focus action on the input element when the isEditingNameCard state is true.
   * This effect is triggered when the component mounts or when the isEditingNameCard state changes.
   */
  useEffect(() => {
    if (isEditingNameCard) {
      inputRef.current?.focus();
    }
  });

  const editNameCard = async (title: string): Promise<void> => {
    if (!isValidCardName(title)) {
      Swal.fire({
        icon: 'error',
        title: 'Ой...',
        text: 'Некоректне ім`я картки',
      });
      return;
    }
    try {
      await api.put(`/board/${boardId}/card/${cardId}`, { id: cardId, title, list_id });
      setIsEditingNameCard(false);
      setCardName(title);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Ой...',
        text: 'Помилка редагування імені картки',
        footer: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const deleteCard = async (id: number): Promise<void> => {
    try {
      await api.delete(`/board/${boardId}/card/${id}`);
      if (updateCardList !== undefined) updateCardList();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Ой...',
        text: 'Помилка видалення картки',
        footer: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const dragStartHandler = (event: React.DragEvent<HTMLDivElement>): void => {
    event.dataTransfer.setData('text/plain', cardId.toString());
  };
  return (
    <div className={s.wrapperCard}>
      <div
        id={cardId.toString()}
        className={s.card}
        draggable="true"
        onDragStart={dragStartHandler}
        onClick={(): void => setIsEditingNameCard(true)}
      >
        {isEditingNameCard ? (
          <h2 className={s.listH2}>
            <FaClipboard className={s.cardIcon} />
            <input
              className={s.card_inputForEditionNameCard}
              value={inputValueNameCard}
              onChange={(event): void => setInputValueNameCard(event.target.value)}
              onBlur={(): Promise<void> => editNameCard(inputValueNameCard)}
              onKeyDown={(ev): void => {
                if (ev.key === 'Enter') {
                  editNameCard(inputValueNameCard);
                }
              }}
              ref={inputRef}
            />
          </h2>
        ) : (
          <h3 className={s.card_title}>{cardName}</h3>
        )}
      </div>
      <RiDeleteBin6Line className={s.iconDelete} onClick={(): Promise<void> => deleteCard(cardId)} />
    </div>
  );
}
