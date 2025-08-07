import React from 'react';

import { TestResultCard } from './TestResultCard';
import { SubmissionResult } from '@/Models/Submission';
import { Summary } from './Summary';


interface TestResultsProps {
  result: SubmissionResult;
}

export const TestResults: React.FC<TestResultsProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Test Results</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Execution Time: {result.executionTime}ms</span>
          <span>Memory: {result.memoryUsed}KB</span>
        </div>
      </div>

      {result.compileError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">Compilation Error</h4>
          <pre className="text-sm text-red-700 whitespace-pre-wrap">{result.compileError}</pre>
        </div>
      )}

      <div className="space-y-4">
        {result.testCaseResults.map((testResult, index) => (
          <TestResultCard
            key={testResult.testCaseId}
            testResult={testResult}
            index={index}
          />
        ))}
      </div>

      <Summary result={result} />
    </div>
  );
};
