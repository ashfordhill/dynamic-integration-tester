import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import axios from 'axios'
import { ConnectionDetails } from '../types/connection'
import { TestCase, TestResult, initialState } from '../types/testCase'

export const saveTestResult = createAsyncThunk<
  { testCaseId: string; result: TestResult }, // Return type
  string, // Argument type (testCaseId)
  { state: RootState; rejectValue: string } // Thunk configuration
>('testCase/saveTestResult', async (testResultId, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const testResult = state.testCase.testResults[testResultId]
    const testCase = state.testCase.testCases[testResult.testCaseId]

    if (!testResult || !testCase) {
      return rejectWithValue('Test result or case not found')
    }

    // Since we're accepting this as the accepted output, mark as 'Pass'
    var newTestResult: TestResult & TestCase & any = {
      ...testResult.rawData,
      ...testResult,
      ...testCase,
      results: {
        ...testResult.rawData?.results,
        result: 'Pass',
        resultMessage: 'User accepted receiver output as success test case.',
        details: {
          ...testResult.rawData?.results.details,
          match: 'true'
        }
      }
    }

    const response = await axios.post('/api/save-test-result', newTestResult)
    const newResult: TestResult = {
      ...testResult,
      result: 'Pass',
      resultMessage: 'User accepted receiver output as successful test case result.'
    }
    if (response.status === 200) {
      console.log('Test result saved successfully')
      console.debug(`Response:\n${JSON.stringify(response.data, null, 2)}`)
      return { testCaseId: testCase.id, result: newResult }
    } else {
      return rejectWithValue('Failed to save test result')
    }
  } catch (error) {
    return rejectWithValue('Error saving test result')
  }
})

export const executeTestCase = createAsyncThunk<
  { testCaseId: string; result: TestResult },
  {
    testCaseId: string
    functionName: string
  },
  { state: RootState; rejectValue: string }
>('testCase/executeTestCase', async ({ testCaseId, functionName }, { rejectWithValue, getState }) => {
  try {
    const state = getState() as RootState
    const testCase = state[testCaseSliceName].testCases[testCaseId]
    const senderConnection = state.connection.senderConnection
    const receiverConnection = state.connection.receiverConnection
    const payload = {
      testCaseId,
      functionName,
      senderConnection,
      receiverConnection,
      inputFileName: testCase.inputFileName,
      outputFileName: testCase.outputFileName || null
    }

    const response = await axios.post('/api/execute-test', payload)
    console.debug(JSON.stringify(response, null, 2))

    const rawResult = response.data.results

    const result: TestResult = {
      id: response.data.id,
      testCaseId: testCaseId,
      result: rawResult.result.includes('Pass') ? 'Pass' : 'Fail',
      resultMessage: rawResult.resultMessage || 'No result message provided',
      receiverOutput: rawResult.details.received || undefined, // Updated to extract receiverOutput
      rawData: response.data
    }

    console.log(JSON.stringify(result))

    return { testCaseId, result }
  } catch (error) {
    return rejectWithValue('Error executing the test case.')
  }
})

export const testCaseSliceName = 'testCase'
const testCaseSlice = createSlice({
  name: testCaseSliceName,
  initialState,
  reducers: {
    addTestCase: (state, action: PayloadAction<TestCase>) => {
      const newTestCase = action.payload
      if (state.testCases[newTestCase.id]) {
        // If the test case already exists, append the new result IDs
        state.testCases[newTestCase.id].testResultIds = [
          ...state.testCases[newTestCase.id].testResultIds,
          ...newTestCase.testResultIds
        ]
      } else {
        // If it's a new test case, add it to the state
        state.testCaseIds.push(newTestCase.id)
        state.testCases[newTestCase.id] = newTestCase
      }
    },
    addTestResult: (state, action: PayloadAction<TestResult>) => {
      const { id } = action.payload
      state.testResultIds.push(id)
      state.testResults[id] = action.payload
    },
    updateReceiverOutputWindow: (state, action: PayloadAction<string>) => {
      state.receiverOutputWindowData = action.payload
    },
    setLastExecutedTestCaseId: (state, action: PayloadAction<string>) => {
      state.lastExecutedTestResultId = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeTestCase.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(executeTestCase.fulfilled, (state, action) => {
        const { result } = action.payload
        state.testResultIds.unshift(result.id)
        state.testResults[result.id] = result
        if (state.testCases[result.testCaseId]) {
          state.testCases[result.testCaseId].testResultIds.push(result.id)
        } else {
          console.warn(`No Test Case found for ${result.id} result for Test Case ID ${result.testCaseId}`)
        }
        state.loading = false
        state.lastExecutedTestResultId = result.id // Update last executed test case
        state.receiverOutputWindowData = result.receiverOutput
      })
      .addCase(executeTestCase.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Unknown error occurred'
      })
      .addCase(saveTestResult.fulfilled, (state, action) => {
        state.loading = false
        console.log('Test result saved successfully and state updated.')
      })
      .addCase(saveTestResult.rejected, (state, action) => {
        state.error = action.payload || 'Failed to save test result'
      })
  }
})

export const { addTestCase, addTestResult, updateReceiverOutputWindow, setLastExecutedTestCaseId, clearError } =
  testCaseSlice.actions

// Selectors
export const selectTestCases = (state: RootState) => state[testCaseSliceName].testCases
export const selectTestResults = (state: RootState) => state[testCaseSliceName].testResults
export const selectTestCaseIds = (state: RootState) => state[testCaseSliceName].testCaseIds
export const selectTestResultIds = (state: RootState) => state[testCaseSliceName].testResultIds
export const selectLastExecuteTestResultId = (state: RootState) => state[testCaseSliceName].lastExecutedTestResultId
export const selectReceiverOutputWindow = (state: RootState) => state[testCaseSliceName].receiverOutputWindowData
// Memoized Selectors
export const selectTestResultsByTestCaseId = (testCaseId: string) =>
  createSelector([selectTestResults, selectTestResultIds], (testResults) =>
    Object.values(testResults).filter((result) => result.testCaseId === testCaseId)
  )

export const selectTestResultById = (id: string) =>
  createSelector([selectTestResults], (testResults) => testResults[id])

export const selectTestCaseById = (id: string) => createSelector([selectTestCases], (testCases) => testCases[id])
export default testCaseSlice.reducer
