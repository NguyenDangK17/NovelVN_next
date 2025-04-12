import { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/app/globals.css";
import { UserProvider } from "@/context/UserContext";

export const LayoutWrapper = ({ children }: PropsWithChildren) => {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body>
        <UserProvider>{children}</UserProvider>
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </body>
    </html>
  );
};
