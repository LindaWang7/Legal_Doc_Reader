import os
import json
from PyPDF2 import PdfReader
from typing import Dict, List
from datetime import datetime


class PDFProcessor:
    def __init__(self, uploads_folder: str = "uploads"):
        """Initialize the PDF processor with the uploads folder path."""
        self.uploads_folder = uploads_folder
        
    def get_pdf_files(self) -> List[str]:
        """Get all PDF files from the uploads folder."""
        if not os.path.exists(self.uploads_folder):
            os.makedirs(self.uploads_folder)
        
        return [f for f in os.listdir(self.uploads_folder) 
                if f.lower().endswith('.pdf')]
    
    def extract_pdf_content(self, pdf_path: str) -> Dict:
        """Extract content from a PDF file and return it as a dictionary."""
        try:
            reader = PdfReader(os.path.join(self.uploads_folder, pdf_path))
            content = []
            
            # Extract text from each page
            for page_num, page in enumerate(reader.pages, 1):
                text = page.extract_text()
                content.append({
                    "page_number": page_num,
                    "content": text.strip()
                })
            
            # Create metadata
            metadata = {
                "filename": pdf_path,
                "total_pages": len(reader.pages),
                "processed_date": datetime.now().isoformat(),
            }
            
            return {
                "metadata": metadata,
                "pages": content
            }
            
        except Exception as e:
            return {
                "error": f"Failed to process {pdf_path}: {str(e)}",
                "filename": pdf_path,
                "processed_date": datetime.now().isoformat()
            }
    
    def process_all_pdfs(self) -> Dict:
        """Process all PDFs in the uploads folder and return their content."""
        pdf_files = self.get_pdf_files()
        results = {}
        
        for pdf_file in pdf_files:
            results[pdf_file] = self.extract_pdf_content(pdf_file)
        
        return results
    
    def save_to_json(self, output_file: str = "output.json"):
        """Save the processed PDF content to a JSON file."""
        results = self.process_all_pdfs()
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=4, ensure_ascii=False)
        
        return output_file

def main():
    processor = PDFProcessor()
    output_file = processor.save_to_json()
    print(f"PDF processing complete. Results saved to {output_file}")

if __name__ == "__main__":
    main()
