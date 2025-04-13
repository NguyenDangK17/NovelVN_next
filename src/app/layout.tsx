import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
