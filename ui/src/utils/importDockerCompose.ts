import { setContainers } from '../store/containerSlice'
import yaml from 'js-yaml'

interface DockerComposeService {
  name: string
  image: string
  ports: string[]
  environment: string[]
  volumes: string[]
  network: string
  id: string // Add this line for a unique ID
  running: boolean
}

export const importDockerCompose = (composeFile: string, dispatch: any) => {
  try {
    const composeData = yaml.load(composeFile) as any

    if (!composeData || !composeData.services) {
      throw new Error('Invalid Docker Compose file.')
    }

    const containers: DockerComposeService[] = Object.keys(composeData.services).map((serviceName) => {
      const service = composeData.services[serviceName]
      return {
        id: `${serviceName}-${new Date().getTime()}`, // Create a unique ID
        name: serviceName,
        image: service.image,
        ports: service.ports || [],
        environment: service.environment || [],
        volumes: service.volumes || [],
        network: service.network || 'default',
        running: false // Initialize as not running
      } as DockerComposeService
    })

    // Dispatch the containers to the store
    dispatch(setContainers(containers))
  } catch (error) {
    console.error('Error importing Docker Compose file:', error)
    alert('Failed to import Docker Compose file.')
  }
}
