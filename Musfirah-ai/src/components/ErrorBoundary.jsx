import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.error('Portfolio interface error:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="error-fallback">
        <div className="error-fallback-core" aria-hidden="true"><span /></div>
        <div className="error-fallback-panel glass-panel">
          <AlertTriangle size={24} />
          <span className="eyebrow">INTERFACE RECOVERY</span>
          <h1>The workspace needs a clean restart.</h1>
          <p>Your browser blocked an advanced visual feature. Reloading will restart the portfolio in compatibility mode.</p>
          <button type="button" onClick={() => window.location.reload()}>
            <RefreshCw size={16} /> Reload interface
          </button>
        </div>
      </main>
    );
  }
}
