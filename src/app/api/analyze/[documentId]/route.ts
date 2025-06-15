import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import OpenAI from 'openai';
import { pdfToText } from 'pdf-ts';
import * as mammoth from 'mammoth';
import { existsSync } from 'fs';
import { DocumentAnalysis } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const UPLOAD_DIR = 'uploads';

const SYSTEM_PROMPT = `You are a legal document analyzer. Your task is to analyze the provided text for potential legal risks and vulnerabilities.

IMPORTANT: You must ONLY return a valid JSON object with no additional text or explanation. The response must exactly match this format:

{
  "clauses": [
    {
      "id": "string",
      "text": "string",
      "riskLevel": "Low|Medium|High",
      "comment": "string",
      "category": "string"
    }
  ],
  "summary": "string",
  "overallRiskLevel": "Low|Medium|High"
}

Analysis Instructions:
1. Identify the risk level (Low, Medium, High)
2. Provide a brief explanation of potential issues in the comment field
3. Categorize the type of clause
4. Consider:
   - Vague or ambiguous language
   - One-sided terms
   - Missing standard protections
   - Unusual or potentially unfair conditions
   - Compliance with common regulations

Remember: Your entire response must be a single valid JSON object.`;

async function extractTextFromFile(filePath: string): Promise<string> {
  try {
    console.log('Reading file:', filePath);
    const fileContent = await readFile(filePath);
    console.log('File read successfully, size:', fileContent.length, 'bytes');
    
    const ext = filePath.split('.').pop()?.toLowerCase() || '';
    console.log('File extension:', ext);
    
    if (ext === 'pdf') {
      try {
        console.log('Processing PDF file');
        const text = await pdfToText(fileContent);
        
        if (!text) {
          throw new Error('No text content found in PDF');
        }
        
        console.log('PDF processed successfully');
        return text;
      } catch (error: any) {
        const errorMessage = error?.message || 'Unknown error';
        console.error('PDF parsing error:', errorMessage);
        throw new Error(`Failed to parse PDF document: ${errorMessage}`);
      }
    } else if (ext === 'docx') {
      console.log('Processing DOCX file');
      const result = await mammoth.extractRawText({ buffer: fileContent });
      console.log('DOCX processed successfully');
      return result.value;
    }
    
    throw new Error(`Unsupported file type: ${ext}`);
  } catch (error) {
    console.error('Error extracting text:', error);
    throw error;
  }
}

async function analyzeText(text: string): Promise<any> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    console.log('Sending text to OpenAI for analysis');
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze the following legal text and return ONLY a JSON response in the specified format:\n\n${text}` }
      ],
      temperature: 0.3
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }
    
    console.log('Received response from OpenAI');
    try {
      // Remove any potential non-JSON text before parsing
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}') + 1;
      const jsonContent = content.slice(jsonStart, jsonEnd);
      
      const analysis = JSON.parse(jsonContent);
      
      // Validate the response format
      if (!analysis.clauses || !Array.isArray(analysis.clauses) || !analysis.summary || !analysis.overallRiskLevel) {
        throw new Error('Invalid response format from OpenAI');
      }
      
      return analysis;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Failed to parse analysis result as JSON');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { documentId: string } }
): Promise<NextResponse> {
  const { documentId } = context.params;
  
  if (!documentId) {
    return NextResponse.json(
      { success: false, error: 'Document ID is required' },
      { status: 400 }
    );
  }

  try {
    const uploadPath = join(process.cwd(), UPLOAD_DIR);
    console.log('Processing request for document:', documentId);

    if (!existsSync(uploadPath)) {
      console.error('Uploads directory does not exist');
      return NextResponse.json(
        { success: false, error: 'Upload directory not found' },
        { status: 500 }
      );
    }

    const files = await readdir(uploadPath);
    const matchingFile = files.find(file => file.startsWith(documentId));

    if (!matchingFile) {
      console.error('Document not found:', documentId);
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    const filePath = join(uploadPath, matchingFile);
    console.log('Found file:', filePath);

    try {
      const text = await extractTextFromFile(filePath);
      console.log('Text extracted successfully, length:', text.length);
      
      const analysisResult = await analyzeText(text);
      console.log('Analysis completed');
      
      const response: DocumentAnalysis = {
        id: documentId,
        fileName: matchingFile,
        uploadedAt: new Date().toISOString(),
        clauses: analysisResult.clauses || [],
        summary: analysisResult.summary || 'No summary available',
        overallRiskLevel: analysisResult.overallRiskLevel || 'Medium'
      };
      
      return NextResponse.json(response);
    } catch (error) {
      console.error('Error processing document:', error);
      return NextResponse.json(
        { success: false, error: 'Error processing document: ' + (error instanceof Error ? error.message : 'Unknown error') },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 