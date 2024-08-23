import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface FileState {
  inputFiles: { [fileName: string]: string };
  outputFiles: { [fileName: string]: string };
}

const initialState: FileState = {
  inputFiles: {},
  outputFiles: {},
};

export const filesSliceName = 'files';
const filesSlice = createSlice({
  name: filesSliceName,
  initialState,
  reducers: {
    addInputFile(state, action: PayloadAction<{ fileName: string; displayName: string }>) {
      state.inputFiles[action.payload.fileName] = action.payload.displayName;
    },
    addOutputFile(state, action: PayloadAction<{ fileName: string; displayName: string }>) {
      state.outputFiles[action.payload.fileName] = action.payload.displayName;
    },
  },
});

export const { addInputFile, addOutputFile } = filesSlice.actions;


const selectInputFiles = (state: RootState) => state[filesSliceName].inputFiles;
const selectOutputFiles = (state: RootState) => state[filesSliceName].outputFiles;

export const selectInputFileNames = createSelector(
    selectInputFiles,
    (inputFiles) => Object.keys(inputFiles)
  );
  
  export const selectOutputFileNames = createSelector(
    selectOutputFiles,
    (outputFiles) => Object.keys(outputFiles)
  );
export default filesSlice.reducer;