import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@fontsource/instrument-serif/400-italic.css';
import './globals.css';
import { SITE_URL } from '@/lib/site';
import { CONTACT } from '@/lib/contact';

const TITLE = 'Syed M. Mursalin | AI Automation, Custom MCP Servers & Data Workflows';
const DESCRIPTION =
  'Syed M. Mursalin builds custom MCP servers, CRM workflows, data analysis and scheduled AI automations for businesses. Founder of VoloLeads and VoloTech.';
const SHARE = 'Custom MCP servers, CRM workflows and AI automations that take the busywork out of running a business.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL + '/'),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: './' },
  authors: [{ name: 'Syed M. Mursalin', url: CONTACT.linkedin }],
  openGraph: {
    title: 'Syed M. Mursalin | Work that flows by itself',
    description: SHARE,
    type: 'website',
    url: './',
    siteName: 'Syed M. Mursalin',
    locale: 'en_US',
    images: [{ url: './og.jpg', width: 1200, height: 630, alt: 'Syed M. Mursalin: work that flows by itself' }],
  },
  twitter: { card: 'summary_large_image', title: 'Syed M. Mursalin | Work that flows by itself', description: SHARE, images: ['./og.jpg'] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#f2f1ed', width: 'device-width', initialScale: 1 };

// tells search engines who the page is about
const PERSON = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Syed M. Mursalin',
  url: SITE_URL + '/',
  email: `mailto:${CONTACT.email}`,
  jobTitle: 'Founder & CEO',
  worksFor: [
    { '@type': 'Organization', name: 'VoloLeads', url: 'https://www.vololeads.com' },
    { '@type': 'Organization', name: 'VoloTech', url: 'https://www.volotech.us' },
  ],
  knowsAbout: ['AI automation', 'Model Context Protocol', 'CRM workflows', 'Data analysis'],
  sameAs: [CONTACT.linkedin, CONTACT.facebook],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }} />
        {/* without JavaScript nothing animates in, so show everything and drop the intro curtain */}
        <noscript><style>{`.intro{display:none}[data-hero-fade]{opacity:1;transform:none}`}</style></noscript>
      </body>
    </html>
  );
}
