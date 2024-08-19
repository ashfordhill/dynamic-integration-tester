import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import MonacoEditor from 'react-monaco-editor';
import { useDispatch, useSelector } from 'react-redux';
import { addFunction, selectEditorOpen, setConsoleOutput, setEditorOpen } from '../../store/functionsSlice';
import axios from 'axios';

const scriptDefault = 'def run(args):\n    pass\n';

export const FunctionEditor = () => {
  const [functionName, setFunctionName] = useState('');
  const [script, setScript] = useState(scriptDefault);
  const dispatch = useDispatch();
  const editorOpen = useSelector(selectEditorOpen);

  const handleSave = async () => {
    if (functionName.trim() && script.trim()) {
      const response = await axios.post('/api/save-script', { name: functionName, script: script });
      dispatch(setConsoleOutput(JSON.stringify(response.data)));
      dispatch(addFunction(functionName));
      setFunctionName('');
      setScript(scriptDefault);
      handleClose();
    }
  };

  const handleClose = () => {
    dispatch(setEditorOpen(false));
  };

  return (
    <Dialog open={editorOpen} onClose={handleClose}>
      <DialogTitle>Create New Function</DialogTitle>
      <DialogContent>
        <TextField
          label="Function Name"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <MonacoEditor
          language="python"
          value={script}
          onChange={setScript}
          height="400px"
          width="500px"
          options={{
            selectOnLineNumbers: true,           
            lineNumbers: "on",
            autoIndent: "full",
            theme: "vs-dark",
            language: "python",
            scrollbar: { vertical: "hidden"}
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};
