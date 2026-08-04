import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AppContext = createContext(null);

function getInitialTheme() {
  try {
    const saved = window.localStorage.getItem('musfirah-os-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  } catch {
    return 'dark';
  }
}

export function AppProvider({ children }) {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#050608' : '#f2f5f5');
    try {
      window.localStorage.setItem('musfirah-os-theme', theme);
    } catch {
      // Theme still works for this session when storage is unavailable.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({ assistantOpen, setAssistantOpen, soundEnabled, setSoundEnabled, theme, toggleTheme }),
    [assistantOpen, soundEnabled, theme, toggleTheme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
