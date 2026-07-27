import React, { useState } from 'react';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || '');

  return (
    <div className="w-full max-w-md mx-auto my-6">
      <div role="tablist" aria-label="Sample Tabs" className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTabId(tab.id)}
              className={`px-4 py-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isActive
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          if (!isActive) return null;
          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={`panel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              tabIndex={0}
              className="p-4 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};