interface Card {
  id: number;
  title: string;
  description: string;
  position: number;
  users: [];
  custom: {
    deadline: number;
  };
  created_at: number;
}

interface List {
  id: number;
  title: string;
  position: number;
  cards: Card[];
}

interface Board {
  title: string;
  custom: {
    background: string;
  };
  users: {
    id: number;
    username: string;
  }[];
  lists: List[];
}

export function findListIdByCardId(data: Board, cardId: number): number | null {
  const foundedlist = data.lists.find((list) => list.cards.some((card) => card.id === cardId));
  return foundedlist ? foundedlist.id : null;
}
