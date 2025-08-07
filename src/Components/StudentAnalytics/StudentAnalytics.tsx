import { StudentAnalytics } from '@/Models/Analytics';
import { analyticsApi } from '@/Services/api/AnalyticsApi';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsStatsCards } from './AnalyticsStatsCards';
import { ProblemStatusChart } from './ProblemStatusChart';
import { AttemptsBarChart } from './AttemptsBarChart';
import { DetailedProblemTable } from './DetailedProblemTable';

interface Props {
  studentId: number;
}

export const StudentAnalytic: React.FC<Props> = ({ studentId }) => {
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [studentId]);

  const loadAnalytics = async () => {
  try {
    const response = await analyticsApi.getStudentAnalytics(studentId);
    setAnalytics(response.data); // assuming ApiResponse<StudentAnalytics>
  } catch (error) {
    console.error('Failed to load analytics:', error);
    toast.error('Failed to load analytics data');
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center text-gray-500 p-8">
        <p>No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <AnalyticsHeader studentName={analytics.studentName} studentId={studentId} />
        <AnalyticsStatsCards analytics={analytics} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ProblemStatusChart performances={analytics.problemPerformances} />
          <AttemptsBarChart performances={analytics.problemPerformances} />
        </div>
      </div>

      <DetailedProblemTable performances={analytics.problemPerformances} />
    </div>
  );
};
