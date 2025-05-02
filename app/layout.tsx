import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { systemDefault } from './lib/theme';

export const metadata: Metadata = {
  title: {
    template: '%s | Mocarr Steel',
    default: 'Mocarr Steel',
  },
  metadataBase: new URL('http://localhost:3000/'),
  description:
    'A Dashboard App where users can create an account (with their credentials or using an OAuth provider), create customers and assign invoices to them. Invoices will be shown at the Dashboard page as a summary. ',
  openGraph: {
    title:
      'Dashboard App, created by Vercel and modified by Javier Garza Developer',
    description:
      'A Dashboard App where users can create an account (with their credentials or using an OAuth provider), create customers and assign invoices to them. Invoices will be shown at the Dashboard page as a summary.',
    siteName: 'Mocarr Steel',
    locale: 'es_MX',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased ${systemDefault.bg}`}>
        {children}
      </body>
    </html>
  );
}
