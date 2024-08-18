import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import MonacoEditor from 'react-monaco-editor';

interface FunctionEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, content: string) => void;
}

export const FunctionEditor: React.FC<FunctionEditorProps> = ({ open, onClose, onSave }) => {
  const [functionName, setFunctionName] = useState('');
  const [scriptContent, setScriptContent] = useState('def run(args):\n    pass\n');

  const handleSave = () => {
    onSave(functionName, scriptContent);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Function</DialogTitle>
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
          value={scriptContent}
          onChange={setScriptContent}
          height="400px"
          options={{
            selectOnLineNumbers: true,
            lineNumbers: "on",
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};
