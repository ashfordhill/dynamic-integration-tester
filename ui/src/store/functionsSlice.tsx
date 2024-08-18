import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FunctionData {
  name: string;
  script: string;
}

interface FunctionsState {
  functions: FunctionData[];
  selectedFunction: FunctionData | null;
}

const initialState: FunctionsState = {
  functions: [],
  selectedFunction: null,
};

const functionsSlice = createSlice({
  name: 'functions',
  initialState,
  reducers: {
    addFunction: (state, action: PayloadAction<FunctionData>) => {
      state.functions.push(action.payload);
    },
    removeFunction: (state, action: PayloadAction<string>) => {
      state.functions = state.functions.filter(func => func.name !== action.payload);
      if (state.selectedFunction?.name === action.payload) {
        state.selectedFunction = null;
      }
    },
    updateFunction: (state, action: PayloadAction<FunctionData>) => {
      const index = state.functions.findIndex(func => func.name === action.payload.name);
      if (index !== -1) {
        state.functions[index] = action.payload;
      }
    },
    setSelectedFunction: (state, action: PayloadAction<string>) => {
      state.selectedFunction = state.functions.find(func => func.name === action.payload) || null;
    },
  },
});

export const { addFunction, removeFunction, updateFunction, setSelectedFunction } = functionsSlice.actions;

export const selectFunctions = (state: { functions: FunctionsState }) => state.functions.functions;
export const selectSelectedFunction = (state: { functions: FunctionsState }) => state.functions.selectedFunction;

export default functionsSlice.reducer;
