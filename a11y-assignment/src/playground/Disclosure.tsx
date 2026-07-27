import React, { useState } from 'react';

interface DisclosureProps {
  summary: string;
  children: React.ReactNode;
}

export const Disclosure: React.FC<DisclosureProps> = ({ summary, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const disclosureId = React.useId();

  return (
    <div className="w-full max-w-md mx-auto my-4 border border-gray-200 rounded-lg overflow-hidden">
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={`disclosure-content-${disclosureId}`}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center p-4 bg-gray-100 font-medium text-left text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>{summary}</span>
          <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </h3>
      {isOpen && (
        <div
          id={`disclosure-content-${disclosureId}`}
          className="p-4 bg-white text-gray-700 border-t border-gray-200"
        >
          {children}
        </div>
      )}
    </div>
  );
};