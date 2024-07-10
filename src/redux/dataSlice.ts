import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
}

interface DataState {
  modal: ModalState;
  cards: Array<{
    id: number;
    title: string;
    description: string;
    position: number;
    users: [];
    custom: {
      deadline: number;
    };
    created_at: number;
  }>;
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
      if (state.modal.isOpen) {
        state.modal.isOpen = false;
      } else {
        state.modal.isOpen = true;
      }
    },
    fetchDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess(
      state,
      action: PayloadAction<
        Array<{
          id: number;
          title: string;
          description?: string;
          position?: number;
          users?: [];
          custom?: {
            deadline: number;
          };
          created_at?: number;
        }>
      >
    ) {
      state.loading = false;
      state.cards = action.payload.map((card) => ({
        id: card.id,
        title: card.title,
        description: card.description ?? '',
        position: card.position ?? 0,
        users: card.users ?? [],
        custom: card.custom ?? { deadline: 0 },
        created_at: card.created_at ?? Date.now(),
      }));
    },
    fetchDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    toggleModal(state) {
      state.modal.isOpen = !state.modal.isOpen;
    },
    setListId(state, action: PayloadAction<string>) {
      state.listId = action.payload;
    },
    setCardId(state, action: PayloadAction<string>) {
      state.cardId = action.payload;
    },
    setListTitle(state, action: PayloadAction<string>) {
      state.list_name = action.payload;
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
  visibleModalForCard,
} = dataSlice.actions;

export default dataSlice.reducer;
