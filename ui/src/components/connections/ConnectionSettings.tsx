import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { ConnectionType, connectionTypes, ConnectionDetails } from "../../types/connection";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

interface ConnectionSettingsProps {
  connectionDetails: ConnectionDetails;
  dispatchAction: any;
}

export const ConnectionSettings = ({
  name,
  connectionSettings,
}: {
  name: string;
  connectionSettings: ConnectionSettingsProps;
}) => {
  const dispatch = useDispatch();
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails>(
    connectionSettings.connectionDetails,
  );
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setConnectionDetails(connectionDetails);
  }, [connectionDetails]);

  const handleInputChange = (field: keyof ConnectionDetails, value: string | number) => {
    setConnectionDetails((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    dispatch(connectionSettings.dispatchAction(connectionDetails));
    setIsEditMode(!isEditMode);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>{name}</AccordionSummary>
      <AccordionDetails>
        <Box mt={2}>
          <FormControl fullWidth>
            <InputLabel id="connection-type-select-label">Connection Type</InputLabel>
            <Select
              labelId="connection-type-select-label"
              value={connectionDetails.connectionType}
              onChange={(e) => handleInputChange("connectionType", e.target.value as ConnectionType)}
              disabled={isEditMode}
            >
              {connectionTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Host"
            fullWidth
            margin="normal"
            value={connectionDetails.host}
            onChange={(e) => handleInputChange("host", e.target.value)}
            disabled={isEditMode}
          />
          <TextField
            label="Port"
            fullWidth
            margin="normal"
            value={connectionDetails.port}
            onChange={(e) => handleInputChange("port", +e.target.value)}
            disabled={isEditMode}
          />
          {connectionDetails.connectionType === "Kafka" && (
            <TextField
              label="Topic"
              fullWidth
              margin="normal"
              value={connectionDetails.topic}
              onChange={(e) => handleInputChange("topic", e.target.value)}
              disabled={isEditMode}
            />
          )}
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {isEditMode ? "Edit" : "Save"}
            </Button>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
