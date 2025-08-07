import { StudentAnalytics } from '@/Models/Analytics';
import React from 'react';


interface Props {
  analytics: StudentAnalytics;
}

export const AnalyticsStatsCards: React.FC<Props> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card title="Problems Solved" value={analytics.problemsSolved} color="blue" />
      <Card title="Success Rate" value={`${(analytics.successRate * 100).toFixed(1)}%`} color="green" />
      <Card title="Total Attempts" value={analytics.totalAttempts} color="yellow" />
      <Card title="Avg. Solve Time" value={`${analytics.averageTimeToSolve.toFixed(1)}m`} color="purple" />
    </div>
  );
};

const Card = ({ title, value, color }: { title: string; value: string | number; color: string }) => {
  const bg = `bg-${color}-50`;
  const text = `text-${color}-600`;
  const val = `text-${color}-900`;

  return (
    <div className={`${bg} p-4 rounded-lg`}>
      <h3 className={`text-sm font-medium ${text}`}>{title}</h3>
      <p className={`text-2xl font-bold ${val}`}>{value}</p>
    </div>
  );
};
