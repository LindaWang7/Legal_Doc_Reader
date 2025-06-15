export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface ClauseAnalysis {
  id: string;
  text: string;
  riskLevel: RiskLevel;
  comment: string;
  category?: string;
  lineNumber?: number;
}

export interface DocumentAnalysis {
  id: string;
  fileName: string;
  uploadedAt: string;
  clauses: ClauseAnalysis[];
  summary: string;
  overallRiskLevel: RiskLevel;
}

export interface UploadResponse {
  success: boolean;
  documentId?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
} 