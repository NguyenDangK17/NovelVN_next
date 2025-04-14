import '../../globals.css';
import { ReactNode } from 'react';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import Navbar from '@/components/Navbar/Navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <LayoutWrapper>
      <Navbar />
      {children}
    </LayoutWrapper>
  );
}
