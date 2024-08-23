import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { randomUUID } from 'crypto';

interface TestCase {
  id: string;
  inputFileName: string;
  outputFileName: string | null;
}

interface TestCaseState {
  testCases: TestCase[];
}

const initialState: TestCaseState = {
  testCases: [],
};

export const testCaseSliceName = "testCase"
const testCaseSlice = createSlice({
  name: testCaseSliceName,
  initialState,
  reducers: {
    addTestCase(state, action: PayloadAction<{ inputFileName: string; outputFileName: string | null }>) {
      const id = `${Date.now()}`;
      state.testCases.push({ id, ...action.payload });
    },
    removeTestCase(state, action: PayloadAction<string>) {
      state.testCases = state.testCases.filter(testCase => testCase.id !== action.payload);
    },
    // Additional actions like editing, fetching, etc.
  },
});

export const { addTestCase, removeTestCase } = testCaseSlice.actions;

export const selectTestCases = (state: RootState) => state[testCaseSliceName].testCases;
export default testCaseSlice.reducer;
