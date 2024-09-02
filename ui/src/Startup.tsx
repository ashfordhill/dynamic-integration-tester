import React, { ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { FunctionProps } from './types/function'
import { addFunction } from './store/functionSlice'
import { addTestCase, addTestResult } from './store/testCaseSlice'
import { TestCase, TestResult } from './types/testCase'
import { v4 as uuidv4 } from 'uuid'

interface StartupProps {
  children: ReactNode
}

export const Startup: React.FC<StartupProps> = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchFunctions = async () => {
      try {
        const response = await axios.get('/api/functions')
        const functions: FunctionProps[] = response.data.map((fn: any) => ({
          name: fn.name,
          args: fn.args || []
        }))

        functions.forEach((func: FunctionProps) => {
          dispatch(addFunction(func))
        })
      } catch (error) {
        console.error('Error fetching functions:', error)
      }
    }

    const fetchTestResults = async () => {
      try {
        const response = await axios.get('/api/test-results')
        const testResults = response.data
        console.error('Fetched test results:', testResults) // Log fetched results

        testResults.forEach((testResult: any) => {
          const testCaseId = uuidv4()

          // Create a TestCase
          const testCase: TestCase = {
            id: testCaseId,
            inputFileName: testResult.input_file,
            outputFileName: testResult.output_file,
            functionName: testResult.function_name
          }

          // Dispatch the TestCase
          dispatch(addTestCase(testCase))

          // Create a TestResult
          const testResultObject: TestResult = {
            id: uuidv4(),
            testCaseId: testCaseId,
            result: testResult.results.result === 'Pass' ? 'Pass' : 'Fail',
            resultMessage: testResult.results.resultMessage || testResult.error || ''
          }

          // Dispatch the TestResult
          dispatch(addTestResult(testResultObject))
        })
      } catch (error) {
        console.error('Error fetching test results:', error)
      }
    }

    fetchFunctions()
    fetchTestResults()
  }, [dispatch])

  return <>{children}</>
}
