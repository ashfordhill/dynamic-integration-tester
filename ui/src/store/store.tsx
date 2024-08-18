import { configureStore } from '@reduxjs/toolkit';
import containersReducer from './containersSlice';
import functionsReducer from './functionsSlice';

export const store = configureStore({
  reducer: {
    containers: containersReducer,
    functions: functionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;