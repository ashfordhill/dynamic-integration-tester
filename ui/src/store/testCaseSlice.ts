import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { v4 as uuidv4 } from 'uuid'

export type TestResultType = 'Pass' | 'Fail'

interface TestResult {
  id: string
  testCaseId: string
  result: TestResultType
  resultMessage?: string
}

interface TestCase {
  id: string
  inputFileName: string
  outputFileName: string | null
}

interface TestCaseState {
  testCaseIds: string[]
  testResultIds: string[]
  testCases: Record<string, TestCase>
  testResults: Record<string, TestResult>
}

const initialState: TestCaseState = {
  testCaseIds: [],
  testResultIds: [],
  testCases: {},
  testResults: {}
}

export const testCaseSliceName = 'testCase'
const testCaseSlice = createSlice({
  name: testCaseSliceName,
  initialState,
  reducers: {
    addTestCase(state, action: PayloadAction<{ inputFileName: string; outputFileName: string | null }>) {
      const id = uuidv4()
      state.testCaseIds.push(id)
      state.testCases[id] = { ...action.payload, id }
    }
  }
})

export const { addTestCase } = testCaseSlice.actions

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
