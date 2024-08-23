import { Grid, CssBaseline, Drawer, IconButton, Typography } from '@mui/material'
import { ContainerTable } from './components/docker/ContainerTable'
import { ActionButtons } from './components/docker/ActionButtons'
import { FunctionDropdown } from './components/functions/FunctionDropdown'
import { FunctionActionButtons } from './components/functions/FunctionActionButtons'
import { FunctionConsoleWindow } from './components/functions/FunctionConsoleWindow'
import { ConnectionSettings } from './components/connections/ConnectionSettings'
import { FunctionEditor } from './components/functions/editor/FunctionEditor'
import DockerControls from './components/docker/DockerControls'
import { initialConnectionDetails } from './types/connection'
import { setReceiverConnection, setSenderConnection } from './store/connectionsSlice'
import { DockerConsoleWindow } from './components/docker/DockerConsoleWindow'
import { UserUploadYaml } from './components/docker/UserUploadYaml'
import ReceiverOutputWindow from './components/connections/ReceiverOutputWindow'
import FileMappingTable from './components/files/FileMappingTable'
import CreateTestCasePopup from './components/tests/CreateTestCasePopup'
import { useState } from 'react'
import { Menu } from '@mui/icons-material'

function App() {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)

  return (
    <>
      <CssBaseline />
      <Grid container spacing={2} p={2}>
        {/* Left Drawer */}
        <Drawer
          variant='persistent'
          anchor='left'
          open={leftDrawerOpen}
          sx={{
            width: leftDrawerOpen ? 240 : 0,
            transition: 'width 0.3s',
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box'
            }
          }}
        >
          {leftDrawerOpen && (
            <>
              <UserUploadYaml />
              <ContainerTable />
              <ActionButtons />
              <DockerControls />
              <DockerConsoleWindow />
            </>
          )}
        </Drawer>

        {/* Middle Panel - File/Connection Settings */}
        <Grid item xs>
          <CreateTestCasePopup />
          <FileMappingTable />
          <Typography variant='h6'>Receiver Output</Typography>
          <ReceiverOutputWindow />
          <ConnectionSettings
            name='Sender Connection'
            connectionSettings={{
              connectionDetails: initialConnectionDetails,
              dispatchAction: setSenderConnection
            }}
          />
          <ConnectionSettings
            name='Receiver Connection'
            connectionSettings={{
              connectionDetails: initialConnectionDetails,
              dispatchAction: setReceiverConnection
            }}
          />
        </Grid>

        {/* Right Drawer - Function Editor/Console */}
        <Drawer
          variant='persistent'
          anchor='right'
          open={rightDrawerOpen}
          sx={{
            width: rightDrawerOpen ? 300 : 0,
            transition: 'width 0.3s',
            '& .MuiDrawer-paper': {
              width: 300,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          <div style={{ padding: '16px', flex: 1 }}>
            <FunctionDropdown />
            <FunctionActionButtons />
            <FunctionEditor />
            <FunctionConsoleWindow />
          </div>
        </Drawer>

        {/* Toggle Left Drawer Button */}
        <IconButton
          onClick={() => setLeftDrawerOpen(!leftDrawerOpen)}
          style={{
            position: 'fixed',
            left: 10,
            top: '10px',
            zIndex: 1300
          }}
        >
          <Menu />
        </IconButton>

        {/* Toggle Right Drawer Button */}
        <IconButton
          onClick={() => setRightDrawerOpen(!rightDrawerOpen)}
          style={{
            position: 'fixed',
            right: rightDrawerOpen ? 310 : 10,
            top: '10px',
            zIndex: 1300
          }}
        >
          <Menu />
        </IconButton>
      </Grid>
    </>
  )
}

export default App
