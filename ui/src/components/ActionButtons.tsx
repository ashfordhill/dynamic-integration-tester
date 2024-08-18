import React from 'react';
import { Button, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { AddContainerDialog } from './AddContainerDialog';
import { ContainerSettingsDialog } from './ContainerSettingsDialog';
import { RemoveContainerDialog } from './RemoveContainerDialog';

export const ActionButtons: React.FC = () => {
  const selectedContainer = useSelector((state: RootState) => state.containers.selectedContainer);

  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);

  const handleAdd = () => {
    setAddDialogOpen(true);
  };

  const handleSettings = () => {
    if (selectedContainer) {
      setSettingsDialogOpen(true);
    }
  };

  const handleRemove = () => {
    if (selectedContainer) {
      setRemoveDialogOpen(true);
    }
  };

  return (
    <Box mt={2}>
      <Button variant="contained" color="primary" fullWidth onClick={handleSettings} disabled={!selectedContainer}>
        Settings
      </Button>
      <Button variant="contained" color="secondary" fullWidth onClick={handleAdd}>
        Add
      </Button>
      <Button variant="contained" color="error" fullWidth onClick={handleRemove} disabled={!selectedContainer}>
        Remove
      </Button>

      <ContainerSettingsDialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} />
      <AddContainerDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} />
      <RemoveContainerDialog open={removeDialogOpen} onClose={() => setRemoveDialogOpen(false)} />
    </Box>
  );
};