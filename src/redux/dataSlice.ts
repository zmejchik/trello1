import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICard } from '../common/interfaces/ICard';

interface ModalState {
  isOpen: boolean;
}

interface Card {
  id: number;
  title: string;
  description: string;
  position: number;
  users: string[];
  custom: {
    deadline: number;
  };
  created_at: number;
}

interface DataState {
  modal: ModalState;
  cards: Card[];
  listId: string;
  list_name: string;
  cardId: string | null;
  loading: boolean;
  error: string | null;
  boardId: string | null;
}

const initialState: DataState = {
  modal: { isOpen: false },
  cards: [],
  cardId: null,
  listId: '-1',
  list_name: '-1',
  boardId: null,
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    visibleModalForCard(state) {
      return {
        ...state,
        modal: { isOpen: !state.modal.isOpen },
      };
    },
    fetchDataStart(state) {
      return {
        ...state,
        loading: true,
        error: null,
      };
    },
    fetchDataSuccess(state, action: PayloadAction<ICard[]>) {
      const cards = action.payload.map((card) => ({
        ...card,
        description: card.description ?? '',
        position: card.position ?? 0,
        users: card.users ?? [],
        custom: card.custom ?? { deadline: 0 },
        created_at: card.created_at ?? Date.now(),
      })) as Card[];

      return {
        ...state,
        loading: false,
        cards,
      };
    },
    fetchDataFailure(state, action: PayloadAction<string>) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    toggleModal(state) {
      return {
        ...state,
        modal: { isOpen: !state.modal.isOpen },
      };
    },
    setListId(state, action: PayloadAction<string>) {
      return {
        ...state,
        listId: action.payload,
      };
    },
    setCardId(state, action: PayloadAction<string>) {
      return {
        ...state,
        cardId: action.payload,
      };
    },
    setCardTitle(state, action: PayloadAction<{ title: string }>) {
      const { title } = action.payload;
      const cardCurrent = state.cards.find((card) => card.id.toString() === state.cardId);
      if (cardCurrent) {
        cardCurrent.title = title.trim();
      }
    },
    setListTitle(state, action: PayloadAction<string>) {
      return {
        ...state,
        list_name: action.payload,
      };
    },
    setBoardId(state, action: PayloadAction<string>) {
      return {
        ...state,
        boardId: action.payload,
      };
    },
    setDescription(state, action: PayloadAction<{ cardId: number; description: string }>) {
      const { cardId, description } = action.payload;
      const cards = state.cards.map((card) => (card.id === cardId ? { ...card, description } : card));

      return {
        ...state,
        cards,
      };
    },
  },
});

export const {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
  toggleModal,
  setListId,
  setListTitle,
  setCardId,
  setBoardId,
  visibleModalForCard,
  setDescription,
  setCardTitle,
} = dataSlice.actions;

export default dataSlice.reducer;
