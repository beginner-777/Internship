import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <div className="page-loader" aria-label="Loading page">
      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }} />
      <small>Resolving node</small>
    </div>
  );
}
