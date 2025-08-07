import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { SubmissionResult } from '@/Models/Submission';

interface Props {
  result: SubmissionResult;
}

export const Summary: React.FC<Props> = ({ result }) => {
  const failedCount = result.testCaseResults.filter(t => !t.passed).length;

  return (
    <div className="mt-6 p-4 rounded-lg border-2 border-dashed">
      <div className="text-center">
        {result.isCorrect ? (
          <div className="text-green-600">
            <CheckCircleIcon className="h-8 w-8 mx-auto mb-2" />
            <p className="font-semibold">Solution Accepted!</p>
            <p className="text-sm text-gray-600">All test cases passed</p>
          </div>
        ) : (
          <div className="text-red-600">
            <XCircleIcon className="h-8 w-8 mx-auto mb-2" />
            <p className="font-semibold">Solution Rejected</p>
            <p className="text-sm text-gray-600">
              {failedCount} test case{failedCount > 1 ? 's' : ''} failed
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
