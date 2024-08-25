export interface Container {
    id: string
    name: string
    image: string
    ports: string[]
    environment: string[]
    volumes: string[]
    network: string
    running: boolean
  }
  
  export interface DockerState {
    containers: Container[]
    selectedContainer: Container | undefined
    dockerOutput: string | undefined
  }
  
  export const initialState: DockerState = {
    containers: [],
    selectedContainer: undefined,
    dockerOutput: undefined
  }