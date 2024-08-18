import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

interface FunctionEditorDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (functionName: string, script: string) => void;
}

export const FunctionEditorDialog: React.FC<FunctionEditorDialogProps> = ({ open, onClose, onSave }) => {
  const [functionName, setFunctionName] = useState('');
  const [script, setScript] = useState('');

  const handleSave = () => {
    onSave(functionName, script);
    setFunctionName('');
    setScript('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Function</DialogTitle>
      <DialogContent>
        <TextField
          label="Function Name"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Function Script"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          fullWidth
          multiline
          rows={10}
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
