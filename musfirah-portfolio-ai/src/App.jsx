import { lazy, Suspense, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppShell from './components/AppShell';
import BootSequence from './components/BootSequence';
import PageLoader from './components/PageLoader';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const AIWorkspace = lazy(() => import('./pages/AIWorkspace'));
const Resume = lazy(() => import('./pages/Resume'));
const Contact = lazy(() => import('./pages/Contact'));

function RoutedExperience() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route element={<AppShell />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="workspace" element={<AIWorkspace />} />
        <Route path="resume" element={<Resume />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const [booting, setBooting] = useState(() => {
    try {
      return window.sessionStorage.getItem('musfirah-os-booted') !== 'true';
    } catch {
      return true;
    }
  });

  const completeBoot = () => {
    try {
      window.sessionStorage.setItem('musfirah-os-booted', 'true');
    } catch {
      // Storage can be disabled inside embedded preview browsers.
    }
    setBooting(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {booting && <BootSequence key="boot-sequence" onComplete={completeBoot} />}
      </AnimatePresence>
      {!booting && (
        <Suspense fallback={<PageLoader />}>
          <RoutedExperience />
        </Suspense>
      )}
    </>
  );
}
