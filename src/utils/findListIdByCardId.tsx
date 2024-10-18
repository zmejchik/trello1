import { IList } from '../common/interfaces/IList';

interface Board {
  title: string;
  custom: {
    background: string;
  };
  users: {
    id: number;
    username: string;
  }[];
  lists: IList[];
}

const findListIdByCardId = (data: Board, cardId: number): number | null => {
  const foundedlist = data.lists.find((list) => list.cards.some((card) => card.id === cardId));
  return foundedlist ? foundedlist.id : null;
};

export default findListIdByCardId;
