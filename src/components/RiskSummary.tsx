'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DocumentAnalysis, RiskLevel } from '@/types';
import RiskBadge from './RiskBadge';

interface RiskSummaryProps {
  analysis: DocumentAnalysis;
}

const COLORS = {
  High: '#EF4444',   // Red
  Medium: '#F59E0B', // Yellow
  Low: '#10B981',    // Green
};

export default function RiskSummary({ analysis }: RiskSummaryProps) {
  const riskCounts = useMemo(() => {
    const counts = {
      High: 0,
      Medium: 0,
      Low: 0,
    };

    analysis.clauses.forEach((clause) => {
      counts[clause.riskLevel]++;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [analysis.clauses]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Document Risk Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <div className="text-gray-600 mb-2">
              Total Clauses: <span className="font-medium">{analysis.clauses.length}</span>
            </div>
            <div className="text-gray-600 mb-2">
              Overall Risk Level: <RiskBadge level={analysis.overallRiskLevel} />
            </div>
          </div>

          <div className="space-y-2">
            {Object.entries(COLORS).map(([level, color]) => (
              <div key={level} className="flex items-center justify-between">
                <span className="text-gray-600">{level} Risk:</span>
                <span className="font-medium" style={{ color }}>
                  {riskCounts.find(r => r.name === level)?.value || 0} clauses
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskCounts}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {riskCounts.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name as RiskLevel]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-gray-700">{analysis.summary}</p>
      </div>
    </div>
  );
} 