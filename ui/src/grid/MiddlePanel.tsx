import { Box, Button } from '@mui/material'
import { styled } from '@mui/system'
import { ConnectionSettings } from './connections/ConnectionSettings'
import { initialConnectionDetails } from '../types/connection'
import { setReceiverConnection, setSenderConnection } from '../store/connectionSlice'
import TestCaseGrid from './tests/TestCaseGrid'
import ReceiverOutputWindow from './connections/ReceiverOutputWindow'
import CreateTestCasePopup from './tests/CreateTestCasePopup'

const MiddleContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3) // Adds spacing between sections
}))

const ConnectionRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start', // Ensures both are aligned to the top
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap' // Ensures wrapping on smaller screens
}))

const ConnectionItem = styled(Box)(({ theme }) => ({
  flex: '1 1 calc(50% - 16px)', // 50% width minus gap
  minWidth: '300px' // Ensures a reasonable minimum width before wrapping
}))

export const MiddlePanel = () => {
  return (
    <MiddleContainer>
      <ConnectionRow>
        <ConnectionItem>
          <ConnectionSettings
            name='Sender Connection'
            connectionSettings={{
              connectionDetails: initialConnectionDetails,
              dispatchAction: setSenderConnection
            }}
          />
        </ConnectionItem>
        <ConnectionItem>
          <ConnectionSettings
            name='Receiver Connection'
            connectionSettings={{
              connectionDetails: initialConnectionDetails,
              dispatchAction: setReceiverConnection
            }}
          />
        </ConnectionItem>
      </ConnectionRow>
      <CreateTestCasePopup />
      <TestCaseGrid />
      <ReceiverOutputWindow />
    </MiddleContainer>
  )
}
