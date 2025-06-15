'use client';

import { useState } from 'react';
import { ClauseAnalysis } from '@/types';
import RiskBadge from './RiskBadge';

interface ClauseCardProps {
  clause: ClauseAnalysis;
}

export default function ClauseCard({ clause }: ClauseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(clause.text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
      <div
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <p className="text-gray-700 font-medium line-clamp-2">
              {clause.text}
            </p>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy clause text"
              >
                {isCopied ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
              <RiskBadge level={clause.riskLevel} />
            </div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 ml-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t">
          <div className="mt-3">
            <p className="text-sm text-gray-700 italic mb-2">{clause.comment}</p>
            {clause.category && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Category:</span> {clause.category}
              </p>
            )}
            {clause.lineNumber && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Line:</span> {clause.lineNumber}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 