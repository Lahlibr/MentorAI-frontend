import { SubmissionResult, TestCaseResult } from '@/Models/Submission';
import React from 'react';

interface Props {
  result: SubmissionResult;
}

export const TestResult: React.FC<Props> = ({ result }) => {
  const {
    isCorrect,
    compileError,
    testCaseResults,
    executionTime,
    memoryUsed,
    status,
  } = result;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold">Submission Results</h3>

      <div>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Execution Time:</strong> {executionTime} ms</p>
        <p><strong>Memory Used:</strong> {memoryUsed} KB</p>
      </div>

      {compileError && (
        <div className="text-red-600 font-medium">
          ❌ Compilation Error:
          <pre className="bg-red-50 p-2 rounded mt-2 text-sm overflow-auto whitespace-pre-wrap">
            {compileError}
          </pre>
        </div>
      )}

      {!compileError && isCorrect && (
        <div className="text-green-600 font-medium">✅ All test cases passed!</div>
      )}

      {!compileError && !isCorrect && testCaseResults?.length > 0 && (
        <div className="space-y-4">
          {testCaseResults.map((testCase: TestCaseResult, index: number) => (
            <div key={testCase.testCaseId} className="border rounded p-4 bg-gray-50">
              <p className="text-sm text-gray-600">Test Case #{index + 1} {testCase.isHidden && '(Hidden)'}</p>

              <div className="mt-2">
                <strong>Input:</strong>
                <pre className="bg-white p-2 rounded text-sm border">{testCase.input}</pre>
              </div>

              <div className="mt-2">
                <strong>Expected Output:</strong>
                <pre className="bg-white p-2 rounded text-sm border">{testCase.expectedOutput}</pre>
              </div>

              <div className="mt-2">
                <strong>Your Output:</strong>
                <pre className="bg-white p-2 rounded text-sm border">{testCase.actualOutput}</pre>
              </div>

              {testCase.errorDetails && (
                <div className="mt-2 text-red-600">
                  <strong>Error:</strong>
                  <pre className="bg-red-50 p-2 rounded text-sm border">{testCase.errorDetails}</pre>
                </div>
              )}

              <div className="mt-2">
                <strong>Execution Time:</strong> {testCase.executionTime} ms
              </div>

              <div className="mt-2">
                {testCase.passed ? (
                  <span className="text-green-600 font-semibold">✔ Passed</span>
                ) : (
                  <span className="text-red-600 font-semibold">✘ Failed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
