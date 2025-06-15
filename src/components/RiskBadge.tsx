'use client';

import { useState } from 'react';
import { RiskLevel } from '@/types';

interface RiskBadgeProps {
  level: RiskLevel;
}

const riskColors = {
  Low: 'bg-green-100 text-green-800 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  High: 'bg-red-100 text-red-800 border-red-200',
};

const riskDescriptions = {
  Low: 'Minor concerns or standard clauses with minimal risk',
  Medium: 'Potential issues that should be reviewed by legal counsel',
  High: 'Significant concerns requiring immediate legal attention',
};

export default function RiskBadge({ level }: RiskBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <span
        className={`${riskColors[level]} px-3 py-1 rounded-full text-sm font-medium border cursor-help`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {level}
        <svg
          className="w-4 h-4 ml-1 inline-block"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </span>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded shadow-lg w-48 z-10">
          {riskDescriptions[level]}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>
      )}
    </div>
  );
} 