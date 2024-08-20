import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Function {
  name: string,
  scriptContent: string,
  args?: string[]
}

interface EditorState {
  editor: {
    isOpen: boolean;
    existingData: string | undefined;
  }
}

interface FunctionsState {
  functionNames: string[];
  functions: {[functionName: string]: Function};
  selectedFunctionName: string | undefined;
  consoleOutput: string;
}

const initialState: FunctionsState & EditorState = {
  functionNames: [],
  functions: {},
  selectedFunctionName: undefined,
  consoleOutput: "",
  editor: {
    isOpen: false,
    existingData: undefined
  }
};

export const functionsSliceName = 'functions';
const functionsSlice = createSlice({
  name: functionsSliceName,
  initialState,
  reducers: {
    addFunction: (state, action: PayloadAction<Function>) => {
      var fnName = action.payload.name;
      state.functionNames.push(fnName);
      state.functions[fnName] = action.payload;
    },
    removeFunction: (state, action: PayloadAction<string>) => {
      var fnName = action.payload;
      state.functionNames = state.functionNames.filter(f => f !== fnName);
      if (state.selectedFunctionName === fnName) {
        state.selectedFunctionName = undefined;
      }
      delete state.functions[fnName]
    },
    updateFunction: (state, action: PayloadAction<Function>) => {
      var fnName = action.payload.name;
      state.functions[fnName] = action.payload;
    },
    setSelectedFunction: (state, action: PayloadAction<string>) => {
      state.selectedFunctionName = action.payload;
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

export const selectFunctionNames = (state: RootState) => state[functionsSliceName].functionNames;
export const selectSelectedFunctionName = (state: RootState) => state[functionsSliceName].selectedFunctionName;
export const selectConsoleOutput = (state: RootState) => state[functionsSliceName].consoleOutput;
export const selectEditorOpen =  (state: RootState) => state[functionsSliceName].editor.isOpen;

export default functionsSlice.reducer;
