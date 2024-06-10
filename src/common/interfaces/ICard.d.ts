export interface ICard {
  id: number;
  title: string;
  list_id?: number;
  position?: number;
  updateCardList?: () => Promise<void>;
}
