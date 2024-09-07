import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { Container, initialState } from '../types/docker'

export const dockerSliceName = 'docker'

const dockerSlice = createSlice({
  name: dockerSliceName,
  initialState,
  reducers: {
    setContainers: (state, action: PayloadAction<Container[]>) => {
      state.containers = action.payload
    },
    addContainer: (state, action: PayloadAction<Container>) => {
      state.containers.push(action.payload)
    },
    removeContainer: (state, action: PayloadAction<string>) => {
      state.containers = state.containers.filter((container) => container.id !== action.payload)
    },
    updateContainer: (state, action: PayloadAction<Partial<Container>>) => {
      const index = state.containers.findIndex((container) => container.name === action.payload.name)
      if (index !== -1) {
        state.containers[index] = {...state.containers[index], ...action.payload }
      }
    },
    updateContainerStatus: (state, action: PayloadAction<{ id: string; running: boolean }>) => {
      const container = state.containers.find((container) => container.id === action.payload.id)
      if (container) {
        container.running = action.payload.running
      }
    },
    selectContainer: (state, action: PayloadAction<string | undefined>) => {
      state.selectedContainer = state.containers.find((container) => container.id === action.payload) || undefined
    },
    setDockerOutput: (state, action: PayloadAction<string>) => {
      state.dockerOutput = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setContainerLogs: (state, action: PayloadAction<{ id: string; logs: string }>) => {
      const container = state.containers.find((container) => container.id === action.payload.id)
      if (container) {
        container.logs = action.payload.logs
      }
    }
  }
})

export const {
  setContainers,
  addContainer,
  removeContainer,
  updateContainer,
  updateContainerStatus,
  selectContainer,
  setDockerOutput,
  setLoading,
  setContainerLogs
} = dockerSlice.actions

export const selectContainers = (state: RootState) => state[dockerSliceName].containers
export const selectSelectedContainer = (state: RootState) => state[dockerSliceName].selectedContainer
export const selectDockerOutput = (state: RootState) => state[dockerSliceName].dockerOutput
export const selectLoading = (state: RootState) => state[dockerSliceName].loading

export default dockerSlice.reducer
