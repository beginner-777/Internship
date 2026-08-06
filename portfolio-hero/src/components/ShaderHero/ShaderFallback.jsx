/**
 * Pure CSS approximation of the Cosmic Carbon palette, shown only when
 * WebGL itself is unavailable (old browsers, disabled GPU, some
 * lockdown/enterprise environments). Keeps the same visual identity —
 * deep carbon base + cyan/indigo/violet aurora — without any shader.
 */
export default function ShaderFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 30% 25%, rgba(95,208,196,0.16), transparent 55%)," +
          "radial-gradient(circle at 70% 70%, rgba(143,108,217,0.14), transparent 55%)," +
          "radial-gradient(circle at 50% 50%, rgba(108,123,240,0.10), transparent 60%)," +
          "#04050a",
      }}
      aria-hidden="true"
    />
  );
}
