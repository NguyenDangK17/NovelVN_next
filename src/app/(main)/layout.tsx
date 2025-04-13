import '../globals.css';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import NextTopLoader from 'nextjs-toploader';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <LayoutWrapper>
      <NextTopLoader
        zIndex={1000}
        easing="ease-in-out"
        speed={400}
        height={4}
        showSpinner={false}
        template={`
              <div class="bar bg-yellow-500" role="bar"><div class="peg"></div></div> 
        <div class="spinner text-yellow-500" role="spinner"><div class="spinner-icon"></div></div>`}
      />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      {/* <Footer /> */}
    </LayoutWrapper>
  );
}
