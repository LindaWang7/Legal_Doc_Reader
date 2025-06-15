import json
import os
from openai import OpenAI
from typing import Dict, Any
from pathlib import Path
import re

def load_env_from_file(file_path: str = ".env.local") -> str:
    """
    Load OpenAI API key from .env.local file
    """
    try:
        with open(file_path, 'r') as f:
            content = f.read()
            match = re.search(r'OPENAI_API_KEY=([^\n]+)', content)
            if match:
                return match.group(1).strip("'").strip('"')
    except FileNotFoundError:
        pass
    return None

def analyze_clause(client: OpenAI, text: str) -> Dict[str, str]:
    """
    Analyze a single clause using OpenAI's GPT-3.5-turbo model.
    """
    prompt = f"""You are a legal contract risk assessor. Analyze the following clause and answer:
1. What is the vulnerability level? (High, Medium, Low)
2. Who is at risk? (Consultant, Commission, Neutral)
3. Why is this clause risky (or safe)? Explain in plain language.

Clause: {text}"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a legal contract risk assessor."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    # Parse the response
    response_text = response.choices[0].message.content
    
    # Extract information from the response
    lines = response_text.split('\n')
    vulnerability_level = None
    party_at_risk = None
    explanation = None

    for line in lines:
        if "vulnerability level" in line.lower():
            if "high" in line.lower():
                vulnerability_level = "High"
            elif "medium" in line.lower():
                vulnerability_level = "Medium"
            elif "low" in line.lower():
                vulnerability_level = "Low"
        elif "who is at risk" in line.lower() or "at risk" in line.lower():
            if "consultant" in line.lower():
                party_at_risk = "Consultant"
            elif "commission" in line.lower():
                party_at_risk = "Commission"
            elif "neutral" in line.lower():
                party_at_risk = "Neutral"
        elif any(marker in line.lower() for marker in ["why", "explain", "because", "reason"]):
            explanation = line.split(":", 1)[-1].strip() if ":" in line else line.strip()

    return {
        "vulnerability_level": vulnerability_level,
        "party_at_risk": party_at_risk,
        "explanation": explanation
    }

def process_legal_document(input_path: str, output_path: str):
    """
    Process the entire legal document, analyzing each clause and saving the results.
    """
    # Initialize OpenAI client
    api_key = load_env_from_file() or os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OpenAI API key not found in .env.local or environment variables")
    
    client = OpenAI(api_key=api_key)

    # Load the input JSON
    with open(input_path, 'r') as f:
        document = json.load(f)

    # Process each section and its clauses
    for section in document["document_structure"]:
        for clause in section.get("clauses", []):
            if clause.get("text"):
                # Skip single numbers or very short text (like section numbers)
                if len(clause["text"].strip()) < 5:
                    continue
                print(f"Processing clause {clause['clause_id']}...")
                analysis = analyze_clause(client, clause["text"])
                clause.update(analysis)

    # Save the annotated document
    output_dir = os.path.dirname(output_path)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    with open(output_path, 'w') as f:
        json.dump(document, f, indent=2)
    
    print(f"\nAnalysis complete! Results saved to {output_path}")

if __name__ == "__main__":
    input_file = "legal_doc_analyzer_py/data/output/processed_legal_doc.json"
    output_file = "legal_doc_analyzer_py/data/output/annotated_legal_doc.json"
    
    process_legal_document(input_file, output_file) 