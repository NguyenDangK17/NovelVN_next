import '@/app/globals.css';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ChapterLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="min-h-screen max-w-4xl mx-auto px-4 py-8">{children}</main>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}
