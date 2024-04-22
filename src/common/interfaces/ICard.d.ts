export interface ICard {
  id: number;
  title: string;
  listId?: number;
  updateCardList: () => Promise<void>;
}
