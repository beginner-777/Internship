import { useState } from 'react';
import { ArrowUpRight, Check, ChevronRight, Languages, MonitorSmartphone, PanelsTopLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { projects } from '../data/portfolioData';

export default function Projects() {
  const [activeDetail, setActiveDetail] = useState(0);
  const project = projects[0];

  return (
    <section className="page projects-page">
      <PageHeader
        index="02"
        label="DEPLOYED WORK"
        title="One project. Fully explored."
        description="No generic card grid—enter a focused reconstruction of the verified paid client delivery."
      />

      <div className="project-console">
        <Reveal className="project-index" delay={0.06}>
          <span>PROJECT INDEX</span>
          <button className="active" type="button">
            <small>{project.index}</small><strong>{project.title}</strong><ChevronRight size={16} />
          </button>
          <div className="index-foot"><i /> {project.status}</div>
        </Reveal>

        <Reveal className="project-viewport" delay={0.12}>
          <div className="browser-chrome">
            <div><span /><span /><span /></div>
            <p>premium-sofa-curtains.vercel.app</p>
            <MonitorSmartphone size={15} />
          </div>
          <div className="curtain-preview">
            <motion.div className="curtain-panel left" initial={{ x: 0 }} animate={{ x: '-82%' }} transition={{ duration: 1.6, delay: 0.45, ease: [0.65, 0, 0.35, 1] }} />
            <motion.div className="curtain-panel right" initial={{ x: 0 }} animate={{ x: '82%' }} transition={{ duration: 1.6, delay: 0.45, ease: [0.65, 0, 0.35, 1] }} />
            <div className="preview-nav"><b>PREMIUM</b><span>Services</span><span>Collections</span><span>Team</span><i>EN / AR</i></div>
            <div className="preview-copy">
              <small>TAILORED INTERIORS</small>
              <h3>Spaces, softly transformed.</h3>
              <p>A visual reconstruction of the deployed furnishing experience.</p>
              <span>EXPLORE COLLECTION</span>
            </div>
            <div className="preview-sofa"><i /><i /><i /></div>
          </div>
          <div className="viewport-caption"><Sparkles size={14} /> Motion-led reconstruction · not a static screenshot</div>
        </Reveal>

        <Reveal className="project-inspector glass-panel" delay={0.18}>
          <div className="inspector-top"><span>PROJECT / {project.index}</span><strong>{project.date}</strong></div>
          <span className="project-type">{project.type}</span>
          <h2>{project.title}</h2>
          <p>{project.description}</p>

          <div className="feature-selector">
            {project.details.map((detail, index) => (
              <button
                type="button"
                key={detail}
                className={activeDetail === index ? 'active' : ''}
                onMouseEnter={() => setActiveDetail(index)}
                onFocus={() => setActiveDetail(index)}
                onClick={() => setActiveDetail(index)}
              >
                <Check size={12} /> {detail}
              </button>
            ))}
          </div>
          <div className="detail-readout">
            {activeDetail === 0 ? <Languages size={19} /> : <PanelsTopLeft size={19} />}
            <span><small>ACTIVE CAPABILITY</small><strong>{project.details[activeDetail]}</strong></span>
          </div>
          <div className="project-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
          <a className="primary-action" href={project.live} target="_blank" rel="noreferrer">Launch live project <ArrowUpRight size={17} /></a>
        </Reveal>
      </div>
    </section>
  );
}
