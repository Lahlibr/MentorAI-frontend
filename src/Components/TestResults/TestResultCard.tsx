import React from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { TestCaseResult } from '@/Models/Submission';


interface Props {
  testResult: TestCaseResult;
  index: number;
}

export const TestResultCard: React.FC<Props> = ({ testResult, index }) => {
  const getStatusIcon = (passed: boolean, hasError: boolean) => {
    if (hasError) return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
    return passed
      ? <CheckCircleIcon className="h-5 w-5 text-green-500" />
      : <XCircleIcon className="h-5 w-5 text-red-500" />;
  };

  const getStatusText = (passed: boolean, hasError: boolean) => {
    if (hasError) return 'Runtime Error';
    return passed ? 'Passed' : 'Failed';
  };

  const getStatusColor = (passed: boolean, hasError: boolean) => {
    if (hasError) return 'text-yellow-600 bg-yellow-50';
    return passed ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon(testResult.passed, !!testResult.errorDetails)}
          <span className="font-medium">Test Case {index + 1}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            getStatusColor(testResult.passed, !!testResult.errorDetails)
          }`}>
            {getStatusText(testResult.passed, !!testResult.errorDetails)}
          </span>
        </div>
        <span className="text-sm text-gray-500">{testResult.executionTime}ms</span>
      </div>

      {!testResult.isHidden && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-900 mb-1">Input:</h5>
            <pre className="bg-gray-50 p-2 rounded border text-gray-700 overflow-x-auto">{testResult.input}</pre>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-1">Expected:</h5>
            <pre className="bg-gray-50 p-2 rounded border text-gray-700 overflow-x-auto">{testResult.expectedOutput}</pre>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-1">Your Output:</h5>
            <pre className="bg-gray-50 p-2 rounded border text-gray-700 overflow-x-auto">{testResult.actualOutput}</pre>
          </div>
        </div>
      )}

      {testResult.errorDetails && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
          <h5 className="font-medium text-red-800 mb-1">Error Details:</h5>
          <pre className="text-sm text-red-700 whitespace-pre-wrap">{testResult.errorDetails}</pre>
        </div>
      )}

      {testResult.isHidden && (
        <div className="text-sm text-gray-500 italic">Hidden test case - details not shown</div>
      )}
    </div>
  );
};
