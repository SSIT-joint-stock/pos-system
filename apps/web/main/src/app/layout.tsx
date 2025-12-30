import { GoogleAnalytics } from '@next/third-parties/google';
import { MantineProvider, ThemeProvider } from '@repo/design-system/providers';
import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './global.css';

const fontSans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EraPOS - Phần mềm quản lý bán hàng',
  description: 'Phần mềm quản lý bán hàng giúp bạn quản lý khách hàng, hóa đơn, báo cáo, ...',
  generator: 'EraPOS',
  applicationName: 'EraPOS',
  keywords: [
    'EraPOS',
    'Phần mềm quản lý bán hàng',
    'Phần mềm quản lý bán hàng',
    'Phần mềm quản lý bán hàng',
  ],
  authors: [{ name: 'EraPOS', url: 'https://erapos.vn' }],
  creator: 'EraPOS',
  publisher: 'EraPOS',
  openGraph: {
    title: 'EraPOS - Phần mềm quản lý bán hàng',
    description: 'Phần mềm quản lý bán hàng giúp bạn quản lý khách hàng, hóa đơn, báo cáo, ...',
    url: 'https://erapos.vn',
    siteName: 'EraPOS',
    images: [{ url: '/images/og-image.png' }],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full overscroll-contain scroll-smooth">
      <body className={`${fontSans.className} min-h-dvh font-sans antialiased`}>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        <MantineProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
            forcedTheme={'light'}
          >
            {children}
          </ThemeProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
