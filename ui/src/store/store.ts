import { configureStore } from '@reduxjs/toolkit';
import containersReducer, {containerSliceName} from './containersSlice';
import functionsReducer, { functionsSliceName } from './functionsSlice';
import connectionsReducer, { connectionsSliceName } from './connectionsSlice';

export const store = configureStore({
  reducer: {
    [containerSliceName]: containersReducer,
    [functionsSliceName]: functionsReducer,
    [connectionsSliceName]: connectionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;