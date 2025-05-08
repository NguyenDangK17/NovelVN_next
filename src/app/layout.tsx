import './globals.css';
import { ReactNode, Suspense } from 'react';
import { Poppins } from 'next/font/google';
import { NavigationProvider } from '@/context/NavigationContext';
import { Metadata, Viewport } from 'next';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MangaVN - Đọc truyện tranh online',
  description:
    'MangaVN - Nền tảng đọc truyện tranh online lớn nhất Việt Nam với hàng ngàn bộ truyện được cập nhật liên tục.',
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`dark ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <NavigationProvider>{children}</NavigationProvider>
        </Suspense>
      </body>
    </html>
  );
}
