import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal Document Risk Analysis',
  description: 'AI-powered legal document risk analysis tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
