"""Main script for processing legal documents."""
import os
import json
from pathlib import Path
from .processors.pdf_to_json import PDFProcessor
from .processors.clause_processor import ClauseProcessor

class LegalDocumentAnalyzer:
    def __init__(self):
        """Initialize the Legal Document Analyzer."""
        self.base_dir = Path(__file__).parent
        self.input_dir = self.base_dir / "data" / "input"
        self.output_dir = self.base_dir / "data" / "output"
        
        # Ensure directories exist
        self.input_dir.mkdir(parents=True, exist_ok=True)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def process_documents(self) -> dict:
        """Process all legal documents in the input directory."""
        # Step 1: PDF to JSON conversion
        pdf_processor = PDFProcessor(str(self.input_dir))
        raw_output = self.output_dir / "raw_output.json"
        pdf_processor.save_to_json(str(raw_output))
        
        # Step 2: Process into structured clauses
        with open(raw_output, 'r', encoding='utf-8') as f:
            raw_content = json.load(f)
        
        clause_processor = ClauseProcessor()
        processed_content = clause_processor.process_json_content(raw_content)
        
        # Save processed content
        output_file = self.output_dir / "processed_legal_doc.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(processed_content, f, indent=2, ensure_ascii=False)
        
        return processed_content

def main():
    """Main entry point for the legal document analyzer."""
    try:
        analyzer = LegalDocumentAnalyzer()
        print("🔍 Starting legal document analysis...")
        
        # Check for input files
        pdf_files = list(Path(analyzer.input_dir).glob("*.pdf"))
        if not pdf_files:
            print(f"❌ No PDF files found in {analyzer.input_dir}")
            print("Please add PDF files to analyze and try again.")
            return
        
        print(f"📄 Found {len(pdf_files)} PDF file(s) to process")
        
        # Process documents
        result = analyzer.process_documents()
        
        print("\n✅ Document processing complete!")
        print(f"📊 Processed {result['metadata']['total_clauses']} clauses")
        print(f"💾 Results saved in: {analyzer.output_dir}")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("\nPlease ensure:")
        print("1. PDF files are in the 'data/input' directory")
        print("2. You have necessary permissions")
        print("3. All requirements are installed")

if __name__ == "__main__":
    main() 