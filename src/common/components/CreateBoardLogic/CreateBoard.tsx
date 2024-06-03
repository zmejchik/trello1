import React, { useState } from 'react';
import Swal from 'sweetalert2';
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
  const [newBoardName, setNewBoardName] = useState('');

  const generateRandomColor = (): string => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const createBoard = async (): Promise<void> => {
    if (isValidBoardName(newBoardName)) {
      try {
        await api.post('/board', {
          title: newBoardName,
          custom: { background: generateRandomColor() },
        });
        onClose();
        const { boards }: { boards: IBoard[] } = await api.get('/board');
        setBoards(boards);
        setNewBoardName('');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Ой...',
          text: 'Помилка створення дошки',
        }).then(() => {
          onClose();
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ой...',
        text: 'Некоректне ім`я дошки',
      });
      onClose();
    }
  };

  return (
    <Modal
      visible={isModal}
      title="Введіть назву нової дошки"
      inputValue={newBoardName}
      placeholder="Назва нової дошки"
      setValue={setNewBoardName}
      footer={<button onClick={createBoard}>Створити</button>}
      onClose={onClose}
    />
  );
}
