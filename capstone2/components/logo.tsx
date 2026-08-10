export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand" aria-label="TRACE AI home">
      <span className="brand-mark" aria-hidden="true"><span /></span>
      {!compact && <span className="brand-text">TRACE <span style={{ color: "#d6a84b" }}>AI</span></span>}
    </span>
  );
}
