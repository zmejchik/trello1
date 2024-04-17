import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaSquarePlus } from 'react-icons/fa6';
import { FaClipboard } from 'react-icons/fa';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import Button from './components/Button/Button';
import List from './components/List/List';
import s from './board.module.scss';
import api from '../../api/request';
import { IList } from '../../common/interfaces/IList';
import { Modal } from '../../common/components/ModalWindow/Modal';
import { isValidBoardName } from '../../common/components/CreateBoardLogic/CreateBoard';
import SelectColor from '../../common/components/SelectColor/SelectColor';
import { ProgresBar } from '../../common/components/ProgressBar/ProgresBar';

export function Board(): JSX.Element {
  const [boardTitle, setBoardTitle] = useState('');
  const [lists, setLists] = useState<IList[]>([]);
  const [value, setValue] = useState('');
  const [isModal, setModal] = useState(false);
  const [inputValueNameBoard, setInputValueNameBoard] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [bgColor, setBgColor] = useState('FFFFFF');
  const [progresBar, setProgresBar] = useState(0);

  const { boardId } = useParams();

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
          title: 'Oops...',
          text: 'Error fetching boards',
          footer: error instanceof Error ? error.message : String(error),
        });
      }
    };

    fetchData();
  }, []);

  const createList = async (title: string): Promise<void> => {
    if (isValidBoardName(title)) {
      try {
        await api.post(`/board/${boardId}/list`, {
          title,
          position: lists.length ? lists.length + 1 : 1,
        });
        setModal(false);
        const data: { lists: IList[] } = await api.get(`/board/${boardId}/`);
        setLists(data.lists);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error fetching boards',
          footer: error instanceof Error ? error.message : String(error),
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Incorrect list name',
      });
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
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error editing board name',
          footer: error instanceof Error ? error.message : String(error),
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Incorrect board name',
      });
    }
  };

  return (
    <div className={s.board} style={{ backgroundColor: bgColor }}>
      {progresBar >= 0 && <ProgresBar progress={progresBar} />}
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
                  const target = ev.target as HTMLInputElement;
                  target.blur();
                }
              }}
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
        inputValue={value}
        setValue={setValue}
        footer={<button onClick={(): Promise<void> => createList(value)}>Створити</button>}
        onClose={onClose}
      />
    </div>
  );
}
