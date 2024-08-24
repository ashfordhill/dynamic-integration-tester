import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { ConnectionDetails } from '../types/connection'

interface ConnectionsState {
  senderConnection: ConnectionDetails
  receiverConnection: ConnectionDetails
}

const initialState: ConnectionsState = {
  senderConnection: { connectionType: 'TCP', host: '127.0.0.1', port: 1234 },
  receiverConnection: { connectionType: 'Kafka', host: '127.0.0.1', port: 9092, topic: '' }
}
export const connectionsSliceName = 'connections'
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
