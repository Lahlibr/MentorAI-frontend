import { Properties } from '@/Models';
import { ProblemPerformance } from '@/Models/Analytics';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';




export const ProblemStatusChart: React.FC<Properties> = ({ performances }) => {
  const data = [
    { name: 'Solved', value: performances.filter(p => p.status === 'Solved').length },
    { name: 'Attempted', value: performances.filter(p => p.status === 'Attempted').length },
  ];

  const COLORS = ['#10B981', '#F59E0B'];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Problem Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
