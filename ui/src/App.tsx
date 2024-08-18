import React, { useState, useEffect } from 'react';
import { ContainerTable } from './components/ContainerTable';
import { ActionButtons } from './components/ActionButtons';
import { FunctionDropdown } from './components/FunctionDropdown';
import { FunctionActionButtons } from './components/FunctionActionButtons';
import { OutputWindow } from './components/OutputWindow';
import { ConnectionSettings } from './components/ConnectionSettings';
import { FunctionEditorDialog } from './components/FunctionEditorDialog';
import { Grid, CssBaseline, Box, Button, Input } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { importDockerCompose } from './utils/importDockerCompose';
import { setContainers, updateContainerStatus } from './store/containersSlice';
import { setSelectedFunction, addFunction, selectFunctions, selectSelectedFunction } from './store/functionsSlice';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();
  const containers = useSelector((state: RootState) => state.containers.containers);
  const functions = useSelector(selectFunctions);
  const selectedFunction = useSelector(selectSelectedFunction);
  const [output, setOutput] = useState('');
  const [isEditorOpen, setEditorOpen] = useState(false);

  // Connection settings states
  const [outgoingConnectionType, setOutgoingConnectionType] = useState<string>('TCP');
  const [outgoingHost, setOutgoingHost] = useState<string>('');
  const [outgoingPort, setOutgoingPort] = useState<number | ''>('');
  const [outgoingTopic, setOutgoingTopic] = useState<string>('');

  const [incomingConnectionType, setIncomingConnectionType] = useState<string>('TCP');
  const [incomingHost, setIncomingHost] = useState<string>('');
  const [incomingPort, setIncomingPort] = useState<number | ''>('');
  const [incomingTopic, setIncomingTopic] = useState<string>('');

  const availableFunctions = functions.map(func => func.name);

  const handleFunctionSelect = (funcName: string) => {
    dispatch(setSelectedFunction(funcName));
  };

  const handleAddFunction = () => {
    setEditorOpen(true);
  };

  const handleSaveFunction = (functionName: string, script: string) => {
    dispatch(addFunction({ name: functionName, script }));
    setEditorOpen(false);
  };

  const handleCloseEditor = () => {
    setEditorOpen(false);
  };

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
            <OutputWindow output={output} />
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
          <FunctionDropdown
            selectedFunction={selectedFunction?.name || ''}
            onFunctionSelect={handleFunctionSelect}
            availableFunctions={availableFunctions}
          />
          <FunctionActionButtons onAddFunction={handleAddFunction} />
          <ConnectionSettings
            connectionType={outgoingConnectionType}
            onChangeConnectionType={setOutgoingConnectionType}
            onChangeHost={setOutgoingHost}
            onChangePort={(p) => setOutgoingPort(+p)}
            onChangeTopic={setOutgoingTopic}
          />
          <ConnectionSettings
            connectionType={incomingConnectionType}
            onChangeConnectionType={setIncomingConnectionType}
            onChangeHost={setIncomingHost}
            onChangePort={(p) => setIncomingPort(+p)}
            onChangeTopic={setIncomingTopic}
          />
          <FunctionEditorDialog
            open={isEditorOpen}
            onClose={handleCloseEditor}
            onSave={handleSaveFunction}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
