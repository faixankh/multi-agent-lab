import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AgentOS Enterprise Platform',
  description: 'Multi-agent AI operating system dashboard'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
