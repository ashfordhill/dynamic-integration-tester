import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updateContainer } from '../store/containersSlice';  // Correctly import updateContainer

interface ContainerSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ContainerSettingsDialog: React.FC<ContainerSettingsDialogProps> = ({ open, onClose }) => {
  const selectedContainer = useSelector((state: RootState) => state.containers.selectedContainer);
  const [localContainer, setLocalContainer] = useState(selectedContainer);
  const dispatch = useDispatch();

  React.useEffect(() => {
    setLocalContainer(selectedContainer);
  }, [selectedContainer]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalContainer({
      ...localContainer!,
      [event.target.name]: event.target.value.split(',').map(item => item.trim()),
    });
  };

  const handleSave = () => {
    if (localContainer) {
      dispatch(updateContainer(localContainer));
      onClose();
    }
  };

  if (!localContainer) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Container Settings: {localContainer.name}</DialogTitle>
      <DialogContent>
        <TextField
          label="Ports"
          name="ports"
          value={localContainer.ports.join(',')}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Environment Variables"
          name="environment"
          value={localContainer.environment.join(',')}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Volumes"
          name="volumes"
          value={localContainer.volumes.join(',')}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Network"
          name="network"
          value={localContainer.network}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};