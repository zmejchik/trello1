import React, { useState } from 'react';
import { Modal } from '../ModalWindow/Modal';
import { IBoard } from '../../interfaces/IBoard';
import api from '../../../api/request';

export const isValidBoardName = (title: string): boolean => {
  const pattern = /^[a-zA-Zа-яА-Я0-9\s.-_]+$/;
  return pattern.test(title);
};

export function CreateBoard({
  onClose,
  setBoards,
  isModal,
}: {
  onClose: () => void;
  setBoards: (arg0: IBoard[]) => void;
  isModal: boolean;
}): JSX.Element {
  const [value, setValue] = useState('');

  const generateRandomColor = (): string => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const createBoard = async (): Promise<void> => {
    if (isValidBoardName(value)) {
      try {
        await api.post('/board', {
          title: value,
          custom: { background: generateRandomColor() },
        });
        onClose();
        const { boards }: { boards: IBoard[] } = await api.get('/board');
        setBoards(boards);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error creating board:', error);
      }
    } else {
      // eslint-disable-next-line no-alert
      alert('Incorrect board name');
    }
  };

  return (
    <Modal
      visible={isModal}
      title="Введіть назву нової дошки"
      inputValue={value}
      setValue={setValue}
      footer={<button onClick={createBoard}>Create</button>}
      onClose={onClose}
    />
  );
}
