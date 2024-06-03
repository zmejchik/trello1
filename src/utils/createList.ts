import Swal from 'sweetalert2';
import api from '../api/request';
import { isValidBoardName } from '../common/components/CreateBoardLogic/CreateBoard';
import { IList } from '../common/interfaces/IList';

export const createList = async (
  boardId: string,
  titleList: string,
  lists: IList[],
  setLists: (lists: IList[]) => void,
  setNewListName: (name: string) => void,
  onClose: () => void
): Promise<void> => {
  if (!isValidBoardName(titleList)) {
    onClose();
    Swal.fire({ icon: 'error', title: 'Ой...', text: 'Некоректне ім`я списку' });
    return;
  }

  try {
    await api.post(`/board/${boardId}/list`, {
      title: titleList,
      position: lists.length ? lists.length + 1 : 1,
    });
    onClose();
    const data: { lists: IList[] } = await api.get(`/board/${boardId}/`);
    setLists(data.lists);
    setNewListName('');
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Ой...',
      text: 'Помилка завантаження або створення списків',
      footer: error instanceof Error ? error.message : String(error),
    });
  }
};
