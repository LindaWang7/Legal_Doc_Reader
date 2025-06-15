'use client';

import { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerClientProps {
  pdfUrl: string;
}

export default function PDFViewerClient({ pdfUrl }: PDFViewerClientProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setError('Error loading PDF. Please try again.');
  }

  const handlePrevious = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setPageNumber((prev) => Math.min(numPages || prev, prev + 1));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="pdf-container w-full overflow-auto flex justify-center bg-gray-100 p-4 rounded-lg">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="animate-pulse text-gray-600 p-4">Loading PDF...</div>
          }
          error={
            <div className="text-red-500 p-4">
              {error || 'Failed to load PDF. Please try again.'}
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg bg-white"
            loading={
              <div className="animate-pulse text-gray-600">Loading page...</div>
            }
          />
        </Document>
      </div>

      {numPages && (
        <div className="flex justify-between items-center w-full max-w-xl mt-4 px-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            disabled={pageNumber <= 1}
            onClick={handlePrevious}
          >
            Previous
          </button>
          <p className="text-center">
            Page {pageNumber} of {numPages}
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            disabled={pageNumber >= (numPages || 0)}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 