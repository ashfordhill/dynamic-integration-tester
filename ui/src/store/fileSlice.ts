import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { initialState } from '../types/file'

export const filesSliceName = 'file'
const filesSlice = createSlice({
  name: filesSliceName,
  initialState,
  reducers: {
    addInputFile(state, action: PayloadAction<{ fileName: string; displayName: string }>) {
      state.inputFiles[action.payload.fileName] = action.payload.displayName
    },
    addOutputFile(state, action: PayloadAction<{ fileName: string; displayName: string }>) {
      state.outputFiles[action.payload.fileName] = action.payload.displayName
    }
  }
})

export const { addInputFile, addOutputFile } = filesSlice.actions

const selectInputFiles = (state: RootState) => state[filesSliceName].inputFiles
const selectOutputFiles = (state: RootState) => state[filesSliceName].outputFiles

export const selectInputFileNames = createSelector(selectInputFiles, (inputFiles) => Object.keys(inputFiles))

export const selectOutputFileNames = createSelector(selectOutputFiles, (outputFiles) => Object.keys(outputFiles))
export default filesSlice.reducer
