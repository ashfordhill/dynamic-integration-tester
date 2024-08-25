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
  
  export interface ContainerState {
    containers: Container[]
    selectedContainer: Container | undefined
    dockerOutput: string | undefined
  }
  
  export const initialState: ContainerState = {
    containers: [],
    selectedContainer: undefined,
    dockerOutput: undefined
  }