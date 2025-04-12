import "@/app/globals.css";
import { ReactNode } from "react";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChapterLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NextTopLoader
        zIndex={1000}
        easing="ease-in-out"
        speed={400}
        height={4}
        showSpinner={false}
        template='<div class="bar bg-yellow-500" role="bar"><div class="peg"></div></div><div class="spinner text-yellow-500" role="spinner"><div class="spinner-icon"></div></div>'
      />
      <main className="min-h-screen max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}
