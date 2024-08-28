import { v4 as uuidv4 } from 'uuid'

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
  functionName: string
}

export interface TestCaseState {
  testCaseIds: string[]
  testResultIds: string[]
  testCases: Record<string, TestCase>
  testResults: Record<string, TestResult>
  loading: boolean
  error: string | null
}

export const initialState: TestCaseState = {
  testCaseIds: [],
  testResultIds: [],
  testCases: {},
  testResults: {},
  loading: false,
  error: null
}

// having this to be able to display visuals from Puppeteer when pushing commits.
// when querying test case results on startup + Github Actions starts backend, can kill this
// since past committed test case results will prob be committed to the repo for a while.
// Dummy data with 3 test cases
const testCase1Id = uuidv4()
const testCase2Id = uuidv4()
const testCase3Id = uuidv4()

const testResult2Id = uuidv4()
const testResult3Id = uuidv4()

export const dummyDataInitialState: TestCaseState = {
  testCaseIds: [testCase1Id, testCase2Id, testCase3Id],
  testResultIds: [testResult2Id, testResult3Id],
  testCases: {
    [testCase1Id]: {
      id: testCase1Id,
      inputFileName: 'New Text Document.xml',
      outputFileName: 'New Text Document.xml', // No TestResult for this TestCase
      functionName: 'SendAndReceiveOrTimeout'
    },
    [testCase2Id]: {
      id: testCase2Id,
      inputFileName: 'New Text Document.xml',
      outputFileName: 'New Text Document.xml', // TestCase with a 'fail' TestResult
      functionName: 'SendAndReceiveOrTimeout'
    },
    [testCase3Id]: {
      id: testCase3Id,
      inputFileName: 'New Text Document.xml',
      outputFileName: 'New Text Document.xml', // TestCase with a 'pass' TestResult
      functionName: 'SendAndReceiveOrTimeout'
    }
  },
  testResults: {
    [testResult2Id]: {
      id: testResult2Id,
      testCaseId: testCase2Id,
      result: 'Fail',
      resultMessage: 'Failure example' // Error message for failed TestResult
    },
    [testResult3Id]: {
      id: testResult3Id,
      testCaseId: testCase3Id,
      result: 'Pass'
      // No resultMessage defined for passed TestResult
    }
  },
  loading: false,
  error: null
}
