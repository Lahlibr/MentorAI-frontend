import { ProblemPerformance } from '@/Models/Analytics';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


interface Props {
  performances: ProblemPerformance[];
}

export const AttemptsBarChart: React.FC<Props> = ({ performances }) => {
  const data = performances.map(p => ({
    problem: p.problemTitle.length > 20 ? p.problemTitle.slice(0, 20) + '...' : p.problemTitle,
    attempts: p.attempts,
  }));

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Attempts per Problem</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.slice(0, 10)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="problem" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="attempts" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
