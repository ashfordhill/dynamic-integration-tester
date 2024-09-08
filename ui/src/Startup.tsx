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
        console.log('Fetched test results:', testResults) // Log fetched results

        const testCasesMap: Record<string, TestCase> = {} // Store TestCases by a unique key for grouping

        testResults.forEach((testResult: any) => {
          const {
            input_file,
            output_file,
            function_name,
            sender_connection,
            receiver_connection,
            id: testResultId,
            results: { result, resultMessage }
          } = testResult

          // Create a unique key based on input_file, output_file, function_name, sender and receiver connections
          const testCaseKey = `${input_file}-${output_file}-${function_name}-${JSON.stringify(sender_connection)}-${JSON.stringify(receiver_connection)}`

          // Create a TestResult object with the provided testResult.id
          const testResultObject: TestResult = {
            id: testResultId, // Use the ID returned from the response
            testCaseId: '', // We'll assign the correct testCaseId later
            result: result === 'Pass' ? 'Pass' : 'Fail',
            resultMessage: resultMessage || testResult.error || '',
            rawData: testResult
          }

          // If we already have a matching TestCase, append the TestResult ID to it
          if (testCasesMap[testCaseKey]) {
            testCasesMap[testCaseKey].testResultIds.push(testResultId)
          } else {
            // Create a new TestCase for this grouping
            const testCaseId = uuidv4()

            const testCase: TestCase = {
              id: testCaseId,
              inputFileName: input_file,
              outputFileName: output_file || null,
              functionName: function_name,
              testResultIds: [testResultId]
            }

            // Assign the TestCase to the map
            testCasesMap[testCaseKey] = testCase
          }

          // After identifying the TestCase, set the correct testCaseId in TestResult
          testResultObject.testCaseId = testCasesMap[testCaseKey].id

          // Dispatch the TestResult
          dispatch(addTestResult(testResultObject))
        })

        // Now dispatch all the TestCases
        Object.values(testCasesMap).forEach((testCase) => {
          dispatch(addTestCase(testCase))
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
