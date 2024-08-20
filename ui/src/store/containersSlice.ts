import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  selectedContainer: Container | null;
}

const initialState: ContainersState = {
  containers: [],
  selectedContainer: null,
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
    selectContainer: (state, action: PayloadAction<string | null>) => {
      state.selectedContainer = state.containers.find(container => container.id === action.payload) || null;
    },
  },
});

export const {
  setContainers,
  addContainer,
  removeContainer,
  updateContainer,
  updateContainerStatus,
  selectContainer,
} = containersSlice.actions;

export default containersSlice.reducer;
