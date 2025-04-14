import '../globals.css';
import { ReactNode } from 'react';
import { LayoutWrapper } from '@/components/LayoutWrapper';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <LayoutWrapper>
      <main>{children}</main>
    </LayoutWrapper>
  );
}
