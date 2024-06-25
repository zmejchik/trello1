import Swal from 'sweetalert2';
import { IList } from '../common/interfaces/IList';
import api from '../api/request';
import { ICard } from '../common/interfaces/ICard';

export const updateCardList = async (
  boardId: string,
  listId: number,
  setCards: React.Dispatch<React.SetStateAction<ICard[]>>
): Promise<void> => {
  if (!boardId) {
    return;
  }
  try {
    const data: { lists: IList[] } = await api.get(`/board/${boardId}`);
    const newCards = data.lists.find((list) => list.id === +listId)?.cards || [];
    newCards.forEach((card, index) => {
      const newCard = { ...card, position: index + 1 };
      Object.assign(card, newCard);
    });
    setCards(newCards);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Ой...',
      text: 'Помилка оновлення списків:',
      footer: error instanceof Error ? error.message : String(error),
    });
  }
};
