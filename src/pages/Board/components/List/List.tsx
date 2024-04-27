import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FaSquarePlus } from 'react-icons/fa6';
import { FaClipboard } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import s from './list.module.scss';
import Button from '../Button/Button';
import api from '../../../../api/request';
import { Card } from '../Card/Card';
import Slot from '../../../../common/components/SlotForCard/SlotForCard';
import { IList } from '../../../../common/interfaces/IList';
import { Modal } from '../../../../common/components/ModalWindow/Modal';
import { ICard } from '../../../../common/interfaces/ICard';
import { isValidBoardName as isValidListName } from '../../../../common/components/CreateBoardLogic/CreateBoard';

function List({ id, title: titleList, cards: cardsArray }: IList): JSX.Element {
  const [value, setValue] = useState('');
  const [isModal, setModal] = useState(false);
  const [cards, setcards] = useState(cardsArray);
  const [listName, setListName] = useState(titleList);
  const [isEditingNameList, setIsEditingNameList] = useState(false);
  const [inputValueNameList, setInputValueNameList] = useState(listName);
  const [isDragginCard, setIsDragginCard] = useState(false);

  const onClose = (): void => setModal(false);
  const { boardId } = useParams();

  const updateCardList = async (): Promise<void> => {
    try {
      const data: { lists: IList[] } = await api.get(`/board/${boardId}`);
      const newCards = data.lists.find((list) => list.id === id)?.cards || [];
      setcards(newCards);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error updating card list:',
        footer: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const createCard = async (titleCard: string): Promise<void> => {
    if (isValidListName(titleCard)) {
      try {
        await api.post(`/board/${boardId}/card/`, {
          title: titleCard,
          list_id: id,
          position: cards.length ? cards.length + 1 : 1,
          description: 'washing process',
          custom: {
            deadline: '2022-08-31 12:00',
          },
        });
        onClose();
        updateCardList();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error creating card',
          footer: error instanceof Error ? error.message : String(error),
        }).then(() => {
          onClose();
        });
      }
    } else {
      onClose();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error name card',
      });
    }
  };

  const editNameList = async (title: string): Promise<void> => {
    if (isValidListName(title)) {
      try {
        await api.put(`/board/${boardId}/list/${id}`, { title });
        const data: { lists: IList[] } = await api.get(`/board/${boardId}`);
        const newListName = data.lists.find((list) => list.id === id)?.title || '';
        setListName(newListName);
        setIsEditingNameList(false);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error editing list name',
          footer: error instanceof Error ? error.message : String(error),
        }).then(() => {
          onClose();
        });
      }
    } else {
      onClose();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Incorrect list name',
      });
    }
  };

  function dragOverHandler(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    setIsDragginCard(true);
  }

  const addSlot = (): void => {
    setcards([...cards, { id: -1, title: '' }]);
  };
  const dropHandler = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
    event.preventDefault();
    const cardId = event.dataTransfer.getData('text/plain');
    try {
      const data: { lists: IList[] } = await api.get(`/board/${boardId}`);
      let draggedCard = null;
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
        setIsDragginCard(false);
        updateCardList();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error moving card',
        footer: error instanceof Error ? error.message : String(error),
      });
    }
  };
  return (
    <>
      <div className={s.list} onDragOver={dragOverHandler} onDrop={dropHandler}>
        {isEditingNameList ? (
          <h2 className={s.listH2}>
            <FaClipboard className={s.listIcon} />
            <input
              className={s.list_inputForEditionNameList}
              value={inputValueNameList}
              onChange={(event): void => setInputValueNameList(event.target.value)}
              onBlur={(): Promise<void> => editNameList(inputValueNameList)}
              onKeyDown={(ev): void => {
                if (ev.key === 'Enter') {
                  const target = ev.target as HTMLInputElement;
                  target.blur();
                }
              }}
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
            <Card key={cardId} id={cardId} title={titleCard} list_id={id} updateCardList={updateCardList} />
          ))}
        </div>
        {isDragginCard && <Slot onDragOver={addSlot} />}
        <Button icon={<FaSquarePlus />} caption="Створити картку" onClick={(): void => setModal(true)} />
      </div>
      <Modal
        visible={isModal}
        title="Введіть назву нового списку"
        inputValue={value}
        setValue={setValue}
        footer={<button onClick={(): Promise<void> => createCard(value)}>Створити</button>}
        onClose={onClose}
      />
    </>
  );
}

export default List;
