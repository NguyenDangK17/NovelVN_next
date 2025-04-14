import './globals.css';
import { ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import { NavigationProvider } from '@/context/NavigationContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`dark ${poppins.variable}`} suppressHydrationWarning>
      <body>
        <NavigationProvider>{children}</NavigationProvider>
      </body>
    </html>
  );
}
