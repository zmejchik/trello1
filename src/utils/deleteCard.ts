import Swal from 'sweetalert2';
import api from '../api/request';

export const deleteCard = async (cardId: number, boardId: string, updateCardList?: () => void): Promise<void> => {
  try {
    await api.delete(`/board/${boardId}/card/${cardId}`);
    if (updateCardList !== undefined) updateCardList();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Ой...',
      text: 'Помилка видалення картки',
      footer: error instanceof Error ? error.message : String(error),
    });
  }
};
