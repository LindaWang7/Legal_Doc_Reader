import re
import uuid
from typing import List, Dict, Optional
import nltk
from nltk.tokenize import sent_tokenize

class ClauseProcessor:
    def __init__(self):
        """Initialize the clause processor and download required NLTK data."""
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')

    def generate_clause_id(self) -> str:
        """Generate a unique clause ID."""
        return f"clause-{str(uuid.uuid4())[:8]}"

    def extract_section_header(self, text: str) -> Optional[str]:
        """Extract section headers using common legal document patterns."""
        # Match patterns like "1. INTRODUCTION" or "Section 1: Definitions"
        section_patterns = [
            r'^(?:\d+\.|\bSection\s+\d+:?)\s+[A-Z][A-Za-z\s]+',
            r'^[A-Z][A-Z\s]+:',  # ALL CAPS headers with colon
        ]
        
        for pattern in section_patterns:
            match = re.match(pattern, text.strip())
            if match:
                return match.group(0)
        return None

    def split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences using NLTK's sentence tokenizer."""
        return sent_tokenize(text)

    def process_text(self, text: str, page_number: int) -> List[Dict]:
        """Process a single text block into structured clauses."""
        sentences = self.split_into_sentences(text)
        clauses = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:  # Skip empty sentences
                continue
                
            clause = {
                "clause_id": self.generate_clause_id(),
                "page_number": page_number,
                "text": sentence,
                "vulnerability_level": None,
                "party_at_risk": None,
                "explanation": None
            }
            clauses.append(clause)
            
        return clauses

    def group_by_sections(self, clauses: List[Dict]) -> List[Dict]:
        """Group clauses by sections if section headers are detected."""
        sections = []
        current_section = None
        current_clauses = []

        for clause in clauses:
            potential_header = self.extract_section_header(clause["text"])
            
            if potential_header:
                # Save previous section if it exists
                if current_section:
                    sections.append({
                        "section": current_section,
                        "clauses": current_clauses
                    })
                current_section = potential_header
                current_clauses = []
            else:
                current_clauses.append(clause)
        
        # Add the last section
        if current_section and current_clauses:
            sections.append({
                "section": current_section,
                "clauses": current_clauses
            })
        elif not sections and current_clauses:  # No sections found
            return current_clauses
            
        return sections

    def process_json_content(self, json_content: Dict) -> Dict:
        """Process the JSON content from pdf_to_json.py into structured clauses."""
        all_clauses = []
        
        for pdf_file, content in json_content.items():
            if "error" in content:
                continue
                
            for page in content["pages"]:
                page_clauses = self.process_text(
                    page["content"],
                    page["page_number"]
                )
                all_clauses.extend(page_clauses)
        
        # Try to group by sections
        result = self.group_by_sections(all_clauses)
        
        return {
            "document_structure": result,
            "metadata": {
                "total_clauses": len(all_clauses),
                "has_sections": isinstance(result, list) and isinstance(result[0], dict) and "section" in result[0]
            }
        } 