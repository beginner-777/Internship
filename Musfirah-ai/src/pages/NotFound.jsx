import { ArrowLeft, SearchX } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { Link } from '../routing/Router';

export default function NotFound() {
  return (
    <section className="page not-found-page">
      <PageHeader
        index="404"
        label="ROUTE NOT FOUND"
        title="This workspace does not exist."
        description="The requested portfolio route may have moved or the address may be incomplete."
      />

      <Reveal className="not-found-panel glass-panel" delay={0.08}>
        <SearchX size={28} aria-hidden="true" />
        <div>
          <span className="eyebrow">RECOVERY PATH</span>
          <h2>Return to the command center.</h2>
          <p>No information was lost. Use the main navigation or continue from the homepage.</p>
        </div>
        <Link to="/"><ArrowLeft size={15} /> Back home</Link>
      </Reveal>
    </section>
  );
}
