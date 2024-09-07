export interface Container {
  id?: string
  name?: string
  image?: string
  ports: string[]
  environment: Record<string, string>
  volumes?: string[]
  network?: string
  running: boolean
  logs: string
}

export interface DockerState {
  containers: Container[]
  selectedContainer: Container | undefined
  dockerOutput: string | undefined
  loading: boolean
}

export const initialState: DockerState = {
  containers: [],
  selectedContainer: undefined,
  dockerOutput: undefined,
  loading: false
}
