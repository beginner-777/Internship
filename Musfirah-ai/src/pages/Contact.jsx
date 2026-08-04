import { useState } from 'react';
import { ArrowUpRight, Check, Copy, GitBranch, Mail, MapPin, Network, PhoneCall, Send } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { profile } from '../data/portfolioData';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section className="page contact-page">
      <PageHeader
        index="05"
        label="OPEN CHANNEL"
        title="Start a useful conversation."
        description="For internships, frontend opportunities and thoughtful collaborations—choose a direct channel below."
      />

      <div className="contact-layout">
        <Reveal className="contact-core glass-panel" delay={0.06}>
          <div className="contact-orbit" aria-hidden="true"><span /><i /></div>
          <span className="eyebrow">CHANNEL / AVAILABLE</span>
          <h2>Let’s build something<br /><em>clear, responsive, alive.</em></h2>
          <p>Musfirah is currently growing through practical frontend work and is open to opportunities that value craft, feedback and momentum.</p>
          <div className="contact-location"><MapPin size={16} /> {profile.location}<i /> PKT</div>
        </Reveal>

        <div className="contact-channels">
          <Reveal delay={0.12}>
            <button className="channel-row" type="button" onClick={copyEmail}>
              <div className="channel-icon"><Mail size={20} /></div>
              <span><small>PRIMARY CHANNEL</small><strong>{profile.email}</strong></span>
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </Reveal>
          <Reveal delay={0.17}>
            <a className="channel-row" href={profile.links.linkedin} target="_blank" rel="noreferrer">
              <div className="channel-icon"><Network size={20} /></div>
              <span><small>PROFESSIONAL NETWORK</small><strong>LinkedIn profile</strong></span>
              <ArrowUpRight size={18} />
            </a>
          </Reveal>
          <Reveal delay={0.22}>
            <a className="channel-row" href={profile.links.github} target="_blank" rel="noreferrer">
              <div className="channel-icon"><GitBranch size={20} /></div>
              <span><small>CODE SIGNAL</small><strong>GitHub repositories</strong></span>
              <ArrowUpRight size={18} />
            </a>
          </Reveal>
          <Reveal delay={0.27}>
            <a className="channel-row" href={`tel:${profile.phone.replace(/\s/g, '')}`}>
              <div className="channel-icon"><PhoneCall size={20} /></div>
              <span><small>DIRECT LINE</small><strong>{profile.phone}</strong></span>
              <ArrowUpRight size={18} />
            </a>
          </Reveal>
        </div>

        <Reveal className="contact-footer" delay={0.32}>
          <span><i /> Response channel online</span>
          <a href={`mailto:${profile.email}?subject=Frontend%20opportunity%20for%20Musfirah`}>Compose an email <Send size={15} /></a>
        </Reveal>
      </div>
    </section>
  );
}
