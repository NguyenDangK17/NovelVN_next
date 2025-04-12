import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-9xl font-bold text-white">404</h1>
      <p className="text-xl text-gray-500 mt-4">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 text-lg font-medium text-white bg-primary-500 rounded-lg hover:bg-gray-900 transition-all"
      >
        Go Home
      </Link>
    </div>
  );
}
