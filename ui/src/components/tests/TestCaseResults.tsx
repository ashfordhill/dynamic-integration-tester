import React from 'react';
import { useSelector } from 'react-redux';
import { selectTestResultsByTestCaseId, TestResult } from '../../store/testCaseSlice';
import { Typography, Box } from '@mui/material';
import { CheckCircle, Cancel, RemoveCircleOutline } from '@mui/icons-material';

interface TestCaseResultsProps {
  testCaseId: string;
}

const TestCaseResults: React.FC<TestCaseResultsProps> = ({ testCaseId }) => {
  const results: TestResult[] = useSelector(selectTestResultsByTestCaseId(testCaseId));

  if (results.length === 0) {
    return (
      <Box display="flex" alignItems="center" justifyContent="flex-start" height="100%">
        <RemoveCircleOutline />
      </Box>
    );
  }

  const lastResult = results[results.length - 1];

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-start" height="100%">
      {lastResult.result === 'Pass' ? (
        <CheckCircle color="success" />
      ) : (
        <>
          <Cancel color="error" />
          <Typography variant="body2" color="error" ml={1}>
            {lastResult.resultMessage}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default TestCaseResults;