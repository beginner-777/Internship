import { useEffect, useRef, useState } from 'react';

export function useLiveMetric(base, variance = 5, intervalMs = 1000) {
  const [value, setValue] = useState(base);
  const baseRef = useRef(base);

  useEffect(() => {
    baseRef.current = base;
  }, [base]);

  useEffect(() => {
    const id = setInterval(() => {
      setValue((prev) => {
        const drift = (Math.random() - 0.5) * variance;
        const next = prev + drift + (baseRef.current - prev) * 0.15;
        return Math.max(0, Math.min(100, next));
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [variance, intervalMs]);

  return value;
}
