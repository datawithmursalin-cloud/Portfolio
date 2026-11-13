import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Syed Mursalin | AI Automation, CRM Systems & MCP Connectors',
  description:
    'Syed Mursalin builds CRM workflows, MCP connectors and AI automations for GoHighLevel, Close and HubSpot. Founder of VoloLeads.',
  openGraph: {
    title: 'Syed Mursalin | Work that flows by itself',
    description: 'CRM workflows, MCP connectors and AI automations that take the busywork out of sales operations.',
    type: 'website',
    images: ['/og.jpg'],
  },
};

export const viewport: Viewport = { themeColor: '#f2f1ed', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
