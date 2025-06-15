"""Legal Document Analysis Package

This package provides tools for analyzing legal documents, including:
- PDF to structured JSON conversion
- Clause-level analysis
- Risk assessment preparation
"""

from .main import LegalDocumentAnalyzer, main

__version__ = "0.1.0"
__all__ = ['LegalDocumentAnalyzer', 'main'] 