'use client';

import { ClauseAnalysis as ClauseAnalysisType } from '@/types';

interface ClauseAnalysisProps {
  clause: ClauseAnalysisType;
}

const riskColors = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
};

export default function ClauseAnalysis({ clause }: ClauseAnalysisProps) {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-gray-700 font-medium mb-2">{clause.text}</p>
          <p className="text-gray-600 text-sm">{clause.comment}</p>
        </div>
        <span
          className={`${riskColors[clause.riskLevel]} px-3 py-1 rounded-full text-sm font-medium ml-4`}
        >
          {clause.riskLevel}
        </span>
      </div>
      {clause.category && (
        <div className="mt-2">
          <span className="text-sm text-gray-500">Category: {clause.category}</span>
        </div>
      )}
      {clause.lineNumber && (
        <div className="mt-1">
          <span className="text-sm text-gray-500">Line: {clause.lineNumber}</span>
        </div>
      )}
    </div>
  );
} 