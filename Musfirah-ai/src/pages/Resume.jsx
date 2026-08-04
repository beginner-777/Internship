import { ArrowUpRight, Award, BriefcaseBusiness, Download, GraduationCap, TerminalSquare } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { certifications, education, experience, profile, projects, skills } from '../data/portfolioData';

export default function Resume() {
  return (
    <section className="page resume-page">
      <PageHeader
        index="04"
        label="VERIFIED RECORD"
        title="Resume, recompiled."
        description="The original resume content translated into an interactive record—without invented roles, numbers or achievements."
      />

      <div className="resume-layout">
        <Reveal className="resume-sidebar" delay={0.05}>
          <div className="resume-identity glass-panel">
            <div className="resume-monogram">MS</div>
            <span>FRONTEND NODE</span>
            <h2>{profile.name}</h2>
            <p>{profile.headline}</p>
            <a href="/resume/Musfirah-Shakeel-Resume.docx" download>Download original resume <Download size={15} /></a>
          </div>
          <div className="resume-stack-block">
            <span className="eyebrow">CORE STACK</span>
            <div>{skills[0].items.map((item) => <span key={item}>{item}</span>)}</div>
          </div>
        </Reveal>

        <div className="resume-stream">
          <Reveal className="stream-node" delay={0.1}>
            <div className="stream-icon"><BriefcaseBusiness size={19} /></div>
            <span className="stream-line" />
            <div className="stream-content">
              <div className="stream-label"><span>EXPERIENCE</span><small>{experience[0].period}</small></div>
              <h2>{experience[0].role}</h2>
              <h3>{experience[0].company}</h3>
              <ul>{experience[0].points.map((point) => <li key={point}>{point}</li>)}</ul>
            </div>
          </Reveal>

          <Reveal className="stream-node" delay={0.16}>
            <div className="stream-icon"><TerminalSquare size={19} /></div>
            <span className="stream-line" />
            <div className="stream-content">
              <div className="stream-label"><span>SELECTED PROJECT</span><small>{projects[0].date}</small></div>
              <h2>{projects[0].title}</h2>
              <h3>{projects[0].type}</h3>
              <p>{projects[0].description}</p>
              <a href={projects[0].live} target="_blank" rel="noreferrer">View live delivery <ArrowUpRight size={14} /></a>
            </div>
          </Reveal>

          <Reveal className="stream-node" delay={0.22}>
            <div className="stream-icon"><GraduationCap size={19} /></div>
            <span className="stream-line" />
            <div className="stream-content">
              <div className="stream-label"><span>EDUCATION</span><small>{education.period}</small></div>
              <h2>{education.degree}</h2>
              <h3>{education.school}</h3>
              <div className="education-inline"><span>{education.standing}</span><strong>CGPA {education.cgpa}</strong></div>
            </div>
          </Reveal>

          <Reveal className="stream-node final" delay={0.28}>
            <div className="stream-icon"><Award size={19} /></div>
            <div className="stream-content">
              <div className="stream-label"><span>CERTIFICATION</span><small>{certifications[0].date}</small></div>
              <h2>{certifications[0].name}</h2>
              <h3>{certifications[0].issuer}</h3>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
