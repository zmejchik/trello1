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
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error creating board',
        }).then(() => {
          onClose();
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Incorrect board name',
      });
      onClose(); // Закрываем модальное окно при некорректном имени доски
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
