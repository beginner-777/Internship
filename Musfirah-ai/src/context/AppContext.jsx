import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.colorScheme = 'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0B1220');
    try {
      window.localStorage.removeItem('musfirah-os-theme');
    } catch {
      // The single visual theme does not depend on storage.
    }
  }, []);

  const value = useMemo(
    () => ({ assistantOpen, setAssistantOpen, soundEnabled, setSoundEnabled }),
    [assistantOpen, soundEnabled],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
