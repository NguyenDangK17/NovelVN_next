'use client';
import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  // componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  //   // You can log error info to an error reporting service here
  //   // console.error('ErrorBoundary caught an error', error, errorInfo);
  // }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#1a1a1a] text-white">
          <h1 className="text-5xl font-bold mb-4">Something went wrong.</h1>
          <p className="mb-4">
            An unexpected error occurred. Please try refreshing the page or contact support.
          </p>
          <details className="text-gray-400 whitespace-pre-wrap">
            {this.state.error?.toString()}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
