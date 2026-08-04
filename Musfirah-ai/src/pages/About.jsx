import { Binary, Cpu, Fingerprint, GraduationCap, MapPin, Orbit } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { education, profile, skills } from '../data/portfolioData';

export default function About() {
  return (
    <section className="page about-page">
      <PageHeader
        index="01"
        label="IDENTITY MATRIX"
        title="The human inside the system."
        description="A verified profile assembled from education, practical delivery and a deliberate focus on responsive frontend craft."
      />

      <div className="about-grid">
        <Reveal className="about-dossier glass-panel" delay={0.08}>
          <div className="dossier-scan" aria-hidden="true" />
          <div className="dossier-icon"><Fingerprint size={32} /></div>
          <span className="eyebrow">PROFILE / VERIFIED</span>
          <h2>{profile.name}</h2>
          <p>{profile.summary}</p>
          <div className="dossier-meta">
            <span><MapPin size={14} /> {profile.location}</span>
            <span><Cpu size={14} /> Frontend AI Engineering Intern</span>
            <span><GraduationCap size={14} /> Software Engineering</span>
          </div>
        </Reveal>

        <Reveal className="education-node" delay={0.14}>
          <span className="node-number">EDU–01</span>
          <Orbit size={20} />
          <h3>{education.degree}</h3>
          <p>{education.school}</p>
          <div className="education-metrics">
            <div><span>CGPA</span><strong>{education.cgpa}</strong></div>
            <div><span>STATUS</span><strong>{education.standing}</strong></div>
          </div>
        </Reveal>

        <Reveal className="skills-matrix" delay={0.2}>
          <div className="matrix-heading">
            <div><span className="eyebrow"><Binary size={13} /> CAPABILITY SIGNALS</span><h2>Technical constellation</h2></div>
            <small>Resume-indexed</small>
          </div>
          <div className="skill-signals">
            {skills.map((skill) => (
              <div className="skill-signal" key={skill.group}>
                <div className="signal-title"><strong>{skill.group}</strong><span>{skill.items.length} nodes</span></div>
                <div className="signal-bar"><i style={{ '--signal': `${skill.signal}%` }} /></div>
                <div className="skill-tags">{skill.items.map((item) => <span key={item}>{item}</span>)}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="coursework-node" delay={0.26}>
          <span className="eyebrow">ACADEMIC KNOWLEDGE GRAPH</span>
          <div className="coursework-cloud">
            {education.coursework.map((course, index) => (
              <span key={course} style={{ '--i': index }}>{course}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
