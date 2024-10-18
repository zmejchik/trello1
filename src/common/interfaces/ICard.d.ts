export interface ICard {
  id: number;
  title: string;
  list_id?: number;
  position: number;
  users?: string[];
  custom?: {
    deadline?: number;
  };
  description?: string;
  created_at?: number;
  updateCardList?: () => Promise<void>;
}
