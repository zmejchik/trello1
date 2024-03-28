import React, { useEffect, useState } from 'react';
import { FaSquarePlus } from 'react-icons/fa6';
import { FaClipboard } from 'react-icons/fa';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import Button from './components/Button/Button';
import List from './components/List/List';
import s from './board.module.scss';
import api from '../../api/request';
import { IList } from '../../common/interfaces/IList';
import { Modal } from '../../common/components/Modal/Modal';
import { isValidBoardName } from '../../common/components/CreateBoardLogic/CreateBoard';

export function Board(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [boardTitle, setBoardTitle] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lists, setLists] = useState<IList[]>([]);
  const [value, setValue] = useState('');
  const [isModal, setModal] = useState(false);
  const [inputValueNameBoard, setInputValueNameBoard] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  const { boardId } = useParams();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const data: { title: string; lists: IList[] } = await api.get(`/board/${boardId}`);
        setLists(data.lists);
        setBoardTitle(data.title);
        setInputValueNameBoard(data.title);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching boards:', error);
      }
    };

    fetchData();
  }, []);

  const createList = async (title: string): Promise<void> => {
    try {
      await api.post(`/board/${boardId}/list`, {
        title,
        position: lists.length ? lists.length + 1 : 1,
      });
      setModal(false);
      const data: { lists: IList[] } = await api.get(`/board/${boardId}/`);
      setLists(data.lists);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching boards:', error);
    }
  };

  const onClose = (): void => setModal(!isModal);

  const editNameBoard = async (title: string): Promise<void> => {
    if (isValidBoardName(title)) {
      try {
        await api.put(`/board/${boardId}`, { title });
        setBoardTitle(title);
        setIsEditingName(false);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error editing board name:', error);
      }
    } else {
      // eslint-disable-next-line no-alert
      alert('Incorrect board name');
    }
  };

  return (
    <div>
      <header className={s.board_header}>
        <Button icon={<MdKeyboardDoubleArrowLeft />} caption="Додому" className={s.board_button_back} to="/" />
        {isEditingName ? (
          <h1 className={s.boardH1}>
            <FaClipboard />
            <input
              className={s.board_inputForEditionNameBoard}
              value={inputValueNameBoard}
              onChange={(event): void => setInputValueNameBoard(event.target.value)}
              onBlur={(): Promise<void> => editNameBoard(inputValueNameBoard)}
            />
          </h1>
        ) : (
          <h1 onClick={(): void => setIsEditingName(true)}>
            {boardTitle} With id {boardId}
          </h1>
        )}
      </header>
      <div className={s.board_body}>
        {lists.map(({ id, title: listTitle, cards }) => (
          <List key={id} id={id} title={listTitle} cards={cards} />
        ))}
        <Button
          icon={<FaSquarePlus />}
          caption="Створити список"
          className={s.board_button}
          onClick={(): void => setModal(true)}
        />
      </div>
      <Modal
        visible={isModal}
        title="Введіть назву нового списку"
        inputValue={value}
        setValue={setValue}
        footer={<button onClick={(): Promise<void> => createList(value)}>Створити</button>}
        onClose={onClose}
      />
    </div>
  );
}
