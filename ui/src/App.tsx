import { Grid, CssBaseline } from '@mui/material'
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

function App() {
  return (
    <>
      <CssBaseline />
      <Grid container spacing={2} p={2}>
        {/* Left Panel */}
        <Grid item xs={3}>
          <UserUploadYaml />
          <ContainerTable />
          <ActionButtons />
          <DockerControls />
          <DockerConsoleWindow />
        </Grid>

        {/* Middle Panel */}
        <Grid item xs={6}>
          <FunctionDropdown />
          <FunctionActionButtons />
          <FunctionEditor />
          <FunctionConsoleWindow />
        </Grid>

        {/* Right Panel for Connection Settings */}
        <Grid item xs={3}>
          <ConnectionSettings
            name='Sender Connection'
            connectionSettings={{ connectionDetails: initialConnectionDetails, dispatchAction: setSenderConnection }}
          />
          <ConnectionSettings
            name='Receiver Connection'
            connectionSettings={{ connectionDetails: initialConnectionDetails, dispatchAction: setReceiverConnection }}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default App
