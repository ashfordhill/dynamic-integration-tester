import React, { useState } from 'react';
import { Select, MenuItem, Button, Box } from '@mui/material';
import { FunctionEditorDialog } from './FunctionEditorDialog';

interface FunctionDropdownProps {
  selectedFunction: string;
  onFunctionSelect: (funcName: string) => void;
  availableFunctions: string[];
}

export const FunctionDropdown: React.FC<FunctionDropdownProps> = ({ selectedFunction, onFunctionSelect, availableFunctions }) => {
  const [editorOpen, setEditorOpen] = useState(false);

  const handleFunctionChange = (event: any) => {
    onFunctionSelect(event.target.value);
  };

  const handleNewFunction = () => {
    setEditorOpen(true);
  };

  const handleSaveFunction = (functionName: string) => {
    onFunctionSelect(functionName);
    availableFunctions.push(functionName); // Save function to list
  };

  return (
    <Box>
      <Select
        labelId="function-select-label"
        value={selectedFunction}
        onChange={handleFunctionChange}
        fullWidth
      >
        {availableFunctions.map((func, index) => (
          <MenuItem key={index} value={func}>{func}</MenuItem>
        ))}
        <MenuItem value="new-function" onClick={handleNewFunction}>Create New Function...</MenuItem>
      </Select>

      <FunctionEditorDialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveFunction}
      />
    </Box>
  );
};