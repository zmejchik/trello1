import React, { useEffect, useRef, useState } from 'react';
import { FaClipboard } from 'react-icons/fa';
import { FaSquarePlus } from 'react-icons/fa6';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import { Modal } from '../../common/components/ModalWindow/Modal';
import SelectColor from '../../common/components/SelectColor/SelectColor';
import { IList } from '../../common/interfaces/IList';
import s from './board.module.scss';
import Button from '../../common/components/Button/Button';
import List from './components/List/List';
import { fetchBoardData } from '../../utils/fetchBoardData';
import { createList } from '../../utils/createList';
import { editBoardName } from '../../utils/editBoardName';

export function Board(): JSX.Element {
  const [boardTitle, setBoardTitle] = useState('');
  const [lists, setLists] = useState<IList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [isModal, setModal] = useState(false);
  const [inputValueNameBoard, setInputValueNameBoard] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [bgColor, setBgColor] = useState(() => {
    return localStorage.getItem('boardBgColor') || '#FFFFFF';
  });
  const [progresBar, setProgresBar] = useState(0);
  const { boardId = '' } = useParams();
  const [renderList, setRenderList] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const onClose = (): void => setModal(!isModal);

  useEffect(() => {
    if (boardId) {
      fetchBoardData(boardId, setLists, setBoardTitle, setInputValueNameBoard, setProgresBar);
    }
  }, [boardId]);

  useEffect(() => {
    localStorage.setItem('boardBgColor', bgColor);
  }, [bgColor]);

  useEffect(() => {
    if (isEditingName) {
      inputRef.current?.focus();
    }
  });

  useEffect(() => {
    setRenderList(false);
    setLists([]);
    if (boardId) {
      fetchBoardData(boardId, setLists, setBoardTitle, setInputValueNameBoard, setProgresBar);
    }
  }, [renderList]);

  return (
    <div className={s.board} style={{ background: `${bgColor}80` }}>
      <LinearProgress
        variant="determinate"
        value={progresBar}
        sx={{
          height: 20,
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
              onBlur={(): void => {
                if (boardId) {
                  editBoardName(boardId, inputValueNameBoard, setBoardTitle, setIsEditingName);
                }
              }}
              onKeyDown={(ev): void => {
                if (ev.key === 'Enter' && boardId) {
                  editBoardName(boardId, inputValueNameBoard, setBoardTitle, setIsEditingName);
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
          <List key={id} id={id} title={listTitle} cards={cards} setRenderList={setRenderList} />
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
        footer={
          <button
            onClick={(): Promise<void> => {
              if (boardId) {
                return createList(boardId, newListName, lists, setLists, setNewListName, onClose);
              }
              return Promise.resolve();
            }}
          >
            Створити
          </button>
        }
        onClose={onClose}
      />
    </div>
  );
}
