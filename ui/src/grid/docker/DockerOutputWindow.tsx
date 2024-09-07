import React, { useState, useEffect } from 'react'
import { Paper, Typography, Box, Tabs, Tab } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { selectContainers, setContainerLogs } from '../../store/dockerSlice'
import axios from 'axios'

export const DockerOutputWindow = () => {
  const containers = useSelector(selectContainers) || [] // Default to an empty array
  const dispatch = useDispatch()
  const [selectedTab, setSelectedTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  useEffect(() => {
    const fetchLogs = async (containerId: string) => {
      try {
        const response = await axios.get(`/api/docker/container-logs/${containerId}`)
        if (response.status === 200) {
          dispatch(setContainerLogs({ id: containerId, logs: response.data.logs }))
        }
      } catch (error) {
        console.error('Error fetching container logs:', error)
      }
    }

    const intervalId = setInterval(() => {
      containers.forEach((container) => {
        if (container.id) {
          fetchLogs(container.id)
        }
      })
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(intervalId)
  }, [containers, dispatch])

  return (
    <Paper variant='outlined' sx={{ padding: 2, height: 300, overflowY: 'scroll' }}>
      <Typography variant='h6'>Docker Output</Typography>
      {/* Only render Tabs if there are containers */}
      {containers.length > 0 ? (
        <>
          <Tabs value={selectedTab} onChange={handleTabChange} variant='scrollable' scrollButtons='auto'>
            {containers.map((container, index) => (
              <Tab key={container.id} label={container.name} />
            ))}
          </Tabs>
          <Box component='pre' sx={{ margin: 0, padding: 2 }}>
            {containers[selectedTab]?.logs || 'No logs available. Is container running?'}
          </Box>
        </>
      ) : (
        <Typography>No containers available</Typography>
      )}
    </Paper>
  )
}
