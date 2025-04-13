import { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/app/globals.css";
import { UserProvider } from "@/context/UserContext";

export const LayoutWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen">
      <UserProvider>{children}</UserProvider>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};
