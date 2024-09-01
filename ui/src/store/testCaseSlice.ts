import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { ConnectionDetails } from '../types/connection'
import { dummyDataInitialState, TestCase, TestResult } from '../types/testCase'

export const executeTestCase = createAsyncThunk<
  { testCaseId: string; result: TestResult }, // Return type
  {
    testCaseId: string
    senderConnection: ConnectionDetails
    receiverConnection: ConnectionDetails
    functionName: string
  }, // Argument types
  { state: RootState; rejectValue: string } // Thunk configuration
>(
  'testCase/executeTestCase',
  async ({ testCaseId, functionName, senderConnection, receiverConnection }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const testCase = state.testCase.testCases[testCaseId]

      const payload = {
        functionName,
        senderConnection,
        receiverConnection,
        inputFileName: testCase.inputFileName,
        outputFileName: testCase.outputFileName || null
      }
      const response = await axios.post('/api/execute-test', payload)
      console.debug(JSON.stringify(response.data, null, 2))

      const resultId = uuidv4()
      const rawResult = response.data.results

      const result: TestResult = {
        id: resultId,
        testCaseId: testCaseId,
        result: rawResult.result.includes('Pass') ? 'Pass' : 'Fail',
        resultMessage: rawResult.resultMessage || 'No result message provided'
      }

      console.log(JSON.stringify(result))

      return { testCaseId, result }
    } catch (error) {
      return rejectWithValue('Error executing the test case.')
    }
  }
)

export const testCaseSliceName = 'testCase'
const testCaseSlice = createSlice({
  name: testCaseSliceName,
  initialState: dummyDataInitialState,
  reducers: {
    addTestCase: (state, action: PayloadAction<TestCase>) => {
      const newTestCase = action.payload
      state.testCaseIds.push(newTestCase.id)
      state.testCases[newTestCase.id] = newTestCase
    },
    addTestResult(state, action: PayloadAction<TestResult>) {
      const { id } = action.payload
      state.testResultIds.push(id)
      state.testResults[id] = action.payload
    },

    clearError(state) {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeTestCase.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        executeTestCase.fulfilled,
        (state, action: PayloadAction<{ testCaseId: string; result: TestResult }>) => {
          const { result } = action.payload
          state.testResultIds.push(result.id)
          state.testResults[result.id] = result
          state.loading = false
        }
      )
      .addCase(executeTestCase.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false
        state.error = action.payload || 'Unknown error occurred'
      })
  }
})

export const { addTestCase, addTestResult, clearError } = testCaseSlice.actions

export const selectTestCases = (state: RootState) => state[testCaseSliceName].testCases
export const selectTestResults = (state: RootState) => state[testCaseSliceName].testResults
export const selectTestCaseIds = (state: RootState) => state[testCaseSliceName].testCaseIds
export const selectTestResultIds = (state: RootState) => state[testCaseSliceName].testResultIds

export const selectTestResultByTestCaseId = (testCaseId: string) =>
  createSelector(selectTestResults, (testResults) =>
    Object.values(testResults).find((result) => result.testCaseId === testCaseId)
  )

export const selectTestResultById = (id: string) =>
  createSelector(selectTestResults, (testResults) => Object.values(testResults).find((result) => result.id === id))

export const selectTestCaseById = (id: string) =>
  createSelector(selectTestCases, (testCases) => Object.values(testCases).find((testCase) => testCase.id === id))

export default testCaseSlice.reducer
