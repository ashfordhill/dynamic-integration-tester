import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { ConnectionDetails } from '../types/connection'

export type TestResultType = 'Pass' | 'Fail'

export interface TestResult {
  id: string
  testCaseId: string
  result: TestResultType
  resultMessage?: string
}

export interface TestCase {
  id: string
  inputFileName: string
  outputFileName: string | null
}

interface TestCaseState {
  testCaseIds: string[]
  testResultIds: string[]
  testCases: Record<string, TestCase>
  testResults: Record<string, TestResult>
  loading: boolean
  error: string | null
}

const initialState: TestCaseState = {
  testCaseIds: [],
  testResultIds: [],
  testCases: {},
  testResults: {},
  loading: false,
  error: null
}

export const executeTestCase = createAsyncThunk<
  { testCaseId: string; result: TestResult }, // Return type
  { testCaseId: string; senderConnection: ConnectionDetails; receiverConnection: ConnectionDetails }, // Argument types
  { state: RootState; rejectValue: string } // Thunk configuration
>(
  'testCase/executeTestCase',
  async ({ testCaseId, senderConnection, receiverConnection }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const testCase = state.testCase.testCases[testCaseId]

      const functionName = 'SendAndReceiveOrTimeout' // Replace this with actual logic to get the function name
      const payload = {
        functionName,
        senderConnection,
        receiverConnection,
        inputFileName: testCase.inputFileName,
        outputFileName: testCase.outputFileName || null
      }
      const response = await axios.post('/api/execute-test', {
        functionName,
        senderConnection,
        receiverConnection,
        inputFileName: testCase.inputFileName,
        outputFileName: testCase.outputFileName || null
      })
      console.log(JSON.stringify(response, null, 2))

      if (response.data.error) {
        //return rejectWithValue(response.data.error)
        console.error('data had error field defined???')
      }

      const resultId = uuidv4()
      const result: TestResult = {
        id: resultId,
        testCaseId: testCaseId,
        result: response.data.result.includes('Fail') ? 'Fail' : 'Pass',
        resultMessage: response.data.resultMessage
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
  initialState,
  reducers: {
    addTestCase(state, action: PayloadAction<{ inputFileName: string; outputFileName: string | null }>) {
      const id = uuidv4()
      state.testCaseIds.push(id)
      state.testCases[id] = { ...action.payload, id }
    },
    addTestResult(state, action: PayloadAction<TestResult>) {
      const { id, testCaseId } = action.payload
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
          const { testCaseId, result } = action.payload
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

export const selectTestResultsByTestCaseId = (testCaseId: string) =>
  createSelector(selectTestResults, (testResults) =>
    Object.values(testResults).filter((result) => result.testCaseId === testCaseId)
  )

export const selectTestResultById = (id: string) =>
  createSelector(selectTestResults, (testResults) => Object.values(testResults).find((result) => result.id === id))

export const selectTestCaseById = (id: string) =>
  createSelector(selectTestResults, (testResults) => Object.values(testResults).find((result) => result.id === id))

export default testCaseSlice.reducer
