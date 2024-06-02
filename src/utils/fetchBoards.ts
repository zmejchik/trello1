import Swal from 'sweetalert2';
import api from '../api/request';
import { IBoard } from '../common/interfaces/IBoard';

export const fetchBoards = async (
  setBoards: (boards: IBoard[]) => void,
  setProgresBar: (progress: number) => void
): Promise<void> => {
  try {
    const data: { boards: IBoard[] } = await api.get(`/board`, {
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
    setBoards(data.boards);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Ой...',
      text: 'Помилка завантаження дошок',
      footer: error instanceof Error ? error.message : String(error),
    });
  }
};
