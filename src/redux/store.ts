import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';

// Create a Redux store containing the data slice.
const store = configureStore({
  reducer: {
    data: dataReducer,
  },
});

// Export the Redux store and the type for the state.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
