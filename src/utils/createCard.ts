import Swal from 'sweetalert2';
import api from '../api/request';
import { isValidBoardName as isValidListName } from '../common/components/CreateBoardLogic/CreateBoard';
import { updateCardList } from './updateCardList';
import { ICard } from '../common/interfaces/ICard';

export const createCard = async (
  boardId: string,
  listId: number,
  titleCard: string,
  cards: ICard[],
  setCards: React.Dispatch<React.SetStateAction<ICard[]>>,
  setNewCardName: React.Dispatch<React.SetStateAction<string>>,
  onClose: () => void
): Promise<void> => {
  if (!boardId) {
    return;
  }
  if (!isValidListName(titleCard)) {
    onClose();
    Swal.fire({
      icon: 'error',
      title: 'Ой...',
      text: 'Невалідне ім`я картки',
    });
    return;
  }
  try {
    await api.post(`/board/${boardId}/card/`, {
      title: titleCard,
      list_id: listId,
      position: cards.length ? cards.length + 1 : 1,
      description: 'washing process',
      custom: {
        deadline: '2022-08-31 12:00',
      },
    });
    onClose();
    await updateCardList(boardId, listId, setCards);
    setNewCardName('');
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Ой...',
      text: 'Помилка створення картки',
      footer: error instanceof Error ? error.message : String(error),
    }).then(() => {
      onClose();
    });
  }
};
