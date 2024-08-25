import { useEffect } from 'react'
import { Box, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { selectContainers, updateContainerStatus } from '../../store/containerSlice'
import { setConsoleOutput } from '../../store/functionSlice'

const DockerControls = () => {
  const dispatch = useDispatch()
  const containers = useSelector(selectContainers)

  useEffect(() => {
    const fetchAndUpdateStatuses = async () => {
      await fetchContainerStatuses()
      const intervalId = setInterval(fetchContainerStatuses, 10000)
      return () => clearInterval(intervalId)
    }

    fetchAndUpdateStatuses()
  }, [containers, dispatch])

  const fetchContainerStatuses = async () => {
    try {
      const response = await axios.get('/api/docker/container-statuses')
      if (response.status === 200) {
        const containerStatuses = response.data.statuses
        updateAllContainerStatuses(containerStatuses)
      } else {
        console.error('Unexpected status code:', response.status)
      }
    } catch (error) {
      console.error('Failed to fetch container statuses:', error)
    }
  }

  const updateAllContainerStatuses = (containerStatuses: Record<string, any>) => {
    containers.forEach((container) => {
      const matchingContainer = Object.keys(containerStatuses).find((id) =>
        containerStatuses[id].name.includes(container.name)
      )
      const status = matchingContainer ? containerStatuses[matchingContainer].status : 'stopped'
      dispatch(updateContainerStatus({ id: container.id, running: status === 'running' }))
    })
  }

  const handleContainerAction = async (action: 'start' | 'stop', endpoint: string) => {
    try {
      const response = await axios.post(endpoint, { containers })
      if (response.status === 200) {
        await fetchContainerStatuses()
        dispatch(setConsoleOutput(response.data.output))
      } else {
        handleError(`Failed to ${action} containers`, response.statusText)
      }
    } catch (error) {
      handleError(`Failed to ${action} containers`, error)
    }
  }

  const handleExport = async () => {
    try {
      const response = await axios.post('/api/docker/export-compose', { containers })
      if (response.status === 200) {
        dispatch(setConsoleOutput('docker-compose.yml exported successfully.'))
      } else {
        handleError('Failed to export docker-compose.yml', response.statusText)
      }
    } catch (error) {
      handleError('Failed to export docker-compose.yml', error)
    }
  }

  const handleError = (message: string, error: any) => {
    const errorMsg = axios.isAxiosError(error)
      ? error.response?.data?.error || error.message
      : error instanceof Error
        ? error.message
        : 'Unknown error occurred.'
    dispatch(setConsoleOutput(`${message}: ${errorMsg}`))
  }

  return (
    <Box mt={4}>
      <Button
        variant='contained'
        color='primary'
        fullWidth
        onClick={() => handleContainerAction('start', '/api/docker/start-containers')}
      >
        {containers.length > 0 && containers.every((container) => container.running) ? 'Running' : 'Start All'}
      </Button>
      <Button
        variant='contained'
        color='secondary'
        fullWidth
        onClick={() => handleContainerAction('stop', '/api/docker/stop-containers')}
        sx={{ mt: 2 }}
      >
        Stop All
      </Button>
      <Button variant='contained' color='info' fullWidth onClick={handleExport} sx={{ mt: 2 }}>
        Save As
      </Button>
    </Box>
  )
}

export default DockerControls
