export interface ICard {
  id: number;
  title: string;
  list_id?: number;
  updateCardList?: () => Promise<void>;
}
