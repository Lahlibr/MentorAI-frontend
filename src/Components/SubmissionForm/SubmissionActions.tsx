// src/components/SubmissionForm/SubmissionActions.tsx
import React from 'react';

interface Props {
  submitting: boolean;
  onSubmit: () => void;
}

export const SubmissionActions: React.FC<Props> = ({ submitting, onSubmit }) => (
  <button
    onClick={onSubmit}
    disabled={submitting}
    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {submitting ? 'Submitting...' : 'Submit Solution'}
  </button>
);
