'use client';

import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="text-2xl font-bold">Legal Doc Analyzer</div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50">
        {children}
      </main>

      <footer className="bg-white border-t py-4 px-6 fixed bottom-0 w-full">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
          <p>
            This is an automated risk-detection tool and does not provide legal advice.
            Please consult a qualified attorney for professional review.
          </p>
        </div>
      </footer>
    </div>
  );
} 