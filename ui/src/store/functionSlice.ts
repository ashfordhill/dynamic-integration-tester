import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { FunctionProps, initialState } from '../types/function'

export const functionsSliceName = 'function'
const functionsSlice = createSlice({
  name: functionsSliceName,
  initialState,
  reducers: {
    addFunction: (state, action: PayloadAction<FunctionProps>) => {
      var fnName = action.payload.name
      state.functionNames.push(fnName)
      state.functions[fnName] = action.payload
    },
    removeFunction: (state, action: PayloadAction<string>) => {
      var fnName = action.payload
      state.functionNames = state.functionNames.filter((f) => f !== fnName)
      if (state.selectedFunctionName === fnName) {
        state.selectedFunctionName = undefined
      }
      delete state.functions[fnName]
    },
    updateFunction: (state, action: PayloadAction<FunctionProps>) => {
      var fnName = action.payload.name
      state.functions[fnName] = action.payload
    },
    setSelectedFunction: (state, action: PayloadAction<string>) => {
      state.selectedFunctionName = action.payload
    },
    setEditorOpen: (state, action: PayloadAction<boolean>) => {
      state.editor.isOpen = action.payload
    },
    setConsoleOutput: (state, action: PayloadAction<string>) => {
      state.consoleOutput = action.payload
    }
  }
})

export const { addFunction, removeFunction, updateFunction, setSelectedFunction, setConsoleOutput, setEditorOpen } =
  functionsSlice.actions

export const selectFunctionNames = (state: RootState) => state[functionsSliceName].functionNames
export const selectSelectedFunctionName = (state: RootState) => state[functionsSliceName].selectedFunctionName
export const selectConsoleOutput = (state: RootState) => state[functionsSliceName].consoleOutput
export const selectEditorOpen = (state: RootState) => state[functionsSliceName].editor.isOpen
export const selectFunctions = (state: RootState) => state[functionsSliceName].functions

export default functionsSlice.reducer
