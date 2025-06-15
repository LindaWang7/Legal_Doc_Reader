declare module 'pdf.js-extract' {
  interface PDFExtractOptions {
    firstPage?: number;
    lastPage?: number;
    password?: string;
  }

  interface PDFExtractContent {
    str: string;
    x: number;
    y: number;
    w: number;
    h: number;
    fontName: string;
  }

  interface PDFExtractPage {
    content: PDFExtractContent[];
    pageInfo: {
      num: number;
      scale: number;
      width: number;
      height: number;
    };
  }

  interface PDFExtractResult {
    pages: PDFExtractPage[];
    meta?: any;
  }

  export class PDFExtract {
    extract(filePath: string, options?: PDFExtractOptions): Promise<PDFExtractResult>;
  }
} 