# Legal Document Risk Analysis

A web application that analyzes legal documents (PDF/DOCX) for potential risks and vulnerabilities using AI.

## Features

- Document upload (PDF/DOCX support)
- Clause-by-clause risk analysis
- Risk level categorization (Low, Medium, High)
- Detailed explanations for identified risks
- Summary report generation
- Modern, responsive UI

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Create an `uploads` directory in the root folder (if not already present):
   ```bash
   mkdir uploads
   ```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Upload a legal document (PDF or DOCX)
2. Wait for the analysis to complete
3. Review the identified risks and explanations
4. Check the summary report for overall assessment

## Disclaimer

This tool provides automated analysis and should not be considered legal advice. Please consult with a qualified legal professional for proper legal guidance.

## Technical Details

- Built with Next.js and TypeScript
- Uses OpenAI GPT-4 for analysis
- PDF parsing with pdf-parse
- DOCX parsing with mammoth
- Tailwind CSS for styling
- File upload handling with react-dropzone 