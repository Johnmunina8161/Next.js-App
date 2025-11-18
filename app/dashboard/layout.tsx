// /app/layout.tsx
import SideNav from '@/app/ui/dashboard/sidenav';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Dashboard built with App Router.',
  metadataBase: new URL('https://your-site.com'), // replace with your site URL
  icons: {
    icon: '/favicon.ico', // your favicon path
  },
  openGraph: {
    title: 'Acme Dashboard',
    description: 'The official Next.js Dashboard built with App Router.',
    url: 'https://your-site.com',
    siteName: 'Acme Dashboard',
    images: [
      {
        url: '/opengraph-image.jpg', // your OG image path
        width: 1200,
        height: 630,
        alt: 'Acme Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
