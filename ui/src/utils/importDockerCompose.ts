import axios from 'axios'
import { setContainers } from '../store/dockerSlice'
import { Container } from '../types/docker'

export const importDockerCompose = async (composeContent: string, dispatch: any) => {
  try {
    const formData = new FormData()
    formData.append('file', new Blob([composeContent], { type: 'text/yaml' }))

    const response = await axios.post('/api/docker/upload-compose', formData)

    if (response.status === 200) {
      const services: any[] = response.data.compose.services
      const containers = Object.entries(services).map(([key, service]) => {
        const container: Container = {
          name: key,
          environment: service.environment,
          ports: service.ports,
          logs: '',
          running: false
        }
        return container
      })
      dispatch(setContainers(containers))
    }
  } catch (error) {
    console.error('Error uploading docker-compose file:', error)
  }
}
