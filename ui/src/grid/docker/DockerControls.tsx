import React from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setDockerOutput, setLoading, selectLoading, updateContainer } from '../../store/dockerSlice'
import { Container } from '../../types/docker'

const DockerControls = () => {
  const dispatch = useDispatch()
  const loading = useSelector(selectLoading)

  const handleContainerAction = async (action: 'start' | 'stop', endpoint: string) => {
    dispatch(setLoading(true))
    try {
      const response = await axios.post(endpoint) // No need to send containers data
      if (response.status === 200) {
        response.data.containers.forEach((container: { service_name: any; container_id: any }) => {
          const props: Partial<Container> = {
            name: container.service_name,
            id: container.container_id
          }
          dispatch(updateContainer(props))
        })
      } else {
        console.error(`Failed to ${action} containers`, response.statusText)
      }
    } catch (error) {
      console.error(`Failed to ${action} containers`, error)
    }
    dispatch(setLoading(false))
  }

  const handleExport = async () => {
    dispatch(setLoading(true))
    try {
      const response = await axios.post('/api/docker/export-compose')
      if (response.status === 200) {
        dispatch(setDockerOutput('docker-compose.yml exported successfully.'))
      } else {
        console.error('Failed to export docker-compose.yml', response.statusText)
      }
    } catch (error) {
      console.error('Failed to export docker-compose.yml', error)
    }
    dispatch(setLoading(false))
  }

  return (
    <Box mt={4}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            onClick={() => handleContainerAction('start', '/api/docker/start-containers')}
            disabled={loading}
          >
            Start All
          </Button>
          <Button
            variant='contained'
            color='secondary'
            fullWidth
            onClick={() => handleContainerAction('stop', '/api/docker/stop-containers')}
            sx={{ mt: 2 }}
            disabled={loading}
          >
            Stop All
          </Button>
          <Button variant='contained' color='info' fullWidth onClick={handleExport} sx={{ mt: 2 }} disabled={loading}>
            Save As
          </Button>
        </>
      )}
    </Box>
  )
}

export default DockerControls
