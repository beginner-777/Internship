import { lazy, Suspense } from 'react';
import { ArrowDownRight, ArrowUpRight, Braces, ScanLine, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import { profile } from '../data/portfolioData';
import { Link } from '../routing/Router';

const NeuralCore = lazy(() => import('../components/NeuralCore'));

export default function Home() {
  return (
    <section className="home-experience">
      <div className="home-coordinate coordinate-top">34.0151° N / 71.5249° E</div>
      <div className="home-coordinate coordinate-bottom">INTERFACE INTELLIGENCE / ACTIVE</div>

      <Reveal className="home-intro" delay={0.05}>
        <span className="eyebrow"><Sparkles size={13} /> FRONTEND × INTELLIGENCE</span>
        <h1>Interfaces that <em>think</em><br />with you.</h1>
        <p>
          A living digital workspace shaped by responsive engineering, thoughtful motion and an AI-first mindset.
        </p>
        <div className="home-actions">
          <Link className="primary-action" to="/projects">Explore verified work <ArrowDownRight size={17} /></Link>
          <Link className="text-action" to="/about">Decode identity <ArrowUpRight size={16} /></Link>
        </div>
      </Reveal>

      <motion.div
        className="home-core-wrap"
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
      >
        <Suspense fallback={null}>
          <NeuralCore />
        </Suspense>
      </motion.div>

      <Reveal className="home-intelligence" delay={0.24}>
        <div className="identity-readout glass-panel">
          <div className="readout-top">
            <span>IDENTITY SIGNAL</span>
            <ScanLine size={16} />
          </div>
          <h2>{profile.name}</h2>
          <p>{profile.headline}</p>
          <div className="readout-data">
            <div><span>BASE</span><strong>{profile.location}</strong></div>
            <div><span>FOCUS</span><strong>Responsive systems</strong></div>
          </div>
        </div>

        <div className="active-mission">
          <div className="mission-icon"><Braces size={19} /></div>
          <div>
            <span>ACTIVE MISSION</span>
            <strong>Frontend AI Engineering · FlyRank</strong>
          </div>
          <i />
        </div>
      </Reveal>

      <div className="home-scroll-note"><span /> Move through the system</div>
    </section>
  );
}
