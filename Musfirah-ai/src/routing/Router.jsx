import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const RouterContext = createContext(null);

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

export function RouterProvider({ children }) {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => setPathname(normalizePath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((destination, { replace = false } = {}) => {
    const url = new URL(destination, window.location.href);
    if (url.origin !== window.location.origin) {
      window.location.assign(url.href);
      return;
    }

    const nextPath = `${url.pathname}${url.search}${url.hash}`;
    window.history[replace ? 'replaceState' : 'pushState']({}, '', nextPath);
    setPathname(normalizePath(url.pathname));
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const value = useMemo(() => ({ pathname, navigate }), [navigate, pathname]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRouter must be used inside RouterProvider.');
  return context;
}

export function Link({ children, onClick, target, to, ...props }) {
  const { navigate } = useRouter();

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
      || target === '_blank') return;

    const url = new URL(to, window.location.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    navigate(`${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <a {...props} href={to} target={target} onClick={handleClick}>
      {children}
    </a>
  );
}

export function NavLink({ className, end = false, to, ...props }) {
  const { pathname } = useRouter();
  const normalizedTarget = normalizePath(to);
  const isActive = end
    ? pathname === normalizedTarget
    : pathname === normalizedTarget || pathname.startsWith(`${normalizedTarget}/`);
  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;

  return (
    <Link
      {...props}
      to={to}
      className={resolvedClassName}
      aria-current={isActive ? 'page' : undefined}
    />
  );
}

