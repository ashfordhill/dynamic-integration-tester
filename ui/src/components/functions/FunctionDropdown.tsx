import { useState } from 'react';
import { Select, MenuItem, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addFunction, selectFunctions, selectSelectedFunction, setEditorOpen, setSelectedFunction } from '../../store/functionsSlice';
import { FunctionEditor } from './FunctionEditor';

export const FunctionDropdown = () => {
  const dispatch = useDispatch();
  const functions = useSelector(selectFunctions);
  const selectedFunction = useSelector(selectSelectedFunction);

  const handleFunctionChange = (event: any) => {
    const functionId = event.target.value;
    if (functionId === "new-function") {
      dispatch(setEditorOpen(true)); // Open the editor if "Create New Function..." is selected
    } else {
      dispatch(setSelectedFunction(functionId));
    }
  };

  return (
    <Box>
      <Select
        labelId="function-select-label"
        value={selectedFunction || ''}
        onChange={handleFunctionChange}
        fullWidth
      >
        {functions.map((func, index) => (
          <MenuItem key={index} value={func}>{func}</MenuItem>
        ))}
        <MenuItem value="new-function">Create New Function...</MenuItem>
      </Select>

      <FunctionEditor
      />
    </Box>
  );
};
