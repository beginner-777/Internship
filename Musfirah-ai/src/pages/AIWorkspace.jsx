import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, CheckCircle2, Code2, Languages, Monitor, Play, RotateCcw, Smartphone, Sparkles } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { useApp } from '../context/AppContext';

const modes = {
  design: {
    label: 'UI intelligence',
    output: 'A clear visual hierarchy, touch-safe actions and responsive content flow are active.',
  },
  quality: {
    label: 'Quality scan',
    output: 'Layout integrity, contrast, navigation clarity and cross-device behavior are in focus.',
  },
  motion: {
    label: 'Motion logic',
    output: 'Transitions reinforce state changes while reduced-motion preferences remain respected.',
  },
};

export default function AIWorkspace() {
  const [viewport, setViewport] = useState('desktop');
  const [language, setLanguage] = useState('EN');
  const [mode, setMode] = useState('design');
  const [running, setRunning] = useState(false);
  const { setAssistantOpen } = useApp();

  const runAnalysis = () => {
    setRunning(true);
    window.setTimeout(() => setRunning(false), 900);
  };

  return (
    <section className="page workspace-page">
      <PageHeader
        index="03"
        label="AI WORKSPACE"
        title="Test the thinking layer."
        description="A small interactive lab that demonstrates how responsive decisions, motion and AI-guided retrieval can coexist in one interface."
      />

      <div className="lab-layout">
        <Reveal className="lab-controls glass-panel" delay={0.06}>
          <div className="lab-title"><Code2 size={18} /><div><span>INTERFACE LAB</span><strong>Runtime controls</strong></div></div>

          <fieldset>
            <legend>Viewport</legend>
            <div className="segmented-control">
              <button type="button" className={viewport === 'desktop' ? 'active' : ''} onClick={() => setViewport('desktop')}><Monitor size={15} /> Desktop</button>
              <button type="button" className={viewport === 'mobile' ? 'active' : ''} onClick={() => setViewport('mobile')}><Smartphone size={15} /> Mobile</button>
            </div>
          </fieldset>

          <fieldset>
            <legend>Language state</legend>
            <div className="segmented-control">
              {['EN', 'AR'].map((item) => <button type="button" key={item} className={language === item ? 'active' : ''} onClick={() => setLanguage(item)}>{item}</button>)}
            </div>
          </fieldset>

          <fieldset>
            <legend>Analysis lens</legend>
            <div className="mode-list">
              {Object.entries(modes).map(([key, value]) => (
                <button type="button" className={mode === key ? 'active' : ''} key={key} onClick={() => setMode(key)}>
                  <span>{value.label}</span><i />
                </button>
              ))}
            </div>
          </fieldset>

          <button className="run-button" type="button" onClick={runAnalysis} disabled={running}>
            {running ? <RotateCcw className="spin" size={16} /> : <Play size={16} />} {running ? 'Analyzing interface' : 'Run interface analysis'}
          </button>
        </Reveal>

        <Reveal className="lab-canvas" delay={0.12}>
          <div className="canvas-toolbar">
            <span><i /> LIVE SANDBOX</span>
            <div>{viewport.toUpperCase()} · {language}</div>
          </div>
          <motion.div
            layout
            className={`sandbox-device ${viewport} ${language === 'AR' ? 'rtl' : ''}`}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            <div className="sandbox-nav"><strong>studio.</strong><span>{language === 'EN' ? 'Collections  Journal  Contact' : 'المجموعات  المجلة  تواصل'}</span></div>
            <div className="sandbox-hero">
              <span>{language === 'EN' ? 'INTELLIGENT INTERFACES' : 'واجهات ذكية'}</span>
              <h2>{language === 'EN' ? 'Design that adapts.' : 'تصميم يتكيف معك.'}</h2>
              <p>{language === 'EN' ? 'Responsive by structure, expressive by motion.' : 'متجاوب في البنية، معبّر في الحركة.'}</p>
              <button type="button">{language === 'EN' ? 'Explore system' : 'استكشف النظام'}</button>
            </div>
            <div className="sandbox-visual"><i /><i /><i /></div>
          </motion.div>
        </Reveal>

        <Reveal className={`analysis-output glass-panel ${running ? 'running' : ''}`} delay={0.18}>
          <div className="analysis-pulse"><Sparkles size={20} /></div>
          <div>
            <span className="eyebrow">AI ANALYSIS / {mode.toUpperCase()}</span>
            <h3>{modes[mode].label}</h3>
            <p>{running ? 'Reading hierarchy, state and responsive behavior…' : modes[mode].output}</p>
          </div>
          <CheckCircle2 size={18} className="analysis-check" />
        </Reveal>

        <Reveal className="assistant-callout" delay={0.24}>
          <Bot size={22} />
          <div><span>Need portfolio context?</span><strong>Query the structured resume agent.</strong></div>
          <button type="button" onClick={() => setAssistantOpen(true)}>Open AI <Sparkles size={14} /></button>
        </Reveal>
      </div>
    </section>
  );
}
