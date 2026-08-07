export function StaticWorkstation() {
  const keys = Array.from({ length: 30 }, (_, index) => <span key={index} />);

  return (
    <div className="static-workstation static-workstation-frontend" role="img" aria-label="Frontend engineering laptop visualization">
      <div className="static-laptop-screen">
        <small>FRONTEND WORKSTATION · LIVE</small>
        <strong>&lt;Interface responsive accessible /&gt;</strong>
        <span /><span /><span />
      </div>
      <div className="static-laptop-base">
        <div className="static-key-grid">{keys}</div>
        <i />
      </div>
    </div>
  );
}

export default function NeuralCoreFallback() {
  return (
    <div className="neural-core engineering-workstation" aria-label="Frontend engineering workstation">
      <div className="workstation-halo" aria-hidden="true" />
      <StaticWorkstation />
      <div className="workstation-caption workstation-caption-pro">
        <span>FRONTEND WORKSTATION</span><i /> DESIGN · CODE · SHIP
      </div>
    </div>
  );
}

