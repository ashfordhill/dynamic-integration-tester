import { v4 as uuidv4 } from 'uuid'

export type TestResultType = 'Pass' | 'Fail'

export interface RawData {
  id: string
  function_name: string
  sender_connection: {
    connectionType: string
    host: string
    port: number
    topic?: string
  }

  receiver_connection: {
    connectionType: string
    host: string
    port: number
    topic?: string
  }
  input_file: string
  output_file: string
  output: string
  input: string
  status: string
  timestamp: string
  results: {
    result: string
    resultMessage: string
    details: {
      expected: string
      received: string
      match: string
    }
  }
}

export interface TestResult {
  id: string
  testCaseId: string
  result: TestResultType
  rawData: RawData
  resultMessage?: string
  receiverOutput?: string
}

export interface TestCase {
  id: string
  inputFileName: string
  outputFileName: string | null
  functionName: string
  testResultIds: string[]
}

export interface TestCaseState {
  testCaseIds: string[]
  testResultIds: string[]
  testCases: Record<string, TestCase>
  testResults: Record<string, TestResult>
  loading: boolean
  error: string | null
  lastExecutedTestResultId: string | undefined
  receiverOutputWindowData: string | undefined
}

export const initialState: TestCaseState = {
  testCaseIds: [],
  testResultIds: [],
  testCases: {},
  testResults: {},
  loading: false,
  error: null,
  lastExecutedTestResultId: undefined,
  receiverOutputWindowData: undefined
}
