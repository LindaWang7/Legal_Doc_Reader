'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import DocumentUpload from '@/components/DocumentUpload';
import ClauseCard from '@/components/ClauseCard';
import RiskSummary from '@/components/RiskSummary';
import PDFViewer from '@/components/PDFViewer';
import { DocumentAnalysis } from '@/types';

export default function Home() {
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleUploadSuccess = async (documentId: string) => {
    try {
      // Set the PDF URL for viewing
      setPdfUrl(`/uploads/${documentId}`);
      
      const response = await fetch(`/api/analyze/${documentId}`);
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Error analyzing document');
      }
      
      if (!data.clauses || !Array.isArray(data.clauses)) {
        throw new Error('Invalid analysis response format');
      }
      
      setAnalysis(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error analyzing document');
      setAnalysis(null);
    }
  };

  const handleUploadError = (error: string) => {
    setError(error);
    setAnalysis(null);
    setPdfUrl(null);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <DocumentUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
              {error}
            </div>
          )}
        </div>

        {pdfUrl && (
          <div className="mb-8">
            <PDFViewer pdfUrl={pdfUrl} />
          </div>
        )}

        {analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <div className="sticky top-8">
                <RiskSummary analysis={analysis} />
              </div>
            </div>

            <div className="lg:col-span-7">
              <h2 className="text-xl font-semibold mb-4">Clause Analysis</h2>
              <div className="space-y-4">
                {analysis.clauses.map((clause) => (
                  <ClauseCard key={clause.id} clause={clause} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 