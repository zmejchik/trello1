import React, { useEffect, useRef, useState } from 'react';
import { FaClipboard } from 'react-icons/fa';
import { FaSquarePlus } from 'react-icons/fa6';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LinearProgress } from '@mui/material';
import { red } from '@mui/material/colors';
import api from '../../api/request';
import { isValidBoardName } from '../../common/components/CreateBoardLogic/CreateBoard';
import { Modal } from '../../common/components/ModalWindow/Modal';
import SelectColor from '../../common/components/SelectColor/SelectColor';
import { IList } from '../../common/interfaces/IList';
import s from './board.module.scss';
import Button from './components/Button/Button';
import List from './components/List/List';

export function Board(): JSX.Element {
  const [boardTitle, setBoardTitle] = useState('');
  const [lists, setLists] = useState<IList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [isModal, setModal] = useState(false);
  const [inputValueNameBoard, setInputValueNameBoard] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [bgColor, setBgColor] = useState('FFFFFF');
  const [progresBar, setProgresBar] = useState(0);

  const { boardId } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const onClose = (): void => setModal(!isModal);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const data: { title: string; lists: IList[] } = await api.get(`/board/${boardId}`, {
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            if (total !== undefined) {
              const calculatedProgress = Math.round((loaded / total) * 100);
              setProgresBar(calculatedProgress);
            }
          },
          onDownloadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            if (total !== undefined) {
              const calculatedProgress = Math.round((loaded / total) * 100);
              setProgresBar(calculatedProgress);
            }
          },
        });
        setLists(data.lists);
        setBoardTitle(data.title);
        setInputValueNameBoard(data.title);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Ой...',
          text: 'Помилка завантаження дошки',
          footer: error instanceof Error ? error.message : String(error),
        });
      }
    };

    fetchData();
  }, []);

  /**
   * Adds a document event listener to handle clicks outside of a specific element.
   * If a click occurs outside of the specified element, it sets the state to stop editing the name.
   */
  useEffect(() => {
    if (isEditingName) {
      inputRef.current?.focus();
    }
  });

  const createList = async (titleList: string): Promise<void> => {
    if (!isValidBoardName(titleList)) {
      onClose();
      Swal.fire({ icon: 'error', title: 'Ой...', text: 'Некоректне ім`я списку' });
      return;
    }

    try {
      await api.post(`/board/${boardId}/list`, {
        title: titleList,
        position: lists.length ? lists.length + 1 : 1,
      });
      onClose();
      const data: { lists: IList[] } = await api.get(`/board/${boardId}/`);
      setLists(data.lists);
      setNewListName('');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Ой...',
        text: 'Помилка завантаження або створення списків',
        footer: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const editNameBoard = async (title: string): Promise<void> => {
    if (!isValidBoardName(title)) {
      Swal.fire({ icon: 'error', title: 'Ой...', text: 'Некоректне ім`я дошки' });
      return;
    }
    try {
      await api.put(`/board/${boardId}`, { title });
      setBoardTitle(title);
      setIsEditingName(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Ой...',
        text: 'Помилка редагування імені дошки',
        footer: error instanceof Error ? error.message : String(error),
      });
    }
  };

  return (
    <div className={s.board} style={{ backgroundColor: bgColor }}>
      <LinearProgress
        variant="determinate"
        value={progresBar}
        sx={{
          height: 20,
          color: red,
        }}
      />
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
              onKeyDown={(ev): void => {
                if (ev.key === 'Enter') {
                  editNameBoard(inputValueNameBoard);
                }
              }}
              ref={inputRef}
            />
          </h1>
        ) : (
          <h1 onClick={(): void => setIsEditingName(true)}>{boardTitle}</h1>
        )}
        <SelectColor onChange={setBgColor} />
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
        inputValue={newListName}
        placeholder="Назва нового списку"
        setValue={setNewListName}
        footer={<button onClick={(): Promise<void> => createList(newListName)}>Створити</button>}
        onClose={onClose}
      />
    </div>
  );
}
