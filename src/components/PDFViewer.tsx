'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Create a client-side only component
const PDFViewerComponent = dynamic(
  () => import('./PDFViewerClient'),
  { ssr: false }
);

interface PDFViewerProps {
  pdfUrl: string;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-4" style={{ height: '750px' }}>
        <PDFViewerComponent pdfUrl={pdfUrl} />
      </div>
    </div>
  );
} 