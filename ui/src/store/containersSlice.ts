import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { setConsoleOutput } from "./functionsSlice";

export interface Container {
  id: string;
  name: string;
  image: string;
  ports: string[];
  environment: string[];
  volumes: string[];
  network: string;
  running: boolean;
}

interface ContainersState {
  containers: Container[];
  selectedContainer: Container | undefined;
  dockerOutput: string | undefined;
}

const initialState: ContainersState = {
  containers: [],
  selectedContainer: undefined,
  dockerOutput: undefined,
};

export const containerSliceName = 'containers';

const containersSlice = createSlice({
  name: containerSliceName,
  initialState,
  reducers: {
    setContainers: (state, action: PayloadAction<Container[]>) => {
      state.containers = action.payload;
    },
    addContainer: (state, action: PayloadAction<Container>) => {
      state.containers.push(action.payload);
    },
    removeContainer: (state, action: PayloadAction<string>) => {
      state.containers = state.containers.filter(container => container.id !== action.payload);
    },
    updateContainer: (state, action: PayloadAction<Container>) => {
      const index = state.containers.findIndex(container => container.id === action.payload.id);
      if (index !== -1) {
        state.containers[index] = action.payload;
      }
    },
    updateContainerStatus: (state, action: PayloadAction<{ id: string; running: boolean }>) => {
      const container = state.containers.find(container => container.id === action.payload.id);
      if (container) {
        container.running = action.payload.running;
      }
    },
    selectContainer: (state, action: PayloadAction<string | undefined>) => {
      state.selectedContainer = state.containers.find(container => container.id === action.payload) || undefined;
    },
    setDockerOutput: (state, action: PayloadAction<string>) => {
      state.dockerOutput = action.payload;
    }
  },
});

export const {
  setContainers,
  addContainer,
  removeContainer,
  updateContainer,
  updateContainerStatus,
  selectContainer,
  setDockerOutput,
} = containersSlice.actions;

export const selectContainers = (state: RootState) => state[containerSliceName].containers;
export const selectDockerOutput = (state: RootState) => state[containerSliceName].dockerOutput;
export default containersSlice.reducer;
