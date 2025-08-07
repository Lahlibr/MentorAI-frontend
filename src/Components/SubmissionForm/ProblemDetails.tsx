// src/components/SubmissionForm/ProblemDetails.tsx
import { ProblemDetail } from '@/Models';
import React from 'react';

export const ProblemDetails: React.FC<{ problem: ProblemDetail }> = ({ problem }) => (
  <div className="bg-white rounded-lg shadow p-6 mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-gray-900">{problem.title}</h2>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {problem.difficulty}
      </span>
    </div>
    <div className="prose max-w-none">
      <p className="text-gray-700 whitespace-pre-wrap">{problem.description}</p>
    </div>
  </div>
);
