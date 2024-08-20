import Swal from 'sweetalert2';
import api from '../api/request';
import { isValidBoardName as isValidListName } from '../common/components/CreateBoardLogic/CreateBoard';
import { IList } from '../common/interfaces/IList';

export const editNameList = async (
  boardId: string,
  listId: number,
  title: string,
  setListName: React.Dispatch<React.SetStateAction<string>>,
  setIsEditingNameList: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  if (!boardId) {
    return;
  }
  if (!isValidListName(title)) {
    Swal.fire({
      icon: 'error',
      title: 'Ой...',
      text: 'Некоректне ім`я списку',
    });
    return;
  }
  try {
    await api.put(`/board/${boardId}/list/${listId}`, { title });
    const data: { lists: IList[] } = await api.get(`/board/${boardId}`);
    const newListName = data.lists.find((list) => list.id === +listId)?.title || '';
    setListName(newListName);
    setIsEditingNameList(false);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Ой...',
      text: 'Помилка редагування імені списку',
      footer: error instanceof Error ? error.message : String(error),
    });
  }
};
