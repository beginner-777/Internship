import { motion } from 'framer-motion';

export default function PageHeader({ index, label, title, description }) {
  return (
    <header className="page-header">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="page-header-line"
      />
      <div className="page-kicker"><span>{index}</span>{label}</div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  );
}
