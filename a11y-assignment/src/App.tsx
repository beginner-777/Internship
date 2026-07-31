import  { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "./components/ui/dialog"

// Helper component to trigger crash safely inside child tree
function BuggyComponent({ shouldCrash }: { shouldCrash: boolean }) {
  if (shouldCrash) {
    throw new Error("Test error boundary crash!");
  }
  return null;
}

export function AccessibleModalDemo() {
  const [shouldCrash, setShouldCrash] = useState(false);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center">
        
        <BuggyComponent shouldCrash={shouldCrash} />

        {/* Error Boundary Testing Button */}
        <div className="w-full max-w-2xl mb-4 flex justify-end">
          <button 
            onClick={() => setShouldCrash(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-lg cursor-pointer"
          >
            Test Error Boundary
          </button>
        </div>

        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Accessibility Playground</h1>
          <p className="text-gray-400">
            Testing hand-coded, W3C ARIA-compliant React + TypeScript components with shadcn/ui.
          </p>
        </header>

        <main className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">1. Modal Dialog Component</h2>
            <Dialog>
              <DialogTrigger asChild>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors border border-slate-700">
                  Open Accessible Modal
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Accessible Modal Dialog</DialogTitle>
                  <DialogDescription>
                    Notice how your keyboard focus is trapped inside this modal! Press Esc to close.
                  </DialogDescription>
                </DialogHeader>
                <input 
                  type="text" 
                  placeholder="Focusable input inside modal" 
                  className="w-full mt-4 p-2 bg-slate-800 border border-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </DialogContent>
            </Dialog>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-slate-200">2. Status & Next Steps</h2>
            <p className="text-gray-400 text-sm">
              Your components, Tailwind CSS styling, and documentation notes (`NOTES.md`) are fully configured and ready for submission.
            </p>
          </section>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default AccessibleModalDemo;