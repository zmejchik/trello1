import Swal from 'sweetalert2';
import api from '../api/request';
import { isValidBoardName as isValidCardName } from '../common/components/CreateBoardLogic/CreateBoard';

export const editNameCard = async (
  title: string,
  cardId: number,
  boardId: string,
  list_id: number,
  setIsEditingNameCard: (value: boolean) => void,
  setCardName: (name: string) => void
): Promise<void> => {
  if (!isValidCardName(title)) {
    Swal.fire({
      icon: 'error',
      title: 'Ой...',
      text: 'Некоректне ім`я картки',
    });
    return;
  }
  try {
    await api.put(`/board/${boardId}/card/${cardId}`, { id: cardId, title, list_id });
    setIsEditingNameCard(false);
    setCardName(title);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Ой...',
      text: 'Помилка редагування імені картки',
      footer: error instanceof Error ? error.message : String(error),
    });
  }
};
