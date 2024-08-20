import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { ConnectionDetails } from '../types/connection';

interface ConnectionsState {
  senderConnection: ConnectionDetails | undefined;
  receiverConnection: ConnectionDetails | undefined;
}

const initialState: ConnectionsState = {
  senderConnection: undefined,
  receiverConnection: undefined
};
export const connectionsSliceName = 'connections';
const connectionsSlice = createSlice({
  name: connectionsSliceName,
  initialState,
  reducers: {
    setSenderConnection: (state, action: PayloadAction<ConnectionDetails>) => {
      state.senderConnection = action.payload;
    },
    setReceiverConnection: (state, action: PayloadAction<ConnectionDetails>) => {
      state.receiverConnection = action.payload;
    },
  },
});

export const { setSenderConnection, setReceiverConnection } = connectionsSlice.actions;

export const selectSenderConnection = (state: RootState) => state[connectionsSliceName].senderConnection;
export const selectReceiverConnection = (state: RootState) => state[connectionsSliceName].receiverConnection;

export default connectionsSlice.reducer;
