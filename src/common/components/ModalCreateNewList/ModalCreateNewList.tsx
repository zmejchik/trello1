import React from 'react';
import { Modal } from '../ModalWindow/Modal';
import { IList } from '../../interfaces/IList';
import { createList } from '../../../utils/createList';

interface ModalCreateNewListProps {
  isModal: boolean;
  newListName: string;
  setNewListName: React.Dispatch<React.SetStateAction<string>>;
  boardId: string;
  lists: IList[];
  setLists: React.Dispatch<React.SetStateAction<IList[]>>;
  onClose: () => void;
}

const ModalCreateNewList = ({
  isModal,
  newListName,
  setNewListName,
  boardId,
  lists,
  setLists,
  onClose,
}: ModalCreateNewListProps) => {
  return (
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
  );
};

export default ModalCreateNewList;
