import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { FaSquarePlus } from 'react-icons/fa6';
import { FaClipboard } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import s from './list.module.scss';
import Button from '../../../../common/components/Button/Button';
import { Card } from '../Card/Card';
import Slot from '../../../../common/components/SlotForCard/SlotForCard';
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
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const [draggingCardId, setDraggingCardId] = useState<number>(-1);

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
  }

  const addSlot = (cardId: number): void => {
    if (!cards.some((card) => card.id === cardId)) {
      setCards([...cards, { id: -1, title: '' }]);
    }
  };

  const delSlot = (): void => {
    setCards(cards.filter((card) => card.id !== -1));
  };

  const dropHandler = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
    event.preventDefault();
    const cardId = event.dataTransfer.getData('text/plain');
    if (boardId && draggingCardId) {
      try {
        const data: { lists: IList[] } = await api.get(`/board/${boardId}`);
        let draggedCard: ICard | undefined;
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
          await api.post(`/board/${boardId}/card/`, draggedCard);
          setIsDraggingCard(false);
          delSlot();
          await updateCardList(boardId, id, setCards);
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
  };

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
          {cards.map(({ id: cardId, title: titleCard }: ICard) =>
            isDraggingCard && draggingCardId === +id ? (
              <Slot key={cardId} cardId={id} onDragOver={addSlot} onDragLeave={delSlot} />
            ) : (
              <Card
                key={cardId}
                id={cardId}
                title={titleCard}
                list_id={id}
                updateCardList={(): Promise<void> =>
                  boardId ? updateCardList(boardId, id, setCards) : Promise.resolve()
                }
                setDraggingCardId={setDraggingCardId}
              />
            )
          )}
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
