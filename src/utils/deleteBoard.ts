import Swal from 'sweetalert2';
import api from '../api/request';

export const deleteBoard = async (boardId: string): Promise<void> => {
  try {
    await api.delete(`/board/${boardId}`);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Ой...',
      text: 'Помилка видалення дошки',
      footer: error instanceof Error ? error.message : String(error),
    });
  }
};
