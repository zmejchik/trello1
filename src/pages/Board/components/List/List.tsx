import React, { useState } from 'react';
import { FaSquarePlus } from 'react-icons/fa6';
import { FaClipboard } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import s from './list.module.scss';
import Button from '../Button/Button';
import api from '../../../../api/request';
import { Card } from '../Card/Card';
import { IList } from '../../../../common/interfaces/IList';
import { Modal } from '../../../../common/components/Modal/Modal';
import { ICard } from '../../../../common/interfaces/ICard';
import { isValidBoardName as isValidListName } from '../../../../common/components/CreateBoardLogic/CreateBoard';

function List({ id, title: titleList, cards: cardsArray }: IList): JSX.Element {
  const [value, setValue] = useState('');
  const [isModal, setModal] = useState(false);
  const [cards, setcards] = useState(cardsArray);
  const [listName, setListName] = useState(titleList);
  const [isEditingNameList, setIsEditingNameList] = useState(false);
  const [inputValueNameList, setInputValueNameList] = useState(listName);

  const onClose = (): void => setModal(!isModal);
  const { boardId } = useParams();

  const createCard = async (titleCard: string): Promise<void> => {
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
      setModal(false);
      const data: { lists: IList[] } = await api.get(`/board/${boardId}`);
      const newCards = data.lists.find((list) => list.id === id)?.cards || [];
      setcards(newCards);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching boards:', error);
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
        // eslint-disable-next-line no-console
        console.error('Error editing board name:', error);
      }
    } else {
      // eslint-disable-next-line no-alert
      alert('Incorrect list name');
    }
  };

  return (
    <>
      <div className={s.list}>
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
          <h2 className={s.list_title} onClick={(): void => setIsEditingNameList(true)}>
            {listName}
          </h2>
        )}

        <div className={s.list_body}>
          {cards.map(({ id: cardId, title: titleCard }: ICard) => (
            <Card key={cardId} id={cardId} title={titleCard} listId={id} />
          ))}
        </div>
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
