import { lazy, Suspense, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import AppShell from './components/AppShell';
import BootSequence from './components/BootSequence';
import PageLoader from './components/PageLoader';
import { useRouter } from './routing/Router';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const AIWorkspace = lazy(() => import('./pages/AIWorkspace'));
const Resume = lazy(() => import('./pages/Resume'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RoutedExperience() {
  const { pathname } = useRouter();
  const routes = {
    '/': <Home />,
    '/about': <About />,
    '/projects': <Projects />,
    '/workspace': <AIWorkspace />,
    '/resume': <Resume />,
    '/contact': <Contact />,
  };

  return (
    <AppShell>
      {routes[pathname] || <NotFound />}
    </AppShell>
  );
}

export default function App() {
  const [booting, setBooting] = useState(true);

  const completeBoot = () => {
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
