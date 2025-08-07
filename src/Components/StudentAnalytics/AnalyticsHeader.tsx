import { analyticsApi } from '@/Services/api/AnalyticsApi';
import React from 'react';

import toast from 'react-hot-toast';

interface Props {
  studentName: string;
  studentId: number;
}

export const AnalyticsHeader: React.FC<Props> = ({ studentName, studentId }) => {
  const downloadCsv = async () => {
    try {
      await analyticsApi.downloadStudentAnalyticsCsv(studentId);
      toast.success('CSV downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download CSV');
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics for {studentName}</h2>
      <button
        onClick={downloadCsv}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Download CSV
      </button>
    </div>
  );
};
