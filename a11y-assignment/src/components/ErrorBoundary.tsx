import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-8 max-w-md shadow-2xl backdrop-blur-xl">
            <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">!</div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong!</h2>
            <p className="text-slate-400 text-xs mb-6">
              {this.state.error?.message || "An unexpected error occurred in this application flow."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-white text-slate-950 font-bold rounded-xl text-xs hover:bg-slate-200 transition shadow-lg cursor-pointer"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}