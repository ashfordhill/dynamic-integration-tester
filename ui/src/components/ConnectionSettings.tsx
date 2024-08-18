import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

interface ConnectionSettingsProps {
  connectionType: string;
  onChangeConnectionType: (type: string) => void;
  onChangeHost: (host: string) => void;
  onChangePort: (port: string) => void;
  onChangeTopic?: (topic: string) => void;
}

export const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({
  connectionType,
  onChangeConnectionType,
  onChangeHost,
  onChangePort,
  onChangeTopic,
}) => {
  return (
    <Box mt={2}>
      <FormControl fullWidth>
        <InputLabel id="connection-type-select-label">Connection Type</InputLabel>
        <Select
          labelId="connection-type-select-label"
          value={connectionType}
          onChange={(e) => onChangeConnectionType(e.target.value as string)}
        >
          <MenuItem value="TCP">TCP</MenuItem>
          <MenuItem value="Kafka">Kafka</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Host"
        fullWidth
        margin="normal"
        onChange={(e) => onChangeHost(e.target.value)}
      />
      <TextField
        label="Port"
        fullWidth
        margin="normal"
        onChange={(e) => onChangePort(e.target.value)}
      />
      {connectionType === 'Kafka' && (
        <TextField
          label="Topic"
          fullWidth
          margin="normal"
          onChange={(e) => onChangeTopic && onChangeTopic(e.target.value)}
        />
      )}
    </Box>
  );
};
