// src/components/SubmissionForm/SampleTestCases.tsx
import { ProblemDetail } from '@/Models';
import React from 'react';

export const SampleTestCases: React.FC<{ problem: ProblemDetail }> = ({ problem }) => {
  if (!problem.sampleTestCases.length) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-3">Sample Test Cases</h3>
      {problem.sampleTestCases.map((testCase, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Input:</h4>
              <pre className="text-sm bg-white p-2 border rounded">{testCase.input}</pre>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Expected Output:</h4>
              <pre className="text-sm bg-white p-2 border rounded">{testCase.expectedOutput}</pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
