import Swal from 'sweetalert2';
import api from '../api/request';
import { isValidBoardName } from '../common/components/CreateBoardLogic/CreateBoard';

export const editBoardName = async (
  boardId: string,
  title: string,
  setBoardTitle: (title: string) => void,
  setIsEditingName: (isEditing: boolean) => void
): Promise<void> => {
  if (!isValidBoardName(title)) {
    Swal.fire({ icon: 'error', title: 'Ой...', text: 'Некоректне ім`я дошки' });
    return;
  }
  try {
    await api.put(`/board/${boardId}`, { title });
    setBoardTitle(title);
    setIsEditingName(false);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Ой...',
      text: 'Помилка редагування імені дошки',
      footer: error instanceof Error ? error.message : String(error),
    });
  }
};
