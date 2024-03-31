import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaClipboard } from 'react-icons/fa';
import { ICard } from '../../../../common/interfaces/ICard';
import s from './card.module.scss';
import { isValidBoardName as isValidCardName } from '../../../../common/components/CreateBoardLogic/CreateBoard';
import api from '../../../../api/request';

export function Card({ id: cardId, title: cardTitle, listId }: ICard): JSX.Element {
  const [isEditingNameCard, setIsEditingNameCard] = useState(false);
  const [inputValueNameCard, setInputValueNameCard] = useState(cardTitle);
  const [cardName, setCardName] = useState(cardTitle);
  const { boardId } = useParams();

  const editNameCard = async (title: string): Promise<void> => {
    if (isValidCardName(title)) {
      try {
        await api.put(`/board/${boardId}/card/${cardId}`, { id: cardId, title, list_id: listId });
        setIsEditingNameCard(false);
        setCardName(title);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error editing board name:', error);
      }
    } else {
      // eslint-disable-next-line no-alert
      alert('Incorrect card name');
    }
  };

  return (
    <div className={s.card} onClick={(): void => setIsEditingNameCard(true)}>
      {isEditingNameCard ? (
        <h2 className={s.listH2}>
          <FaClipboard className={s.listIcon} />
          <input
            className={s.list_inputForEditionNameList}
            value={inputValueNameCard}
            onChange={(event): void => setInputValueNameCard(event.target.value)}
            onBlur={(): Promise<void> => editNameCard(inputValueNameCard)}
            onKeyDown={(ev): void => {
              if (ev.key === 'Enter') {
                const target = ev.target as HTMLInputElement;
                target.blur();
              }
            }}
          />
        </h2>
      ) : (
        <h3 className={s.card_title}>{cardName}</h3>
      )}
    </div>
  );
}
