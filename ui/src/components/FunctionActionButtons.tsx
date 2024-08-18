import React from 'react';
import { Button, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { selectSelectedFunction, removeFunction } from '../store/functionsSlice';
import { FunctionEditorDialog } from './FunctionEditorDialog';

export const FunctionActionButtons: React.FC<{ onAddFunction: () => void }> = ({ onAddFunction }) => {
  const selectedFunction = useSelector((state: RootState) => selectSelectedFunction(state));
  const dispatch = useDispatch();

  const [editorDialogOpen, setEditorDialogOpen] = React.useState(false);

  const handleEdit = () => {
    if (selectedFunction) {
      setEditorDialogOpen(true);
    }
  };

  const handleRemove = () => {
    if (selectedFunction) {
      dispatch(removeFunction(selectedFunction.name));
    }
  };

  return (
    <Box mt={2}>
      <Button variant="contained" color="primary" fullWidth onClick={handleEdit} disabled={!selectedFunction}>
        Edit
      </Button>
      <Button variant="contained" color="secondary" fullWidth onClick={handleRemove} disabled={!selectedFunction}>
        Remove
      </Button>
      <Button variant="contained" fullWidth onClick={onAddFunction}>
        Add Function
      </Button>
      {selectedFunction && (
        <FunctionEditorDialog
          open={editorDialogOpen}
          onClose={() => setEditorDialogOpen(false)}
          onSave={(name, script) => {
            // Add logic to handle the updated function if necessary
            setEditorDialogOpen(false);
          }}
        />
      )}
    </Box>
  );
};
