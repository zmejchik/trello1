import Swal from 'sweetalert2';
import api from '../api/request';
import { IList } from '../common/interfaces/IList';

export const fetchBoardData = async (
  boardId: string,
  setLists: (lists: IList[]) => void,
  setBoardTitle: (title: string) => void,
  setInputValueNameBoard: (title: string) => void,
  setProgresBar: (progress: number) => void
): Promise<void> => {
  try {
    const data: { title: string; lists: IList[] } = await api.get(`/board/${boardId}`, {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        if (total !== undefined) {
          const calculatedProgress = Math.round((loaded / total) * 100);
          setProgresBar(calculatedProgress);
        }
      },
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        if (total !== undefined) {
          const calculatedProgress = Math.round((loaded / total) * 100);
          setProgresBar(calculatedProgress);
        }
      },
    });
    setLists(data.lists);
    setBoardTitle(data.title);
    setInputValueNameBoard(data.title);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Ой...',
      text: 'Помилка завантаження дошки',
      footer: error instanceof Error ? error.message : String(error),
    });
  }
};
