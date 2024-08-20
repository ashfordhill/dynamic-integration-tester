import React, { useState, useEffect } from 'react';
import { ContainerTable } from './components/docker/ContainerTable';
import { ActionButtons } from './components/docker/ActionButtons';
import { FunctionDropdown } from './components/functions/FunctionDropdown';
import { FunctionActionButtons } from './components/functions/FunctionActionButtons';
import { FunctionConsoleWindow } from './components/functions/FunctionConsoleWindow';
import { ConnectionSettings } from './components/connections/ConnectionSettings';
import { Grid, CssBaseline, Box, Button, Input } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { importDockerCompose } from './utils/importDockerCompose';
import { updateContainerStatus } from './store/containersSlice';
import axios from 'axios';
import { FunctionEditor } from './components/functions/FunctionEditor';
import { initialConnectionDetails } from './types/connection';
import { setReceiverConnection, setSenderConnection } from './store/connectionsSlice';

function App() {
  const dispatch = useDispatch();
  const containers = useSelector((state: RootState) => state.containers.containers);
  const [output, setOutput] = useState('');


  const fetchContainerStatuses = async () => {
    try {
      const response = await axios.get('/api/docker/container-statuses');
      if (response.status === 200) {
        const containerStatuses = response.data.statuses;

        if (Object.keys(containerStatuses).length > 0) {
          containers.forEach(container => {
            const matchingContainer = Object.keys(containerStatuses).find(id =>
              containerStatuses[id].name.includes(container.name)
            );

            if (matchingContainer) {
              const status = containerStatuses[matchingContainer].status;
              dispatch(updateContainerStatus({
                id: container.id,
                running: status === "running"
              }));
            } else {
              dispatch(updateContainerStatus({
                id: container.id,
                running: false
              }));
            }
          });
        } else {
          containers.forEach(container => {
            dispatch(updateContainerStatus({
              id: container.id,
              running: false
            }));
          });
        }
      } else {
        console.error('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch container statuses:', error);
    }
  };

  useEffect(() => {
    fetchContainerStatuses();
    const intervalId = setInterval(fetchContainerStatuses, 10000);
    return () => clearInterval(intervalId);
  }, [containers, dispatch]);

  const handleStartAll = async () => {
    try {
      const response = await axios.post('/api/docker/start-containers', { containers });
      if (response.status === 200) {
        fetchContainerStatuses();
        setOutput(response.data.output);
      } else {
        setOutput(`Failed to start containers: ${response.data.error || response.statusText}`);
      }
    } catch (error) {
      handleAxiosError(error, 'start containers');
    }
  };

  const handleStopAll = async () => {
    try {
      const response = await axios.post('/api/docker/stop-containers', { containers });
      if (response.status === 200) {
        fetchContainerStatuses();
        setOutput(response.data.output);
      }
    } catch (error) {
      handleAxiosError(error, 'stop containers');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          importDockerCompose(reader.result as string, dispatch);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.post('/api/docker/export-compose', { containers });
      if (response.status === 200) {
        setOutput("docker-compose.yml exported successfully.");
      }
    } catch (error) {
      handleAxiosError(error, 'export docker-compose.yml');
    }
  };

  const handleAxiosError = (error: any, action: string) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        setOutput(`Failed to ${action}: ${error.response.data.error}`);
      } else {
        setOutput(`Failed to ${action}: ${error.message}`);
      }
    } else if (error instanceof Error) {
      setOutput(`Failed to ${action}: ${error.message}`);
    } else {
      setOutput(`Failed to ${action}: Unknown error occurred.`);
    }
  };

  return (
    <>
      <CssBaseline />
      <Grid container spacing={2} p={2}>
        <Grid item xs={4}>
          <ContainerTable />
          <ActionButtons />
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleStartAll}
            >
              {containers.length > 0 && containers.every(container => container.running) ? "Running" : "Start All"}
            </Button>
            <Button variant="contained" color="secondary" fullWidth onClick={handleStopAll} sx={{ mt: 2 }}>
              Stop All
            </Button>
            <Button variant="contained" color="info" fullWidth onClick={handleExport} sx={{ mt: 2 }}>
              Save As
            </Button>
          </Box>
          <Box mt={4}>
            <FunctionConsoleWindow />
          </Box>
          <Box mt={4}>
            <Input
              type="file"
              inputProps={{ accept: ".yaml,.yml" }}
              onChange={handleFileChange}
            />
          </Box>
        </Grid>
        <Grid item xs={8}>
          <FunctionDropdown />
          <FunctionActionButtons />
          <ConnectionSettings
            name='Sender Connection'
            connectionSettings={{connectionDetails: initialConnectionDetails, dispatchAction: setSenderConnection}}
          />
          <ConnectionSettings
            name='Receiver Connection'
            connectionSettings={{connectionDetails: initialConnectionDetails, dispatchAction: setReceiverConnection}}
          />
          <FunctionEditor />
          <FunctionConsoleWindow />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
