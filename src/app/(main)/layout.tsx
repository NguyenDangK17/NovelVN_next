import '../globals.css';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { LayoutWrapper } from '@/components/LayoutWrapper';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <LayoutWrapper>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      {/* <Footer /> */}
    </LayoutWrapper>
  );
}
