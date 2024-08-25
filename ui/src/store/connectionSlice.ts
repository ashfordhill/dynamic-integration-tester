import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { ConnectionDetails, initialState } from '../types/connection'

export const connectionsSliceName = 'connection'
const connectionsSlice = createSlice({
  name: connectionsSliceName,
  initialState,
  reducers: {
    setSenderConnection: (state, action: PayloadAction<ConnectionDetails>) => {
      state.senderConnection = action.payload
    },
    setReceiverConnection: (state, action: PayloadAction<ConnectionDetails>) => {
      state.receiverConnection = action.payload
    }
  }
})

export const { setSenderConnection, setReceiverConnection } = connectionsSlice.actions

export const selectSenderConnection = (state: RootState) => state[connectionsSliceName].senderConnection
export const selectReceiverConnection = (state: RootState) => state[connectionsSliceName].receiverConnection

export default connectionsSlice.reducer
