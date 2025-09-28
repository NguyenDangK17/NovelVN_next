'use client';
import '../globals.css';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const DynamicChatPage = dynamic(() => import('./chat/page'), {
  ssr: false,
  loading: () => <div>Loading chat...</div>,
});

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <LayoutWrapper>
      <Navbar />
      <main className="min-h-screen">{pathname === '/chat' ? <DynamicChatPage /> : children}</main>
      {/* <Footer /> */}
    </LayoutWrapper>
  );
}
