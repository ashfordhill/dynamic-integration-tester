import React, { useState, useEffect } from 'react'
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
  Button
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { ConnectionType, connectionTypes, ConnectionDetails } from '../../types/connection'

interface ConnectionSettingsProps {
  connectionDetails: ConnectionDetails
  dispatchAction: any
}

export const ConnectionSettings: React.FC<{ name: string; connectionSettings: ConnectionSettingsProps }> = ({
  name,
  connectionSettings
}) => {
  const dispatch = useDispatch()
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails>(connectionSettings.connectionDetails)
  const [isEditMode, setIsEditMode] = useState(false)
  const [errors, setErrors] = useState<{ [key in keyof ConnectionDetails]?: string }>({})

  useEffect(() => {
    setConnectionDetails(connectionDetails)
  }, [connectionDetails])

  const validateConnectionDetails = (details: ConnectionDetails): boolean => {
    const newErrors: { [key in keyof ConnectionDetails]?: string } = {}

    if (!details.host) {
      newErrors.host = 'Host is required'
    }
    if (!details.port) {
      newErrors.port = 'Port is required'
    } else if (isNaN(details.port) || details.port <= 0) {
      newErrors.port = 'Port must be a positive number'
    }
    if (details.connectionType === 'Kafka' && !details.topic) {
      newErrors.topic = 'Topic is required for Kafka connection'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof ConnectionDetails, value: string | number) => {
    setConnectionDetails((prevState) => ({
      ...prevState,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    if (validateConnectionDetails(connectionDetails)) {
      dispatch(connectionSettings.dispatchAction(connectionDetails))
      setIsEditMode(!isEditMode)
    } else {
      alert('Please correct the errors before saving.')
    }
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>{name}</AccordionSummary>
      <AccordionDetails>
        <Box mt={2}>
          <FormControl fullWidth>
            <InputLabel id='connection-type-select-label'>Connection Type</InputLabel>
            <Select
              labelId='connection-type-select-label'
              value={connectionDetails.connectionType}
              onChange={(e) => handleInputChange('connectionType', e.target.value as ConnectionType)}
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
            label='Host'
            fullWidth
            margin='normal'
            value={connectionDetails.host}
            onChange={(e) => handleInputChange('host', e.target.value)}
            disabled={isEditMode}
            error={!!errors.host}
            helperText={errors.host}
          />
          <TextField
            label='Port'
            fullWidth
            margin='normal'
            value={connectionDetails.port ?? ''}
            onChange={(e) => handleInputChange('port', +e.target.value)}
            disabled={isEditMode}
            error={!!errors.port}
            helperText={errors.port}
          />
          {connectionDetails.connectionType === 'Kafka' && (
            <TextField
              label='Topic'
              fullWidth
              margin='normal'
              value={connectionDetails.topic ?? ''}
              onChange={(e) => handleInputChange('topic', e.target.value)}
              disabled={isEditMode}
              error={!!errors.topic}
              helperText={errors.topic}
            />
          )}
          <Box mt={2}>
            <Button variant='contained' color='primary' onClick={handleSubmit}>
              {isEditMode ? 'Edit' : 'Save'}
            </Button>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}
