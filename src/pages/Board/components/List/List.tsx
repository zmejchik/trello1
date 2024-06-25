import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { FaSquarePlus } from 'react-icons/fa6';
import { FaClipboard } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import s from './list.module.scss';
import Button from '../../../../common/components/Button/Button';
import { Card } from '../Card/Card';
import { IList } from '../../../../common/interfaces/IList';
import { Modal } from '../../../../common/components/ModalWindow/Modal';
import { ICard } from '../../../../common/interfaces/ICard';
import { updateCardList } from '../../../../utils/updateCardList';
import { createCard } from '../../../../utils/createCard';
import { editNameList } from '../../../../utils/editNameList';
import api from '../../../../api/request';

function List({ id, title: titleList, cards: cardsArray, setRenderList }: IList): JSX.Element {
  const [newCardName, setNewCardName] = useState('');
  const [isModal, setModal] = useState(false);
  const [cards, setCards] = useState(cardsArray);
  const [listName, setListName] = useState(titleList);
  const [isEditingNameList, setIsEditingNameList] = useState(false);
  const [inputValueNameList, setInputValueNameList] = useState(listName);
  const [, setIsDraggingCard] = useState(false);
  const draggingCardId = useRef<number>(-1);

  const onClose = (): void => setModal(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { boardId = '' } = useParams<{ boardId?: string }>();

  useEffect(() => {
    if (isEditingNameList) {
      inputRef.current?.focus();
    }
  }, [isEditingNameList]);

  function dragOverHandler(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    setIsDraggingCard(true);
  }

  function dragLeaveHandler(): void {
    setIsDraggingCard(false);
    const newCards = cards.filter((card) => card.id !== -1);
    setTimeout(() => {
      newCards.forEach((card, index) => {
        const newCard = { ...card, position: index + 1 };
        Object.assign(card, newCard);
      });
      setCards(newCards);
    }, 0);
  }

  const dropHandler = async (event: React.DragEvent<HTMLElement>): Promise<void> => {
    event.preventDefault();
    const cardId = event.dataTransfer.getData('text/plain');
    let draggedCard: ICard | undefined;
    if (boardId && draggingCardId) {
      try {
        const data: { lists: IList[] } = await api.get(`/board/${boardId}`);

        data.lists.find((list) => {
          draggedCard = list.cards.find((card) => card.id.toString() === cardId);
          if (draggedCard) {
            draggedCard.list_id = id;
            return true;
          }
          return false;
        });
        if (draggedCard) {
          await api.delete(`/board/${boardId}/card/${cardId}`);
          cards.forEach((card, index) => {
            const newCard = { ...card, position: index + 1 };
            Object.assign(card, newCard);
          });
          const slotCard: ICard[] = cards.filter((card) => card.id === -1);
          draggedCard.position = slotCard[0].position;
          cards.forEach((card, index) => {
            if (card.position === draggedCard?.position) {
              cards[index] = draggedCard as ICard;
            }
          });
          cards.forEach((card, index) => {
            const newCard = { ...card, position: index + 1 };
            Object.assign(card, newCard);
          });
          await api.post(`/board/${boardId}/card/`, draggedCard);

          setIsDraggingCard(false);
          await updateCardList(boardId, id, setCards);
          setCards(cards);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error moving card',
          footer: error instanceof Error ? error.message : String(error),
        });
      }
    }
    setRenderList(true);
    /* field for coding  */

    const dataFromServer: { lists: IList[] } = await api.get(`/board/${boardId}`);
    const listFromServer = dataFromServer.lists.find((list) => list.id === id);
    const cardFromServer = listFromServer?.cards.find((card) => card.title === draggedCard?.title);

    const updateDataOnServer = cards.map((card) => {
      if (card.title === draggedCard?.title && card.id !== undefined && cardFromServer?.id) {
        card.id = cardFromServer?.id;
      }
      return { id: card.id, position: card.position, list_id: id };
    });

    await api.put(`/board/${boardId}/card`, updateDataOnServer);

    setCards(cards);
  };

  function dragEnterHandler(event: React.DragEvent<HTMLElement>, cardId: number): void {
    const element = event.currentTarget as HTMLElement;
    const mousePos = event.clientY - element.getBoundingClientRect().top;
    const isBelowHalf = mousePos > element.offsetHeight / 2;
    const newCards = [...cards];
    const cardIndex = newCards.findIndex((card) => card.id === cardId);
    // Remove any existing slot cards
    const existingSlotIndex = newCards.findIndex((card) => card.id === -1);
    if (existingSlotIndex !== -1) {
      newCards.splice(existingSlotIndex, 1);
    }
    if (cardIndex !== -1 && newCards[cardIndex] !== undefined) {
      // Create a new slot card
      const slotCard = { id: -1, title: '', list_id: id, position: newCards[cardIndex].position };
      if (isBelowHalf) {
        newCards.splice(cardIndex + 1, 0, slotCard);
      } else {
        newCards.splice(cardIndex - 1, 0, slotCard);
      }
      newCards.forEach((card, index) => {
        const newCard = { ...card, position: index + 1 };
        Object.assign(card, newCard);
      });
      setTimeout(() => {
        setCards(newCards);
      }, 100);
    }
  }

  function dragStartHandler(event: React.DragEvent<HTMLElement>, cardId: number): void {
    event.dataTransfer.setData('text/plain', cardId.toString());
    draggingCardId.current = cardId;
    const newCards = cards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            id: -1,
            title: '',
          }
        : card
    );
    setTimeout(() => {
      newCards.forEach((card, index) => {
        const newCard = { ...card, position: index + 1 };
        Object.assign(card, newCard);
      });
      setCards(newCards);
    }, 0);
  }

  return (
    <>
      <div className={s.list} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler} onDrop={dropHandler}>
        {isEditingNameList ? (
          <h2 className={s.listH2}>
            <FaClipboard className={s.listIcon} />
            <input
              className={s.list_inputForEditionNameList}
              value={inputValueNameList}
              onChange={(event): void => setInputValueNameList(event.target.value)}
              onBlur={(): Promise<void> =>
                boardId
                  ? editNameList(boardId, id, inputValueNameList, setListName, setIsEditingNameList)
                  : Promise.resolve()
              }
              onKeyDown={(ev): void => {
                if (ev.key === 'Enter' && boardId) {
                  editNameList(boardId, id, inputValueNameList, setListName, setIsEditingNameList);
                }
              }}
              ref={inputRef}
            />
          </h2>
        ) : (
          <h2
            className={s.list_title}
            onDragOver={dragOverHandler}
            onDrop={dropHandler}
            onClick={(): void => setIsEditingNameList(true)}
          >
            {listName}
          </h2>
        )}

        <div className={s.list_body}>
          {cards.map(({ id: cardId, title: titleCard }: ICard) => (
            <Card
              key={cardId}
              id={cardId}
              title={titleCard}
              list_id={id}
              updateCardList={(): Promise<void> =>
                boardId ? updateCardList(boardId, id, setCards) : Promise.resolve()
              }
              onDragStart={(event): void => dragStartHandler(event, cardId)}
              onDragEnter={(event): void => dragEnterHandler(event, cardId)}
              classSlot={cardId === -1 ? 'slotCard' : ''}
            />
          ))}
        </div>

        <Button icon={<FaSquarePlus />} caption="Створити картку" onClick={(): void => setModal(true)} />
      </div>

      <Modal
        visible={isModal}
        title="Введіть назву нової картки"
        placeholder="Назва нової картки"
        inputValue={newCardName}
        setValue={setNewCardName}
        footer={
          <button
            onClick={(): Promise<void> =>
              boardId
                ? createCard(boardId, id, newCardName, cards, setCards, setNewCardName, onClose)
                : Promise.resolve()
            }
          >
            Створити
          </button>
        }
        onClose={onClose}
      />
    </>
  );
}

export default List;
