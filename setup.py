from setuptools import setup, find_packages

setup(
    name="legal_doc_analyzer_py",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "PyPDF2>=3.0.0",
        "nltk>=3.8.1",
        "typing-extensions>=4.5.0",
    ],
    entry_points={
        'console_scripts': [
            'analyze-legal-docs=legal_doc_analyzer_py.main:main',
        ],
    },
    author="Your Name",
    description="A tool for analyzing legal documents and identifying potential vulnerabilities",
    python_requires=">=3.7",
) 