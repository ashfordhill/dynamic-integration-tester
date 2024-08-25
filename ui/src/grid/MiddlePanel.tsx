import { Grid, IconButton, Box, Typography, Button } from '@mui/material'
import { ConnectionSettings } from './connections/ConnectionSettings'
import {
  selectReceiverConnection,
  selectSenderConnection,
  setReceiverConnection,
  setSenderConnection
} from '../store/connectionSlice'
import TestCaseGrid from './tests/TestCaseGrid'
import ReceiverOutputWindow from './connections/ReceiverOutputWindow'
import CreateTestCasePopup from './tests/CreateTestCasePopup'
import { SwapHoriz } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'

export const MiddlePanel = () => {
  const dispatch = useDispatch()
  const senderConnection = useSelector(selectSenderConnection)
  const receiverConnection = useSelector(selectReceiverConnection)

  const handleSwapConnections = () => {
    const currSenderConnection = { ...senderConnection }
    dispatch(setSenderConnection(receiverConnection))
    dispatch(setReceiverConnection(currSenderConnection))
  }

  return (
    <Grid container spacing={2} direction='column' style={{ flexGrow: 1 }} alignItems='center'>
      <Grid
        item
        container
        spacing={2}
        alignItems='flex-start' // Pin to the top
        justifyContent='center' // Center the whole row
      >
        <Grid item xs={12} sm={5} display='flex' justifyContent='center'>
          <ConnectionSettings
            name='Sender Connection'
            connectionSettings={{
              storeValue: senderConnection,
              dispatchAction: setSenderConnection
            }}
          />
        </Grid>

        <Grid item xs='auto' display='flex' justifyContent='center'>
          <IconButton onClick={handleSwapConnections} color='primary'>
            <SwapHoriz fontSize='large' />
          </IconButton>
        </Grid>

        <Grid item xs={12} sm={5} display='flex' justifyContent='center'>
          <ConnectionSettings
            name='Receiver Connection'
            connectionSettings={{
              storeValue: receiverConnection,
              dispatchAction: setReceiverConnection
            }}
          />
        </Grid>
      </Grid>

      <Grid item xs={12} sm={8} display='flex' justifyContent='center'>
        <TestCaseGrid />
      </Grid>

      <Grid item xs={12} sm={8} display='flex' justifyContent='center' sx={{ marginTop: 4 }}>
        <ReceiverOutputWindow />
      </Grid>
    </Grid>
  )
}
