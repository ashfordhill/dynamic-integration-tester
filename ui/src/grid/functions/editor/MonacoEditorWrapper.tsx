import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { Box } from '@mui/material';

interface MonacoEditorWrapperProps {
  script: string;
  setScript: (value: string) => void;
  height: string;
  width: string;
  language: string;
}

const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({ script, setScript, height, width, language }) => {
  const handleImportInsert = (importStatement: string) => {
    const newScript = `${importStatement}\n${script}`;
    setScript(newScript);
  };

  return (
    <Box>
      <MonacoEditor
        value={script}
        onChange={setScript}
        theme="vs-dark"
        language={language}
        height={height}
        width={width}
        options={{
          lineNumbers: 'on',
          autoIndent: 'advanced',
          scrollbar: { vertical: 'hidden', verticalScrollbarSize: 5 }
        }}
      />
    </Box>
  );
};

export default MonacoEditorWrapper;