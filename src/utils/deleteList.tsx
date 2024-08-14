import Swal from 'sweetalert2';
import api from '../api/request';

export const deleteList = async (boardId: string, listId: string): Promise<void> => {
  try {
    await api.delete(`/board/${boardId}/list/${listId}`);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Ой...',
      text: 'Помилка видалення списку',
      footer: error instanceof Error ? error.message : String(error),
    });
  }
};
