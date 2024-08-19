import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Function {
  id: string,
  name: string,
  args?: string[]
}

interface EditorState {
  isOpen: boolean;
  existingData: string | undefined;
}

interface FunctionsState {
  functionIds: string[];
  selectedFunctionId: string | undefined;
  consoleOutput: string;
}

const initialState: FunctionsState & {editor: EditorState} = {
  functionIds: [],
  selectedFunctionId: undefined,
  consoleOutput: "",
  editor: {
    isOpen: false,
    existingData: undefined
  }
};
const sliceName = 'functions';
const functionsSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    addFunction: (state, action: PayloadAction<string>) => {
      state.functionIds.push(action.payload);
    },
    removeFunction: (state, action: PayloadAction<string>) => {
      state.functionIds = state.functionIds.filter(func => func !== action.payload);
      if (state.selectedFunctionId === action.payload) {
        state.selectedFunctionId = undefined;
      }
    },
    updateFunction: (state, action: PayloadAction<string>) => {
      const index = state.functionIds.findIndex(func => func === action.payload);
      if (index !== -1) {
        state.functionIds[index] = action.payload;
      }
    },
    setSelectedFunction: (state, action: PayloadAction<string>) => {
      state.selectedFunctionId = state.functionIds.find(func => func === action.payload) || undefined;
    },
    setEditorOpen: (state, action: PayloadAction<boolean>) => {
      state.editor.isOpen = action.payload;
    },    
    setConsoleOutput: (state, action: PayloadAction<string>) => {
      state.consoleOutput = action.payload;
    }
  },
});

export const { addFunction, removeFunction, updateFunction, setSelectedFunction, setConsoleOutput, setEditorOpen } = functionsSlice.actions;

export const selectFunctions = (state: RootState) => state[sliceName].functionIds;
export const selectSelectedFunction = (state: RootState) => state[sliceName].selectedFunctionId;
export const selectConsoleOutput = (state: RootState) => state[sliceName].consoleOutput;
export const selectEditorOpen =  (state: RootState) => state[sliceName].editor.isOpen;

export default functionsSlice.reducer;
